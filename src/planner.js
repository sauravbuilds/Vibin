import { ACTIVITIES, FOOD, FALLBACK_ACTIVITIES, FALLBACK_FOOD, SUPPORTED_CITIES } from './data';

export function normalizeCity(input) {
  return input.trim().toLowerCase().replace('bengaluru', 'bangalore');
}

export function isCitySupported(city) {
  return SUPPORTED_CITIES.includes(normalizeCity(city));
}

export function getCityKey(city) {
  const normalized = normalizeCity(city);
  return ACTIVITIES[normalized] ? normalized : null;
}

export function parsePreferences({ city, budget, hours, mood, interests, constraints }) {
  const cityKey = getCityKey(city);
  const isVeg = constraints.includes('vegetarian');
  const noCrowd = constraints.includes('avoid crowds');
  const indoorOnly = constraints.includes('indoors');
  const outdoorOnly = constraints.includes('outdoors');

  return {
    cityKey,
    cityDisplay: city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase(),
    budget: parseInt(budget),
    hours: parseInt(hours),
    mood,
    interests,
    constraints,
    isVeg,
    noCrowd,
    indoorOnly,
    outdoorOnly,
  };
}

export function getActivityOptions(prefs) {
  const source = ACTIVITIES[prefs.cityKey] || FALLBACK_ACTIVITIES;
  let acts = source.filter(a => prefs.interests.some(i => a.tags.includes(i)));

  if (prefs.noCrowd) acts = acts.filter(a => a.crowd !== 'high');
  if (prefs.indoorOnly) acts = acts.filter(a => a.indoor === true);
  if (prefs.outdoorOnly) acts = acts.filter(a => a.indoor === false);

  // Mood scoring — sort by how well they match the current mood
  acts = acts.sort((a, b) => {
    const aScore = a.moods?.includes(prefs.mood) ? 1 : 0;
    const bScore = b.moods?.includes(prefs.mood) ? 1 : 0;
    return bScore - aScore;
  });

  return acts;
}

export function getFoodOptions(prefs) {
  const source = FOOD[prefs.cityKey] || FALLBACK_FOOD;
  let food = source.filter(f => {
    if (prefs.isVeg && !f.veg) return false;
    if (prefs.noCrowd && f.crowd === 'high') return false;
    if (prefs.indoorOnly && f.outdoor) return false;
    return true;
  });

  // Fallback: loosen veg if nothing matches
  const loosened = food.length === 0;
  if (loosened) {
    food = (FOOD[prefs.cityKey] || FALLBACK_FOOD).filter(f => {
      if (prefs.noCrowd && f.crowd === 'high') return false;
      return true;
    });
  }

  return { food, loosened };
}

export function estimateCost(slots) {
  return slots.reduce((total, slot) => {
    if (slot.type === 'food') return total + slot.item.cph;
    return total + slot.item.cost;
  }, 0);
}

export function estimateTransportCost(prefs, slots) {
  const stopCount = Array.isArray(slots) ? slots.length : 3;
  const targetTotal = prefs.budget > 1500 ? prefs.budget * 0.35 : prefs.budget * 0.75;
  const nonTransport = estimateCost(slots);
  const base = Math.round(targetTotal - nonTransport);
  if (base > 0) return Math.max(180, base);
  return Math.max(180, base + Math.max(0, stopCount - 3) * 75);
}

export function validatePlan(plan, prefs) {
  const violations = [];
  if (prefs.isVeg && plan.some(s => s.type === 'food' && !s.item.veg)) {
    violations.push('vegetarian constraint');
  }
  if (prefs.noCrowd && plan.some(s => s.item.crowd === 'high')) {
    violations.push('crowd preference');
  }
  if (prefs.indoorOnly && plan.some(s => s.type === 'act' && s.item.indoor === false)) {
    violations.push('indoor preference');
  }
  return violations;
}

