import React from 'react';

export default function Chip({ label, selected, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: selected ? 'rgba(200, 240, 74, 0.16)' : 'rgba(255,255,255,0.06)',
        border: `0.5px solid ${selected ? 'rgba(200, 240, 74, 0.68)' : 'rgba(255,255,255,0.16)'}`,
        borderRadius: '20px',
        padding: '7px 16px',
        fontSize: '13px',
        fontFamily: "'Syne', sans-serif",
        fontWeight: selected ? 500 : 400,
        color: selected ? '#D8FF5A' : 'rgba(240,242,245,0.72)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        outline: 'none',
        letterSpacing: '0.01em',
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={e => {
        if (!selected && !disabled) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
          e.currentTarget.style.color = 'rgba(240,242,245,0.9)';
        }
      }}
      onMouseLeave={e => {
        if (!selected && !disabled) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
          e.currentTarget.style.color = 'rgba(240,242,245,0.72)';
        }
      }}
    >
      {label}
    </button>
  );
}
