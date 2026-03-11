import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileType, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

const UploadJob = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    const uploaded = e.dataTransfer.files[0];
    validateFile(uploaded);
  };

  const handleSimulateUpload = () => {
    validateFile({ name: 'train_gnn_v2.py', type: 'application/x-python' });
  };

  const validateFile = (uploadedFile) => {
    setValidating(true);
    setError('');
    
    setTimeout(() => {
      // Valid Job Format Check as per diagram
      if (uploadedFile.name.endsWith('.py') || uploadedFile.name.endsWith('.sh') || uploadedFile.name.endsWith('.exe')) {
        setFile(uploadedFile);
        setValidating(false);
      } else {
        setError('Invalid File Format. Please upload .py, .sh, or binary executables.');
        setFile(null);
        setValidating(false);
      }
    }, 1200);
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}><span className="gradient-text">1. Upload</span> Job / Script</h2>
          <p style={{ color: 'var(--text-muted)' }}>Upload the executable task for the distributed compute engine.</p>
        </div>

        <div className="card text-center" 
          onDragOver={(e) => e.preventDefault()} 
          onDrop={handleDrop}
          style={{ padding: '4rem 2rem', borderStyle: 'dashed', borderWidth: '2px', cursor: 'pointer', borderColor: file ? 'var(--success)' : error ? 'var(--danger)' : 'var(--border)' }}>
          
          {validating ? (
            <div className="animate-pulse-slow">
              <FileType size={48} color="var(--warning)" style={{ margin: '0 auto 1.5rem' }} />
              <div style={{ fontWeight: 500 }}>Validating Job Format...</div>
            </div>
          ) : file ? (
            <div>
              <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
              <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>{file.name} Uploaded Successfully</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Format Validated. Ready for parameter configuration.</div>
            </div>
          ) : (
            <div onClick={handleSimulateUpload}>
              <UploadCloud size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
              <div style={{ fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Drag & Drop your script here</div>
              <div style={{ color: 'var(--text-muted)' }}>Supports .py, .sh, .exe (Click to simulate upload)</div>
            </div>
          )}

        </div>

        {error && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {file && (
          <div style={{ marginTop: '2rem', textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={() => navigate('/requirements')} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Next: Select Compute Requirements <ArrowRight size={20} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default UploadJob;
