import React from 'react';
import { User, Github, Linkedin } from 'lucide-react';

const Team = () => {
  const members = [
    { name: "ESA ABHISHEK", id: "S20220010068", role: "Full-Stack Developer", glow: "var(--primary)" },
    { name: "PERISETTY SATYA AMRUTHA RAJA", id: "S20220010170", role: "System Orchestration", glow: "var(--accent)" },
    { name: "SEETHEPALLI SATYA SANTOSH", id: "S20220010197", role: "Data Architect", glow: "var(--warning)" }
  ];

  return (
    <section id="team" className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2>Team <span className="gradient-text">Primus</span></h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Domain experts in Computer Science and Python full-stack engineering.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          
          {members.map((member, i) => (
            <div key={i} className="card text-center" style={{ padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                background: member.glow, boxShadow: `0 0 15px ${member.glow}`
              }}></div>
              
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1.5rem', 
                background: 'var(--bg-tertiary)', border: `2px solid ${member.glow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
              }}>
                <User size={40} />
              </div>
              
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{member.name}</h3>
              <div className="badge" style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>{member.id}</div>
              
              <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem', marginBottom: '2rem' }}>{member.role}</p>

              <div className="flex justify-center gap-4">
                <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><Github size={20} /></a>
                <a href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><Linkedin size={20} /></a>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Team;
