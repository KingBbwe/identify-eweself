const test = require('node:test'), assert = require('node:assert/strict');
const S = require('../skills.js'), C = require('../character.js'), A = require('../allocation.js'), T = require('./data.js');

function seq(vals) { let i = 0; return () => vals[i++ % vals.length]; }
function lcg(seed) { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); }

test('catalogue matches the commander\'s document: 111 canon skills + 2 rules-text + 21 codex additions, unique names, domains and groups', () => {
  assert.equal(S.CATALOGUE.length, 134); assert.equal(new Set(S.NAMES).size, 134);
  const canon = S.CATALOGUE.filter(s => s.source === 'canon-list');
  assert.equal(canon.length, 111);
  assert.deepEqual([...new Set(canon.map(s => s.domain))].sort(), ['Combat Skills', 'Etiquette', 'Haggling', 'Magics', 'Social Skills', 'Technologies']);
  assert.equal(new Set(canon.map(s => s.group)).size, 34);
  assert.deepEqual(S.CATALOGUE.filter(s => s.source === 'rules-text').map(s => s.name).sort(), ['Artistry', 'Command']);
  const codex = S.CATALOGUE.filter(s => s.source === 'codex');
  assert.equal(codex.length, 21); assert.equal(codex.filter(s => s.attribute === 'Will').length, 16); assert.ok(codex.every(s => s.link === 'proposed'));
  assert.deepEqual([...new Set(S.CATALOGUE.map(s => s.domain).filter(Boolean))].sort(), ['Combat Skills', 'Discipline', 'Etiquette', 'Haggling', 'Magics', 'Social Skills', 'Technologies']);
  assert.equal(new Set(S.CATALOGUE.filter(s => s.domain).map(s => s.group)).size, 39);
  assert.equal(S.CATALOGUE.filter(s => s.attribute === 'Will').length, 24);
});

test('every skill now has an attribute; the document\'s 36 links are untouched and tagged canon', () => {
  const table = {
    Inspiration: ['Arcane Knowledge', 'Protocol', 'Public Works', 'Sacred Geometry Application'],
    Intellect: ['Herb Lore', 'Energy Harnessing', 'Negotiation', 'Runic Circuit Design'],
    Prowess: ['Leadership', 'Charm', 'Trade Customs', 'Interstellar Diplomacy'],
    SelfAwareness: ['Spirit Communication', 'Rituals', 'Illusion', 'Aetheric Attunement'],
    Instinct: ['Fire Manipulation', 'Gadgetry', 'Urban Etiquette', 'Aerial Maneuvers'],
    Drive: ['Shielding', 'Cooperative Mechanics', 'Price Setting', 'Magnetric Engine Operation'],
    Energy: ['Offensive Spells', 'Machinery Control', 'Exchange Skills', 'Crystalline Engine Maintenance'],
    Emotion: ['Divination', 'Streetwise', 'Market Awareness', 'Vibrational Frequency Manipulation'],
    Will: ['Defensive Magic', 'Invention', 'Bartering', 'Tantric Energy Channeling']
  };
  A.ATTRIBUTES.forEach(a => {
    const got = S.CATALOGUE.filter(s => s.attribute === a && s.link === 'canon').map(s => s.name).sort();
    assert.deepEqual(got, table[a].slice().sort(), a);
  });
  assert.equal(S.CATALOGUE.filter(s => s.link === 'canon').length, 36);
  S.CATALOGUE.forEach(s => { assert.ok(A.ATTRIBUTES.includes(s.attribute), s.name + ' has no valid attribute'); assert.ok(['canon', 'assigned', 'rules-text', 'proposed'].includes(s.link), s.name); });
  assert.equal(S.CATALOGUE.filter(s => s.link === 'assigned').length, 76);   // 75 unlinked canon skills + Command
  assert.equal(S.find('Artistry').attribute, 'Inspiration'); assert.equal(S.find('Artistry').link, 'rules-text');
  assert.equal(S.find('Swordsmanship').attribute, 'Prowess'); assert.equal(S.find('Swordsmanship').link, 'assigned');
  A.ATTRIBUTES.forEach(a => assert.ok(S.CATALOGUE.filter(s => s.attribute === a).length >= 6, a + ' is thin'));   // no attribute left starved
});

