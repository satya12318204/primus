import React from 'react';
import { AlertOctagon, RefreshCcw, Cpu } from 'lucide-react';

const ProblemSolution = () => {
  return (
    <section id="problem" className="section" style={{ background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>The <span className="gradient-text">Problem First</span> Approach</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Understanding the root pain points of students training complex models like GNNs.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          
          <div className="card flex-col items-start">
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '1rem', color: 'var(--danger)', marginBottom: '1.5rem' }}>
              <AlertOctagon size={32} />
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>The Problem</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Students and independent researchers frequently face <strong>"Out of Memory" (OOM)</strong> errors and hardware thermal throttling when training complex models on lower-end personal computers.
            </p>
          </div>

          <div className="card flex-col items-start">
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '1rem', color: 'var(--warning)', marginBottom: '1.5rem' }}>
              <RefreshCcw size={32} />
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>The Pain</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Existing manual workarounds involve restarting long training sessions from scratch when a friend’s "borrowed" PC disconnects or a single node fails, leading to wasted time and profound emotional frustration.
            </p>
          </div>

          <div className="card flex-col items-start" style={{ borderColor: 'var(--accent)', background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%)' }}>
            <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '1rem', color: 'var(--accent)', marginBottom: '1.5rem' }}>
              <Cpu size={32} />
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>The Solution</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              A technology interface that clusters accessible, idle hardware from <strong>"well-wishers"</strong> into a single, durable execution engine that automatically recovers, flags corrupted devices, and reassigns tasks to ensure successful completion.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
