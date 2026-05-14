import React, { useEffect, useRef } from 'react';

function TraceStatus({ status }) {
  const styles = {
    ok: { background: '#96DCA0' },
    err: { background: '#F0A095' },
    warn: { background: '#F0C060' },
    running: { background: '#C8F04A', animation: 'blink 1.1s infinite' },
  };

  return (
    <span style={{
      display: 'inline-block',
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      flexShrink: 0,
      marginTop: '5px',
      ...styles[status],
    }} />
  );
}

export default function AgentTrace({ lines }) {
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [lines]);

  if (lines.length === 0) return null;

  return (
    <div style={{ marginTop: '36px' }}>
      <p style={{
        fontSize: '10px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(200,240,74,0.5)',
        marginBottom: '12px',
        fontWeight: 400,
      }}>
        Agent trace
      </p>

      <div
        ref={boxRef}
        style={{
          background: 'rgba(0,0,0,0.4)',
          border: '0.5px solid rgba(255,255,255,0.07)',
          borderRadius: '10px',
          padding: '18px 22px',
          fontFamily: "'DM Mono', monospace",
          fontSize: '11.5px',
          maxHeight: '260px',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}
      >
        <style>{`
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
          @keyframes tracein { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        `}</style>

        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '4px 0',
              animation: 'tracein 0.3s ease forwards',
              lineHeight: 1.65,
            }}
          >
            <TraceStatus status={line.status} />
            <span>
              <span style={{ color: '#C8F04A', fontWeight: 500 }}>[{line.label}]</span>
              {' '}
              <span style={{ color: 'rgba(240,242,245,0.42)' }}>{line.msg}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
