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
        fontWeight: 600,
        fontSize: isSmall ? '18px' : '24px',
        color: '#F0F2F5',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        vibin
      </span>
      <span style={{
        width: isSmall ? '5px' : '7px',
        height: isSmall ? '5px' : '7px',
        borderRadius: '50%',
        background: '#C8F04A',
        display: 'inline-block',
        flexShrink: 0,
        marginBottom: isSmall ? '8px' : '12px',
      }} />
    </div>
  );
}
