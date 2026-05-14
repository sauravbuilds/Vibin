import React from 'react';

const BADGE_STYLES = {
  food: { bg: 'rgba(240,140,80,0.15)', color: '#F0A870' },
  walk: { bg: 'rgba(80,180,220,0.12)', color: '#80C8E8' },
  music: { bg: 'rgba(180,120,240,0.12)', color: '#C0A0F0' },
  coffee: { bg: 'rgba(200,150,80,0.15)', color: '#D4A870' },
  art: { bg: 'rgba(200,240,74,0.1)', color: '#C8F04A' },
  books: { bg: 'rgba(100,200,160,0.12)', color: '#80D4B0' },
  markets: { bg: 'rgba(240,180,80,0.12)', color: '#F0C870' },
};

const BADGE_LABELS = {
  food: 'Food & Drink',
  walk: 'Walk',
  music: 'Music',
  coffee: 'Coffee',
  art: 'Art',
  books: 'Books',
  markets: 'Markets',
};

function Badge({ type }) {
  const style = BADGE_STYLES[type] || BADGE_STYLES.art;
  const label = BADGE_LABELS[type] || 'Activity';

  return (
    <span style={{
      fontSize: '10px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding: '4px 11px',
      borderRadius: '12px',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      fontWeight: 400,
      background: style.bg,
      color: style.color,
    }}>
      {label}
    </span>
  );
}

export default function PlanCard({ slot, index }) {
  const { item, time, type } = slot;
  const isFood = type === 'food';
  const costLabel = isFood
    ? `Rs.${item.cph}/head`
    : item.cost === 0
    ? 'Free'
    : `Rs.${item.cost} entry`;

  const badgeType = isFood ? 'food' : item.type;

  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      marginBottom: '24px',
      position: 'relative',
      animation: `slidein 0.5s ease ${index * 120}ms both`,
    }}>
      <style>{`
        @keyframes slidein {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Timeline left */}
      <div style={{
        flexShrink: 0,
        width: '34px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '2px',
      }}>
        <div style={{
          width: '9px',
          height: '9px',
          borderRadius: '50%',
          background: '#C8F04A',
          border: '2px solid #0A0C10',
          boxShadow: '0 0 0 1.5px rgba(200,240,74,0.4)',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: '10px',
          color: 'rgba(200,240,74,0.55)',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          marginTop: '8px',
          letterSpacing: '0.06em',
          fontWeight: 400,
          fontFamily: "'DM Mono', monospace",
        }}>
          {time}
        </span>
      </div>

      {/* Card */}
      <div style={{
        flex: 1,
        background: 'rgba(255,255,255,0.03)',
        border: '0.5px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '20px 24px',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,240,74,0.2)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px',
            fontWeight: 300,
            color: '#F0F2F5',
            lineHeight: 1.2,
          }}>
            {item.name}
          </div>
          <Badge type={badgeType} />
        </div>

        {/* Description */}
        <p style={{
          fontSize: '13.5px',
          color: 'rgba(240,242,245,0.5)',
          lineHeight: 1.75,
          marginBottom: '12px',
          fontWeight: 300,
        }}>
          {item.desc}
        </p>

        {/* Why */}
        <p style={{
          fontSize: '12.5px',
          color: 'rgba(200,240,74,0.6)',
          fontStyle: 'italic',
          fontFamily: "'Cormorant Garamond', serif",
          borderLeft: '1.5px solid rgba(200,240,74,0.2)',
          paddingLeft: '12px',
          marginBottom: item.tradeoff ? '10px' : '14px',
          lineHeight: 1.65,
        }}>
          {item.why}
        </p>

        {/* Trade-off note */}
        {item.tradeoff && (
          <div style={{
            marginBottom: '14px',
            fontSize: '11.5px',
            color: 'rgba(240,192,96,0.6)',
            fontStyle: 'italic',
            borderLeft: '1.5px solid rgba(240,192,96,0.2)',
            paddingLeft: '10px',
            lineHeight: 1.6,
          }}>
            Trade-off: {item.tradeoff}
          </div>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11.5px', color: 'rgba(240,242,245,0.35)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: 'rgba(240,242,245,0.65)', fontWeight: 400 }}>{costLabel}</span>
          </span>
          {item.dur && (
            <span style={{ fontSize: '11.5px', color: 'rgba(240,242,245,0.35)' }}>
              <span style={{ color: 'rgba(240,242,245,0.65)' }}>{item.dur}</span>
            </span>
          )}
          {item.crowd && (
            <span style={{ fontSize: '11.5px', color: 'rgba(240,242,245,0.35)' }}>
              <span style={{ color: 'rgba(240,242,245,0.65)' }}>{item.crowd} crowd</span>
            </span>
          )}
          {item.cuisine && (
            <span style={{ fontSize: '11.5px', color: 'rgba(240,242,245,0.35)' }}>
              <span style={{ color: 'rgba(240,242,245,0.65)' }}>{item.cuisine}</span>
            </span>
          )}
          {isFood && !item.veg && (
            <span style={{ fontSize: '11px', color: '#F0A095', background: 'rgba(230,90,80,0.1)', padding: '2px 8px', borderRadius: '10px' }}>
              Non-veg
            </span>
          )}
          {isFood && item.veg && (
            <span style={{ fontSize: '11px', color: '#96DCA0', background: 'rgba(120,210,100,0.1)', padding: '2px 8px', borderRadius: '10px' }}>
              Veg
            </span>
          )}
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '11.5px', color: 'rgba(200,240,74,0.65)', textDecoration: 'none' }}
            >
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
