const test = require('node:test'), assert = require('node:assert/strict');
const C = require('../character.js'), T = require('./data.js'), A = require('../allocation.js');
const NOW = '2026-11-27T10:00:00.000Z';

// Mirrors forgeIdentity() in index.html: how the page derives the four DCs. If the page changes, this must too.
function session(over) {
  const ct = [T.coreTraits[0], T.coreTraits[1]], tj = T.trajectories[0];
  const sp = T.soulProfiles[0];
  return Object.assign({
    name: 'Aralen', gender: 'ewe', originalHexagram: 17, renames: 5, characterId: 'abc123',
    soulPattern: sp, coreTraits: ct, trajectory: tj, ageBand: tj.ageBand,
    lineage: T.lineages[0], allocation: A.newAllocation(T.lineages[0].baseAttributes, {}), tribe: T.tribes[0]
  }, over || {});
}

test('data tables ship the shapes the contract relies on', () => {
  assert.equal(T.coreTraits.length, 64); assert.equal(T.trajectories.length, 64);
  for (const t of T.coreTraits) assert.ok(t.hexagram >= 1 && t.hexagram <= 64, t.trait);
  for (const t of T.trajectories) {
    const [a, b] = t.ageBand === '18-36' ? [t.fromHex, t.toHex] : [t.currentHex, t.reflectingHex];
    assert.ok(a >= 1 && a <= 64 && b >= 1 && b <= 64, 'trajectory ' + t.id);
  }
});

test('the twelve soul-pattern profiles equal SentientHub validProfiles, in both tables', () => {
  assert.equal(C.VALID_PROFILES.length, 12);
  for (const p of T.soulPatterns) assert.ok(C.isValidProfile(C.parseProfile(p.profile)), p.profile);
  for (const p of T.soulProfiles) assert.ok(C.isValidProfile(C.parseProfile(p.profileId)), p.profileId);
  const have = new Set(T.soulProfiles.map(p => p.profileId));
  for (const [a, b] of C.VALID_PROFILES) assert.ok(have.has(a + '/' + b), 'no extended profile for ' + a + '/' + b);
});

test('mode follows the DC band at every boundary', () => {
  const want = { 1: 'over', 16: 'over', 17: 'under', 32: 'under', 33: 'over', 48: 'over', 49: 'under', 64: 'under' };
  for (const [dc, m] of Object.entries(want)) assert.equal(C.modeForDC(+dc), m, 'DC ' + dc);
  assert.throws(() => C.modeForDC(0)); assert.throws(() => C.modeForDC(65));
});

test('four-DC derivation is canon: conscious, unconscious, trajectory A, trajectory B', () => {
  for (const tj of T.trajectories) {
    const c = C.buildCharacter(session({ trajectory: tj, ageBand: tj.ageBand }), { now: NOW });
    const young = tj.ageBand === '18-36';
    assert.equal(c.dc.intellectual.value, T.coreTraits[0].hexagram);
    assert.equal(c.dc.physical.value, T.coreTraits[1].hexagram);
    assert.equal(c.dc.emotional.value, young ? tj.fromHex : tj.currentHex);
    assert.equal(c.dc.spiritual.value, young ? tj.toHex : tj.reflectingHex);
    for (const d of C.DOMAINS) assert.equal(c.dc[d].mode, C.modeForDC(c.dc[d].value));
  }
});

test('every core-trait pair x every trajectory builds a valid Character (exhaustive)', () => {
  let n = 0;
  for (const a of T.coreTraits) for (const b of T.coreTraits) for (const tj of T.trajectories) {
    const c = C.buildCharacter(session({ coreTraits: [a, b], trajectory: tj, ageBand: tj.ageBand }), { now: NOW });
    assert.ok(C.validateCharacter(c).ok); n++;
  }
  assert.equal(n, 64 * 64 * 64);
});

