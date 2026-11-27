/*
 * skills.js — the skills layer, as pure functions.
 *
 * Canon: a skill's modifier starts at -2, or at 0 if it was randomly assigned to the character at creation (character-creation
 * rules, section 5). The check formula adds the attribute modifier; this layer supplies the skill's.
 * The catalogue is the commander's canonical list (TCoAE_Character_Creation_Skills.docx, "Basic Skills List" and "Integration
 * with Attributes"): six domains, 34 groups, 111 skills. `attribute` is set only where the document's integration table links
 * the skill (4 per attribute, 36 in all); the other 75 are canonical skills with no stated attribute, so it is null.
 * source 'rules-text' marks two skills named in the creation rules (Artistry -> Inspiration, Command) but absent from the list.
 *
 * FLAGGED INTERPRETATIONS:
 *   - How many skills are "randomly assigned": ASSIGNED_COUNT = 3, distinct, uniform over the whole catalogue (not stated).
 *   - Where the integration table's parentheticals (Inspiration (Reason), Prowess (Charisma), Energy (Strength) ...) disagree
 *     with the skills they list, the attribute NAME governs and the parenthetical is ignored.
 *   - Invention and Defensive Magic appear in the table as skills, though they are also group headings; each is one skill here.
 *   - The document has no Internal/External split, so none is stored.
 *   - Acquired Skillsets (trained: Emotional Reading, Rapport Building) are NOT built.
 * A Character stores only the assigned skills ({name: 0}); every other catalogue skill is implicitly DEFAULT (-2).
 */
