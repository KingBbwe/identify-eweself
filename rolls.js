/*
 * rolls.js — the creation dice, as pure functions of an injected rng (rng() returns a float in [0,1)).
 * Works from file:// (window.AuldEweRolls) and in Node.
 *
 * Documented rules (project corpus, "Character creation"):
 *  - Soul Pattern / Personality Profile: roll 2d6 and read it as a fraction (first/second). If it is not one of the twelve
 *    valid profiles, keep the FIRST die and re-roll the SECOND (1d6) until a valid pair appears.
 *  - Core Traits: a conscious and an unconscious trait, "determined through random rolls", 64 traits.
 *    The corpus gives no method. Ruled build: 2d8 per trait, read as (first - 1) * 8 + second, which is uniform 1-64.
 *  - Age bands (ruling 2026-11-27): "18-36" and "36-50+".
 */
(function (root) {
  'use strict';

  var VALID_PROFILES = [[1,3],[1,4],[2,4],[2,5],[3,5],[3,6],[4,6],[4,1],[5,1],[5,2],[6,2],[6,3]];   // = SentientHub validProfiles
  var AGE_BANDS = ['18-36', '36-50+'];
  var AGE_SPLIT = 36;           // ages 18-35 are the first band; 36 and over the second (the labels share the number 36)

  function die(rng, n) { return Math.floor(rng() * n) + 1; }
  function isValidPair(a, b) { return VALID_PROFILES.some(function (p) { return p[0] === a && p[1] === b; }); }

  // 2d6 -> profile. Returns the audit trail as well as the result, so the table can see exactly what happened.
  function rollProfile(rng) {
    var a = die(rng, 6), b = die(rng, 6), initial = [a, b], rerolls = [], guard = 0;
    while (!isValidPair(a, b)) {
      b = die(rng, 6); rerolls.push(b);
      if (++guard > 10000) throw new Error('profile roll did not converge');   // unreachable: every first die has two valid partners
    }
    return { profile: [a, b], profileId: a + '/' + b, dice: initial, rerolls: rerolls };
  }

  // 2d8 -> one core-trait hexagram, 1-64.
  function traitFromDice(x, y) { return (x - 1) * 8 + y; }
  function rollCoreTrait(rng) { var x = die(rng, 8), y = die(rng, 8); return { dice: [x, y], hexagram: traitFromDice(x, y) }; }

  function bandForAge(age) {
    if (typeof age !== 'number' || !(age >= 18) || age % 1) throw new RangeError('age must be a whole number, 18 or over');
    return age < AGE_SPLIT ? AGE_BANDS[0] : AGE_BANDS[1];
  }
  // Pick one entry (uniformly) from the trajectories of a band. Returns {index, entry}.
  function rollTrajectory(rng, table, band) {
    var pool = table.filter(function (t) { return t.ageBand === band; });
    if (!pool.length) throw new Error('no trajectories for band ' + band);
    var i = die(rng, pool.length) - 1;
    return { index: i, entry: pool[i] };
  }

  var api = { VALID_PROFILES: VALID_PROFILES, AGE_BANDS: AGE_BANDS, AGE_SPLIT: AGE_SPLIT, isValidPair: isValidPair,
              rollProfile: rollProfile, rollCoreTrait: rollCoreTrait, traitFromDice: traitFromDice, bandForAge: bandForAge, rollTrajectory: rollTrajectory };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AuldEweRolls = api;
})(typeof window !== 'undefined' ? window : globalThis);
