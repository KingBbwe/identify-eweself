/*
 * skills.js — the skills layer, as pure functions.
 *
 * Canon: a skill's modifier starts at -2, or at 0 if it was randomly assigned to the character at creation (character-creation
 * rules, section 5). The check formula adds the attribute modifier; this layer supplies the skill's.
 * The catalogue is the commander's canonical list (TCoAE_Character_Creation_Skills.docx, "Basic Skills List" and "Integration
 * with Attributes"): six domains, 34 groups, 111 skills. Every skill has an `attribute`. link 'canon' (36) is
 * the document's integration table (4 per attribute); link 'assigned' (75, plus Command) was filled in by the build on
 * 2026-11-27 at the commander's request, by the skill's plain meaning and its group. Reassigning one is a one-word change here.
 * source 'rules-text' marks two skills named in the creation rules (Artistry -> Inspiration, Command) but absent from the list.
 *
 * FLAGGED INTERPRETATIONS:
 *   - How many skills are "randomly assigned": ASSIGNED_COUNT = 3, distinct, uniform over the whole catalogue (not stated).
 *   - Where the integration table's parentheticals (Inspiration (Reason), Prowess (Charisma), Energy (Strength) ...) disagree
 *     with the skills they list, the attribute NAME governs and the parenthetical is ignored.
 *   - Invention and Defensive Magic appear in the table as skills, though they are also group headings; each is one skill here.
 *   - The document has no Internal/External split, so none is stored.
 *   - Acquired Skillsets (rules section 6: trained abilities, "linked to core internal skills", e.g. Emotional Reading and
 *     Rapport Building, both on the Emotion attribute) are built as a second, small catalogue. The rules name only those two,
 *     so only those two exist; linkedSkill is null until the commander says which core skill each hangs from. Nobody starts with
 *     one: they are earned in play. A held skillset is stored in Character.acquired as {name: 0}; one not held cannot be used.
 *     (SentientHub's progression, 5 Feats = Medal, 5 Medals = Acquired Skill, is the earning mechanism; not wired here.)
 * A Character stores only the assigned skills ({name: 0}); every other catalogue skill is implicitly DEFAULT (-2).
 */