(function (root) {
  'use strict';

  var DEFAULT = -2, ASSIGNED = 0, ASSIGNED_COUNT = 3;

  var CATALOGUE = [
    { name: 'Arcane Knowledge', domain: 'Magics', group: 'High Magic', attribute: 'Inspiration', source: 'canon-list' },
    { name: 'Spellcasting Mastery', domain: 'Magics', group: 'High Magic', attribute: null, source: 'canon-list' },
    { name: 'Enchantment', domain: 'Magics', group: 'High Magic', attribute: null, source: 'canon-list' },
    { name: 'Alchemy', domain: 'Magics', group: 'Low Magic', attribute: null, source: 'canon-list' },
    { name: 'Herb Lore', domain: 'Magics', group: 'Low Magic', attribute: 'Intellect', source: 'canon-list' },
    { name: 'Rituals', domain: 'Magics', group: 'Low Magic', attribute: 'SelfAwareness', source: 'canon-list' },
    { name: 'Fire Manipulation', domain: 'Magics', group: 'Elemental Magic', attribute: 'Instinct', source: 'canon-list' },
    { name: 'Water Control', domain: 'Magics', group: 'Elemental Magic', attribute: null, source: 'canon-list' },
    { name: 'Earth Shaping', domain: 'Magics', group: 'Elemental Magic', attribute: null, source: 'canon-list' },
    { name: 'Air Mastery', domain: 'Magics', group: 'Elemental Magic', attribute: null, source: 'canon-list' },
    { name: 'Illusion', domain: 'Magics', group: 'Ephemeral Magic', attribute: 'SelfAwareness', source: 'canon-list' },
    { name: 'Shadow Weaving', domain: 'Magics', group: 'Ephemeral Magic', attribute: null, source: 'canon-list' },
    { name: 'Dream Walking', domain: 'Magics', group: 'Ephemeral Magic', attribute: null, source: 'canon-list' },
    { name: 'Spirit Communication', domain: 'Magics', group: 'Ethereal Magic', attribute: 'SelfAwareness', source: 'canon-list' },
    { name: 'Astral Projection', domain: 'Magics', group: 'Ethereal Magic', attribute: null, source: 'canon-list' },
    { name: 'Divination', domain: 'Magics', group: 'Ethereal Magic', attribute: 'Emotion', source: 'canon-list' },
    { name: 'Offensive Spells', domain: 'Magics', group: 'Combative Magic', attribute: 'Energy', source: 'canon-list' },
    { name: 'Magical Weaponry', domain: 'Magics', group: 'Combative Magic', attribute: null, source: 'canon-list' },
    { name: 'Battle Runes', domain: 'Magics', group: 'Combative Magic', attribute: null, source: 'canon-list' },
    { name: 'Fireballs', domain: 'Magics', group: 'Combative Magic', attribute: null, source: 'canon-list' },
    { name: 'Lightning Bolts', domain: 'Magics', group: 'Combative Magic', attribute: null, source: 'canon-list' },
    { name: 'Ice Shards', domain: 'Magics', group: 'Combative Magic', attribute: null, source: 'canon-list' },
    { name: 'Shielding', domain: 'Magics', group: 'Defensive Magic', attribute: 'Drive', source: 'canon-list' },
    { name: 'Warding', domain: 'Magics', group: 'Defensive Magic', attribute: null, source: 'canon-list' },
    { name: 'Healing', domain: 'Magics', group: 'Defensive Magic', attribute: null, source: 'canon-list' },
    { name: 'Aetheric Attunement', domain: 'Magics', group: 'Vimana Magic', attribute: 'SelfAwareness', source: 'canon-list' },
    { name: 'Tantric Energy Channeling', domain: 'Magics', group: 'Vimana Magic', attribute: 'Will', source: 'canon-list' },
    { name: 'Crystalline Resonance', domain: 'Magics', group: 'Vimana Magic', attribute: null, source: 'canon-list' },
    { name: 'Gadgetry', domain: 'Technologies', group: 'Personal Tech', attribute: 'Instinct', source: 'canon-list' },
    { name: 'Tinkering', domain: 'Technologies', group: 'Personal Tech', attribute: null, source: 'canon-list' },
    { name: 'Personal Defense Systems', domain: 'Technologies', group: 'Personal Tech', attribute: null, source: 'canon-list' },
    { name: 'Infrastructure Engineering', domain: 'Technologies', group: 'Communal Tech', attribute: null, source: 'canon-list' },
    { name: 'Public Works', domain: 'Technologies', group: 'Communal Tech', attribute: 'Inspiration', source: 'canon-list' },
    { name: 'Urban Planning', domain: 'Technologies', group: 'Communal Tech', attribute: null, source: 'canon-list' },
    { name: 'Energy Harnessing', domain: 'Technologies', group: 'Magnelectric Tech', attribute: 'Intellect', source: 'canon-list' },
    { name: 'Electric Manipulation', domain: 'Technologies', group: 'Magnelectric Tech', attribute: null, source: 'canon-list' },
    { name: 'Magnetic Fields', domain: 'Technologies', group: 'Magnelectric Tech', attribute: null, source: 'canon-list' },
    { name: 'Communal Networks', domain: 'Technologies', group: 'Collective Tech', attribute: null, source: 'canon-list' },
    { name: 'Cooperative Mechanics', domain: 'Technologies', group: 'Collective Tech', attribute: 'Drive', source: 'canon-list' },
    { name: 'Shared Innovations', domain: 'Technologies', group: 'Collective Tech', attribute: null, source: 'canon-list' },
    { name: 'Creativity in Engineering', domain: 'Technologies', group: 'Invention', attribute: null, source: 'canon-list' },
    { name: 'Prototype Development', domain: 'Technologies', group: 'Invention', attribute: null, source: 'canon-list' },
    { name: 'Innovative Design', domain: 'Technologies', group: 'Invention', attribute: null, source: 'canon-list' },
    { name: 'Machinery Control', domain: 'Technologies', group: 'Manipulation', attribute: 'Energy', source: 'canon-list' },
    { name: 'Mechanical Precision', domain: 'Technologies', group: 'Manipulation', attribute: null, source: 'canon-list' },
    { name: 'Tech Adaptation', domain: 'Technologies', group: 'Manipulation', attribute: null, source: 'canon-list' },
    { name: 'Crystalline Engine Maintenance', domain: 'Technologies', group: 'Vimana Tech', attribute: 'Energy', source: 'canon-list' },
    { name: 'Runic Circuit Design', domain: 'Technologies', group: 'Vimana Tech', attribute: 'Intellect', source: 'canon-list' },
    { name: 'Etheric Crystal Tuning', domain: 'Technologies', group: 'Vimana Tech', attribute: null, source: 'canon-list' },
    { name: 'Magnetric Engine Operation', domain: 'Technologies', group: 'Ship Tech', attribute: 'Drive', source: 'canon-list' },
    { name: 'Teleportation Deck Programming', domain: 'Technologies', group: 'Ship Tech', attribute: null, source: 'canon-list' },
    { name: 'Cosmoport Systems', domain: 'Technologies', group: 'Ship Tech', attribute: null, source: 'canon-list' },
    { name: 'Sacred Geometry Application', domain: 'Technologies', group: 'Starfort Tech', attribute: 'Inspiration', source: 'canon-list' },
    { name: 'Vibrational Frequency Manipulation', domain: 'Technologies', group: 'Starfort Tech', attribute: 'Emotion', source: 'canon-list' },
    { name: 'Cymatic Engineering', domain: 'Technologies', group: 'Starfort Tech', attribute: null, source: 'canon-list' },
    { name: 'Negotiation', domain: 'Social Skills', group: 'Persuasion', attribute: 'Intellect', source: 'canon-list' },
    { name: 'Diplomacy', domain: 'Social Skills', group: 'Persuasion', attribute: null, source: 'canon-list' },
    { name: 'Influence', domain: 'Social Skills', group: 'Persuasion', attribute: null, source: 'canon-list' },
    { name: 'Leadership', domain: 'Social Skills', group: 'Conviction', attribute: 'Prowess', source: 'canon-list' },
    { name: 'Rallying', domain: 'Social Skills', group: 'Conviction', attribute: null, source: 'canon-list' },
    { name: 'Inspirational Speaking', domain: 'Social Skills', group: 'Conviction', attribute: null, source: 'canon-list' },
    { name: 'Charm', domain: 'Social Skills', group: 'Cordiality', attribute: 'Prowess', source: 'canon-list' },
    { name: 'Etiquette', domain: 'Social Skills', group: 'Cordiality', attribute: null, source: 'canon-list' },
    { name: 'Cultural Awareness', domain: 'Social Skills', group: 'Cordiality', attribute: null, source: 'canon-list' },
    { name: 'Protocol', domain: 'Etiquette', group: 'Courtly Manners', attribute: 'Inspiration', source: 'canon-list' },
    { name: 'Noble Interaction', domain: 'Etiquette', group: 'Courtly Manners', attribute: null, source: 'canon-list' },
    { name: 'Poise', domain: 'Etiquette', group: 'Courtly Manners', attribute: null, source: 'canon-list' },
    { name: 'Urban Etiquette', domain: 'Etiquette', group: 'Streetwise', attribute: 'Instinct', source: 'canon-list' },
    { name: 'Underworld Connections', domain: 'Etiquette', group: 'Streetwise', attribute: null, source: 'canon-list' },
    { name: 'Survival Tactics', domain: 'Etiquette', group: 'Streetwise', attribute: null, source: 'canon-list' },
    { name: 'Trade Customs', domain: 'Etiquette', group: 'Merchant', attribute: 'Prowess', source: 'canon-list' },
    { name: 'Marketplace Manners', domain: 'Etiquette', group: 'Merchant', attribute: null, source: 'canon-list' },
    { name: 'Bargaining Etiquette', domain: 'Etiquette', group: 'Merchant', attribute: null, source: 'canon-list' },
    { name: 'Spiritual Alignment Protocols', domain: 'Etiquette', group: 'Vimana Etiquette', attribute: null, source: 'canon-list' },
    { name: 'Interstellar Diplomacy', domain: 'Etiquette', group: 'Vimana Etiquette', attribute: 'Prowess', source: 'canon-list' },
    { name: 'Cosmic Navigation Customs', domain: 'Etiquette', group: 'Vimana Etiquette', attribute: null, source: 'canon-list' },
    { name: 'Price Setting', domain: 'Haggling', group: 'Trade Negotiation', attribute: 'Drive', source: 'canon-list' },
    { name: 'Value Assessment', domain: 'Haggling', group: 'Trade Negotiation', attribute: null, source: 'canon-list' },
    { name: 'Deal Making', domain: 'Haggling', group: 'Trade Negotiation', attribute: null, source: 'canon-list' },
    { name: 'Exchange Skills', domain: 'Haggling', group: 'Bartering', attribute: 'Energy', source: 'canon-list' },
    { name: 'Trade Fair', domain: 'Haggling', group: 'Bartering', attribute: null, source: 'canon-list' },
    { name: 'Swap Meet Savvy', domain: 'Haggling', group: 'Bartering', attribute: null, source: 'canon-list' },
    { name: 'Economic Trends', domain: 'Haggling', group: 'Market Awareness', attribute: null, source: 'canon-list' },
    { name: 'Supply and Demand', domain: 'Haggling', group: 'Market Awareness', attribute: null, source: 'canon-list' },
    { name: 'Market Knowledge', domain: 'Haggling', group: 'Market Awareness', attribute: null, source: 'canon-list' },
    { name: 'Weapon Proficiency', domain: 'Combat Skills', group: 'Weapon Proficiency', attribute: null, source: 'canon-list' },
    { name: 'Swordsmanship', domain: 'Combat Skills', group: 'Offensive Techniques', attribute: null, source: 'canon-list' },
    { name: 'Archery', domain: 'Combat Skills', group: 'Offensive Techniques', attribute: null, source: 'canon-list' },
    { name: 'Dagger Fighting', domain: 'Combat Skills', group: 'Offensive Techniques', attribute: null, source: 'canon-list' },
    { name: 'Staff Combat', domain: 'Combat Skills', group: 'Offensive Techniques', attribute: null, source: 'canon-list' },
    { name: 'Shield Use', domain: 'Combat Skills', group: 'Defensive Techniques', attribute: null, source: 'canon-list' },
    { name: 'Parrying', domain: 'Combat Skills', group: 'Defensive Techniques', attribute: null, source: 'canon-list' },
    { name: 'Dodging', domain: 'Combat Skills', group: 'Defensive Techniques', attribute: null, source: 'canon-list' },
    { name: 'Armor Utilization', domain: 'Combat Skills', group: 'Defensive Techniques', attribute: null, source: 'canon-list' },
    { name: 'Hand-to-Hand Combat', domain: 'Combat Skills', group: 'Martial Arts', attribute: null, source: 'canon-list' },
    { name: 'Grappling', domain: 'Combat Skills', group: 'Martial Arts', attribute: null, source: 'canon-list' },
    { name: 'Kicking Techniques', domain: 'Combat Skills', group: 'Martial Arts', attribute: null, source: 'canon-list' },
    { name: 'Strategy Formulation', domain: 'Combat Skills', group: 'Battle Tactics', attribute: null, source: 'canon-list' },
    { name: 'Flanking Maneuvers', domain: 'Combat Skills', group: 'Battle Tactics', attribute: null, source: 'canon-list' },
    { name: 'Battlefield Awareness', domain: 'Combat Skills', group: 'Battle Tactics', attribute: null, source: 'canon-list' },
    { name: 'Power Strikes', domain: 'Combat Skills', group: 'Special Attacks', attribute: null, source: 'canon-list' },
    { name: 'Precise Shots', domain: 'Combat Skills', group: 'Special Attacks', attribute: null, source: 'canon-list' },
    { name: 'Critical Hits', domain: 'Combat Skills', group: 'Special Attacks', attribute: null, source: 'canon-list' },
    { name: 'Aerial Maneuvers', domain: 'Combat Skills', group: 'Vimana Combat', attribute: 'Instinct', source: 'canon-list' },
    { name: 'Etheric Weapon Systems', domain: 'Combat Skills', group: 'Vimana Combat', attribute: null, source: 'canon-list' },
    { name: 'Interdimensional Tactics', domain: 'Combat Skills', group: 'Vimana Combat', attribute: null, source: 'canon-list' },
    { name: 'Streetwise', domain: 'Etiquette', group: 'Streetwise', attribute: 'Emotion', source: 'canon-list' },
    { name: 'Market Awareness', domain: 'Haggling', group: 'Market Awareness', attribute: 'Emotion', source: 'canon-list' },
    { name: 'Defensive Magic', domain: 'Magics', group: 'Defensive Magic', attribute: 'Will', source: 'canon-list' },
    { name: 'Invention', domain: 'Technologies', group: 'Invention', attribute: 'Will', source: 'canon-list' },
    { name: 'Bartering', domain: 'Haggling', group: 'Bartering', attribute: 'Will', source: 'canon-list' },
    { name: 'Artistry', domain: null, group: null, attribute: 'Inspiration', source: 'rules-text' },
    { name: 'Command', domain: null, group: null, attribute: null, source: 'rules-text' }
  ];
  var NAMES = CATALOGUE.map(function (s) { return s.name; });

  function find(name) { for (var i = 0; i < CATALOGUE.length; i++) if (CATALOGUE[i].name === name) return CATALOGUE[i]; return null; }

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
              find: find, rollAssigned: rollAssigned, modifier: modifier, problems: problems };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AuldEweSkills = api;
})(typeof window !== 'undefined' ? window : this);
