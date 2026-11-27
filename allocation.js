/*
 * allocation.js — the 32-point attribute allocation, as pure functions on immutable state.
 *
 * Documented rule: allocate 32 points among nine attributes; each at least 1, none above 5.
 * Ruled build (2026-11-27):
 *   - mode "seeded" (default): the lineage's base spread is the floor (a lineage is what you are); you spend the points that
 *     bring the total up to 32.
 *   - mode "free": every attribute starts at 1 and you spend 23 points.
 *   - Reroll penalty: each extra forge within 24 h takes a point off the budget. ZERO FLOOR: the budget never falls below
 *     the sum of the floors, so the points left to spend can never go negative.
 */
(function (root) {
  'use strict';

  var TOTAL = 32, MIN = 1, MAX = 5;
  var ATTRIBUTES = ['Inspiration', 'Intellect', 'Prowess', 'SelfAwareness', 'Instinct', 'Drive', 'Energy', 'Emotion', 'Will'];

  function sum(o) { return ATTRIBUTES.reduce(function (t, a) { return t + o[a]; }, 0); }
  function clone(o) { var c = {}; ATTRIBUTES.forEach(function (a) { c[a] = o[a]; }); return c; }

  /** seed: lineage baseAttributes (required for "seeded"). opts: {mode, penalty}. */
  function newAllocation(seed, opts) {
    opts = opts || {};
    var mode = opts.mode === 'free' ? 'free' : 'seeded';
    var penalty = Math.max(0, Math.floor(opts.penalty || 0));
    var floors = {};
    ATTRIBUTES.forEach(function (a) {
      var v = mode === 'free' ? MIN : (seed || {})[a];
      if (typeof v !== 'number' || v % 1 || v < MIN || v > MAX) throw new RangeError('seed attribute ' + a + ' must be an integer 1-5, got ' + v);
      floors[a] = v;
    });
    var floorSum = sum(floors);
    var budget = Math.max(floorSum, TOTAL - penalty);             // the zero floor
    return { mode: mode, penalty: penalty, floors: floors, values: clone(floors), budget: budget };
  }

  function spent(s) { return sum(s.values); }
  function remaining(s) { return s.budget - spent(s); }
  function canAdd(s, a) { return ATTRIBUTES.indexOf(a) !== -1 && s.values[a] < MAX && remaining(s) > 0; }
  function canRemove(s, a) { return ATTRIBUTES.indexOf(a) !== -1 && s.values[a] > s.floors[a]; }
  function add(s, a) { if (!canAdd(s, a)) return s; var v = clone(s.values); v[a]++; return { mode: s.mode, penalty: s.penalty, floors: s.floors, values: v, budget: s.budget }; }
  function remove(s, a) { if (!canRemove(s, a)) return s; var v = clone(s.values); v[a]--; return { mode: s.mode, penalty: s.penalty, floors: s.floors, values: v, budget: s.budget }; }
  function summary(s) { var sp = spent(s), r = s.budget - sp; return { spent: sp, remaining: r, budget: s.budget, complete: r === 0, total: TOTAL }; }

  /** Checks a plain allocation record (as stored in a Character). Returns an array of problems. */
  function problems(rec) {
    var e = [];
    if (!rec || typeof rec !== 'object') return ['allocation missing'];
    if (rec.mode !== 'seeded' && rec.mode !== 'free') e.push('allocation.mode must be seeded or free');
    var total = 0, floorSum = 0;
    ATTRIBUTES.forEach(function (a) {
      var v = rec.values && rec.values[a], f = rec.floors && rec.floors[a];
      if (typeof v !== 'number' || v % 1 || v < MIN || v > MAX) e.push('attribute ' + a + ' must be an integer 1-5');
      else total += v;
      if (typeof f !== 'number' || f % 1 || f < MIN || f > MAX) e.push('floor ' + a + ' must be an integer 1-5');
      else { floorSum += f; if (typeof v === 'number' && v < f) e.push('attribute ' + a + ' is below its floor'); }
    });
    if (rec.mode === 'free' && rec.floors && ATTRIBUTES.some(function (a) { return rec.floors[a] !== MIN; })) e.push('free-build floors must all be 1');
    if (e.length) return e;
    if (rec.spent !== total) e.push('allocation.spent ' + rec.spent + ' does not equal the attribute total ' + total);
    if (typeof rec.budget !== 'number' || rec.budget < floorSum) e.push('allocation.budget is below the sum of the floors');
    if (total > rec.budget) e.push('attributes total ' + total + ' exceeds the budget ' + rec.budget);
    if (rec.remaining !== rec.budget - total) e.push('allocation.remaining must equal budget minus spent');
    if (rec.complete !== (rec.remaining === 0)) e.push('allocation.complete must be true exactly when nothing remains');
    if (rec.budget > TOTAL) e.push('allocation.budget cannot exceed ' + TOTAL);
    return e;
  }

  var api = { TOTAL: TOTAL, MIN: MIN, MAX: MAX, ATTRIBUTES: ATTRIBUTES, newAllocation: newAllocation, spent: spent, remaining: remaining,
              canAdd: canAdd, canRemove: canRemove, add: add, remove: remove, summary: summary, problems: problems };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AuldEweAllocation = api;
})(typeof window !== 'undefined' ? window : globalThis);