(function (root) {
  'use strict';

  var DEFAULT = -2, ASSIGNED = 0, ASSIGNED_COUNT = 3;

  var CATALOGUE = [
    { name: 'Arcane Knowledge', domain: 'Magics', group: 'High Magic', attribute: 'Inspiration', source: 'canon-list', link: 'canon' },
    { name: 'Spellcasting Mastery', domain: 'Magics', group: 'High Magic', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Enchantment', domain: 'Magics', group: 'High Magic', attribute: 'Inspiration', source: 'canon-list', link: 'assigned' },
    { name: 'Alchemy', domain: 'Magics', group: 'Low Magic', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Herb Lore', domain: 'Magics', group: 'Low Magic', attribute: 'Intellect', source: 'canon-list', link: 'canon' },
    { name: 'Rituals', domain: 'Magics', group: 'Low Magic', attribute: 'SelfAwareness', source: 'canon-list', link: 'canon' },
    { name: 'Fire Manipulation', domain: 'Magics', group: 'Elemental Magic', attribute: 'Instinct', source: 'canon-list', link: 'canon' },
    { name: 'Water Control', domain: 'Magics', group: 'Elemental Magic', attribute: 'Emotion', source: 'canon-list', link: 'assigned' },
    { name: 'Earth Shaping', domain: 'Magics', group: 'Elemental Magic', attribute: 'Will', source: 'canon-list', link: 'assigned' },
    { name: 'Air Mastery', domain: 'Magics', group: 'Elemental Magic', attribute: 'Inspiration', source: 'canon-list', link: 'assigned' },
    { name: 'Illusion', domain: 'Magics', group: 'Ephemeral Magic', attribute: 'SelfAwareness', source: 'canon-list', link: 'canon' },
    { name: 'Shadow Weaving', domain: 'Magics', group: 'Ephemeral Magic', attribute: 'Instinct', source: 'canon-list', link: 'assigned' },
    { name: 'Dream Walking', domain: 'Magics', group: 'Ephemeral Magic', attribute: 'SelfAwareness', source: 'canon-list', link: 'assigned' },
    { name: 'Spirit Communication', domain: 'Magics', group: 'Ethereal Magic', attribute: 'SelfAwareness', source: 'canon-list', link: 'canon' },
    { name: 'Astral Projection', domain: 'Magics', group: 'Ethereal Magic', attribute: 'SelfAwareness', source: 'canon-list', link: 'assigned' },
    { name: 'Divination', domain: 'Magics', group: 'Ethereal Magic', attribute: 'Emotion', source: 'canon-list', link: 'canon' },
    { name: 'Offensive Spells', domain: 'Magics', group: 'Combative Magic', attribute: 'Energy', source: 'canon-list', link: 'canon' },
    { name: 'Magical Weaponry', domain: 'Magics', group: 'Combative Magic', attribute: 'Prowess', source: 'canon-list', link: 'assigned' },
    { name: 'Battle Runes', domain: 'Magics', group: 'Combative Magic', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Fireballs', domain: 'Magics', group: 'Combative Magic', attribute: 'Energy', source: 'canon-list', link: 'assigned' },
    { name: 'Lightning Bolts', domain: 'Magics', group: 'Combative Magic', attribute: 'Energy', source: 'canon-list', link: 'assigned' },
    { name: 'Ice Shards', domain: 'Magics', group: 'Combative Magic', attribute: 'Prowess', source: 'canon-list', link: 'assigned' },
    { name: 'Shielding', domain: 'Magics', group: 'Defensive Magic', attribute: 'Drive', source: 'canon-list', link: 'canon' },
    { name: 'Warding', domain: 'Magics', group: 'Defensive Magic', attribute: 'Will', source: 'canon-list', link: 'assigned' },
    { name: 'Healing', domain: 'Magics', group: 'Defensive Magic', attribute: 'Emotion', source: 'canon-list', link: 'assigned' },
    { name: 'Aetheric Attunement', domain: 'Magics', group: 'Vimana Magic', attribute: 'SelfAwareness', source: 'canon-list', link: 'canon' },
    { name: 'Tantric Energy Channeling', domain: 'Magics', group: 'Vimana Magic', attribute: 'Will', source: 'canon-list', link: 'canon' },
    { name: 'Crystalline Resonance', domain: 'Magics', group: 'Vimana Magic', attribute: 'Emotion', source: 'canon-list', link: 'assigned' },
    { name: 'Gadgetry', domain: 'Technologies', group: 'Personal Tech', attribute: 'Instinct', source: 'canon-list', link: 'canon' },
    { name: 'Tinkering', domain: 'Technologies', group: 'Personal Tech', attribute: 'Prowess', source: 'canon-list', link: 'assigned' },
    { name: 'Personal Defense Systems', domain: 'Technologies', group: 'Personal Tech', attribute: 'Instinct', source: 'canon-list', link: 'assigned' },
    { name: 'Infrastructure Engineering', domain: 'Technologies', group: 'Communal Tech', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Public Works', domain: 'Technologies', group: 'Communal Tech', attribute: 'Inspiration', source: 'canon-list', link: 'canon' },
    { name: 'Urban Planning', domain: 'Technologies', group: 'Communal Tech', attribute: 'Inspiration', source: 'canon-list', link: 'assigned' },
    { name: 'Energy Harnessing', domain: 'Technologies', group: 'Magnelectric Tech', attribute: 'Intellect', source: 'canon-list', link: 'canon' },
    { name: 'Electric Manipulation', domain: 'Technologies', group: 'Magnelectric Tech', attribute: 'Energy', source: 'canon-list', link: 'assigned' },
    { name: 'Magnetic Fields', domain: 'Technologies', group: 'Magnelectric Tech', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Communal Networks', domain: 'Technologies', group: 'Collective Tech', attribute: 'Emotion', source: 'canon-list', link: 'assigned' },
    { name: 'Cooperative Mechanics', domain: 'Technologies', group: 'Collective Tech', attribute: 'Drive', source: 'canon-list', link: 'canon' },
    { name: 'Shared Innovations', domain: 'Technologies', group: 'Collective Tech', attribute: 'Inspiration', source: 'canon-list', link: 'assigned' },
    { name: 'Creativity in Engineering', domain: 'Technologies', group: 'Invention', attribute: 'Inspiration', source: 'canon-list', link: 'assigned' },
    { name: 'Prototype Development', domain: 'Technologies', group: 'Invention', attribute: 'Drive', source: 'canon-list', link: 'assigned' },
    { name: 'Innovative Design', domain: 'Technologies', group: 'Invention', attribute: 'Inspiration', source: 'canon-list', link: 'assigned' },
    { name: 'Machinery Control', domain: 'Technologies', group: 'Manipulation', attribute: 'Energy', source: 'canon-list', link: 'canon' },
    { name: 'Mechanical Precision', domain: 'Technologies', group: 'Manipulation', attribute: 'Prowess', source: 'canon-list', link: 'assigned' },
    { name: 'Tech Adaptation', domain: 'Technologies', group: 'Manipulation', attribute: 'Instinct', source: 'canon-list', link: 'assigned' },
    { name: 'Crystalline Engine Maintenance', domain: 'Technologies', group: 'Vimana Tech', attribute: 'Energy', source: 'canon-list', link: 'canon' },
    { name: 'Runic Circuit Design', domain: 'Technologies', group: 'Vimana Tech', attribute: 'Intellect', source: 'canon-list', link: 'canon' },
    { name: 'Etheric Crystal Tuning', domain: 'Technologies', group: 'Vimana Tech', attribute: 'SelfAwareness', source: 'canon-list', link: 'assigned' },
    { name: 'Magnetric Engine Operation', domain: 'Technologies', group: 'Ship Tech', attribute: 'Drive', source: 'canon-list', link: 'canon' },
    { name: 'Teleportation Deck Programming', domain: 'Technologies', group: 'Ship Tech', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Cosmoport Systems', domain: 'Technologies', group: 'Ship Tech', attribute: 'Drive', source: 'canon-list', link: 'assigned' },
    { name: 'Sacred Geometry Application', domain: 'Technologies', group: 'Starfort Tech', attribute: 'Inspiration', source: 'canon-list', link: 'canon' },
    { name: 'Vibrational Frequency Manipulation', domain: 'Technologies', group: 'Starfort Tech', attribute: 'Emotion', source: 'canon-list', link: 'canon' },
    { name: 'Cymatic Engineering', domain: 'Technologies', group: 'Starfort Tech', attribute: 'Inspiration', source: 'canon-list', link: 'assigned' },
    { name: 'Negotiation', domain: 'Social Skills', group: 'Persuasion', attribute: 'Intellect', source: 'canon-list', link: 'canon' },
    { name: 'Diplomacy', domain: 'Social Skills', group: 'Persuasion', attribute: 'Emotion', source: 'canon-list', link: 'assigned' },
    { name: 'Influence', domain: 'Social Skills', group: 'Persuasion', attribute: 'Prowess', source: 'canon-list', link: 'assigned' },
    { name: 'Leadership', domain: 'Social Skills', group: 'Conviction', attribute: 'Prowess', source: 'canon-list', link: 'canon' },
    { name: 'Rallying', domain: 'Social Skills', group: 'Conviction', attribute: 'Drive', source: 'canon-list', link: 'assigned' },
    { name: 'Inspirational Speaking', domain: 'Social Skills', group: 'Conviction', attribute: 'Inspiration', source: 'canon-list', link: 'assigned' },
    { name: 'Charm', domain: 'Social Skills', group: 'Cordiality', attribute: 'Prowess', source: 'canon-list', link: 'canon' },
    { name: 'Etiquette', domain: 'Social Skills', group: 'Cordiality', attribute: 'SelfAwareness', source: 'canon-list', link: 'assigned' },
    { name: 'Cultural Awareness', domain: 'Social Skills', group: 'Cordiality', attribute: 'Emotion', source: 'canon-list', link: 'assigned' },
    { name: 'Protocol', domain: 'Etiquette', group: 'Courtly Manners', attribute: 'Inspiration', source: 'canon-list', link: 'canon' },
    { name: 'Noble Interaction', domain: 'Etiquette', group: 'Courtly Manners', attribute: 'Prowess', source: 'canon-list', link: 'assigned' },
    { name: 'Poise', domain: 'Etiquette', group: 'Courtly Manners', attribute: 'SelfAwareness', source: 'canon-list', link: 'assigned' },
    { name: 'Urban Etiquette', domain: 'Etiquette', group: 'Streetwise', attribute: 'Instinct', source: 'canon-list', link: 'canon' },
    { name: 'Underworld Connections', domain: 'Etiquette', group: 'Streetwise', attribute: 'Drive', source: 'canon-list', link: 'assigned' },
    { name: 'Survival Tactics', domain: 'Etiquette', group: 'Streetwise', attribute: 'Instinct', source: 'canon-list', link: 'assigned' },
    { name: 'Trade Customs', domain: 'Etiquette', group: 'Merchant', attribute: 'Prowess', source: 'canon-list', link: 'canon' },
    { name: 'Marketplace Manners', domain: 'Etiquette', group: 'Merchant', attribute: 'Emotion', source: 'canon-list', link: 'assigned' },
    { name: 'Bargaining Etiquette', domain: 'Etiquette', group: 'Merchant', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Spiritual Alignment Protocols', domain: 'Etiquette', group: 'Vimana Etiquette', attribute: 'SelfAwareness', source: 'canon-list', link: 'assigned' },
    { name: 'Interstellar Diplomacy', domain: 'Etiquette', group: 'Vimana Etiquette', attribute: 'Prowess', source: 'canon-list', link: 'canon' },
    { name: 'Cosmic Navigation Customs', domain: 'Etiquette', group: 'Vimana Etiquette', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Price Setting', domain: 'Haggling', group: 'Trade Negotiation', attribute: 'Drive', source: 'canon-list', link: 'canon' },
    { name: 'Value Assessment', domain: 'Haggling', group: 'Trade Negotiation', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Deal Making', domain: 'Haggling', group: 'Trade Negotiation', attribute: 'Prowess', source: 'canon-list', link: 'assigned' },
    { name: 'Exchange Skills', domain: 'Haggling', group: 'Bartering', attribute: 'Energy', source: 'canon-list', link: 'canon' },
    { name: 'Trade Fair', domain: 'Haggling', group: 'Bartering', attribute: 'Energy', source: 'canon-list', link: 'assigned' },
    { name: 'Swap Meet Savvy', domain: 'Haggling', group: 'Bartering', attribute: 'Instinct', source: 'canon-list', link: 'assigned' },
    { name: 'Economic Trends', domain: 'Haggling', group: 'Market Awareness', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Supply and Demand', domain: 'Haggling', group: 'Market Awareness', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Market Knowledge', domain: 'Haggling', group: 'Market Awareness', attribute: 'Instinct', source: 'canon-list', link: 'assigned' },
    { name: 'Weapon Proficiency', domain: 'Combat Skills', group: 'Weapon Proficiency', attribute: 'Prowess', source: 'canon-list', link: 'assigned' },
    { name: 'Swordsmanship', domain: 'Combat Skills', group: 'Offensive Techniques', attribute: 'Prowess', source: 'canon-list', link: 'assigned' },
    { name: 'Archery', domain: 'Combat Skills', group: 'Offensive Techniques', attribute: 'Instinct', source: 'canon-list', link: 'assigned' },
    { name: 'Dagger Fighting', domain: 'Combat Skills', group: 'Offensive Techniques', attribute: 'Instinct', source: 'canon-list', link: 'assigned' },
    { name: 'Staff Combat', domain: 'Combat Skills', group: 'Offensive Techniques', attribute: 'Energy', source: 'canon-list', link: 'assigned' },
    { name: 'Shield Use', domain: 'Combat Skills', group: 'Defensive Techniques', attribute: 'Will', source: 'canon-list', link: 'assigned' },
    { name: 'Parrying', domain: 'Combat Skills', group: 'Defensive Techniques', attribute: 'Instinct', source: 'canon-list', link: 'assigned' },
    { name: 'Dodging', domain: 'Combat Skills', group: 'Defensive Techniques', attribute: 'Instinct', source: 'canon-list', link: 'assigned' },
    { name: 'Armor Utilization', domain: 'Combat Skills', group: 'Defensive Techniques', attribute: 'Will', source: 'canon-list', link: 'assigned' },
    { name: 'Hand-to-Hand Combat', domain: 'Combat Skills', group: 'Martial Arts', attribute: 'Energy', source: 'canon-list', link: 'assigned' },
    { name: 'Grappling', domain: 'Combat Skills', group: 'Martial Arts', attribute: 'Energy', source: 'canon-list', link: 'assigned' },
    { name: 'Kicking Techniques', domain: 'Combat Skills', group: 'Martial Arts', attribute: 'Prowess', source: 'canon-list', link: 'assigned' },
    { name: 'Strategy Formulation', domain: 'Combat Skills', group: 'Battle Tactics', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Flanking Maneuvers', domain: 'Combat Skills', group: 'Battle Tactics', attribute: 'Drive', source: 'canon-list', link: 'assigned' },
    { name: 'Battlefield Awareness', domain: 'Combat Skills', group: 'Battle Tactics', attribute: 'Emotion', source: 'canon-list', link: 'assigned' },
    { name: 'Power Strikes', domain: 'Combat Skills', group: 'Special Attacks', attribute: 'Energy', source: 'canon-list', link: 'assigned' },
    { name: 'Precise Shots', domain: 'Combat Skills', group: 'Special Attacks', attribute: 'Prowess', source: 'canon-list', link: 'assigned' },
    { name: 'Critical Hits', domain: 'Combat Skills', group: 'Special Attacks', attribute: 'Instinct', source: 'canon-list', link: 'assigned' },
    { name: 'Aerial Maneuvers', domain: 'Combat Skills', group: 'Vimana Combat', attribute: 'Instinct', source: 'canon-list', link: 'canon' },
    { name: 'Etheric Weapon Systems', domain: 'Combat Skills', group: 'Vimana Combat', attribute: 'Intellect', source: 'canon-list', link: 'assigned' },
    { name: 'Interdimensional Tactics', domain: 'Combat Skills', group: 'Vimana Combat', attribute: 'Inspiration', source: 'canon-list', link: 'assigned' },
    { name: 'Streetwise', domain: 'Etiquette', group: 'Streetwise', attribute: 'Emotion', source: 'canon-list', link: 'canon' },
    { name: 'Market Awareness', domain: 'Haggling', group: 'Market Awareness', attribute: 'Emotion', source: 'canon-list', link: 'canon' },
    { name: 'Defensive Magic', domain: 'Magics', group: 'Defensive Magic', attribute: 'Will', source: 'canon-list', link: 'canon' },
    { name: 'Invention', domain: 'Technologies', group: 'Invention', attribute: 'Will', source: 'canon-list', link: 'canon' },
    { name: 'Bartering', domain: 'Haggling', group: 'Bartering', attribute: 'Will', source: 'canon-list', link: 'canon' },
    { name: 'Artistry', domain: null, group: null, attribute: 'Inspiration', source: 'rules-text', link: 'rules-text' },
    { name: 'Command', domain: null, group: null, attribute: 'Drive', source: 'rules-text', link: 'assigned' }
  ];
  var ACQUIRED = [
    { name: 'Emotional Reading', attribute: 'Emotion', linkedSkill: null, source: 'rules-text' },
    { name: 'Rapport Building',  attribute: 'Emotion', linkedSkill: null, source: 'rules-text' }
  ];
  var ACQUIRED_NAMES = ACQUIRED.map(function (a) { return a.name; });
  var NAMES = CATALOGUE.map(function (s) { return s.name; });

  function find(name) { for (var i = 0; i < CATALOGUE.length; i++) if (CATALOGUE[i].name === name) return CATALOGUE[i]; return null; }

  function findAcquired(name) { for (var i = 0; i < ACQUIRED.length; i++) if (ACQUIRED[i].name === name) return ACQUIRED[i]; return null; }

  /** Grants an Acquired Skillset (immutably). Unknown names throw; granting one already held is a no-op. */
  function acquire(held, name) {
    if (!findAcquired(name)) throw new RangeError('unknown acquired skillset: ' + name);
    var out = {}; Object.keys(held || {}).forEach(function (k) { out[k] = held[k]; });
    if (!Object.prototype.hasOwnProperty.call(out, name)) out[name] = ASSIGNED;
    return out;
  }

  /** Modifier for a held Acquired Skillset; null if the character does not hold it (it cannot be used). */
  function acquiredModifier(held, name) {
    if (!findAcquired(name)) throw new RangeError('unknown acquired skillset: ' + name);
    return held && Object.prototype.hasOwnProperty.call(held, name) ? held[name] : null;
  }

  function acquiredProblems(held) {
    var e = [];
    if (!held || typeof held !== 'object' || Array.isArray(held)) return ['acquired must be an object'];
    Object.keys(held).forEach(function (k) {
      if (!findAcquired(k)) e.push('unknown acquired skillset: ' + k);
      else if (typeof held[k] !== 'number' || held[k] % 1 || held[k] < ASSIGNED) e.push('acquired skillset ' + k + ' must be an integer of at least ' + ASSIGNED);
    });
    return e;
  }

  /** rng() in [0,1). Returns {skills:{name:0,...}, picks:[names in the order drawn]}: distinct, uniform (partial Fisher-Yates). */
  function rollAssigned(rng, count) {
    var n = count == null ? ASSIGNED_COUNT : count;
    if (n % 1 || n < 0 || n > NAMES.length) throw new RangeError('count must be an integer 0-' + NAMES.length);
    var pool = NAMES.slice(), picks = [], skills = {};
    for (var i = 0; i < n; i++) {
      var j = Math.min(pool.length - 1, Math.floor(rng() * pool.length));
      var name = pool.splice(j, 1)[0];
      picks.push(name); skills[name] = ASSIGNED;
    }
    return { skills: skills, picks: picks };
  }

  /** Modifier for a catalogue skill given a Character's stored skills. Unknown skill names throw. */
  function modifier(skills, name) {
    if (!find(name)) throw new RangeError('unknown skill: ' + name);
    return skills && Object.prototype.hasOwnProperty.call(skills, name) ? skills[name] : DEFAULT;
  }

  /** Problems with a stored skills object (empty array = valid). */
  function problems(skills) {
    var e = [];
    if (!skills || typeof skills !== 'object' || Array.isArray(skills)) return ['skills must be an object'];
    Object.keys(skills).forEach(function (k) {
      if (!find(k)) e.push('unknown skill: ' + k);
      else if (typeof skills[k] !== 'number' || skills[k] % 1 || skills[k] < DEFAULT) e.push('skill ' + k + ' must be an integer of at least ' + DEFAULT);
    });
    return e;
  }

  var api = { DEFAULT: DEFAULT, ASSIGNED: ASSIGNED, ASSIGNED_COUNT: ASSIGNED_COUNT, CATALOGUE: CATALOGUE, NAMES: NAMES,
              ACQUIRED: ACQUIRED, ACQUIRED_NAMES: ACQUIRED_NAMES, findAcquired: findAcquired, acquire: acquire, acquiredModifier: acquiredModifier, acquiredProblems: acquiredProblems,
              find: find, rollAssigned: rollAssigned, modifier: modifier, problems: problems };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AuldEweSkills = api;
})(typeof window !== 'undefined' ? window : this);
