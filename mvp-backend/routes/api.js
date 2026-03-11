const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const si = require('systeminformation');

// --- Storage Configuration for Sandbox ---
// We dynamically save uploaded files into the uniquely created sandbox folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Rely on the frontend sending the sandboxId
    const sandboxId = req.body.sandboxId;
    if (!sandboxId) {
      return cb(new Error('sandboxId is required'));
    }
    
    // Using the user's home directory (cross-platform compatible)
    const homeDir = require('os').homedir(); 
    const destFolder = path.join(homeDir, sandboxId);

    // Ensure the folder exists before uploading
    if (!fs.existsSync(destFolder)) {
      cb(new Error(`Sandbox folder ${sandboxId} does not exist.`));
    } else {
      cb(null, destFolder);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });


let accessRequests = []; // In-memory state for active connections
let activeContributors = []; // In-memory state for live network peers

// --- New: Live Peer Registry ---
router.post('/register-node', (req, res) => {
  const { peerId, nodeName, gpu, uptime } = req.body;
  const ip = req.ip || '127.0.0.1'; // Vite proxy causes all incoming to look like local
  const id = peerId || ip; // Use generated peer ID to bypass proxy collapsing
  
  // Update or insert the node based on ID
  const existingIdx = activeContributors.findIndex(c => c.id === id);
  const newPeer = { 
    id, 
    ip,
    name: nodeName || `Peer_${Math.floor(Math.random() * 1000)}`,
    gpu: gpu || 'Mobile / Integrated',
    uptime: uptime || '100%' 
  };
  
  if (existingIdx !== -1) {
    activeContributors[existingIdx] = newPeer;
  } else {
    activeContributors.push(newPeer);
  }
  
  res.json({ success: true, peer: newPeer });
});

router.get('/active-nodes', (req, res) => {
  res.json({ peers: activeContributors });
});

// --- 1. Real Hardware Node Info ---
router.get('/node-info', async (req, res) => {
  try {
    const osInfo = await si.osInfo();
    const cpu = await si.cpu();
    const mem = await si.mem();
    const graphics = await si.graphics();

    const gpuName = graphics.controllers.length > 0 ? graphics.controllers[0].model : 'Integrated Graphics';
    const totalMemGB = (mem.total / (1024 ** 3)).toFixed(1);

    res.json({
      id: req.ip || '127.0.0.1',
      name: osInfo.hostname,
      cpu: `${cpu.manufacturer} ${cpu.brand}`,
      memory: `${totalMemGB}GB RAM`,
      gpu: gpuName
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch node info' });
  }
});

// --- 2. Request Compute Access ---
router.post('/request-access', (req, res) => {
  const { requesterName } = req.body;
  const reqId = `req-${Date.now()}`;
  
  accessRequests.push({
    id: reqId,
    ip: req.ip || '127.0.0.1',
    user: requesterName || 'Network Peer',
    status: 'pending',
    sandboxId: null
  });

  res.json({ success: true, reqId });
});

// --- 3. Get Incoming Requests (Contributor Feed) ---
router.get('/access-requests', (req, res) => {
  res.json({ requests: accessRequests });
});

// --- 4. Approve Access (Contributor Action) ---
router.post('/approve-access', (req, res) => {
  const { reqId } = req.body;
  
  const request = accessRequests.find(r => r.id === reqId);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  // Provision Sandbox Script
  const scriptPath = path.join(__dirname, '..', 'scripts', 'setup-sandbox.js');
  
  exec(`node "${scriptPath}" ${request.id}`, (error, stdout, stderr) => {
    if (error) {
       console.error(`Error executing script: ${error.message}`);
       return res.status(500).json({ error: 'Failed to create sandbox' });
    }
    
    const sandboxId = `primus-${request.id}`;
    request.status = 'approved';
    request.sandboxId = sandboxId;

    res.json({ success: true, sandboxId, logs: stdout });
  });
});

// --- 5. Check Access Status (Requester Polling Loop) ---
router.get('/access-status', (req, res) => {
  const { reqId } = req.query;
  const request = accessRequests.find(r => r.id === reqId);
  
  if (!request) return res.status(404).json({ error: 'Not found' });
  
  res.json({ status: request.status, sandboxId: request.sandboxId });
});

// --- 2. Upload Executable to Sandbox ---
router.post('/upload', upload.single('jobFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  res.json({ 
    success: true, 
    message: `File securely uploaded to sandbox ${req.body.sandboxId}`,
    file: req.file.filename
  });
});

// --- 3. Live System Metrics (Grafana Graphing) ---
router.get('/metrics', async (req, res) => {
  try {
    const mem = await si.mem();
    const cpuLoad = await si.currentLoad();
    
    // Emulating VRAM visually using standard JS memory stats for the MVP
    const vramUsagePct = (mem.active / mem.total) * 100;
    const cpuUsagePct = cpuLoad.currentLoad;

    res.json({
      cpu: cpuUsagePct,
      vram: vramUsagePct
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch system metrics' });
  }
});

module.exports = router;
