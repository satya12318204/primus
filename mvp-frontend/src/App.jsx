import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import RoleSelection from './components/RoleSelection';
import ContributorSetup from './components/ContributorSetup';
import RequesterFlow from './components/RequesterFlow';
import Requirements from './components/Requirements';
import NetworkView from './components/NetworkView';
import Dashboard from './components/Dashboard';
import Team from './components/Team';

function App() {
  const [networkReady, setNetworkReady] = useState(false);
  const [jobStarted, setJobStarted] = useState(false);
  const location = useLocation();

  return (
    <>
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>
      
      <header className="app-header" style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)' }}>
        <div className="container flex justify-between items-center">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="flex items-center gap-2">
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}></div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Primus</h3>
            </div>
          </Link>
          <nav className="flex gap-6">
            <Link to="/role" style={{ color: location.pathname === '/role' ? 'var(--text-main)' : 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Portal Entry</Link>
            <Link to="/contribute" style={{ color: location.pathname === '/contribute' ? 'var(--text-main)' : 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Contribute</Link>
            <Link to="/request" style={{ color: location.pathname === '/request' ? 'var(--text-main)' : 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Request</Link>
            <Link to="/dashboard" style={{ color: location.pathname === '/dashboard' ? 'var(--text-main)' : 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Grafana</Link>
            <Link to="/team" style={{ color: location.pathname === '/team' ? 'var(--text-main)' : 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Team</Link>
          </nav>
          <Link to="/role" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>Launch Portal</Link>
        </div>
      </header>

      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/role" element={<RoleSelection />} />
          <Route path="/contribute" element={<ContributorSetup />} />
          <Route path="/request" element={<RequesterFlow />} />
          <Route path="/dashboard" element={<Dashboard isActive={jobStarted} />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '3rem 0', marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="container">
          <p>© 2026 Team Primus</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Decentralized Fault-Tolerant Compute for Resource-Constrained Developers</p>
        </div>
      </footer>
    </>
  );
}

export default App;
