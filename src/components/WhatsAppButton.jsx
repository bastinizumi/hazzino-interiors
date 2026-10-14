import React, { useState } from 'react';

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const phoneNumber = '918807503355';
  const defaultMessage = encodeURIComponent(
    'Hello Hazzino Interiors, I would like to inquire about your architectural interior design services.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="Direct WhatsApp Concierge"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* Tooltip Pill */}
      <span
        style={{
          backgroundColor: '#121110',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          padding: '7px 14px',
          borderRadius: '30px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(8px)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        Chat on WhatsApp
      </span>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Hazzino Interiors on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 26px rgba(37, 211, 102, 0.4), 0 4px 10px rgba(0, 0, 0, 0.15)',
          color: '#ffffff',
          textDecoration: 'none',
          transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          cursor: 'pointer',
        }}
      >
        {/* WhatsApp Official SVG Icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.64 20.16 9.27 19.8 8.08 19.09L7.79 18.92L4.69 19.74L5.52 16.72L5.33 16.42C4.55 15.17 4.13 13.56 4.13 11.91C4.13 7.37 7.83 3.67 12.04 3.67ZM8.84 7.34C8.63 7.34 8.28 7.42 7.98 7.74C7.68 8.07 6.84 8.85 6.84 10.45C6.84 12.05 8.01 13.6 8.17 13.81C8.33 14.03 10.28 17.03 13.27 18.32C15.75 19.39 16.26 19.17 16.8 19.12C17.34 19.07 18.54 18.41 18.79 17.71C19.04 17.01 19.04 16.41 18.96 16.28C18.89 16.16 18.71 16.08 18.44 15.95C18.17 15.82 16.84 15.16 16.59 15.07C16.34 14.98 16.16 14.94 15.98 15.21C15.8 15.48 15.28 16.08 15.12 16.27C14.96 16.45 14.8 16.48 14.53 16.34C14.26 16.21 13.39 15.92 12.35 15C11.54 14.28 11 13.4 10.84 13.13C10.68 12.86 10.82 12.71 10.96 12.58C11.08 12.46 11.23 12.26 11.37 12.1C11.5 11.93 11.55 11.81 11.64 11.63C11.73 11.45 11.68 11.3 11.62 11.17C11.55 11.04 11.01 9.71 10.79 9.17C10.57 8.64 10.35 8.71 10.18 8.71C10.02 8.71 9.83 8.7 9.64 8.7C9.45 8.7 9.15 8.77 8.84 7.34Z" />
        </svg>
      </a>
    </aside>
  );
}
