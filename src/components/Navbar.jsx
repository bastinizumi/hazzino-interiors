import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subtle magnetic hover effect on "START A PROJECT"
  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btnRef.current.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = 'translate(0px, 0px)';
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const mobileNavItems = [
    { label: 'WORK', target: '#work' },
    { label: 'KITCHEN 3D', target: '#kitchen' },
    { label: 'STUDIO', target: '#studio' },
    { label: 'SERVICES', target: '#services' },
    { label: 'MATERIALS', target: '#materials' },
    { label: 'FURNITURE', target: '#configurator' },
    { label: 'CONTACT', target: '#contact' },
  ];

  const navLinks = mobileNavItems.filter((item) => item.label !== 'CONTACT');

  const handleLinkClick = (target) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(target);
    } else {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          padding: scrolled ? '16px 5vw' : '28px 5vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
          backgroundColor: scrolled ? 'rgba(248, 246, 240, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(20, 20, 20, 0.08)' : '1px solid transparent',
          color: scrolled ? '#121110' : '#ffffff',
        }}
      >
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#hero');
          }}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'transform 0.25s ease',
          }}
          className="brand-logo-link"
        >
          <img
            src="/assets/hazzino_emblem.png"
            alt="Hazzino Logo Emblem"
            style={{
              height: 'clamp(32px, 4.2vw, 42px)',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(16px, 2.2vw, 19px)',
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                lineHeight: 1.05,
                color: scrolled ? '#121110' : '#ffffff',
                transition: 'color 0.4s ease',
              }}
            >
              HAZZINO
            </span>
            <span
              style={{
                fontSize: 'clamp(7.5px, 0.9vw, 8.5px)',
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                opacity: 0.85,
                color: 'var(--color-accent-gold)',
                fontWeight: 600,
                marginTop: '2px',
              }}
            >
              INTERIORS
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '40px',
          }}
          className="desktop-nav-group"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.target}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.target);
              }}
              className="nav-link-item"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                position: 'relative',
                padding: '6px 0',
                transition: 'transform 0.3s var(--ease-expo), color 0.3s ease',
              }}
            >
              <span className="nav-label-text">{link.label}</span>
              <span className="nav-underline" />
            </a>
          ))}
        </div>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            ref={btnRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleLinkClick('#contact')}
            style={{
              display: 'none',
              padding: '12px 24px',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: scrolled ? '#ffffff' : '#121110',
              backgroundColor: scrolled ? '#121110' : '#ffffff',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s',
            }}
            className="desktop-cta-btn"
          >
            START A PROJECT
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
            className="mobile-menu-trigger"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Full-screen Ivory Mobile Menu */}
      <div
        className="mobile-nav-drawer"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          backgroundColor: '#f8f6f0',
          color: '#121110',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '24px',
          padding: 'max(32px, env(safe-area-inset-top, 32px)) 6vw max(28px, env(safe-area-inset-bottom, 28px)) 6vw',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          transform: mobileMenuOpen ? 'translateY(0%)' : 'translateY(-100%)',
          transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/assets/hazzino_emblem.png"
              alt="Hazzino Logo Emblem"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
              }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '19px', fontWeight: 600, letterSpacing: '0.22em', color: '#121110' }}>
                HAZZINO
              </div>
              <div style={{ fontSize: '8px', letterSpacing: '0.38em', color: 'var(--color-accent-gold)', fontWeight: 600, marginTop: '2px' }}>
                INTERIORS • THENI
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Navigation Menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#121110',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>

        {/* Sequential Mobile Nav Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: 'auto 0' }}>
          {mobileNavItems.map((item, index) => (
            <div key={item.label} style={{ overflow: 'hidden' }}>
              <a
                href={item.target}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.target);
                }}
                style={{
                  textDecoration: 'none',
                  color: '#121110',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(22px, 5vw, 36px)',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(20, 20, 20, 0.08)',
                  paddingBottom: '8px',
                  transform: mobileMenuOpen ? 'translateY(0%)' : 'translateY(120%)',
                  transition: `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.08 + index * 0.05}s`,
                }}
              >
                <span>{item.label}</span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-sans)', color: '#8e734c' }}>
                  0{index + 1}
                </span>
              </a>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#2c2925', fontWeight: 500, paddingTop: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <span>EST. 2026 • THENI, TAMIL NADU</span>
          <span>HAZZINOINTERIORS.COM</span>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-group {
            display: flex !important;
          }
          .desktop-cta-btn {
            display: inline-flex !important;
          }
          .mobile-menu-trigger {
            display: none !important;
          }
        }
        .nav-link-item:hover {
          transform: translateY(-3px);
        }
        .nav-underline {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0%;
          height: 1px;
          background: currentColor;
          transition: width 0.35s var(--ease-expo), left 0.35s var(--ease-expo);
        }
        .nav-link-item:hover .nav-underline {
          width: 100%;
          left: 0;
        }
      `}</style>
    </>
  );
}
