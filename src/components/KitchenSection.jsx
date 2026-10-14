/**
 * HAZZINO INTERIORS — THE CULINARY ATELIER
 * Section 04 — Full-viewport live 3D interactive kitchen showroom.
 * Scroll-pinned, with Three.js canvas filling the entire section.
 */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import KitchenViewer from './kitchen/KitchenViewer';

gsap.registerPlugin(ScrollTrigger);

export default function KitchenSection() {
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
      },
      (context) => {
        const { isDesktop } = context.conditions;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: isDesktop ? '+=150%' : '+=30%',
          scrub: false,
          pin: isDesktop,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        // Gentle vignette fade as user enters section
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0.4 },
          {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=15%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      },
      sectionRef
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="kitchen"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#0c0f0d',
        isolation: 'isolate',
      }}
    >
      {/* Full-viewport 3D Kitchen Viewer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
        <KitchenViewer />
      </div>

      {/* Cinematic entry vignette — subtle ambient framing */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(12,15,13,0.35) 100%)',
          zIndex: 15,
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
