import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Settings, Database, Play } from 'lucide-react';

const JobSubmit = ({ networkReady, onStartJob }) => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
    if (onStartJob) onStartJob();
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <section id="jobs" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1rem' }}><span className="gradient-text">2. Job</span> Configuration</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Upload your training scripts and define the target optimization requirements.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8" style={{ maxWidth: '900px', margin: '0 auto', opacity: networkReady ? 1 : 0.5, transition: 'opacity 0.3s', pointerEvents: networkReady ? 'auto' : 'none' }}>
          
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
              <Settings size={20} color="var(--primary)" /> Training Parameters
            </h3>
            
            <div className="flex flex-col gap-4">
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
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="card flex-col items-center justify-center text-center" style={{ flex: 1, borderStyle: 'dashed', borderWidth: '2px', cursor: 'pointer' }}>
              <UploadCloud size={32} color="var(--accent)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Upload `train.py`</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-dark)' }}>Drag and drop your PyTorch/TensorFlow scripts</div>
              <div className="badge" style={{ marginTop: '1rem' }}>train_gnn_v2.py uploaded</div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', background: started ? 'var(--success)' : '' }}
              onClick={handleStart}
              disabled={started || !networkReady}
            >
              <Play size={20} />
              {started ? 'Training Initialized' : 'Schedule distributed tasks'}
            </button>
            
            {!networkReady && (
              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--warning)' }}>
                Please request network access before scheduling.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default JobSubmit;
