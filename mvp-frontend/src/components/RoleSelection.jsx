import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Server, Terminal, Shield } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <section className="section" style={{ display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Welcome to <span className="gradient-text">Primus</span> Local Node</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Select how you want to interact with the decentralized compute network on this machine.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div 
            className="card text-center" 
            style={{ cursor: 'pointer', border: '1px solid var(--accent)', background: 'rgba(139, 92, 246, 0.05)' }}
            onClick={() => navigate('/contribute')}
          >
            <Server size={48} color="var(--accent)" style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>I am a Contributor</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Share your idle GPU power. You will download a script to create a secure, isolated `primus` folder and safely grant temporary SSH access to network Users.
            </p>
            <div className="badge" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
              <Shield size={14} /> Secure Sandbox
            </div>
          </div>

          <div 
            className="card text-center" 
            style={{ cursor: 'pointer', border: '1px solid var(--primary)', background: 'rgba(99, 102, 241, 0.05)' }}
            onClick={() => navigate('/request')}
          >
            <Terminal size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>I am a User</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Request compute resources from the network. You will connect to a Contributor's secure isolated folder to execute your models and view live performance metrics.
            </p>
            <div className="badge" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
              <UserCircle size={14} /> Request Compute
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default RoleSelection;
