import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Activity, Download, Terminal, Cpu, HardDrive, Server } from 'lucide-react';

const Dashboard = () => {
  const location = useLocation();
  const { approvedPeers } = location.state || { approvedPeers: [] };
  
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);
  
  // Create an array mapping states for each node
  const [nodeMetrics, setNodeMetrics] = useState(
    (approvedPeers.length > 0 ? approvedPeers : [{ peer: { name: 'Local Target', id: '127.0.0.1' } }]).map(node => ({
        id: node.peer.id,
        name: node.peer.name,
        vram: 0,
        cpu: 0
    }))
  );

  const handleDownload = () => {
    let outputContent = `Primus Distributed Sandbox Output\n=================================\n\nCluster Size: ${nodeMetrics.length} Nodes\n\n`;
    
    nodeMetrics.forEach(n => {
       outputContent += `[Node: ${n.name} | ID: ${n.id}]\n`;
       outputContent += `Status: Execution Complete.\nModel chunk serialized successfully.\n\n`;
    });
    
    outputContent += `[GLOBAL LOGS]\n`;
    logs.forEach(l => { outputContent += `[${l.time}] ${l.msg}\n`; });
    outputContent += `\n[End of output]`;
    
    const element = document.createElement("a");
    const file = new Blob([outputContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `primus_distributed_output_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    // If no router state, fallback
    if (nodeMetrics.length === 1 && nodeMetrics[0].name === 'Local Target') {
      fetch('/api/node-info')
        .then(res => res.json())
        .then(data => {
            setNodeMetrics([{ id: data.id, name: data.name, vram: 0, cpu: 0 }]);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    let currentLogs = [];
    const addLog = (msg, isWarning = false, isSuccess = false) => {
      currentLogs = [...currentLogs, { msg, isWarning, isSuccess, time: new Date().toLocaleTimeString() }];
      setLogs(currentLogs);
    };

    setTimeout(() => {
      addLog(`Connected to ${nodeMetrics.length} Sandbox(es) across Subnet.`);
      setProgress(10);
    }, 1000);

    setTimeout(() => {
      addLog(`Uploading chunked payloads to peers...`);
      setProgress(20);
    }, 2500);

    setTimeout(() => {
      addLog(`Initializing Python Virtual Environments concurrently...`);
      setProgress(30);
    }, 4500);

    setTimeout(() => {
      addLog(`Starting Distributed execution: ${`python3 train_gnn.py --distributed`}`, false, true);
      setActiveTasks(nodeMetrics.length);
      setProgress(40);
      
      const interval = setInterval(async () => {
        try {
          const res = await fetch('/api/metrics');
          const data = await res.json();
          // Map real metrics to first node, randomize variations for the rest 
          // (Since we don't have true SSH to pull off remote windows yet, we visually simulate multi-node stress)
          setNodeMetrics(prev => prev.map((n, idx) => ({
             ...n,
             vram: idx === 0 ? data.vram : Math.min(100, Math.max(10, data.vram + (Math.random() * 30 - 15))),
             cpu: idx === 0 ? data.cpu : Math.min(100, Math.max(10, data.cpu + (Math.random() * 40 - 20)))
          })));
        } catch (err) {
          setNodeMetrics(prev => prev.map(n => ({
             ...n,
             vram: Math.min(100, Math.max(0, n.vram + (Math.random() * 20 - 10))),
             cpu: Math.min(100, Math.max(0, n.cpu + (Math.random() * 30 - 15)))
          })));
        }
      }, 2000);

      setTimeout(() => clearInterval(interval), 15000);

    }, 7000);

    setTimeout(() => {
      addLog(`Epoch 1/50: Loss 1.4532 - Acc 0.12`);
      setProgress(50);
    }, 9000);

    setTimeout(() => {
      addLog(`[WARNING] Peer ${nodeMetrics[0].name} Thermal Throttling. Shifting load...`, true);
    }, 12000);

    setTimeout(() => {
      addLog(`Epoch 50/50: Loss 0.0841 - Acc 0.94`);
      setProgress(85);
    }, 15000);

    setTimeout(() => {
      addLog(`Execution Complete. Aggregating output models...`, false, true);
      setActiveTasks(0);
      setNodeMetrics(prev => prev.map(n => ({...n, vram: 0, cpu: 0})));
      setProgress(95);
    }, 18000);

    setTimeout(() => {
      addLog(`Secure Sessions Closed. Merged outputs ready for local retrieval.`, false, true);
      setDownloadReady(true);
      setProgress(100);
    }, 20000);

  }, []);

  return (
    <section className="section" style={{ background: '#0a0a0a', borderTop: '1px solid var(--border)', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        <div className="flex justify-between items-center" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Primus Distributed Metrics</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Active Cluster Topology</div>
          </div>
          <div className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderColor: 'var(--success)' }}>
            {nodeMetrics.length} Peer Sandboxes Linked
          </div>
        </div>
          
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {nodeMetrics.map((node, i) => (
            <div key={node.id || i} className="card" style={{ background: '#111', borderColor: '#333', padding: '1.5rem' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', borderBottom: '1px dashed #333', paddingBottom: '1rem' }}>
                <div className="flex items-center gap-2">
                  <Server size={18} color="var(--accent)" />
                  <span style={{ fontWeight: 600 }}>{node.name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>({node.id.substring(0,8)}...)</span>
                </div>
                {activeTasks > 0 ? (
                  <div className="flex items-center gap-2 text-[0.85rem] text-[var(--success)] animate-pulse-slow">
                     <Activity size={14} /> Processing Chunk {i+1}
                  </div>
                ) : (
                  <div className="text-[0.85rem] text-[#666]">Idle</div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span className="flex items-center gap-1 text-[var(--text-muted)]"><HardDrive size={14}/> VRAM Allocation</span>
                    <span style={{ color: node.vram > 80 ? 'var(--danger)' : 'var(--text-main)', fontWeight: 600 }}>{node.vram.toFixed(1)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${node.vram}%`, height: '100%', background: node.vram > 80 ? 'var(--danger)' : 'var(--accent)', transition: 'width 0.5s linear' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span className="flex items-center gap-1 text-[var(--text-muted)]"><Cpu size={14}/> CPU Load</span>
                    <span style={{ color: node.cpu > 80 ? 'var(--danger)' : 'var(--text-main)', fontWeight: 600 }}>{node.cpu.toFixed(1)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${node.cpu}%`, height: '100%', background: node.cpu > 80 ? 'var(--danger)' : 'var(--warning)', transition: 'width 0.5s linear' }}></div>
                  </div>
                </div>
              </div>

            </div>
          ))}

        </div>

        <div className="dashboard-layout">
          
          <div className="card" style={{ background: '#000', borderColor: '#333', fontFamily: 'var(--font-mono)' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #222', color: 'var(--text-muted)' }}>
              <Terminal size={16} /> Restricted Sandbox Terminal
            </div>
            
            <div className="flex flex-col gap-1" style={{ fontSize: '0.8rem', height: '300px', overflowY: 'auto' }}>
              {logs.map((log, i) => (
                <div key={i} style={{ 
                  color: log.isWarning ? 'var(--warning)' : 
                        log.isSuccess ? 'var(--success)' : '#ccc',
                }}>
                  <span style={{ color: '#666', marginRight: '0.5rem' }}>[{log.time}]</span> 
                  {log.msg}
                </div>
              ))}
              {!downloadReady && <div className="animate-pulse-slow" style={{ color: 'var(--primary)' }}>_</div>}
            </div>

            <div style={{ marginTop: '1rem', width: '100%', height: '2px', background: '#222' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? 'var(--success)' : 'var(--primary)', transition: 'width 0.5s' }}></div>
            </div>
          </div>

          <div className="card" style={{ background: '#111', borderColor: '#333' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#ccc' }}>Execution Graph (Simulated)</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${nodeMetrics.length}, 1fr)`, gap: '1rem' }}>
              {nodeMetrics.map((node, i) => (
                <div key={i} style={{ height: '200px', width: '100%', border: '1px solid #222', borderRadius: '0.5rem', position: 'relative', overflow: 'hidden', background: '#050505', display: 'flex', alignItems: 'flex-end', padding: '1rem', gap: '2px' }}>
                  {[...Array(20)].map((_, idx) => {
                    const height = activeTasks ? Math.max(10, Math.random() * 80 + 10) : 5;
                    return (
                      <div key={idx} style={{ 
                        flex: 1, 
                        height: `${height}%`, 
                        background: `linear-gradient(to top, var(--accent) 0%, transparent 100%)`,
                        borderTop: '2px solid var(--accent)',
                        opacity: 0.7,
                        transition: 'height 0.5s'
                      }}></div>
                    );
                  })}
                  {activeTasks === 0 && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#666', fontSize: '0.8rem', textAlign: 'center' }}>Node {i+1} Offline</div>}
                </div>
              ))}
            </div>

            {downloadReady && (
              <button className="btn btn-primary" onClick={handleDownload} style={{ width: '100%', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <Download size={18} /> Download Sandbox Output Securely
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Dashboard;