test('every lineage x tribe x soul profile x allocation mode builds and validates; attributes 1-5', () => {
  for (const l of T.lineages) for (const tr of T.tribes) for (const sp of T.soulProfiles) for (const mode of ['seeded', 'free']) {
    const c = C.buildCharacter(session({ lineage: l, tribe: tr, soulPattern: sp, allocation: A.newAllocation(l.baseAttributes, { mode }) }), { now: NOW });
    assert.deepEqual(c.soul.profile, C.parseProfile(sp.profileId));
    for (const v of Object.values(c.attributes)) assert.ok(v >= 1 && v <= 5, l.name);
    assert.equal(c.allocation.complete, false);
  }
});

test('soulPatterns fallback (no extended profile) still yields a valid pair and a clean pattern name', () => {
  const c = C.buildCharacter(session({ soulPattern: T.soulPatterns[0] }), { now: NOW });
  assert.deepEqual(c.soul.profile, [1, 3]); assert.equal(c.soul.pattern, 'Seeker of Trials');
});

test('the Character is a snapshot of allocations and renames, not of the forge moment', () => {
  const l = T.lineages[0]; let al = A.newAllocation(l.baseAttributes, { penalty: 2 });
  al = A.add(al, 'Instinct'); al = A.add(al, 'Instinct');
  const c = C.buildCharacter(session({ allocation: al, renames: 2 }), { now: NOW });
  assert.equal(c.attributes.Instinct, l.baseAttributes.Instinct + 2); assert.equal(c.renamesRemaining, 2);
  assert.deepEqual(c.allocation, { rule: '32-point', mode: 'seeded', budget: 30, spent: 26, remaining: 4, complete: false, rerollPenalty: 2, floors: c.allocation.floors });
  assert.equal(c.allocation.floors.Instinct, l.baseAttributes.Instinct);
});

test('a fully spent allocation is complete at exactly 32 (or the budget after rerolls)', () => {
  let al = A.newAllocation(T.lineages[0].baseAttributes, {});
  while (A.remaining(al) > 0) for (const a of A.ATTRIBUTES) al = A.add(al, a);
  const c = C.buildCharacter(session({ allocation: al }), { now: NOW });
  assert.equal(c.allocation.spent, 32); assert.ok(c.allocation.complete); assert.equal(c.allocation.remaining, 0);
});

test('the age bands are the ruled ones, and the old labels are refused', () => {
  assert.deepEqual(C.AGE_BANDS, ['18-36', '36-50+']);
  const c = C.buildCharacter(session(), { now: NOW }); assert.equal(c.trajectory.ageBand, '18-36'); assert.equal(c.trajectory.a.role, 'from');
  const old = JSON.parse(JSON.stringify(c)); old.trajectory.ageBand = '0-50'; assert.match(C.validateCharacter(old).errors.join('|'), /ageBand/);
  assert.throws(() => C.buildCharacter(session({ ageBand: '0-50' })), /trajectory/);
  const tj = T.trajectories.find(t => t.ageBand === '36-50+');
  const o = C.buildCharacter(session({ trajectory: tj, ageBand: '36-50+' }), { now: NOW });
  assert.equal(o.trajectory.a.role, 'current'); assert.equal(o.dc.emotional.value, tj.currentHex); assert.equal(o.dc.spiritual.value, tj.reflectingHex);
});

