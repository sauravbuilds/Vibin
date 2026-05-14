import React from 'react';

export default function Logo({ size = 'default' }) {
  const isSmall = size === 'small';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '3px',
    }}>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: isSmall ? 650 : 750,
        fontSize: isSmall ? '20px' : '28px',
        color: '#F0F2F5',
        letterSpacing: isSmall ? '0.01em' : '0.03em',
        lineHeight: 1,
      }}>
        vibin
      </span>
      <span style={{
        width: isSmall ? '6px' : '8px',
        height: isSmall ? '6px' : '8px',
        borderRadius: '50%',
        background: '#C8F04A',
        display: 'inline-block',
        flexShrink: 0,
        marginBottom: isSmall ? '9px' : '14px',
        boxShadow: '0 0 14px rgba(200,240,74,0.55)',
      }} />
    </div>
  );
}
