/*
 * tongues.js: the 20 Tongues of Auld Ewe, as data (source: "Triumph-Conflict-Disaster Breakdown for Tongues" table, 2026-11-27).
 * A Tongue is spoken by its Tribe; using it costs Tongue Power (TP). Master abilities are once per long rest, or once per day where marked.
 * The tp costs equal the powerCost already in index.html's tribe table (checked by tests); burnout and critical wording stay in index.html.
 *
 * FLAGGED: the document's Synergy column names four things that are not among the 20 Tongues: Power, Insight, Memory, Anger.
 * They are stored as written and reported by unresolvedSynergies(); the commander should say whether they are missing Tongues or aliases.
 * The document's Burnout rule says burnout ends "after long rests or successful Wisdom saves"; there is no Wisdom attribute, so only
 * the long rest is modelled.
 */
(function (root) {
  'use strict';
  var T = [
    ['Hope Tongue', 'Tribe of Lightbearers', 'Virtuous', 2, ['Courage Tongue', 'Joy Tongue', 'Unity Tongue'], "Dawn's Promise", 'Advantage on all party rolls once per long rest.', 'long rest'],
    ['Courage Tongue', 'Tribe of Flamekin', 'Virtuous', 3, ['Hope Tongue', 'Trust Tongue', 'Power'], 'Unyielding Heart', 'Negate fear effects for the party for 10 minutes.', 'long rest'],
    ['Joy Tongue', 'Tribe of Merrimakers', 'Virtuous', 2, ['Hope Tongue', 'Unity Tongue', 'Courage Tongue'], "Celebration's Embrace", 'Euphoric aura for 1 hour.', 'long rest'],
    ['Wisdom Tongue', 'Tribe of Seekers', 'Virtuous', 3, ['Insight', 'Memory', 'Spirit Tongue'], "Sage's Revelation", 'Instantly solve one complex puzzle.', 'long rest'],
    ['Unity Tongue', 'Tribe of Bridgebuilders', 'Virtuous', 3, ['Courage Tongue', 'Hope Tongue', 'Power'], 'Unite the Front', 'Party immune to fear and panic for 1 hour.', 'long rest'],
    ['Strength Tongue', 'Tribe of Titans', 'Virtuous', 2, ['Courage Tongue', 'Trust Tongue'], "Titan's Might", 'Grant allies +4 strength for 1 round.', 'long rest'],
    ['Healing Tongue', 'Tribe of Caretakers', 'Virtuous', 2, ['Hope Tongue', 'Courage Tongue'], 'Restore the Broken', 'Fully heal an ally and remove debuffs.', 'long rest'],
    ['Harmony Tongue', 'Tribe of Songweavers', 'Virtuous', 2, ['Joy Tongue', 'Unity Tongue'], "Melody's Embrace", 'Allies act freely without consequences for 1 round.', 'long rest'],
    ['Fury Tongue', 'Tribe of Stormbringers', 'Challenging', 3, ['Anger', 'Conflict Tongue'], "Rage's Call", 'Grant allies advantage on attacks for 1 round.', 'long rest'],
    ['Fear Tongue', 'Tribe of Dread', 'Challenging', 3, ['Conflict Tongue', 'Anger'], "Terror's Embrace", 'Incapacitate enemies in a 50ft radius.', 'long rest'],
    ['Deceit Tongue', 'Tribe of Veilwalkers', 'Challenging', 2, ['Fear Tongue', 'Conflict Tongue'], 'Master of Misdirection', 'Implant a false memory permanently.', 'long rest'],
    ['Conflict Tongue', 'Tribe of Ironclad', 'Challenging', 3, ['Fear Tongue', 'Anger'], "Strife's End", 'Force a ceasefire for 1 hour.', 'long rest'],
    ['Trust Tongue', 'Tribe of Ally', 'Neutral', 2, ['Hope Tongue', 'Courage Tongue'], 'Unbreakable Bond', 'Auto-succeed on an ally saving throw.', 'long rest'],
    ['Nature Tongue', 'Tribe of Rootkin', 'Neutral', 2, ['Wisdom Tongue', 'Memory'], 'Wild Call', 'Summon a powerful natural ally for 1 hour.', 'day'],
    ['Spirit Tongue', 'Tribe of Reverents', 'Neutral', 3, ['Insight', 'Trust Tongue'], "Soul's Harmony", 'Grant the party advantage on saving throws.', 'long rest'],
    ['Trade Tongue', 'Tribe of Coinbearers', 'Neutral', 2, ['Wisdom Tongue', 'Insight'], "Merchant's Wit", 'Secure favorable trades.', 'long rest'],
    ['Lament Tongue', 'Tribe of Griefkeepers', 'Neutral', 2, ['Memory'], "Keeper's Vigil", 'Strengthen allies with memories of lost loved ones.', 'day'],
    ['Riddle Tongue', 'Tribe of Puzzlers', 'Neutral', 2, ['Insight'], 'Puzzle Mastery', 'Solve any riddle instantly.', 'long rest'],
    ['Chaos Tongue', 'Tribe of Maelstroms', 'Challenging', 3, ['Anger'], "Maelstrom's Fury", 'Enemies act randomly for 1 round.', 'day'],
    ['Truth Tongue', 'Tribe of Oathkeepers', 'Virtuous', 3, ['Insight', 'Courage Tongue'], "Revelation's Edge", 'Expose any lie.', 'day']
  ];
  var TONGUES = T.map(function (r, i) {
    return { id: i + 1, name: r[0], tribe: r[1], resonance: r[2], tp: r[3], synergy: r[4], masterAbility: { name: r[5], text: r[6], resets: r[7] } };
  });
  var NAMES = TONGUES.map(function (t) { return t.name; });
  function find(name) { for (var i = 0; i < TONGUES.length; i++) { if (TONGUES[i].name === name) return TONGUES[i]; } return null; }
  function byTribe(tribe) { for (var i = 0; i < TONGUES.length; i++) { if (TONGUES[i].tribe === tribe) return TONGUES[i]; } return null; }
  function unresolvedSynergies() {
    var out = {};
    TONGUES.forEach(function (t) { t.synergy.forEach(function (s) { if (NAMES.indexOf(s) < 0) out[s] = true; }); });
    return Object.keys(out).sort();
  }
  var api = { TONGUES: TONGUES, NAMES: NAMES, find: find, byTribe: byTribe, unresolvedSynergies: unresolvedSynergies };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AuldEweTongues = api;
})(typeof self !== 'undefined' ? self : this);
