import React, { useState, useCallback } from 'react';
import Logo from './components/Logo';
import Chip from './components/Chip';
import AgentTrace from './components/AgentTrace';
import ClarifyModal from './components/ClarifyModal';
import PlanResult from './components/PlanResult';

import {
  MOOD_OPTIONS,
  INTEREST_OPTIONS,
  CONSTRAINT_OPTIONS,
} from './data';

import {
  parsePreferences,
  getActivityOptions,
  getFoodOptions,
  buildPlan,
  validatePlan,
  needsClarification,
} from './planner';

// Server-side planning keeps API keys private and enables real web search.
async function getWebPlan(prefs, freetext) {
  const payload = JSON.stringify({ prefs, freetext });
  const endpoints = ['/api/plan', 'http://localhost:8787/api/plan'];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `Planner API ${response.status}`);
      }
      if (!data.plan?.slots?.length) {
        throw new Error('Planner returned no stops');
      }
      return data.plan;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Planner API unavailable');
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

function Field({ label, error, children, note }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <label style={{
        fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase',
        color: error ? '#F0A095' : 'rgba(200,240,74,0.78)',
        fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        {label}
        {note && <span style={{ color: 'rgba(240,242,245,0.48)', textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>{note}</span>}
      </label>
      {children}
      {error && (
        <div style={{ fontSize: '12px', color: '#F0A095', background: 'rgba(230,90,80,0.1)', padding: '8px 12px', borderRadius: '6px', lineHeight: 1.5 }}>
          {error}
        </div>
      )}
    </div>
  );
}

function SelectInput({ value, onChange, options, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        background: 'rgba(255,255,255,0.065)',
        border: `0.5px solid ${focused ? 'rgba(200,240,74,0.62)' : 'rgba(255,255,255,0.16)'}`,
        borderRadius: '8px', color: '#F0F2F5', fontFamily: "'Syne', sans-serif",
        fontSize: '14px', fontWeight: 300, padding: '13px 16px', outline: 'none',
        width: '100%', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'border-color 0.22s', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23C8F04A' opacity='0.5' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {options.map(o => <option key={o.value} value={o.value} style={{ background: '#0D1018' }}>{o.label}</option>)}
    </select>
  );
}

function makeTrace(status, label, msg) { return { status, label, msg }; }

// ─── constants ────────────────────────────────────────────────────────────────

const STEPS = { FORM: 'form', CLARIFY: 'clarify', RUNNING: 'running', RESULT: 'result', FALLBACK: 'fallback' };
const FIXED_CITY = 'Bangalore';
const NOTE_SUGGESTIONS = [
  'near Koramangala, outdoors, not too crowded',
  'BTM start, easy travel, good food stop',
  'HSR layout, walking + coffee, no touristy spots',
  'Indiranagar side, something spontaneous',
];
const SURPRISE_PRESETS = [
  { mood: 'adventurous', interests: ['walks', 'nature', 'food'], constraints: ['outdoors'] },
  { mood: 'creative', interests: ['art', 'coffee', 'books'], constraints: ['avoid crowds'] },
  { mood: 'chill and relaxed', interests: ['coffee', 'walks', 'food'], constraints: ['avoid crowds'] },
  { mood: 'social', interests: ['music', 'markets', 'food'], constraints: [] },
];

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [budget, setBudget] = useState(2000);
  const [hours, setHours] = useState('4');
  const [mood, setMood] = useState('tired but wants fun');
  const [interests, setInterests] = useState(['food', 'music', 'walks']);
  const [constraints, setConstraints] = useState(['vegetarian', 'avoid crowds']);
  const [freetext, setFreetext] = useState('');

  const [step, setStep] = useState(STEPS.FORM);
  const [errors, setErrors] = useState({});
  const [traceLines, setTraceLines] = useState([]);
  const [plan, setPlan] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [fallback, setFallback] = useState(null);
  const [clarifyQuestions, setClarifyQuestions] = useState([]);
  const notePlaceholder = NOTE_SUGGESTIONS[(interests.length + constraints.length + Number(hours)) % NOTE_SUGGESTIONS.length];

  const toggleInterest = useCallback((val) => {
    setInterests(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    if (errors.interests) setErrors(e => ({ ...e, interests: null }));
  }, [errors.interests]);

  const toggleConstraint = useCallback((val) => {
    setConstraints(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }, []);

  const selectMood = useCallback((val) => {
    setMood(val);
    if (errors.mood) setErrors(e => ({ ...e, mood: null }));
  }, [errors.mood]);

  function validate() {
    const errs = {};
    if (!mood) errs.mood = 'Pick a mood so we can personalise your plan.';
    if (interests.length === 0) errs.interests = 'Pick at least one interest.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function addTrace(status, label, msg) {
    setTraceLines(prev => [...prev, makeTrace(status, label, msg)]);
  }

  function buildFallbackPlan(parsedPrefs) {
    addTrace('running', 'fallbackCatalogue', 'Web search unavailable - scanning local Bangalore fallback data');
    const mockActs = getActivityOptions(parsedPrefs);
    const { food: mockFood, loosened } = getFoodOptions(parsedPrefs);

    addTrace(
      mockActs.length > 0 ? 'ok' : 'err',
      'fallbackActivities',
      mockActs.length > 0 ? `${mockActs.length} fallback activities matched` : 'No fallback activities matched'
    );
    addTrace(
      loosened ? 'warn' : (mockFood.length > 0 ? 'ok' : 'err'),
      'fallbackFood',
      mockFood.length > 0
        ? loosened ? 'No strict food match - vegetarian filter relaxed in fallback' : `${mockFood.length} fallback restaurants matched`
        : 'No fallback restaurants matched'
    );

    if (mockActs.length === 0) {
      throw new Error('No fallback activities match your constraints');
    }

    return buildPlan(mockActs, mockFood, parsedPrefs);
  }

  async function runPlan(freetextOverride = freetext) {
    setStep(STEPS.RUNNING);
    setTraceLines([]);
    setPlan(null);
    setFallback(null);

    const finalNotes = freetextOverride.trim();
    const parsedPrefs = parsePreferences({ city: FIXED_CITY, budget, hours, mood, interests, constraints });
    setPrefs(parsedPrefs);

    const freetextSnippet = finalNotes
      ? `, notes="${finalNotes.slice(0, 55)}${finalNotes.length > 55 ? '...' : ''}"`
      : '';

    addTrace('running', 'parseUserPreferences',
      `city=Bangalore, budget=Rs.${parseInt(budget).toLocaleString('en-IN')}, time=${hours}hrs, mood="${mood}", interests=[${interests.join(', ')}], constraints=[${constraints.join(', ')}]${freetextSnippet}`);
    addTrace('ok', 'parseUserPreferences',
      finalNotes
        ? 'All form fields and notes combined into one planning prompt'
        : 'Form fields combined into one planning prompt');

    addTrace('running', 'aiPlanner', 'Asking the AI planner to create a Bangalore plan from the full prompt');

    let result;
    let usedFallback = false;

    try {
      result = await getWebPlan(parsedPrefs, finalNotes);
      addTrace('ok', 'aiPlanner', 'AI planner returned recommendations');
    } catch (err) {
      usedFallback = true;
      console.error('[Vibin] Web planner failed, using fallback data:', err);
      addTrace('warn', 'aiPlanner', `AI planner failed: ${err.message}. Using fallback data only now.`);
      try {
        result = buildFallbackPlan(parsedPrefs);
      } catch (fallbackErr) {
        addTrace('err', 'buildPlan', fallbackErr.message);
        setFallback({
          title: 'Could not build a plan from web search or fallback data.',
          body: 'Try loosening constraints or adding a clearer Bangalore area like HSR Layout, Koramangala, Indiranagar, or Church Street.',
        });
        setStep(STEPS.FALLBACK);
        return;
      }
    }

    addTrace('running', 'estimateCost', 'Calculating spend across activities and food');
    addTrace(
      result.overBudget ? 'warn' : 'ok',
      'estimateCost',
      `Total Rs.${result.total.toLocaleString('en-IN')} - budget Rs.${parseInt(budget).toLocaleString('en-IN')} ${result.overBudget ? '(over budget)' : '(within budget)'}`
    );

    addTrace('running', 'validatePlan', 'Checking dietary, crowd, and timing constraints');
    const violations = validatePlan(result.slots, parsedPrefs);
    if (violations.length > 0) {
      addTrace('warn', 'validatePlan', `Notes: ${violations.join(', ')}`);
    } else {
      addTrace('ok', 'validatePlan', 'All hard constraints satisfied');
    }

    addTrace('ok', 'buildPlan', usedFallback ? 'Fallback weekend plan is ready' : 'Live web-search weekend plan is ready');
    setPlan(result);
    setStep(STEPS.RESULT);
  }

  function handleSubmit() {
    if (!validate()) return;
    setFallback(null);
    setStep(STEPS.FORM);
    const parsedPrefs = parsePreferences({ city: FIXED_CITY, budget, hours, mood, interests, constraints });
    const questions = needsClarification(parsedPrefs);
    if (questions.length > 0) { setClarifyQuestions(questions); setStep(STEPS.CLARIFY); return; }
    runPlan();
  }

  function handleSurprise() {
    const preset = SURPRISE_PRESETS[Math.floor(Math.random() * SURPRISE_PRESETS.length)];
    setMood(preset.mood);
    setInterests(preset.interests);
    setConstraints(preset.constraints);
    setFreetext(prev => prev.trim() || 'surprise me with something that feels fresh but manageable');
    setErrors({});
  }

  function handleClarifySubmit(answers) {
    const extraNotes = Object.values(answers || {}).map(v => String(v).trim()).filter(Boolean).join('\n');
    const mergedNotes = [freetext.trim(), extraNotes].filter(Boolean).join('\n');
    setFreetext(mergedNotes);
    setStep(STEPS.FORM);
    runPlan(mergedNotes);
  }

  function handleClarifySkip() { setStep(STEPS.FORM); runPlan(); }

  function handleReset() {
    setStep(STEPS.FORM); setPlan(null); setPrefs(null);
    setFallback(null); setTraceLines([]); setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isRunning = step === STEPS.RUNNING;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.42), rgba(0,0,0,0.54)), url(https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center 40%', filter: 'saturate(0.9)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <div className="app-shell" style={{ position: 'relative', zIndex: 3, maxWidth: '860px', margin: '0 auto', padding: '0 28px 120px' }}>

        {/* Header */}
        <header className="hero" style={{ textAlign: 'center', padding: '68px 0 52px', borderBottom: '0.5px solid rgba(255,255,255,0.14)', marginBottom: '60px' }}>
          <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'center' }}><Logo /></div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 300, lineHeight: 1.05, color: '#F0F2F5', letterSpacing: '-0.01em', margin: 0 }}>
            Plan <em style={{ fontStyle: 'italic', color: '#C8F04A' }}>the perfect</em><br />weekend, for you
          </h1>
          <p style={{ marginTop: '16px', fontSize: '15px', color: 'rgba(240,242,245,0.68)', fontWeight: 350, letterSpacing: '0.02em', lineHeight: 1.65 }}>
            Your mood. Your kind of day. Bangalore.
          </p>
        </header>

        {/* Form */}
        {(step === STEPS.FORM || step === STEPS.CLARIFY || step === STEPS.RUNNING || step === STEPS.FALLBACK) && (
          <section>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '18px' }}>
              <Field label="Where are you?">
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(200,240,74,0.3)', borderRadius: '8px', color: 'rgba(200,240,74,0.9)', fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 500, padding: '13px 16px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Bangalore
                </div>
              </Field>
              <Field label="Free time?">
                <SelectInput value={hours} onChange={setHours} disabled={isRunning} options={[
                  { value: '2', label: '2 hours' }, { value: '3', label: '3 hours' },
                  { value: '4', label: '4 hours' }, { value: '5', label: '5 hours' },
                  { value: '6', label: '6 hours' }, { value: '7', label: '7 hours' },
                  { value: '8', label: 'Full day (8 hrs)' },
                ]} />
              </Field>
            </div>

            {/* Budget */}
            <div style={{ marginBottom: '18px' }}>
              <Field label="Budget?">
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 300, color: '#C8F04A', letterSpacing: '-0.01em', marginBottom: '10px' }}>
                  Rs.{parseInt(budget).toLocaleString('en-IN')}
                </div>
                <input type="range" min="500" max="10000" step="250" value={budget} disabled={isRunning}
                  onChange={e => setBudget(e.target.value)}
                  style={{ WebkitAppearance: 'none', appearance: 'none', width: '100%', height: '1.5px', outline: 'none', padding: 0, border: 'none', background: `linear-gradient(to right, #C8F04A ${((budget - 500) / (10000 - 500)) * 100}%, rgba(255,255,255,0.12) ${((budget - 500) / (10000 - 500)) * 100}%)`, cursor: isRunning ? 'not-allowed' : 'pointer', opacity: isRunning ? 0.5 : 1 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(240,242,245,0.2)' }}>Rs.500</span>
                  <span style={{ fontSize: '11px', color: 'rgba(240,242,245,0.2)' }}>Rs.10,000</span>
                </div>
              </Field>
            </div>

            {/* Mood */}
            <div style={{ marginBottom: '18px' }}>
              <Field label="What's the vibe?" error={errors.mood}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '3px' }}>
                  {MOOD_OPTIONS.map(o => <Chip key={o.value} label={o.label} selected={mood === o.value} onClick={() => selectMood(o.value)} disabled={isRunning} />)}
                </div>
              </Field>
            </div>

            {/* Interests */}
            <div style={{ marginBottom: '18px' }}>
              <Field label="What sounds fun?" error={errors.interests}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '3px' }}>
                  {INTEREST_OPTIONS.map(o => <Chip key={o.value} label={o.label} selected={interests.includes(o.value)} onClick={() => toggleInterest(o.value)} disabled={isRunning} />)}
                </div>
              </Field>
            </div>

            {/* Constraints */}
            <div style={{ marginBottom: '18px' }}>
              <Field label="Any hard no's?" note="optional">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '3px' }}>
                  {CONSTRAINT_OPTIONS.map(o => <Chip key={o.value} label={o.label} selected={constraints.includes(o.value)} onClick={() => toggleConstraint(o.value)} disabled={isRunning} />)}
                </div>
              </Field>
            </div>

            {/* Free text */}
            <div style={{ marginBottom: '0' }}>
              <Field label="Extra context?" note="this shapes your plan">
                <textarea
                  value={freetext}
                  onChange={e => setFreetext(e.target.value)}
                  placeholder={`e.g. ${notePlaceholder}`}
                  disabled={isRunning}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.065)',
                    border: freetext.trim() ? '0.5px solid rgba(200,240,74,0.5)' : '0.5px solid rgba(255,255,255,0.16)',
                    borderRadius: '8px', color: '#F0F2F5', fontFamily: "'Syne', sans-serif",
                    fontSize: '14px', fontWeight: 300, padding: '13px 16px', outline: 'none',
                    resize: 'vertical', minHeight: '76px', lineHeight: 1.65,
                    transition: 'border-color 0.22s', opacity: isRunning ? 0.5 : 1,
                  }}
                  onFocus={e => { if (!isRunning) e.target.style.borderColor = 'rgba(200,240,74,0.68)'; }}
                  onBlur={e => { e.target.style.borderColor = freetext.trim() ? 'rgba(200,240,74,0.5)' : 'rgba(255,255,255,0.16)'; }}
                />
                {freetext.trim() && !isRunning && (
                  <div style={{ fontSize: '11px', color: 'rgba(200,240,74,0.68)', marginTop: '5px', letterSpacing: '0.05em' }}>
                    Your notes will shape every pick in the plan
                  </div>
                )}
              </Field>
            </div>

            {/* Submit */}
            <div className="cta-row" style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '12px', marginTop: '32px' }}>
            <button type="button" onClick={handleSubmit} disabled={isRunning}
              style={{ width: '100%', padding: '20px 40px', background: 'rgba(200,240,74,0.08)', border: '0.5px solid rgba(200,240,74,0.45)', borderRadius: '8px', color: 'rgba(200,240,74,0.92)', fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontStyle: 'italic', fontWeight: 400, cursor: isRunning ? 'not-allowed' : 'pointer', letterSpacing: '0.03em', transition: 'all 0.3s', opacity: isRunning ? 0.6 : 1, boxShadow: '0 0 26px rgba(200,240,74,0.08)' }}
              onMouseEnter={e => { if (!isRunning) { e.currentTarget.style.background = 'rgba(200,240,74,0.06)'; e.currentTarget.style.borderColor = 'rgba(200,240,74,0.7)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,240,74,0.08)'; e.currentTarget.style.borderColor = 'rgba(200,240,74,0.45)'; }}
            >
              {isRunning ? 'Finding your vibe...' : 'Find my vibe'}
            </button>
            <button type="button" onClick={handleSurprise} disabled={isRunning}
              style={{ width: '100%', padding: '20px 18px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.18)', borderRadius: '8px', color: 'rgba(240,242,245,0.75)', fontFamily: "'Syne', sans-serif", fontSize: '13px', fontWeight: 500, cursor: isRunning ? 'not-allowed' : 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.25s', opacity: isRunning ? 0.5 : 1 }}
              onMouseEnter={e => { if (!isRunning) { e.currentTarget.style.color = '#F0F2F5'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; } }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(240,242,245,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
            >
              Surprise me
            </button>
            </div>
          </section>
        )}

        {/* Clarify */}
        {step === STEPS.CLARIFY && (
          <ClarifyModal questions={clarifyQuestions} onSubmit={handleClarifySubmit} onSkip={handleClarifySkip} />
        )}

        {/* Trace */}
        {(step === STEPS.RUNNING || (traceLines.length > 0 && step !== STEPS.FORM)) && (
          <AgentTrace lines={traceLines} />
        )}

        {/* Fallback */}
        {step === STEPS.FALLBACK && fallback && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(240,160,149,0.25)', borderRadius: '12px', padding: '26px 30px', marginTop: '28px', animation: 'fadeup 0.4s ease forwards' }}>
            <style>{`@keyframes fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 300, color: '#F0A095', marginBottom: '10px' }}>We hit a snag.</div>
            <p style={{ fontSize: '13.5px', color: 'rgba(240,242,245,0.5)', lineHeight: 1.75, marginBottom: '12px' }}>{fallback.title}</p>
            <p style={{ fontSize: '13px', color: 'rgba(240,242,245,0.35)', fontStyle: 'italic', lineHeight: 1.65 }}>{fallback.body}</p>
            <button type="button" onClick={handleReset}
              style={{ marginTop: '20px', padding: '10px 22px', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'rgba(240,242,245,0.4)', fontFamily: "'Syne', sans-serif", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F0F2F5'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(240,242,245,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >Try again</button>
          </div>
        )}

        {/* Result */}
        {step === STEPS.RESULT && plan && prefs && (
          <PlanResult plan={plan} prefs={prefs} onReset={handleReset} />
        )}

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '48px 0 24px', borderTop: '0.5px solid rgba(255,255,255,0.05)', fontSize: '11px', color: 'rgba(240,242,245,0.15)', letterSpacing: '0.1em', marginTop: '80px' }}>
          <Logo size="small" />
          <span style={{ marginLeft: '12px' }}>Weekend Planner - Made with care</span>
        </footer>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #C8F04A; cursor: pointer; border: 2.5px solid #0A0C10; box-shadow: 0 0 0 1.5px rgba(200,240,74,0.4); }
        input[type=range]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #C8F04A; cursor: pointer; border: 2.5px solid #0A0C10; }
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(240,242,245,0.38); }
        select option { background: #0D1018; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        @media (max-width: 620px) {
          .app-shell { padding-left: 18px !important; padding-right: 18px !important; padding-bottom: 80px !important; }
          .hero { padding-top: 46px !important; padding-bottom: 36px !important; margin-bottom: 38px !important; }
          .cta-row { grid-template-columns: 1fr !important; }
          button, select, textarea { min-height: 48px; }
        }
      `}</style>
    </div>
  );
}

