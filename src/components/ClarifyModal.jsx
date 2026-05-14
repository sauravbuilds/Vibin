import React, { useState } from 'react';

export default function ClarifyModal({ questions, onSubmit, onSkip }) {
  const [answers, setAnswers] = useState({});

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '0.5px solid rgba(200,240,74,0.2)',
      borderRadius: '14px',
      padding: '28px 30px',
      marginTop: '24px',
      animation: 'fadeup 0.4s ease forwards',
    }}>
      <style>{`
        @keyframes fadeup {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '22px',
        fontWeight: 300,
        color: '#F0F2F5',
        marginBottom: '5px',
        lineHeight: 1.3,
      }}>
        One quick thing — <em>before we plan</em>
      </div>
      <div style={{
        fontSize: '13px',
        color: 'rgba(240,242,245,0.45)',
        marginBottom: '24px',
        lineHeight: 1.65,
      }}>
        Your input was a little open-ended. Help us get it right:
      </div>

      {questions.map((q, i) => (
        <div key={q.id} style={{ marginBottom: i < questions.length - 1 ? '20px' : '0' }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '16px',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(240,242,245,0.72)',
            marginBottom: '9px',
            lineHeight: 1.5,
            borderLeft: '1.5px solid rgba(200,240,74,0.2)',
            paddingLeft: '12px',
          }}>
            {q.text}
          </div>
          <input
            type="text"
            value={answers[q.id] || ''}
            onChange={e => handleChange(q.id, e.target.value)}
            placeholder={q.placeholder}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.035)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: '#F0F2F5',
              fontFamily: "'Syne', sans-serif",
              fontSize: '14px',
              fontWeight: 300,
              padding: '12px 16px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(200,240,74,0.35)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        </div>
      ))}

      <div style={{ display: 'flex', gap: '12px', marginTop: '22px' }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 1,
            padding: '14px 24px',
            background: 'transparent',
            border: '0.5px solid rgba(200,240,74,0.45)',
            borderRadius: '8px',
            color: 'rgba(200,240,74,0.85)',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '18px',
            fontStyle: 'italic',
            fontWeight: 300,
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(200,240,74,0.07)';
            e.currentTarget.style.borderColor = 'rgba(200,240,74,0.7)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(200,240,74,0.45)';
          }}
        >
          Continue with my plan
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            padding: '14px 20px',
            background: 'transparent',
            border: '0.5px solid rgba(255,255,255,0.07)',
            borderRadius: '8px',
            color: 'rgba(240,242,245,0.3)',
            fontFamily: "'Syne', sans-serif",
            fontSize: '13px',
            fontWeight: 300,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(240,242,245,0.6)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,242,245,0.3)'}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
