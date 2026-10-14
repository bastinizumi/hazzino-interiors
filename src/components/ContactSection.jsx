import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, ArrowUpRight, MapPin, Mail, Phone, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const submitBtnRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential Interiors',
    location: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Heading moves upward
      tl.fromTo(
        leftColRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
        0
      );

      // Form appears from right
      tl.fromTo(
        rightColRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
        0.2
      );

      // Draw input underlines from left to right
      tl.fromTo(
        '.input-draw-line',
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 0.8, stagger: 0.08, ease: 'power2.inOut' },
        0.4
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic button hover effect
  const handleBtnMouseMove = (e) => {
    if (!submitBtnRef.current) return;
    const rect = submitBtnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    submitBtnRef.current.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const handleBtnMouseLeave = () => {
    if (!submitBtnRef.current) return;
    submitBtnRef.current.style.transform = 'translate(0px, 0px)';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save to localStorage
      const existing = JSON.parse(localStorage.getItem('hazzino_enquiries') || '[]');
      const newEnquiry = { ...formData, timestamp: new Date().toISOString() };
      existing.push(newEnquiry);
      localStorage.setItem('hazzino_enquiries', JSON.stringify(existing));

      // 2. Mock MongoDB API call
      try {
        await fetch('/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEnquiry),
        });
      } catch (err) {
        // Fallback gracefully if backend API is offline
      }

      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 700);
    } catch (err) {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#121110',
        padding: 'clamp(60px, 12vh, 140px) clamp(20px, 6vw, 60px)',
        display: 'flex',
        alignItems: 'center',
        isolation: 'isolate',
      }}
    >
      <div
        className="contact-col-grid"
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(36px, 6vw, 100px)',
          alignItems: 'flex-start',
        }}
      >
        {/* LEFT COLUMN: Large Typography & Studio Details */}
        <div ref={leftColRef}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-bronze)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            START YOUR JOURNEY • 08
          </span>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(36px, 7vw, 92px)',
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: '0.04em',
              margin: '0 0 clamp(20px, 3vh, 32px) 0',
              color: '#121110',
            }}
          >
            LET'S CREATE<br />
            YOUR SPACE.
          </h2>

          <p
            style={{
              fontSize: 'clamp(14px, 1.3vw, 16px)',
              lineHeight: 1.8,
              color: '#1a1917',
              maxWidth: '460px',
              fontFamily: 'var(--font-sans)',
              marginBottom: 'clamp(28px, 4vh, 48px)',
            }}
          >
            Whether an architectural ground-up villa, an executive commercial suite, or bespoke handcrafted furniture, we would love to hear your vision.
          </p>

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <MapPin size={18} color="var(--color-accent-bronze)" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div style={{ fontSize: '13px', lineHeight: 1.6, letterSpacing: '0.04em', color: '#121110', fontWeight: 500 }}>
                Alwarammal Nagar, 1A1, Boothipuram Rd, Thendral Nagar, Palani Chettipatti, Theni, Tamil Nadu 625531
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Mail size={18} color="var(--color-accent-bronze)" style={{ flexShrink: 0 }} />
              <a href="mailto:atelier@hazzinointeriors.com" style={{ fontSize: '13px', letterSpacing: '0.08em', color: '#121110', fontWeight: 500, textDecoration: 'none' }}>
                atelier@hazzinointeriors.com
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Phone size={18} color="var(--color-accent-bronze)" style={{ flexShrink: 0 }} />
              <a href="tel:+918807503355" style={{ fontSize: '13px', letterSpacing: '0.08em', color: '#121110', fontWeight: 600, textDecoration: 'none' }}>
                +91 88075 03355
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.64 20.16 9.27 19.8 8.08 19.09L7.79 18.92L4.69 19.74L5.52 16.72L5.33 16.42C4.55 15.17 4.13 13.56 4.13 11.91C4.13 7.37 7.83 3.67 12.04 3.67ZM8.84 7.34C8.63 7.34 8.28 7.42 7.98 7.74C7.68 8.07 6.84 8.85 6.84 10.45C6.84 12.05 8.01 13.6 8.17 13.81C8.33 14.03 10.28 17.03 13.27 18.32C15.75 19.39 16.26 19.17 16.8 19.12C17.34 19.07 18.54 18.41 18.79 17.71C19.04 17.01 19.04 16.41 18.96 16.28C18.89 16.16 18.71 16.08 18.44 15.95C18.17 15.82 16.84 15.16 16.59 15.07C16.34 14.98 16.16 14.94 15.98 15.21C15.8 15.48 15.28 16.08 15.12 16.27C14.96 16.45 14.8 16.48 14.53 16.34C14.26 16.21 13.39 15.92 12.35 15C11.54 14.28 11 13.4 10.84 13.13C10.68 12.86 10.82 12.71 10.96 12.58C11.08 12.46 11.23 12.26 11.37 12.1C11.5 11.93 11.55 11.81 11.64 11.63C11.73 11.45 11.68 11.3 11.62 11.17C11.55 11.04 11.01 9.71 10.79 9.17C10.57 8.64 10.35 8.71 10.18 8.71C10.02 8.71 9.83 8.7 9.64 8.7C9.45 8.7 9.15 8.77 8.84 7.34Z" />
                </svg>
              </div>
              <a
                href="https://wa.me/918807503355?text=Hello%20Hazzino%20Interiors%2C%20I%20would%20like%20to%20inquire%20about%20your%20interior%20design%20services."
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '13px', letterSpacing: '0.08em', color: '#121110', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Chat on WhatsApp <ArrowUpRight size={13} color="var(--color-accent-bronze)" />
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Clock size={18} color="var(--color-accent-bronze)" />
              <div style={{ fontSize: '13px', letterSpacing: '0.08em', color: '#121110', fontWeight: 500 }}>
                Mon – Sat: 09:30 AM – 07:30 PM (By Appointment)
              </div>
            </div>
          </div>

          {/* Google Maps Location Embed Card */}
          <div
            style={{
              marginTop: '32px',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid rgba(20, 20, 20, 0.12)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              backgroundColor: '#f8f6f0',
              maxWidth: '520px',
            }}
          >
            <div
              style={{
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(20, 20, 20, 0.08)',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color="var(--color-accent-bronze)" />
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#121110' }}>
                  STUDIO LOCATION • THENI
                </span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Alwarammal+Nagar,+1A1,+Boothipuram+Rd,+Thendral+Nagar,+Palani+Chettipatti,+Theni,+Tamil+Nadu+625531"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent-bronze)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                OPEN MAPS <ArrowUpRight size={12} />
              </a>
            </div>
            <iframe
              title="Hazzino Interiors Location Map"
              src="https://maps.google.com/maps?q=Alwarammal+Nagar,+1A1,+Boothipuram+Rd,+Thendral+Nagar,+Palani+Chettipatti,+Theni,+Tamil+Nadu+625531&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="220"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Minimal Architectural Form */}
        <div ref={rightColRef}>
          {submitted ? (
            <div
              style={{
                padding: '60px 40px',
                border: '1px solid rgba(20, 20, 20, 0.1)',
                backgroundColor: '#f8f6f0',
                textAlign: 'center',
                animation: 'fadeInUp 0.6s var(--ease-expo)',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#121110',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                }}
              >
                <Check size={24} />
              </div>
              <h3
                className="font-serif"
                style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  letterSpacing: '0.12em',
                  margin: '0 0 12px 0',
                }}
              >
                THANK YOU.
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  letterSpacing: '0.18em',
                  color: '#555148',
                  textTransform: 'uppercase',
                  marginBottom: '28px',
                }}
              >
                YOUR PROJECT JOURNEY STARTS HERE.
              </p>
              <p style={{ fontSize: '13px', color: '#7a756c', maxWidth: '380px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
                Our principal interior architects have received your consultation enquiry. We will reach out within 24 business hours with an initial project brief.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    projectType: 'Residential Interiors',
                    location: '',
                    message: '',
                  });
                }}
                className="btn-magnetic"
                style={{
                  backgroundColor: '#121110',
                  color: '#ffffff',
                  borderColor: '#121110',
                }}
              >
                <span>SEND ANOTHER ENQUIRY</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Field 1: NAME */}
              <div style={{ position: 'relative' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#121110',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ar. Rajesh Anand"
                  className="contact-field"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                    padding: '10px 0',
                    fontSize: '15px',
                    fontFamily: 'var(--font-sans)',
                    color: '#121110',
                    outline: 'none',
                  }}
                />
                <div className="input-draw-line input-focus-underline" />
              </div>

              {/* Field 2 & 3: EMAIL & PHONE in 2 columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                <div style={{ position: 'relative' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: '#121110',
                    fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rajesh@domain.com"
                    className="contact-field"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                      padding: '10px 0',
                      fontSize: '15px',
                      fontFamily: 'var(--font-sans)',
                      color: '#121110',
                      outline: 'none',
                    }}
                  />
                  <div className="input-draw-line input-focus-underline" />
                </div>

                <div style={{ position: 'relative' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: '#121110',
                    fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    PHONE *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 88075 03355"
                    className="contact-field"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                      padding: '10px 0',
                      fontSize: '15px',
                      fontFamily: 'var(--font-sans)',
                      color: '#121110',
                      outline: 'none',
                    }}
                  />
                  <div className="input-draw-line input-focus-underline" />
                </div>
              </div>

              {/* Field 4 & 5: PROJECT TYPE & LOCATION */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                <div style={{ position: 'relative' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: '#121110',
                    fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    PROJECT TYPE
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="contact-field"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                      padding: '10px 0',
                      fontSize: '14px',
                      fontFamily: 'var(--font-sans)',
                      color: '#121110',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Residential Interiors">Residential Interiors</option>
                    <option value="Luxury Villa Renovation">Luxury Villa Renovation</option>
                    <option value="Executive Office">Executive Office</option>
                    <option value="Custom Furniture Craft">Custom Furniture Craft</option>
                    <option value="Hospitality & Institutional">Hospitality & Institutional</option>
                  </select>
                  <div className="input-draw-line input-focus-underline" />
                </div>

                <div style={{ position: 'relative' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: '#121110',
                    fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Theni / Madurai / Chennai"
                    className="contact-field"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                      padding: '10px 0',
                      fontSize: '15px',
                      fontFamily: 'var(--font-sans)',
                      color: '#121110',
                      outline: 'none',
                    }}
                  />
                  <div className="input-draw-line input-focus-underline" />
                </div>
              </div>

              {/* Field 6: MESSAGE */}
              <div style={{ position: 'relative' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#121110',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  MESSAGE & SCOPE
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your spaces, approximate square footage, timeline..."
                  className="contact-field"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(20, 20, 20, 0.2)',
                    padding: '10px 0',
                    fontSize: '14px',
                    fontFamily: 'var(--font-sans)',
                    color: '#121110',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
                <div className="input-draw-line input-focus-underline" />
              </div>

              {/* Submit Button with Magnetic Motion */}
              <div style={{ paddingTop: '16px' }}>
                <button
                  ref={submitBtnRef}
                  type="submit"
                  disabled={loading}
                  onMouseMove={handleBtnMouseMove}
                  onMouseLeave={handleBtnMouseLeave}
                  className="btn-magnetic"
                  style={{
                    backgroundColor: '#121110',
                    color: '#ffffff',
                    borderColor: '#121110',
                    padding: '18px 42px',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <span>{loading ? 'TRANSMITTING...' : 'START A CONVERSATION'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .input-focus-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: rgba(20, 20, 20, 0.25);
          pointer-events: none;
        }
        .contact-field:focus + .input-focus-underline {
          background-color: var(--color-accent-bronze);
          height: 2px;
        }
      `}</style>
    </section>
  );
}
