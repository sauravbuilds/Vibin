import React from 'react';
import PlanCard from './PlanCard';

export default function PlanResult({ plan, prefs, onReset }) {
  const { slots, total, tradeoff, overBudget } = plan;

  const foodTotal = plan.foodTotal ?? slots.filter(s => s.type === 'food').reduce((a, s) => a + s.item.cph, 0);
  const actTotal = plan.actTotal ?? slots.filter(s => s.type !== 'food').reduce((a, s) => a + s.item.cost, 0);
  const transportCost = plan.transportCost ?? plan.transport?.cost ?? 0;

  const moodLabels = {
    'tired but wants fun': 'Tired, but up for something',
    'adventurous': 'Adventurous',
    'chill and relaxed': 'Chill',
    'romantic': 'Romantic',
    'social': 'Social',
    'introspective': 'Introspective',
    'creative': 'Creative',
  };

  return (
    <div style={{
      marginTop: '60px',
      animation: 'planin 0.6s ease forwards',
    }}>
      <style>{`
        @keyframes planin {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        paddingBottom: '28px',
        marginBottom: '44px',
      }}>
        <div style={{
          fontSize: '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(200,240,74,0.72)',
          marginBottom: '10px',
          fontWeight: 400,
        }}>
          Your plan
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 300,
          color: '#F0F2F5',
          lineHeight: 1.15,
        }}>
          Your <em style={{ fontStyle: 'italic', color: '#C8F04A' }}>perfect</em> weekend in {prefs.cityDisplay}
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '18px' }}>
          {[
            { label: `${prefs.hours} hours` },
            { label: `Rs.${prefs.budget.toLocaleString('en-IN')}` },
            { label: moodLabels[prefs.mood] || prefs.mood },
            ...(prefs.interests.slice(0, 3).map(i => ({ label: i }))),
          ].map((pill, i) => (
            <div key={i} style={{
              fontSize: '11px',
              padding: '5px 13px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.07)',
              border: '0.5px solid rgba(255,255,255,0.16)',
              color: 'rgba(240,242,245,0.76)',
              letterSpacing: '0.03em',
            }}>
              {pill.label}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '16px',
          top: '10px',
          bottom: '10px',
          width: '0.5px',
          background: 'linear-gradient(to bottom, rgba(200,240,74,0.4), rgba(200,240,74,0.05))',
        }} />

        {slots.map((slot, i) => (
          <PlanCard key={`${slot.item.id}-${i}`} slot={slot} index={i} />
        ))}
      </div>

      {/* Cost summary */}
      <div style={{
        marginTop: '36px',
        background: 'rgba(255,255,255,0.055)',
        border: `0.5px solid ${overBudget ? 'rgba(240,192,96,0.38)' : 'rgba(255,255,255,0.14)'}`,
        borderRadius: '12px',
        padding: '26px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div>
          <div style={{
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(240,242,245,0.5)',
            marginBottom: '5px',
            fontWeight: 400,
          }}>
            Total estimated
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '44px',
            fontWeight: 300,
            color: overBudget ? '#F0C060' : '#C8F04A',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            Rs.{total.toLocaleString('en-IN')}
          </div>
          <div style={{
            fontSize: '12px',
            marginTop: '6px',
            color: overBudget ? '#F0C060' : '#96DCA0',
          }}>
            {overBudget ? 'Slightly over your budget' : 'Within your budget'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
          {[
            { label: 'Food & drink', value: `Rs.${foodTotal.toLocaleString('en-IN')}` },
            { label: 'Activities', value: `Rs.${actTotal.toLocaleString('en-IN')}` },
            { label: 'Transport (est.)', value: `Rs.${transportCost.toLocaleString('en-IN')}` },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: '10px', color: 'rgba(240,242,245,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '16px', color: 'rgba(240,242,245,0.88)', fontWeight: 400, marginTop: '3px' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade-off bar */}
      {tradeoff && (
        <div style={{
          marginTop: '14px',
          fontSize: '12.5px',
          color: 'rgba(240,192,96,0.6)',
          fontStyle: 'italic',
          textAlign: 'center',
          padding: '14px 18px',
          border: '0.5px dashed rgba(240,192,96,0.2)',
          borderRadius: '8px',
          lineHeight: 1.65,
          background: 'rgba(240,192,96,0.03)',
          fontFamily: "'Cormorant Garamond', serif",
        }}>
          {tradeoff}
        </div>
      )}

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        style={{
          display: 'block',
          margin: '50px auto 0',
          background: 'transparent',
          border: '0.5px solid rgba(255,255,255,0.09)',
          color: 'rgba(240,242,245,0.35)',
          fontFamily: "'Syne', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          padding: '11px 26px',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
          e.currentTarget.style.color = '#F0F2F5';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
          e.currentTarget.style.color = 'rgba(240,242,245,0.35)';
        }}
      >
        Plan a new weekend
      </button>
    </div>
  );
}
