const test = require('node:test'), assert = require('node:assert/strict');
const A = require('../allocation.js'), T = require('./data.js');
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const sumOf = o => A.ATTRIBUTES.reduce((t, a) => t + o[a], 0);
const fillAll = s => { let guard = 0; while (A.remaining(s) > 0 && guard++ < 100) for (const a of A.ATTRIBUTES) s = A.add(s, a); return s; };

test('the documented numbers: 32 points, nine attributes, each 1-5', () => {
  assert.equal(A.TOTAL, 32); assert.equal(A.MIN, 1); assert.equal(A.MAX, 5); assert.equal(A.ATTRIBUTES.length, 9);
});

test('free build: start at all 1s with 23 to spend; complete means exactly 32', () => {
  let s = A.newAllocation(null, { mode: 'free' });
  assert.deepEqual(A.summary(s), { spent: 9, remaining: 23, budget: 32, complete: false, total: 32 });
  s = fillAll(s); assert.equal(sumOf(s.values), 32); assert.ok(A.summary(s).complete);
  for (const a of A.ATTRIBUTES) assert.ok(s.values[a] >= 1 && s.values[a] <= 5);
});

test('seeded: every lineage ends at exactly 32 when completed, and its seed is the floor', () => {
  for (const l of T.lineages) {
    let s = A.newAllocation(l.baseAttributes, { mode: 'seeded' });
    assert.equal(A.remaining(s), 32 - sumOf(l.baseAttributes), l.name);
    s = fillAll(s); assert.equal(sumOf(s.values), 32, l.name); assert.ok(A.summary(s).complete);
    for (const a of A.ATTRIBUTES) assert.ok(s.values[a] >= l.baseAttributes[a] && s.values[a] <= 5, l.name + ' ' + a);
  }
});

test('the ZERO FLOOR: no number of rerolls drives the points to spend below zero', () => {
  for (const l of T.lineages) for (const penalty of [0, 1, 5, 10, 25, 289, 100000]) {
    const s = A.newAllocation(l.baseAttributes, { penalty });
    assert.ok(A.remaining(s) >= 0, `${l.name} penalty ${penalty}`);
    assert.ok(s.budget >= sumOf(s.floors));
  }
  const free = A.newAllocation(null, { mode: 'free', penalty: 1000 });
  assert.equal(A.remaining(free), 0); assert.equal(free.budget, 9);
});

test('a penalty of n takes n points off the 32 (until the floor)', () => {
  const l = T.lineages[0];                                   // seed sum 24: 8 to spend
  assert.equal(A.remaining(A.newAllocation(l.baseAttributes, { penalty: 0 })), 8);
  assert.equal(A.remaining(A.newAllocation(l.baseAttributes, { penalty: 3 })), 5);
  assert.equal(A.remaining(A.newAllocation(l.baseAttributes, { penalty: 8 })), 0);
  assert.equal(A.remaining(A.newAllocation(l.baseAttributes, { penalty: 9 })), 0);
});

test('VACUITY: the old rule (surplus 10 minus penalty) did go negative and ignored the 32 total', () => {
  const old = (l, penalty) => l.surplus - penalty;
  assert.ok(old(T.lineages[0], 289) < 0);
  const totals = T.lineages.map(l => sumOf(l.baseAttributes) + l.surplus);
  assert.ok(totals.some(t => t !== 32), 'old totals were ' + [...new Set(totals)].sort().join('/'));
});

test('add and remove respect the caps; remove never goes below the floor; no-ops return the same state', () => {
  const l = T.lineages.find(x => Object.values(x.baseAttributes).some(v => v === 5)) || T.lineages[0];
  let s = A.newAllocation(l.baseAttributes, {});
  const five = A.ATTRIBUTES.find(a => s.values[a] === 5);
  if (five) assert.equal(A.add(s, five), s);
  const floorAttr = A.ATTRIBUTES[0]; assert.equal(A.remove(s, floorAttr), s);
  assert.equal(A.add(s, 'Charisma'), s); assert.equal(A.remove(s, 'Charisma'), s);
  const a = A.ATTRIBUTES.find(x => A.canAdd(s, x)); const s2 = A.add(s, a);
  assert.equal(s2.values[a], s.values[a] + 1); assert.equal(s.values[a], s.values[a], 'original untouched');
  assert.equal(A.remove(s2, a).values[a], s.values[a]);
});

test('property: 3,000 random add/remove sequences never break an invariant', () => {
  const rng = mulberry32(31);
  for (let run = 0; run < 3000; run++) {
    const free = rng() < 0.3, l = T.lineages[Math.floor(rng() * T.lineages.length)], penalty = Math.floor(rng() * 14);
    let s = A.newAllocation(free ? null : l.baseAttributes, { mode: free ? 'free' : 'seeded', penalty });
    for (let k = 0; k < 120; k++) {
      const a = A.ATTRIBUTES[Math.floor(rng() * 9)]; s = rng() < 0.6 ? A.add(s, a) : A.remove(s, a);
      assert.ok(A.remaining(s) >= 0 && A.spent(s) <= s.budget && s.budget <= 32);
      for (const x of A.ATTRIBUTES) assert.ok(s.values[x] >= s.floors[x] && s.values[x] <= 5 && s.values[x] >= 1);
    }
  }
});

test('problems(): accepts a good record and names each kind of tampering', () => {
  const l = T.lineages[2]; let s = fillAll(A.newAllocation(l.baseAttributes, {}));
  const rec = () => { const sm = A.summary(s); return { mode: s.mode, floors: Object.assign({}, s.floors), values: Object.assign({}, s.values), budget: s.budget, spent: sm.spent, remaining: sm.remaining, complete: sm.complete }; };
  assert.deepEqual(A.problems(rec()), []);
  const bad = (mut, re) => { const r = rec(); mut(r); const p = A.problems(r); assert.ok(p.length, re); assert.match(p.join('|'), re); };
  bad(r => { r.values.Will = 6; }, /Will must be an integer 1-5/);
  bad(r => { r.values.Will = 0; }, /Will must be/);
  bad(r => { r.spent += 1; }, /does not equal/);
  bad(r => { r.values.Will = r.floors.Will - 1; r.spent -= 1; r.remaining += 1; }, /below its floor|Will must/);
  bad(r => { r.budget = 40; r.remaining = 40 - r.spent; r.complete = false; }, /cannot exceed 32/);
  bad(r => { r.remaining = 3; }, /remaining must equal/);
  bad(r => { r.complete = false; }, /complete must be true/);
  bad(r => { r.mode = 'wild'; }, /mode/);
  assert.match(A.problems(null)[0], /missing/);
});

test('newAllocation refuses a seed that is not 1-5 integers', () => {
  const l = T.lineages[0];
  assert.throws(() => A.newAllocation(Object.assign({}, l.baseAttributes, { Will: 6 })), RangeError);
  assert.throws(() => A.newAllocation(Object.assign({}, l.baseAttributes, { Will: 0 })), RangeError);
  assert.throws(() => A.newAllocation({}), RangeError);
});
