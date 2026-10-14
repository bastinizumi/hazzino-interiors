import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ROOMS = [
  {
    id: 'living',
    num: '01',
    category: 'HOME INTERIORS',
    name: 'LIVING ROOM',
    subtitle: 'Curved Bouclé Lounge & Architectural Oak Fluting',
    image: '/assets/hero_showroom.jpg',
  },
  {
    id: 'kitchen',
    num: '02',
    category: 'HOME INTERIORS',
    name: 'KITCHEN',
    subtitle: 'Forest Green Matte Lacquer & Waterfall Smoked Oak Island',
    image: '/assets/kitchen_showroom.jpg',
  },
  {
    id: 'bedroom',
    num: '03',
    category: 'HOME INTERIORS',
    name: 'BEDROOM',
    subtitle: 'Low Platform Storage Suite with Slatted Crate Drawers & Grid-Tufted Headboard',
    image: '/assets/room_bedroom.jpg',
  },
  {
    id: 'dining',
    num: '04',
    category: 'HOME INTERIORS',
    name: 'DINING',
    subtitle: 'Round Honed Marble Dining Table with Trilateral Timber Pedestal & Tailored Linen Chairs',
    image: '/assets/room_dining.jpg',
  },
  {
    id: 'bathroom',
    num: '05',
    category: 'HOME INTERIORS',
    name: 'BATHROOM',
    subtitle: 'Honed Limestone Sanctuary & Freestanding Oval Bath',
    image: '/assets/room_bathroom.jpg',
  },
];

export default function HomeInteriorsSection() {
  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions;
        const slides = slideRefs.current;
        const numTransitions = ROOMS.length - 1;

        // Master pinned timeline for continuous walk-through of the home
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: isDesktop ? `+=${numTransitions * 150}%` : `+=${numTransitions * 50}%`,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.min(
                Math.floor(self.progress * ROOMS.length),
                ROOMS.length - 1
              );
              setActiveRoomIndex(index);
            },
          },
        });

        // Chain sequential transitions between rooms
        for (let i = 0; i < numTransitions; i++) {
          const currentSlide = slides[i];
          const nextSlide = slides[i + 1];
          if (!currentSlide || !nextSlide) continue;

          const subTl = gsap.timeline();

          // 1. Current slide's text dissolves quickly
          subTl.to(
            currentSlide.querySelector('.room-info-content'),
            {
              opacity: 0,
              y: isMobile ? -16 : -30,
              duration: 0.35,
              ease: 'power2.in',
            },
            0
          );

          // 2. Current slide translates left
          subTl
            .to(
              currentSlide.querySelector('.room-bg'),
              {
                scale: isMobile ? 1.0 : 1.12,
                ease: 'power1.inOut',
                duration: 1.2,
              },
              0
            )
            .to(
              currentSlide,
              {
                x: isMobile ? '-100%' : '-35%',
                opacity: isMobile ? 0 : 0.3,
                ease: 'power2.inOut',
                duration: 1.2,
              },
              0
            )
            // 3. Next slide enters from right
            .fromTo(
              nextSlide,
              {
                x: '100%',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                zIndex: i + 2,
              },
              {
                x: '0%',
                ease: 'power2.inOut',
                duration: 1.2,
              },
              0
            )
            .fromTo(
              nextSlide.querySelector('.room-bg'),
              {
                scale: 1.0,
              },
              {
                scale: 1.0,
                ease: 'power1.out',
                duration: 1.2,
              },
              0.1
            )
            // 4. Next slide's text fades in gracefully
            .fromTo(
              nextSlide.querySelector('.room-info-content'),
              {
                y: isMobile ? 24 : 40,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                ease: 'power3.out',
                duration: 0.7,
              },
              0.45
            );

          tl.add(subTl);
        }
      },
      containerRef
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="interiors"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#0c0f0d',
        isolation: 'isolate',
      }}
    >
      {/* Slides Container */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {ROOMS.map((room, index) => (
          <div
            key={room.id}
            ref={(el) => (slideRefs.current[index] = el)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: index === 0 ? 1 : index + 1,
              transform: index === 0 ? 'translateX(0%)' : 'translateX(100%)',
              overflow: 'hidden',
              backgroundColor: '#0a0a09',
              willChange: 'transform, clip-path',
            }}
          >
            {/* Background Fullscreen Image */}
            <div
              className="room-bg"
              style={{
                position: 'absolute',
                inset: '-4%',
                width: '108%',
                height: '108%',
                backgroundImage: `url(${room.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                willChange: 'transform',
              }}
            />

            {/* Cinematic Gradient Vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at center, rgba(10, 10, 9, 0.2) 0%, rgba(10, 10, 9, 0.7) 85%, rgba(10, 10, 9, 0.95) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Top-Left Counter & Category */}
            <div
              style={{
                position: 'absolute',
                top: 'clamp(70px, 11vh, 100px)',
                left: 'clamp(20px, 6vw, 60px)',
                zIndex: 20,
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.4em',
                  color: 'var(--color-accent-gold)',
                  marginBottom: '4px',
                }}
              >
                {room.num}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  fontWeight: 600,
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                }}
              >
                {room.category}
              </div>
            </div>

            {/* Center Room Title & Information */}
            <div
              className="room-info"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                zIndex: 20,
                width: 'min(92vw, 900px)',
                maxWidth: '900px',
                pointerEvents: 'none',
              }}
            >
              <div className="room-info-content">
                <h3
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(32px, 8.5vw, 120px)',
                    fontWeight: 400,
                    letterSpacing: '0.08em',
                    color: '#ffffff',
                    margin: '0 0 14px 0',
                    lineHeight: 0.95,
                    textShadow: '0 4px 30px rgba(0, 0, 0, 0.7)',
                    wordBreak: 'break-word',
                  }}
                >
                  {room.name}
                </h3>
                <p
                  style={{
                    fontSize: 'clamp(11px, 1.4vw, 17px)',
                    letterSpacing: '0.08em',
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                    maxWidth: '520px',
                    margin: '0 auto',
                    padding: '0 16px',
                    fontFamily: 'var(--font-editorial)',
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                  }}
                >
                  {room.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Dots on the Right */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(12px, 2.5vw, 40px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {ROOMS.map((r, i) => (
          <div
            key={r.id}
            style={{
              width: activeRoomIndex === i ? '28px' : '6px',
              height: '2px',
              backgroundColor: activeRoomIndex === i ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.25)',
              transition: 'all 0.4s var(--ease-expo)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
