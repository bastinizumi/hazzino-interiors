import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HOTSPOTS_DATA = [
  {
    id: 1,
    tag: '01',
    label: 'FRAME',
    title: 'SOLID WOOD FRAME',
    desc: 'Crafted from sustainably sourced American Black Walnut for exceptional structural rigidity, organic warmth, and heirloom longevity.',
    x: 28, // % from left
    y: 72, // % from top
  },
  {
    id: 2,
    tag: '02',
    label: 'FABRIC',
    title: 'TACTILE BOUCLÉ WEAVE',
    desc: 'High-density natural wool and Italian cotton yarn weave with soft-touch textured surface, stain-resistant backing, and gentle breathability.',
    x: 44,
    y: 32,
  },
  {
    id: 3,
    tag: '03',
    label: 'ARMREST',
    title: 'SCULPTED WALNUT ARMREST',
    desc: 'Hand-shaped continuous organic curvature with seamless concealed mortise-and-tenon joinery, finished in zero-VOC matte Danish oil.',
    x: 64,
    y: 44,
  },
  {
    id: 4,
    tag: '04',
    label: 'CUSHION',
    title: 'MULTI-DENSITY CORE',
    desc: 'Multi-layer ergonomic cushion combining high-resilience latex core with a channel-quilted down-alternative wrap for tailored ergonomic support.',
    x: 58,
    y: 65,
  },
];

export default function DetailsSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const chairStageRef = useRef(null);
  const chairImgRef = useRef(null);
  const hotspotRefs = useRef([]);
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions;

        // Pin section for scrubbed camera zoom-in inspection on desktop; smooth natural scroll on mobile
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: isDesktop ? '+=200%' : '+=40%',
            scrub: 1.2,
            pin: isDesktop,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Camera starts with full chair. On mobile, keep scale 1.0 so chair does not zoom in excessively
        tl.fromTo(
          chairImgRef.current,
          { scale: isMobile ? 1.0 : 0.95, y: isMobile ? 0 : 30, rotationX: isMobile ? 0 : 2, transformOrigin: '48% 55%' },
          { scale: isMobile ? 1.0 : 1.28, y: isMobile ? -10 : -20, rotationX: 0, ease: 'none', duration: 2 }
        );

        // Title moves subtly
        tl.to(titleRef.current, { y: -60, opacity: 0.8, ease: 'none', duration: 2 }, 0);

        // 2. Sequential reveal of the 4 hotspots as camera zooms
        hotspotRefs.current.forEach((el, index) => {
          if (!el) return;
          tl.fromTo(
            el,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
            0.3 + index * 0.35
          );
        });
      },
      sectionRef
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="furniture"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#141311',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '1200px',
        isolation: 'isolate',
      }}
    >
      {/* Soft warm ambient background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(35, 32, 28, 0.9) 0%, rgba(14, 13, 11, 0.98) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Editorial Title */}
      <div
        ref={titleRef}
        className="details-header-title"
        style={{
          position: 'absolute',
          top: '10vh',
          left: '6vw',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-gold)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          FURNITURE CRAFT • 02
        </span>
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(30px, 6vw, 76px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            color: '#ffffff',
            lineHeight: 1.05,
            margin: 0,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
          }}
        >
          DETAILS MATTER.
        </h2>
        <p
          style={{
            fontSize: 'clamp(11px, 1.4vw, 13px)',
            fontFamily: 'var(--font-sans)',
            color: '#ffffff',
            fontWeight: 500,
            letterSpacing: '0.05em',
            marginTop: '8px',
            textShadow: '0 1px 6px rgba(0, 0, 0, 0.8)',
          }}
        >
          Click points to inspect bespoke material joinery
        </p>
      </div>

      {/* Chair Display Stage (~60% of viewport) */}
      <div
        ref={chairStageRef}
        style={{
          position: 'relative',
          width: 'min(90vw, 1000px)',
          height: 'min(64vh, 660px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {/* Chair Image with subtle 3D depth */}
        <div
          ref={chairImgRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/assets/chair_closeup.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '4px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            willChange: 'transform',
          }}
        >
          {/* Subtle warm architectural sheen */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, transparent 60%, rgba(0, 0, 0, 0.4) 100%)',
              pointerEvents: 'none',
              borderRadius: '4px',
            }}
          />

          {/* 4 Sequential Pulsing Hotspots */}
          {HOTSPOTS_DATA.map((spot, index) => (
            <div
              key={spot.id}
              ref={(el) => (hotspotRefs.current[index] = el)}
              style={{
                position: 'absolute',
                top: `${spot.y}%`,
                left: `${spot.x}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 30,
              }}
            >
              {/* Pulse Marker */}
              <button
                onClick={() => setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)}
                aria-label={`Inspect ${spot.title}`}
                className="hotspot-pulse"
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: activeHotspot?.id === spot.id ? 'var(--color-accent-gold)' : '#ffffff',
                }}
              />

              {/* Minimal floating tag */}
              <div
                style={{
                  position: 'absolute',
                  top: '-24px',
                  left: '18px',
                  whiteSpace: 'nowrap',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.95)',
                  pointerEvents: 'none',
                }}
              >
                {spot.tag} {spot.label}
              </div>

              {/* Floating Specification Card next to Hotspot */}
              {activeHotspot?.id === spot.id && (
                <div
                  className="details-spec-card"
                  style={{
                    position: 'absolute',
                    top: spot.y > 60 ? 'auto' : '26px',
                    bottom: spot.y > 60 ? '26px' : 'auto',
                    left: spot.x > 60 ? 'auto' : '26px',
                    right: spot.x > 60 ? '26px' : 'auto',
                    width: 'min(260px, calc(100vw - 40px))',
                    maxWidth: 'calc(100vw - 40px)',
                    backgroundColor: 'rgba(248, 246, 240, 0.96)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    color: '#121110',
                    padding: '20px',
                    borderRadius: '2px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(20, 20, 20, 0.08)',
                    zIndex: 50,
                    animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', color: 'var(--color-accent-bronze)' }}>
                      {spot.tag} SPECIFICATION
                    </span>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#121110' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 500, letterSpacing: '0.04em', margin: '0 0 8px 0' }}>
                    {spot.title}
                  </h4>
                  <p style={{ fontSize: '11px', lineHeight: 1.6, color: '#1a1917', fontWeight: 400, margin: 0, fontFamily: 'var(--font-sans)' }}>
                    {spot.desc}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
