import React from 'react';
import { Target, TrendingUp, Users, Heart } from 'lucide-react';

const Frameworks = () => {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">

        <h2 style={{ textAlign: 'center', marginBottom: '4rem' }}>Idea <span className="gradient-text">Evaluation</span> & Frameworks</h2>
        
        <div className="grid grid-cols-2 gap-8" style={{ marginBottom: '4rem' }}>
          
          <div className="card">
            <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
              <Heart color="var(--danger)" />
              <h3 style={{ fontSize: '1.25rem' }}>I Want This Solution</h3>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              This idea originated from our personal struggle trying to train deep learning models on limited local hardware. We constantly wished a system existed that could seamlessly use a friend's idle GPU.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
              <Users color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem' }}>Founder-Market Fit</h3>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Our team consists of CS students who have lived this problem daily. We possess the technical background in Python and full-stack development needed to build the distributed orchestration layer.
            </p>
          </div>

        </div>

        <div className="glass-panel" style={{ padding: '3rem', borderRadius: '1.5rem', background: 'rgba(99, 102, 241, 0.05)' }}>
          <div className="grid grid-cols-3 gap-8 text-center">
            
            <div>
              <TrendingUp size={40} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Trend Changes</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Capitalizing on the massive surge in AI & Automation, where the demand for cheap, decentralized GPU compute is outstripping centralized cloud services.
              </p>
            </div>

            <div>
              <Target size={40} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Market Size</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Expanding exponentially. Democratizing high-performance tasks for millions of students worldwide holds massive long-term growth potential.
              </p>
            </div>

            <div>
              <Users size={40} color="var(--warning)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Our Edge</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                High certainty based on peer observations. We have domain experience, execution ability, and direct access to a large user base of IIIT Sricity students.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Frameworks;
