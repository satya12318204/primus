import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Network } from 'lucide-react';

const Hero = () => {
  return (
    <section className="section" style={{ paddingTop: '8rem', paddingBottom: '6rem', position: 'relative' }}>
      <div className="container flex flex-col items-center text-center animate-fade-up">
        
        <div className="badge" style={{ marginBottom: '2rem' }}>
          <span style={{ marginRight: '0.5rem', display: 'flex' }}><Network size={14} color="var(--accent)" /></span>
          Primus - A Decentralized Fault-Tolerant Compute Engine
        </div>

        <h1 style={{ maxWidth: '900px', marginBottom: '1.5rem' }}>
          Unleash <span className="gradient-text">Decentralized</span> AI Compute via Local Nodes
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
          Run the Primus Portal locally to connect your idle GPUs to the network securely, or request temporary SSH access to train your deep learning models in restricted sandbox environments.
        </p>

        <div className="flex gap-4 items-center justify-center">
          <Link to="/role" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}>
            <Server size={20} /> Launch Local Node Portal
          </Link>
        </div>
        
        {/* Decorative graphic */}
        <div style={{ marginTop: '4rem', opacity: 0.8 }}>
          <Network size={120} color="var(--glass-border)" style={{ filter: 'drop-shadow(0 0 20px var(--accent-glow))' }} />
        </div>

      </div>
    </section>
  );
};

export default Hero;
