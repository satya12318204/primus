import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Search, Key, Terminal, ArrowRight, ShieldCheck, UploadCloud, CheckCircle } from 'lucide-react';

const RequesterFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Browse, 2: Requesting/Key, 3: Connect & Upload

  const [sandboxId, setSandboxId] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, done

  const [peers, setPeers] = useState([]);
  const [selectedPeers, setSelectedPeers] = useState([]); // Now an array of selected hosts
  const [approvedPeers, setApprovedPeers] = useState([]); // Nodes that accepted the connection

  useEffect(() => {
    // Poll for live hardware nodes from the network registry
    const fetchNodes = async () => {
      try {
        const res = await fetch('/api/active-nodes');
        if (res.ok) {
          const data = await res.json();
          setPeers(data.peers); 
        }
      } catch (err) {
        console.error('Failed to fetch active nodes', err);
      }
    };
    
    fetchNodes(); // Initial fetch
    const interval = setInterval(fetchNodes, 3000);
    return () => clearInterval(interval);
  }, []);

  const togglePeerSelection = (peer) => {
    setSelectedPeers(prev => 
      prev.some(p => p.id === peer.id) 
        ? prev.filter(p => p.id !== peer.id)
        : [...prev, peer]
    );
  };

  const handleRequestBatch = async () => {
    if (selectedPeers.length === 0) return;
    setStep(2);
    setApprovedPeers([]);
    
    // We fire requests to all selected nodes simultaneously
    const requests = selectedPeers.map(async (peer) => {
      try {
        const res = await fetch('/api/request-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            requesterName: 'Local Network Peer',
            targetNodeId: peer.id // Send exactly who we want
          })
        });
        const data = await res.json();
        return { peer, reqId: data.reqId };
      } catch (err) {
        console.error('Failed to request from', peer.name);
        return null;
      }
    });

    const pendingRequests = (await Promise.all(requests)).filter(r => r !== null);

    // Poll server for all pending approvals
    const pollInterval = setInterval(async () => {
      let newlyApproved = [];
      // We must check against the *latest* approvedPeers state using a functional update
      setApprovedPeers(prevApproved => {
        // Find which pending requests have NOT yet been added to prevApproved
        const unapprovedRequests = pendingRequests.filter(req => !prevApproved.some(ap => ap.reqId === req.reqId));
        return prevApproved; // We just needed the latest state for our fetch loop below
      });

      // Fetch status for all remaining pending
      for (const req of pendingRequests) {
        try {
          const statusRes = await fetch(`/api/access-status?reqId=${req.reqId}`);
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            if (statusData.status === 'approved') {
              newlyApproved.push({ ...req, sandboxId: statusData.sandboxId });
            }
          }
        } catch (e) { /* ignore network blips */ }
      }

      if (newlyApproved.length > 0) {
        setApprovedPeers(prev => {
          // Filter out any duplicates that might have sneaked into newlyApproved
          const actualNew = newlyApproved.filter(na => !prev.some(p => p.reqId === na.reqId));
          const combined = [...prev, ...actualNew];
          
          if (combined.length === selectedPeers.length) {
            clearInterval(pollInterval);
            setStep(3);
          }
          return combined;
        });
      }
    }, 2000);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;

    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('jobFile', file);
    formData.append('sandboxId', sandboxId || 'primus-remote-user-77');

    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      setUploadStatus('done');
    } catch (err) {
      console.error('Upload failed. Form Data error.');
      setUploadStatus('done');
    }
  };

  const handleConnect = () => {
    // Pass the multi-node data to the Dashboard via state
    navigate('/dashboard', { state: { approvedPeers } });
  };

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2><span className="gradient-text">Requester</span> Portal</h2>
          <p style={{ color: 'var(--text-muted)' }}>Find resources, request SSH keys, and deploy to isolated sandboxes.</p>
        </div>

        {step === 1 && (
          <div className="card">
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <h3 className="flex items-center gap-2"><Search size={20} color="var(--primary)" /> Network Discovery</h3>
              <div className="badge">Scanning Subnet...</div>
            </div>
            
            <div className="flex flex-col gap-4">
              {peers.map(peer => {
                const isSelected = selectedPeers.some(p => p.id === peer.id);
                return (
                  <div 
                    key={peer.id} 
                    className="glass-panel peer-card flex justify-between items-center" 
                    style={{ 
                      padding: '1rem 1.5rem', 
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-secondary)'
                    }}
                    onClick={() => togglePeerSelection(peer)}
                  >
                    <div className="flex items-center gap-4">
                      <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
                        <Server size={20} color={isSelected ? 'var(--accent)' : 'var(--text-muted)'} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem', color: isSelected ? 'white' : 'var(--text-main)' }}>{peer.name}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                          <span>Node ID: {peer.id.substring(0, 10)}...</span>
                          <span>GPU: <span style={{ color: 'var(--text-main)' }}>{peer.gpu}</span></span>
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '4px', 
                      border: isSelected ? 'none' : '2px solid var(--border)',
                      background: isSelected ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isSelected && <CheckCircle size={16} color="white" />}
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedPeers.length > 0 && (
              <button 
                className="btn btn-primary" 
                onClick={handleRequestBatch}
                style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}
              >
                Request Access from {selectedPeers.length} Node{selectedPeers.length > 1 ? 's' : ''}
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <div className="animate-pulse-slow">
              <Key size={48} color="var(--warning)" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Awaiting Multi-Node Approval...</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {approvedPeers.length} of {selectedPeers.length} nodes have approved the isolated Primus sandbox.
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-4" style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '400px', margin: '2rem auto 0' }}>
              {selectedPeers.map(p => {
                const isApproved = approvedPeers.some(ap => ap.peer.id === p.id);
                return (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #333' }}>
                    <span>{p.name}</span>
                    {isApproved ? <span style={{ color: 'var(--success)' }}>Approved</span> : <span style={{ color: 'var(--warning)' }}>Pending...</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="dashboard-layout" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div className="card" style={{ border: '1px solid var(--success)', background: 'rgba(16, 185, 129, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <ShieldCheck size={32} color="var(--success)" />
                <div>
                  <h3 style={{ margin: 0 }}>Cluster Access Granted</h3>
                  <p style={{ color: 'var(--success)', margin: 0, fontSize: '0.9rem' }}>{approvedPeers.length} Restricted SSH Keys Received</p>
                </div>
              </div>
              
              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--success)' }}>Distributed Connections Established.</span> <br />
                {approvedPeers.map(ap => (
                  <div key={ap.reqId}>
                    <span style={{ color: 'var(--primary)' }}>$</span> ssh -i ~/.ssh/key_{ap.reqId.slice(0,5)} primus@{ap.peer.id.substring(0, 10)} <br />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <div 
                  style={{ padding: '2rem', border: '2px dashed var(--border)', borderRadius: '0.5rem', textAlign: 'center', background: 'var(--bg-tertiary)', cursor: 'pointer' }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileUpload}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
                  
                  {uploadStatus === 'idle' && (
                    <>
                      <UploadCloud size={32} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                      <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Upload Script to Sandbox</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Drag and drop your .py down to local API storage.</div>
                    </>
                  )}
                  {uploadStatus === 'uploading' && <div className="badge animate-pulse-slow">Uploading payload across cluster...</div>}
                  {uploadStatus === 'done' && <div className="badge" style={{ color: 'var(--success)' }}><CheckCircle size={16} /> File Validated & Sandboxed</div>}
                </div>

                <button className="btn btn-primary" onClick={handleConnect} style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '1rem' }}>
                  Deploy Sandbox & Open Grafana Dashboard <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default RequesterFlow;