test('creation provenance is carried and checked: dice must reproduce the profile and the traits', () => {
  const creation = { soulRoll: { dice: [1, 1], rerolls: [2, 6, 3] }, traitRolls: { conscious: [1, 5], unconscious: [3, 4] }, rollCount: 1 };
  const s = session({ coreTraits: [T.coreTraits.find(t => t.hexagram === 5), T.coreTraits.find(t => t.hexagram === 20)], creation, soulPattern: T.soulProfiles[0] });
  const c = C.buildCharacter(s, { now: NOW }); assert.ok(C.validateCharacter(c).ok); assert.deepEqual(c.creation.soulRoll.rerolls, [2, 6, 3]);
  const bad = (mut, re) => { const x = JSON.parse(JSON.stringify(c)); mut(x); const v = C.validateCharacter(x); assert.ok(!v.ok, re); assert.match(v.errors.join('|'), re); };
  bad(x => { x.creation.soulRoll.dice[0] = 2; }, /first die must be kept/);
  bad(x => { x.creation.soulRoll.rerolls = []; }, /rerolls must happen exactly when/);
  bad(x => { x.creation.soulRoll.rerolls = [2, 3, 6]; }, /stated profile|rolling should have stopped/);
  bad(x => { x.creation.traitRolls.conscious = [2, 5]; }, /traitRolls\.conscious/);
});

test('missing pieces throw one error naming everything absent', () => {
  assert.throws(() => C.buildCharacter({}), /name.*conscious core trait.*unconscious core trait.*trajectory.*soul pattern.*attribute allocation.*lineage.*tribe/);
  assert.throws(() => C.buildCharacter(session({ ageBand: undefined })), /trajectory/);
  assert.throws(() => C.buildCharacter(session({ trajectory: { id: 1, ageBand: '36-50+' }, ageBand: '36-50+' })), /no valid hexagrams/);
});

test('VACUITY: the validator rejects each kind of tampering', () => {
  const good = () => JSON.parse(JSON.stringify(C.buildCharacter(session({ trajectory: T.trajectories[0] }), { now: NOW })));
  const bad = (mut, re) => { const c = good(); mut(c); const v = C.validateCharacter(c); assert.ok(!v.ok, re); assert.match(v.errors.join('|'), re); };
  assert.ok(C.validateCharacter(good()).ok);
  bad(c => { c.dc.physical.mode = c.dc.physical.mode === 'over' ? 'under' : 'over'; }, /mode/);
  bad(c => { c.dc.spiritual.value = 65; }, /dc\.spiritual/);
  bad(c => { c.dc.intellectual.value = (c.dc.intellectual.value % 64) + 1; c.dc.intellectual.mode = C.modeForDC(c.dc.intellectual.value); }, /intellectual must equal/);
  bad(c => { c.soul.profile = [3, 4]; }, /valid pairs/);
  bad(c => { c.dieTier = 100; }, /dieTier/);
  bad(c => { c.attributes.Will = 6; }, /attribute Will must be an integer 1-5/);
  bad(c => { c.allocation.spent += 1; }, /does not equal/);
  bad(c => { c.allocation.complete = true; }, /complete must be true/);
  bad(c => { c.version = 2; }, /version/);
  bad(c => { c.gender = 'x'; }, /gender/);
});

test('JSON and URL-fragment round trips are lossless; garbage fragments return null', () => {
  const c = C.buildCharacter(session({ name: 'Zöe “the Bold”' }), { now: NOW });
  const plain = JSON.parse(JSON.stringify(c));      // normalise away the other-realm prototypes of the vm-loaded data tables
  assert.deepEqual(JSON.parse(C.toJSONText(c)), plain);
  assert.deepEqual(C.fromFragment('#' + C.toFragment(c)), plain);
  assert.equal(C.fromFragment('#character=%%%'), null); assert.equal(C.fromFragment('#other=1'), null); assert.equal(C.fromFragment(''), null);
  assert.match(C.fileName(c), /^character-Z_e_the_Bold_\.json$/);
});

test('deterministic given a fixed id and clock; ids are generated when absent', () => {
  const a = C.buildCharacter(session(), { now: NOW }), b = C.buildCharacter(session(), { now: NOW });
  assert.deepEqual(a, b);
  const x = C.buildCharacter(session({ characterId: undefined }), { now: NOW }), y = C.buildCharacter(session({ characterId: undefined }), { now: NOW });
  assert.notEqual(x.id, y.id); assert.match(x.id, /^[0-9a-f]{32}$/);
});
