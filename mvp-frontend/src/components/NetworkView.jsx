import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Users, CheckCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

const NetworkView = ({ onNetworkReady }) => {
  const navigate = useNavigate();
  const [peers, setPeers] = useState([
    { id: 'ESA-Rig-Alpha', user: 'ESA Abhishek', specs: 'RTX 3060 | 12GB VRAM', status: 'idle' },
    { id: 'Amrutha-Laptop', user: 'Amrutha Raja', specs: 'M1 Pro | 16GB RAM', status: 'idle' },
    { id: 'Santosh-PC', user: 'Santosh', specs: 'RTX 4070 | 12GB VRAM', status: 'idle' }
  ]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isGranted, setIsGranted] = useState(false);

  const handleRequestAccess = () => {
    setIsRequesting(true);
    setPeers(prev => prev.map(p => ({ ...p, status: 'pending' })));

    // Simulate network delay for peers accepting requests
    setTimeout(() => {
      setPeers(prev => prev.map(p => ({ ...p, status: 'granted' })));
      setIsRequesting(false);
      setIsGranted(true);
      if (onNetworkReady) onNetworkReady();
    }, 4000); // 4 seconds of "Waiting for approval..."
  };

  return (
    <section id="network" className="section" style={{ background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1rem' }}><span className="gradient-text">1. Network</span> Discovery</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Find available hardware in your network and request secure access for distributed training.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <Network color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem' }}>Local Peer Network</h3>
            </div>
            <div className="badge">{peers.length} Nodes Found</div>
          </div>

          <div className="flex flex-col gap-4" style={{ marginBottom: '2rem' }}>
            {peers.map(peer => (
              <div key={peer.id} className="card flex justify-between items-center peer-card" style={{ padding: '1rem 1.5rem', background: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-4">
                  <div style={{ padding: '0.75rem', background: 'var(--glass-bg)', borderRadius: '0.5rem' }}>
                    <Users size={20} color="var(--text-muted)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{peer.user} <span style={{ color: 'var(--text-dark)', fontSize: '0.875rem', fontWeight: 400 }}>({peer.id})</span></div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{peer.specs}</div>
                  </div>
                </div>
                
                <div>
                  {peer.status === 'idle' && <span className="badge">Available</span>}
                  {peer.status === 'pending' && <span className="badge warning"><Clock size={12} style={{ marginRight: '4px' }}/> Awaiting Access</span>}
                  {peer.status === 'granted' && <span className="badge success"><CheckCircle size={12} style={{ marginRight: '4px' }}/> Access Granted</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            {!isGranted ? (
              <button 
                className="btn btn-primary" 
                onClick={handleRequestAccess} 
                disabled={isRequesting}
                style={{ width: '100%', padding: '1rem', opacity: isRequesting ? 0.7 : 1, cursor: isRequesting ? 'wait' : 'pointer' }}
              >
                <ShieldCheck size={20} />
                {isRequesting ? 'Requesting Access from Peers...' : 'Request Access to Network GPUs'}
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '100%', padding: '1rem', color: 'var(--success)', fontWeight: 500, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  Network secured. Resources are ready for allocation.
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/jobs')} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                  Proceed to Job Configuration <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default NetworkView;
