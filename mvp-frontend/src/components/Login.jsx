import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate auth check
    setTimeout(() => {
      if (email && password) {
        navigate('/upload');
      } else {
        setError('Authentication Failed. Please provide valid credentials.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ width: '100%', maxWidth: '500px' }}>
        
        <div className="card text-center" style={{ padding: '3rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={32} color="white" />
            </div>
          </div>
          
          <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Primus <span className="gradient-text">Auth</span></h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to access the decentralized compute grid.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            
            {error && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '0.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email/Username</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@iiits.in"
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '0.5rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '0.5rem', outline: 'none', paddingLeft: '2.5rem' }}
                />
                <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ padding: '1rem', marginTop: '0.5rem', width: '100%', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Authenticating...' : 'Sign In Securely'}
            </button>
          </form>

        </div>

      </div>
    </section>
  );
};

export default Login;