test('Acquired Skillsets: the two named in the rules, on Emotion; granted at 0; unheld ones cannot be used', () => {
  assert.deepEqual(S.ACQUIRED_NAMES, ['Emotional Reading', 'Rapport Building']);
  S.ACQUIRED.forEach(a => assert.equal(a.attribute, 'Emotion'));
  assert.equal(S.acquiredModifier({}, 'Emotional Reading'), null);
  const h = S.acquire({}, 'Emotional Reading');
  assert.deepEqual(h, { 'Emotional Reading': 0 }); assert.equal(S.acquiredModifier(h, 'Emotional Reading'), 0);
  const before = JSON.stringify(h); assert.deepEqual(S.acquire(h, 'Emotional Reading'), h); assert.equal(JSON.stringify(h), before);   // immutable, idempotent
  assert.deepEqual(Object.keys(S.acquire(h, 'Rapport Building')).sort(), ['Emotional Reading', 'Rapport Building']);
  assert.throws(() => S.acquire({}, 'Command'), /unknown acquired/);
  assert.throws(() => S.acquiredModifier({}, 'Command'), /unknown acquired/);
  assert.deepEqual(S.acquiredProblems({ 'Emotional Reading': 0 }), []);
  assert.ok(S.acquiredProblems({ Bogus: 0 }).length && S.acquiredProblems({ 'Rapport Building': -1 }).length && S.acquiredProblems([]).length);
  S.ACQUIRED_NAMES.forEach(n => assert.ok(!S.NAMES.includes(n), n + ' must not also be a core skill'));
});

test('assigned skills start at 0, everything else at -2', () => {
  const r = S.rollAssigned(lcg(1));
  assert.equal(r.picks.length, 3);
  r.picks.forEach(n => assert.equal(S.modifier(r.skills, n), 0));
  S.NAMES.filter(n => !r.picks.includes(n)).forEach(n => assert.equal(S.modifier(r.skills, n), -2));
  assert.equal(S.modifier({}, 'Command'), -2);
  assert.throws(() => S.modifier({}, 'Nonsense'), /unknown skill/);
});

test('rollAssigned: always distinct, every skill reachable, roughly uniform (3 of 18)', () => {
  const rng = lcg(42), counts = {}; S.NAMES.forEach(n => counts[n] = 0);
  const N = 200000;
  for (let i = 0; i < N; i++) { const r = S.rollAssigned(rng); assert.equal(new Set(r.picks).size, 3); r.picks.forEach(n => counts[n]++); }
  const exp = N * 3 / S.NAMES.length;
  S.NAMES.forEach(n => assert.ok(Math.abs(counts[n] - exp) < exp * 0.08, n + ' ' + counts[n]));
});

test('rollAssigned: edge counts and extreme rng values', () => {
  assert.equal(S.rollAssigned(seq([0.99999]), S.NAMES.length).picks.length, S.NAMES.length);
  assert.deepEqual(S.rollAssigned(seq([0]), 0).picks, []);
  assert.throws(() => S.rollAssigned(Math.random, S.NAMES.length + 1), RangeError);
  assert.throws(() => S.rollAssigned(Math.random, 1.5), RangeError);
  assert.equal(S.rollAssigned(seq([0, 0, 0])).picks.join(), S.NAMES.slice(0, 3).join());
});

test('Character: skills ride along and validate; bad skills are refused', () => {
  const l = T.lineages[0], al = A.newAllocation(l.baseAttributes, {});
  const r = S.rollAssigned(lcg(7));
  const mk = (sk, cr) => C.buildCharacter({ name: 'Aralen', gender: 'ewe', originalHexagram: 17, renames: 5, characterId: '0123456789abcdef0123456789abcdef',
    soulPattern: T.soulProfiles[0], coreTraits: [T.coreTraits[4], T.coreTraits[19]], trajectory: T.trajectories[0], ageBand: T.trajectories[0].ageBand,
    lineage: l, allocation: al, tribe: T.tribes[0], skills: sk, creation: cr === null ? undefined : { skillRoll: { picks: r.picks } } }, { now: '2026-11-27T10:00:00.000Z' });
  const c = mk(r.skills); assert.deepEqual(Object.keys(c.skills).sort(), r.picks.slice().sort()); assert.ok(C.validateCharacter(c).ok, JSON.stringify(C.validateCharacter(c)));
  const bad = (f, re) => { const x = JSON.parse(JSON.stringify(c)); f(x); const v = C.validateCharacter(x); assert.ok(!v.ok); assert.match(JSON.stringify(v), re); };
  bad(x => { x.skills.Bogus = 0; }, /unknown skill/);
  bad(x => { x.skills[r.picks[0]] = -3; }, /at least -2/);
  bad(x => { x.skills[r.picks[0]] = 0.5; }, /integer/);
  bad(x => { delete x.skills[r.picks[0]]; }, /not on the sheet/);
  bad(x => { x.creation.skillRoll.picks.push(x.creation.skillRoll.picks[0]); }, /distinct/);
  bad(x => { x.skills = []; }, /skills must be an object/);
  assert.deepEqual(mk(undefined, null).skills, {});
  const withAcq = JSON.parse(JSON.stringify(c)); withAcq.acquired = { 'Rapport Building': 0 }; assert.ok(C.validateCharacter(withAcq).ok);
  withAcq.acquired = { Nope: 0 }; assert.match(JSON.stringify(C.validateCharacter(withAcq)), /unknown acquired/);
  assert.deepEqual(c.acquired, {});
  const legacy = JSON.parse(JSON.stringify(c)); delete legacy.acquired; assert.ok(C.validateCharacter(legacy).ok);   // older files without the field still load   // no skills given: empty, still valid shape
});
