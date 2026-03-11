import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Server, Clock, CheckCircle } from 'lucide-react';

const Requirements = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle -> checking -> queued -> ready

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('checking');

    // Simulate Resource Check
    setTimeout(() => {
      setStatus('queued'); // "Queue Job Until Resources Available"
      
      // Simulate resources becoming available
      setTimeout(() => {
        setStatus('ready');
        
        // Navigate to Dashboard to begin connection/execution
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);

      }, 3000); // Wait 3 seconds in queue
    }, 1500);
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}><span className="gradient-text">2. Select</span> Requirements</h2>
          <p style={{ color: 'var(--text-muted)' }}>Define the hardware needed for your model.</p>
        </div>

        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', opacity: status === 'idle' ? 1 : 0.6, pointerEvents: status === 'idle' ? 'auto' : 'none' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
            <Settings size={20} color="var(--primary)" /> Training Parameters
          </h3>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Model Architecture</label>
              <select style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '0.5rem', outline: 'none' }}>
                <option>Graph Neural Network (GNN)</option>
                <option>Transformer (LLM Finetuning)</option>
                <option>Convolutional Neural Network (CNN)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Required Distributed VRAM</label>
              <select style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '0.5rem', outline: 'none' }}>
                <option>24 GB (Auto-partitioned)</option>
                <option>16 GB</option>
                <option>48 GB</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Optimization Strategy</label>
              <select style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '0.5rem', outline: 'none' }}>
                <option>Fault-Tolerant (Redundant Checkpoints)</option>
                <option>Max Speed (Aggressive Parallelism)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '1rem', width: '100%' }}>
              Allocate Network Resources
            </button>
          </form>
        </div>

        {status !== 'idle' && (
          <div className="card text-center" style={{ marginTop: '2rem', maxWidth: '600px', margin: '2rem auto 0' }}>
            {status === 'checking' && (
              <div className="animate-pulse-slow">
                <Server size={32} color="var(--warning)" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.25rem' }}>Checking Node Availability...</h4>
                <p style={{ color: 'var(--text-muted)' }}>Polling Primus Network for 24GB VRAM capacity.</p>
              </div>
            )}
            
            {status === 'queued' && (
              <div className="animate-pulse-slow">
                <Clock size={32} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.25rem' }}>Job Queued</h4>
                <p style={{ color: 'var(--text-muted)' }}>Waiting for resources to become available...</p>
              </div>
            )}

            {status === 'ready' && (
              <div>
                <CheckCircle size={32} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.25rem' }}>Resources Allocated</h4>
                <p style={{ color: 'var(--text-muted)' }}>Connecting to distributed engine...</p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};

export default Requirements;
