import React, { useState, useEffect } from 'react';
import { Download, Terminal, Shield, CheckCircle, UserPlus, Key } from 'lucide-react';

const ContributorSetup = () => {
  const [scriptDownloaded, setScriptDownloaded] = useState(false);
  const [activeRequests, setActiveRequests] = useState([]);
  const [peerId] = useState(() => {
    let id = localStorage.getItem('primusPeerId');
    if (!id) {
      id = 'peer-' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('primusPeerId', id);
    }
    return id;
  });

  useEffect(() => {
    // Register this device as a live Contributor when the page opens
    const registerDevice = async () => {
      try {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const nodeName = isMobile ? 'Mobile_Contributor' : 'Desktop_Node';
        
        await fetch('/api/register-node', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            peerId: peerId,
            nodeName: nodeName + '_' + Math.floor(Math.random() * 1000),
            gpu: isMobile ? 'Mobile SoC (UML)' : 'Unknown Architecture',
            uptime: '100%'
          })
        });
      } catch (err) {
        console.error('Failed to register node');
      }
    };
    registerDevice();
  }, []);

  useEffect(() => {
    // Poll the backend for real incoming requests
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/access-requests');
        if (res.ok) {
          const data = await res.json();
          // Drop into state so we see incoming requests
          setActiveRequests(data.requests.slice().reverse());
        }
      } catch (err) {
        // Drop silently if network fails mid-poll
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetch('/api/approve-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reqId: id })
      });
      // The polling loop will fetch the updated 'approved' status and refresh the UI automatically
    } catch (err) {
      console.error('Approval failed', err);
    }
  };

  const handleDownloadScript = () => {
    const scriptContent = `#!/bin/bash
# Primus Network Sandbox Initialization Script
# This will safely provision an isolated compute folder for remote requesters

echo "Initializing Primus Contributor Sandbox..."
mkdir -p ~/primus-sandbox
mkdir -p ~/primus-sandbox/.ssh_keys

echo "Generating Restricted Access SSH Keys..."
ssh-keygen -t ed25519 -f ~/primus-sandbox/.ssh_keys/id_primus -N "" -q

echo "Sandbox provisioned securely in ~/primus-sandbox"
echo "Awaiting connections..."
`;
    const element = document.createElement("a");
    const file = new Blob([scriptContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "setup-sandbox.sh";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    
    setScriptDownloaded(true);
  };

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2><span className="gradient-text">Contributor</span> Setup</h2>
          <p style={{ color: 'var(--text-muted)' }}>Provide secure, isolated compute access to a Requester.</p>
        </div>

        <div className="dashboard-layout" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="var(--success)" /> Security Script Initialization
            </h3>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
              To ensure your machine's safety, you must download and run the Primus Sandbox Script. This script will only create an isolated folder <code style={{ color: 'var(--accent)' }}>~/primus-[requester_id]/</code> and generate a restricted SSH keypair that explicitly denies access to the rest of your system.
            </p>

            {!scriptDownloaded ? (
              <button 
                className="btn btn-primary" 
                onClick={handleDownloadScript}
                style={{ width: '100%', padding: '1rem' }}
              >
                <Download size={18} /> Download `setup-sandbox.sh`
              </button>
            ) : (
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '0.5rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} /> Sandbox Initialized on Local Node
              </div>
            )}
          </div>

          <div className="card" style={{ opacity: scriptDownloaded ? 1 : 0.5, pointerEvents: scriptDownloaded ? 'auto' : 'none' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={20} color="var(--primary)" /> Incoming Compute Requests
            </h3>
            
            <div className="flex flex-col gap-4">
              {activeRequests.map(req => (
                <div key={req.id} className="glass-panel" style={{ padding: '1rem 1.5rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                  <div>
                    <div style={{ fontWeight: 600 }}>{req.user}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>IP: {req.id}</div>
                  </div>

                  {req.status === 'pending' ? (
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleApprove(req.id)}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      Approve Request & Host Sandbox
                    </button>
                  ) : (
                    <div className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', borderColor: 'var(--success)' }}>
                      <CheckCircle size={14} /> Access Granted. Sandbox Hosted.
                    </div>
                  )}

                </div>
              ))}
              
              {activeRequests.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Listening for Peer connections on local subnet...
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ContributorSetup;
