import React from 'react';
import { Feather } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div style={{ padding: '60px 0 90px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', padding: '10px', background: '#f2ede4', borderRadius: '50%', color: '#8c4a2f', marginBottom: '14px' }}>
            <Feather size={26} />
          </div>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: '38px', fontWeight: 700, color: '#22201e', marginBottom: '14px' }}>
            About papercup
          </h1>
          <p style={{ fontSize: '18px', color: '#68625d', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto', fontStyle: 'italic' }}>
            A thoughtfully curated engineering journal dedicated to in-depth technical discourse, system design, and the evolving landscape of computing.
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e8e4dc', borderRadius: '10px', padding: '44px 40px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', lineHeight: 1.85, fontSize: '16px', color: '#363330' }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: '24px', fontWeight: 600, color: '#22201e', marginBottom: '16px' }}>
            Our Editorial Philosophy
          </h2>
          <p style={{ marginBottom: '22px' }}>
            In an era of fleeting hot-takes and automated summaries, papercup is designed for practitioners who value deep, deliberate reading. Inspired by classic printed journals and long-form technical literature, every essay and tutorial is prepared with rigorous architectural analysis and verified code implementations.
          </p>
          <p style={{ marginBottom: '28px' }}>
            We cover core software engineering disciplines: distributed systems, foundational artificial intelligence, cloud native infrastructure, DevSecOps, and engineering leadership.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', margin: '36px 0', padding: '24px 0', borderTop: '1px solid #ede8e1', borderBottom: '1px solid #ede8e1' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#8c4a2f', fontFamily: "'Lora', serif" }}>45k+</div>
              <div style={{ fontSize: '13px', color: '#7a736d', marginTop: '4px' }}>Weekly Readers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#8c4a2f', fontFamily: "'Lora', serif" }}>100%</div>
              <div style={{ fontSize: '13px', color: '#7a736d', marginTop: '4px' }}>Peer Reviewed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#8c4a2f', fontFamily: "'Lora', serif" }}>7</div>
              <div style={{ fontSize: '13px', color: '#7a736d', marginTop: '4px' }}>Core Domains</div>
            </div>
          </div>

          <h3 style={{ fontFamily: "'Lora', serif", fontSize: '20px', fontWeight: 600, color: '#22201e', margin: '32px 0 14px' }}>
            What We Focus On
          </h3>
          <ul style={{ paddingLeft: '24px', marginBottom: '28px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Systems Architecture:</strong> Resilient microservices, event streaming, and database scaling.</li>
            <li style={{ marginBottom: '8px' }}><strong>Machine Learning & AI:</strong> LLM reasoning loops, tool augmentation, and model evaluation.</li>
            <li style={{ marginBottom: '8px' }}><strong>Cloud Infrastructure:</strong> Kubernetes orchestration, serverless cost trade-offs, and multi-region reliability.</li>
            <li style={{ marginBottom: '8px' }}><strong>Security Architecture:</strong> Zero-trust workload identities, automated compliance, and defense in depth.</li>
          </ul>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/blog" className="btn-primary" style={{ padding: '12px 24px' }}>
              Explore Our Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