const TIME_SLOTS = {
  2: [
    { time: '9:30 AM', type: 'food', prefer: 'breakfast' },
    { time: '10:45 AM', type: 'act' },
  ],
  3: [
    { time: '9:30 AM', type: 'food', prefer: 'breakfast' },
    { time: '10:45 AM', type: 'act' },
    { time: '12:30 PM', type: 'food', prefer: 'lunch' },
  ],
  4: [
    { time: '9:30 AM', type: 'food', prefer: 'breakfast' },
    { time: '10:45 AM', type: 'act' },
    { time: '12:45 PM', type: 'food', prefer: 'lunch' },
    { time: '2:15 PM', type: 'act' },
  ],
  5: [
    { time: '9:30 AM', type: 'food', prefer: 'breakfast' },
    { time: '10:45 AM', type: 'act' },
    { time: '12:45 PM', type: 'food', prefer: 'lunch' },
    { time: '2:15 PM', type: 'act' },
    { time: '4:00 PM', type: 'food', prefer: 'brunch' },
  ],
  6: [
    { time: '9:00 AM', type: 'food', prefer: 'breakfast' },
    { time: '10:15 AM', type: 'act' },
    { time: '12:30 PM', type: 'food', prefer: 'lunch' },
    { time: '2:00 PM', type: 'act' },
    { time: '4:00 PM', type: 'act' },
    { time: '6:30 PM', type: 'food', prefer: 'dinner' },
  ],
  7: [
    { time: '9:00 AM', type: 'food', prefer: 'breakfast' },
    { time: '10:15 AM', type: 'act' },
    { time: '12:30 PM', type: 'food', prefer: 'lunch' },
    { time: '2:00 PM', type: 'act' },
    { time: '4:00 PM', type: 'act' },
    { time: '6:30 PM', type: 'food', prefer: 'dinner' },
  ],
  8: [
    { time: '9:00 AM', type: 'food', prefer: 'breakfast' },
    { time: '10:00 AM', type: 'act' },
    { time: '12:30 PM', type: 'food', prefer: 'lunch' },
    { time: '2:00 PM', type: 'act' },
    { time: '4:00 PM', type: 'act' },
    { time: '6:00 PM', type: 'food', prefer: 'brunch' },
    { time: '7:30 PM', type: 'act' },
  ],
};

export function buildPlan(acts, food, prefs) {
  const hours = Math.min(prefs.hours, 8);
  // Get nearest available time template
  const keys = Object.keys(TIME_SLOTS).map(Number).sort((a, b) => a - b);
  const templateKey = keys.reduce((prev, curr) =>
    Math.abs(curr - hours) < Math.abs(prev - hours) ? curr : prev
  );
  const template = TIME_SLOTS[templateKey];

  const slots = [];
  let actIdx = 0;
  const usedFood = new Set();

  for (const slot of template) {
    if (slot.type === 'food') {
      const prefer = slot.prefer;
      let candidate = food.find(f => f.timing.includes(prefer) && !usedFood.has(f.id));
      if (!candidate) candidate = food.find(f => !usedFood.has(f.id));
      if (!candidate && food.length > 0) candidate = food[0]; // reuse if exhausted
      if (candidate) {
        slots.push({ time: slot.time, type: 'food', item: candidate });
        usedFood.add(candidate.id);
      }
    } else {
      if (actIdx < acts.length) {
        slots.push({ time: slot.time, type: 'act', item: acts[actIdx] });
        actIdx++;
      }
    }
  }

  const subtotal = estimateCost(slots);
  const transportCost = estimateTransportCost(prefs, slots);
  const total = subtotal + transportCost;
  const overBudget = total > prefs.budget;
  let tradeoff = null;

  if (overBudget) {
    const over = total - prefs.budget;
    tradeoff = `This plan runs ₹${over.toLocaleString('en-IN')} over your ₹${prefs.budget.toLocaleString('en-IN')} budget. Each pick was chosen because it fits your mood — you can skip one food stop or share a meal to bring it within range.`;
  }

  return {
    slots,
    total,
    transportCost,
    transport: {
      mode: 'Auto/cab between stops',
      cost: transportCost,
      desc: 'Estimated local Bangalore transport for this route.',
      sourceUrl: null,
    },
    tradeoff,
    overBudget,
  };
}

export function needsClarification(prefs) {
  const questions = [];

  if (prefs.interests.length === 0) {
    questions.push({
      id: 'interests',
      text: 'What kind of activities do you enjoy? (e.g. food, walks, art, music)',
      placeholder: 'food and coffee, quiet walks, anything with live music…',
    });
  }

  if (!prefs.mood) {
    questions.push({
      id: 'mood',
      text: 'How are you feeling today?',
      placeholder: 'tired but want to do something, feeling adventurous, just want to relax…',
    });
  }

  if (prefs.interests.length > 0 && prefs.interests.length <= 1 && prefs.hours >= 5) {
    questions.push({
      id: 'more_interests',
      text: 'You have a long day. Any other interests we should factor in?',
      placeholder: 'photography, markets, cafés, bookstores…',
    });
  }

  return questions.slice(0, 2);
}
