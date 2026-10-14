import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ onScrollTop }) {
  const scrollToTop = () => {
    if (onScrollTop) onScrollTop();
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#0a0a09',
        color: '#f8f6f0',
        padding: 'clamp(50px, 8vh, 90px) clamp(20px, 6vw, 60px) clamp(30px, 5vh, 50px) clamp(20px, 6vw, 60px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 'clamp(28px, 4vw, 40px)',
          marginBottom: 'clamp(32px, 6vh, 60px)',
        }}
      >
        {/* Col 1: Brand */}
        <div>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '18px' }}
          >
            <img
              src="/assets/hazzino_logo_transparent.png"
              alt="Hazzino Interiors — Designing Spaces, Defining Lifestyles"
              style={{
                width: 'min(230px, 72vw)',
                height: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))',
              }}
            />
          </a>
          <p
            style={{
              fontSize: '12px',
              lineHeight: 1.8,
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-sans)',
              maxWidth: '300px',
            }}
          >
            A high-end interior architecture practice designing timeless living spaces, executive commercial sanctuaries, and custom furniture.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent-gold)', fontWeight: 600, marginBottom: '18px' }}>
            NAVIGATION
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
            {['WORK', 'STUDIO', 'SERVICES', 'MATERIALS', 'FURNITURE', 'CONFIGURATOR'].map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--color-accent-gold)')}
                  onMouseLeave={(e) => (e.target.style.color = '#ffffff')}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Studio Coordinates */}
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent-gold)', fontWeight: 600, marginBottom: '18px' }}>
            HEADQUARTERS
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8, color: '#ffffff' }}>
            Hazzino Architecture Atelier<br />
            Alwarammal Nagar, 1A1, Boothipuram Rd,<br />
            Thendral Nagar, Palani Chettipatti,<br />
            Theni, Tamil Nadu 625531
          </div>
        </div>

        {/* Col 4: Scroll Top */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-accent-gold)', fontWeight: 600, marginBottom: '18px' }}>
              DIRECT INQUIRIES
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.8, color: '#ffffff' }}>
              <a href="mailto:atelier@hazzinointeriors.com" style={{ color: '#ffffff', textDecoration: 'none', display: 'block' }}>
                atelier@hazzinointeriors.com
              </a>
              <a href="tel:+918807503355" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600, display: 'block' }}>
                +91 88075 03355
              </a>
              <a href="https://wa.me/918807503355?text=Hello%20Hazzino%20Interiors%2C%20I%20would%20like%20to%20inquire%20about%20your%20interior%20design%20services." target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                WhatsApp Chat ↗
              </a>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="btn-magnetic"
            style={{
              padding: '12px 20px',
              fontSize: '9px',
              marginTop: '20px',
            }}
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '30px',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.85)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <span>© {new Date().getFullYear()} HAZZINO INTERIORS. ALL RIGHTS RESERVED.</span>
        <span>CINEMATIC ARCHITECTURAL SHOWROOM</span>
      </div>
    </footer>
  );
}
