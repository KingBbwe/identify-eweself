const test = require('node:test'), assert = require('node:assert/strict');
const R = require('../rolls.js'), T = require('./data.js');

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// A scripted rng: each wanted die face n (on a dN) is fed as the float that yields it.
const script = (faces, sides) => { let i = 0; return () => { const f = faces[i], n = sides[i]; i++; if (f === undefined) throw new Error('script exhausted'); return (f - 1) / n + 0.5 / n; }; };

test('soul profile: a valid first 2d6 is kept as rolled, no rerolls', () => {
  const r = R.rollProfile(script([1, 3], [6, 6]));
  assert.deepEqual(r.profile, [1, 3]); assert.deepEqual(r.dice, [1, 3]); assert.deepEqual(r.rerolls, []); assert.equal(r.profileId, '1/3');
});

test('soul profile: an invalid pair keeps the FIRST die and rerolls only the SECOND until valid (the documented rule)', () => {
  // 1/1 invalid -> reroll second: 2 (1/2 invalid), 6 (1/6 invalid), 4 (1/4 valid)
  const r = R.rollProfile(script([1, 1, 2, 6, 4], [6, 6, 6, 6, 6]));
  assert.deepEqual(r.dice, [1, 1]); assert.deepEqual(r.rerolls, [2, 6, 4]); assert.deepEqual(r.profile, [1, 4]);
  const k = R.rollProfile(script([6, 6, 1, 2], [6, 6, 6, 6]));            // 6/6 invalid -> 6/1 invalid -> 6/2 valid
  assert.deepEqual(k.profile, [6, 2]); assert.deepEqual(k.rerolls, [1, 2]);
});

test('soul profile: the first die is never re-rolled, every reroll but the last is invalid, the result is one of the twelve (200,000 rolls)', () => {
  const rng = mulberry32(7), seen = new Set();
  for (let i = 0; i < 200000; i++) {
    const r = R.rollProfile(rng);
    assert.equal(r.profile[0], r.dice[0]);
    assert.ok(R.isValidPair(r.profile[0], r.profile[1]));
    if (r.rerolls.length) {
      assert.ok(!R.isValidPair(r.dice[0], r.dice[1]));
      r.rerolls.slice(0, -1).forEach(b => assert.ok(!R.isValidPair(r.dice[0], b)));
      assert.equal(r.rerolls[r.rerolls.length - 1], r.profile[1]);
    } else assert.equal(r.dice[1], r.profile[1]);
    seen.add(r.profileId);
  }
  assert.equal(seen.size, 12);
});

test('soul profile: each of the twelve comes up 1 time in 12 (chi-square, 600,000 rolls)', () => {
  const rng = mulberry32(2026), n = 600000, c = {};
  for (let i = 0; i < n; i++) { const id = R.rollProfile(rng).profileId; c[id] = (c[id] || 0) + 1; }
  const exp = n / 12; let chi = 0; for (const id of Object.keys(c)) chi += (c[id] - exp) ** 2 / exp;
  assert.equal(Object.keys(c).length, 12);
  assert.ok(chi < 31.26, 'chi-square ' + chi.toFixed(1) + ' (df 11, p=0.001 critical 31.26)');     // the reroll rule makes the twelve exactly equiprobable
});

test('every one of the twelve profiles exists in both data tables (so a roll can always be resolved to a soul pattern)', () => {
  for (const [a, b] of R.VALID_PROFILES) {
    assert.ok(T.soulPatterns.some(p => /\((\d)\/(\d)\)/.exec(p.profile).slice(1).join('/') === a + '/' + b), 'pattern ' + a + '/' + b);
    assert.ok(T.soulProfiles.some(p => p.profileId === a + '/' + b), 'profile ' + a + '/' + b);
  }
});

test('core trait: 2d8 is a bijection onto hexagrams 1-64', () => {
  const seen = new Set();
  for (let x = 1; x <= 8; x++) for (let y = 1; y <= 8; y++) seen.add(R.traitFromDice(x, y));
  assert.equal(seen.size, 64); assert.equal(Math.min(...seen), 1); assert.equal(Math.max(...seen), 64);
  assert.equal(R.traitFromDice(1, 1), 1); assert.equal(R.traitFromDice(8, 8), 64);
});

test('core trait: rollCoreTrait reports its dice and is uniform (chi-square, 640,000 rolls)', () => {
  const rng = mulberry32(99), n = 640000, c = new Array(65).fill(0);
  for (let i = 0; i < n; i++) { const t = R.rollCoreTrait(rng); assert.equal(R.traitFromDice(t.dice[0], t.dice[1]), t.hexagram); c[t.hexagram]++; }
  const exp = n / 64; let chi = 0; for (let h = 1; h <= 64; h++) chi += (c[h] - exp) ** 2 / exp;
  assert.ok(chi < 103.4, 'chi-square ' + chi.toFixed(1) + ' (df 63, p=0.001 critical 103.4)');
});

test('core traits: the two rolls are independent, so they may coincide (as the page always allowed)', () => {
  const r = script([3, 5, 3, 5], [8, 8, 8, 8]), a = R.rollCoreTrait(r), b = R.rollCoreTrait(r);
  assert.equal(a.hexagram, b.hexagram);
});

test('age bands: 18-35 -> "18-36", 36 and over -> "36-50+"; nothing under 18, no fractions', () => {
  assert.equal(R.bandForAge(18), '18-36'); assert.equal(R.bandForAge(35), '18-36');
  assert.equal(R.bandForAge(36), '36-50+'); assert.equal(R.bandForAge(50), '36-50+'); assert.equal(R.bandForAge(90), '36-50+');
  for (const bad of [17, 0, -5, 36.5, NaN, '40', null]) assert.throws(() => R.bandForAge(bad), RangeError, String(bad));
});

test('the trajectory table is relabelled to the ruled bands: 32 each, nothing left under the old labels', () => {
  const by = {}; for (const t of T.trajectories) by[t.ageBand] = (by[t.ageBand] || 0) + 1;
  assert.deepEqual(by, { '18-36': 32, '36-50+': 32 });
  assert.deepEqual([...R.AGE_BANDS].sort(), Object.keys(by).sort());
});

test('rollTrajectory picks only from the band and reaches every entry of it', () => {
  const rng = mulberry32(5); for (const band of R.AGE_BANDS) {
    const hit = new Set();
    for (let i = 0; i < 4000; i++) { const t = R.rollTrajectory(rng, T.trajectories, band); assert.equal(t.entry.ageBand, band); hit.add(t.entry.id); }
    assert.equal(hit.size, 32, band);
  }
  assert.throws(() => R.rollTrajectory(rng, T.trajectories, '0-50'), /no trajectories/);
});

test('the shipped core-trait table holds each hexagram 1-64 exactly once (so every 2d8 roll finds exactly one trait)', () => {
  const h = Array.from(T.coreTraits, t => t.hexagram).sort((a, b) => a - b);   // Array.from: vm-realm arrays would fail deepEqual
  assert.equal(h.length, 64); assert.deepEqual(h, Array.from({ length: 64 }, (_, i) => i + 1));
});
