/*
 * character.js — the Character contract (identify-eweself -> SentientHub / Hex-Die).
 * Pure and DOM-free: works from file:// (classic script, sets window.AuldEweCharacter) and in Node (module.exports).
 *
 * The page's session object is a bag of mutable state. buildCharacter() turns it into a validated, versioned
 * Character, which is the source of truth; the PDF and Telegram message are views of it.
 */
(function (root) {
  'use strict';

  // allocation.js supplies the 32-point rule: required alongside this file (require() in Node, window.AuldEweAllocation in a page).
  var Alloc = typeof require === 'function' && typeof module !== 'undefined' ? require('./allocation.js') : root.AuldEweAllocation;
  if (!Alloc) throw new Error('character.js needs allocation.js loaded first');
  var Skills = typeof require === 'function' && typeof module !== 'undefined' ? require('./skills.js') : root.AuldEweSkills;
  if (!Skills) throw new Error('character.js needs skills.js loaded first');

  var SCHEMA = 'auld-ewe.character', VERSION = 1;
  var DOMAINS = ['intellectual', 'physical', 'emotional', 'spiritual'];

  // Roll-Over / Roll-Under bands by DC (RULES_CANON ruling 4). Mirrors Hex-Die's engine CONFIG.bands.
  var BANDS = [
    { from: 1,  to: 16, mode: 'over'  },
    { from: 17, to: 32, mode: 'under' },
    { from: 33, to: 48, mode: 'over'  },
    { from: 49, to: 64, mode: 'under' }
  ];

  // The twelve soul-pattern profile pairs. Identical to SentientHub's `validProfiles`.
  var VALID_PROFILES = [[1,3],[1,4],[2,4],[2,5],[3,5],[3,6],[4,6],[4,1],[5,1],[5,2],[6,2],[6,3]];

  var ATTRIBUTES = Alloc.ATTRIBUTES;
  var AGE_BANDS = ['18-36', '36-50+'];          // ruled 2026-11-27; the first covers 18-35, the second 36 and over
  var START_DIE = 6;          // every new character starts on a d6 (levels: 6 -> 8 -> 12 -> 20)

  function isHex(n) { return typeof n === 'number' && n % 1 === 0 && n >= 1 && n <= 64; }

  function bandFor(dc) {
    for (var i = 0; i < BANDS.length; i++) if (dc >= BANDS[i].from && dc <= BANDS[i].to) return BANDS[i];
    throw new RangeError('DC ' + dc + ' is outside 1-64');
  }
  function modeForDC(dc) { return bandFor(dc).mode; }

  // "1/3", "Investigating Catalyst (1/3)" -> [1, 3]; anything else -> null.
  function parseProfile(text) {
    var m = /(\d)\s*\/\s*(\d)/.exec(String(text || ''));
    return m ? [+m[1], +m[2]] : null;
  }
  function isValidProfile(p) {
    return Array.isArray(p) && VALID_PROFILES.some(function (v) { return v[0] === p[0] && v[1] === p[1]; });
  }

  function dcEntry(value, label) {
    var b = bandFor(value);
    return { value: value, band: b.from + '-' + b.to, mode: b.mode, source: label };
  }

  function newId() {
    var hex = '';
    var c = root.crypto && root.crypto.getRandomValues ? root.crypto : null;
    for (var i = 0; i < 4; i++) {
      var n = c ? c.getRandomValues(new Uint32Array(1))[0] : Math.floor(Math.random() * 4294967296);
      hex += ('00000000' + n.toString(16)).slice(-8);
    }
    return hex;
  }

  /**
   * session: { name, gender, originalHexagram, renames, characterId, soulPattern, coreTraits:[conscious, unconscious],
   *            trajectory, ageBand, lineage, currentAttributes, remainingSurplus, tribe, skulduggery, grace }
   * opts:    { now: Date|ms|ISO string, id: string }  (injectable for tests)
   * Throws Error listing everything that is missing.
   */
  function buildCharacter(session, opts) {
    opts = opts || {}; session = session || {};
    var miss = [];
    var ct = session.coreTraits || [], conscious = ct[0], unconscious = ct[1], tj = session.trajectory, band = session.ageBand;
    if (!session.name) miss.push('name');
    if (!conscious || !isHex(conscious.hexagram)) miss.push('conscious core trait');
    if (!unconscious || !isHex(unconscious.hexagram)) miss.push('unconscious core trait');
    if (!tj || AGE_BANDS.indexOf(band) === -1) miss.push('trajectory / age band');
    if (!session.soulPattern) miss.push('soul pattern');
    if (!session.allocation) miss.push('attribute allocation');
    if (!session.lineage) miss.push('lineage');
    if (!session.tribe) miss.push('tribe');
    if (miss.length) throw new Error('Cannot build Character, missing: ' + miss.join(', '));

    var young = band === AGE_BANDS[0];
    var emo = young ? tj.fromHex : tj.currentHex, spi = young ? tj.toHex : tj.reflectingHex;
    if (!isHex(emo) || !isHex(spi)) throw new Error('Cannot build Character, trajectory has no valid hexagrams for age band ' + band);

    var sp = session.soulPattern;
    var profile = parseProfile(sp.profileId) || parseProfile(sp.profile);
    var spName = sp.soulPattern || String(sp.pattern || '').split(' - ')[0].trim();

    var when = opts.now == null ? new Date() : new Date(opts.now);
    var al = session.allocation, sp2 = Alloc.summary(al);
    var attrs = {}, floors = {};
    ATTRIBUTES.forEach(function (a) { attrs[a] = al.values[a]; floors[a] = al.floors[a]; });
    var cr = session.creation || null;

    var c = {
      schema: SCHEMA, version: VERSION,
      id: session.characterId || opts.id || newId(),
      createdAt: when.toISOString(),
      name: session.name,
      gender: session.gender === 'ram' ? 'ram' : 'ewe',
      nameHexagram: isHex(session.originalHexagram) ? session.originalHexagram : null,
      renamesRemaining: typeof session.renames === 'number' ? session.renames : null,
      soul: { pattern: spName, profile: profile, profileId: profile ? profile[0] + '/' + profile[1] : null, profileName: sp.name || null },
      coreTraits: {
        conscious:   { trait: conscious.trait,   hexagram: conscious.hexagram },
        unconscious: { trait: unconscious.trait, hexagram: unconscious.hexagram }
      },
      trajectory: young
        ? { id: tj.id, ageBand: band, a: { role: 'from', hexagram: tj.fromHex, name: tj.fromName }, b: { role: 'to', hexagram: tj.toHex, name: tj.toName } }
        : { id: tj.id, ageBand: band, a: { role: 'current', hexagram: tj.currentHex, name: tj.currentName }, b: { role: 'reflecting', hexagram: tj.reflectingHex, name: tj.reflectingName } },
      // Personal DCs: static, derived once (RULES_CANON section 2). Mode is carried so no consumer re-derives it.
      dc: {
        intellectual: dcEntry(conscious.hexagram, 'core trait: conscious'),
        physical:     dcEntry(unconscious.hexagram, 'core trait: unconscious'),
        emotional:    dcEntry(emo, 'trajectory: ' + (young ? 'from' : 'current')),
        spiritual:    dcEntry(spi, 'trajectory: ' + (young ? 'to' : 'reflecting'))
      },
      lineage: { name: session.lineage.name, type: session.lineage.type, role: session.lineage.role, traits: (session.lineage.traits || []).slice() },
      tribe: { name: session.tribe.name, tongue: session.tribe.tongue, resonance: session.tribe.resonance },
      // The 32-point rule: nine attributes, each 1-5. `floors` is the lineage seed ("seeded") or all 1s ("free").
      attributes: attrs,
      allocation: { rule: '32-point', mode: al.mode, budget: al.budget, spent: sp2.spent, remaining: sp2.remaining, complete: sp2.complete,
                    rerollPenalty: al.penalty, floors: floors },
      skills: JSON.parse(JSON.stringify(session.skills || {})),   // assigned skills only ({name: 0}); every other skill is implicitly -2
      dieTier: START_DIE,
      skulduggery: session.skulduggery || 0,
      grace: session.grace || 0
    };
    if (cr) c.creation = JSON.parse(JSON.stringify(cr));     // how the dice fell: an audit trail for the GM
    var v = validateCharacter(c);
    if (!v.ok) throw new Error('Built an invalid Character: ' + v.errors.join('; '));
    return c;
  }

  /** Structural + canon checks. Returns {ok, errors[]}. Used on export AND on import. */
  function validateCharacter(c) {
    var e = [];
    if (!c || typeof c !== 'object') return { ok: false, errors: ['not an object'] };
    if (c.schema !== SCHEMA) e.push('schema must be "' + SCHEMA + '"');
    if (c.version !== VERSION) e.push('unsupported version ' + c.version + ' (this build reads ' + VERSION + ')');
    if (typeof c.id !== 'string' || !c.id) e.push('id missing');
    if (typeof c.name !== 'string' || !c.name) e.push('name missing');
    if (c.gender !== 'ewe' && c.gender !== 'ram') e.push('gender must be ewe or ram');
    if (!c.soul || !isValidProfile(c.soul.profile)) e.push('soul.profile is not one of the twelve valid pairs');
    DOMAINS.forEach(function (d) {
      var x = c.dc && c.dc[d];
      if (!x || !isHex(x.value)) { e.push('dc.' + d + ' missing or outside 1-64'); return; }
      if (x.mode !== modeForDC(x.value)) e.push('dc.' + d + ' mode "' + x.mode + '" does not match DC ' + x.value + ' (expected ' + modeForDC(x.value) + ')');
    });
    if (c.coreTraits && c.dc) {
      if (c.dc.intellectual && c.coreTraits.conscious && c.dc.intellectual.value !== c.coreTraits.conscious.hexagram) e.push('dc.intellectual must equal the conscious core-trait hexagram');
      if (c.dc.physical && c.coreTraits.unconscious && c.dc.physical.value !== c.coreTraits.unconscious.hexagram) e.push('dc.physical must equal the unconscious core-trait hexagram');
    } else e.push('coreTraits missing');
    if (c.trajectory && c.dc) {
      if (c.dc.emotional && c.trajectory.a && c.dc.emotional.value !== c.trajectory.a.hexagram) e.push('dc.emotional must equal trajectory.a');
      if (c.dc.spiritual && c.trajectory.b && c.dc.spiritual.value !== c.trajectory.b.hexagram) e.push('dc.spiritual must equal trajectory.b');
    } else e.push('trajectory missing');
    if ([6, 8, 12, 20].indexOf(c.dieTier) === -1) e.push('dieTier must be 6, 8, 12 or 20');
    if (!c.trajectory || AGE_BANDS.indexOf(c.trajectory.ageBand) === -1) e.push('trajectory.ageBand must be one of ' + AGE_BANDS.join(', '));
    if (!c.allocation || !c.attributes) e.push('allocation / attributes missing');
    else {
      Alloc.problems({ mode: c.allocation.mode, floors: c.allocation.floors, values: c.attributes, budget: c.allocation.budget,
                       spent: c.allocation.spent, remaining: c.allocation.remaining, complete: c.allocation.complete }).forEach(function (m) { e.push(m); });
      if (c.allocation.rule !== '32-point') e.push('allocation.rule must be "32-point"');
    }
    Skills.problems(c.skills).forEach(function (m) { e.push(m); });
    if (c.creation) {
      var cr = c.creation, sr = cr.soulRoll, tr = cr.traitRolls;
      if (cr.skillRoll) {
        var pk = cr.skillRoll.picks;
        if (!Array.isArray(pk) || new Set(pk).size !== pk.length) e.push('creation.skillRoll.picks must be distinct skill names');
        else pk.forEach(function (n) { if (!Object.prototype.hasOwnProperty.call(c.skills, n)) e.push('creation.skillRoll: ' + n + ' is not on the sheet'); });
      }
      if (sr) {
        var d = sr.dice, rr = sr.rerolls || [], p = c.soul && c.soul.profile;
        if (!Array.isArray(d) || d.length !== 2 || !p) e.push('creation.soulRoll malformed');
        else {
          if (d[0] !== p[0]) e.push('creation.soulRoll: the first die must be kept (' + d[0] + ' vs profile ' + p[0] + ')');
          if (rr.length === 0 ? d[1] !== p[1] : rr[rr.length - 1] !== p[1]) e.push('creation.soulRoll does not end on the stated profile');
          if ((rr.length === 0) !== isValidProfile([d[0], d[1]])) e.push('creation.soulRoll: rerolls must happen exactly when the first pair is invalid');
          rr.slice(0, -1).forEach(function (b) { if (isValidProfile([d[0], b])) e.push('creation.soulRoll: rolling should have stopped at ' + d[0] + '/' + b); });
        }
      }
      if (tr && c.coreTraits) ['conscious', 'unconscious'].forEach(function (k) {
        var x = tr[k]; if (!x) return;
        if (!Array.isArray(x) || x.length !== 2 || (x[0] - 1) * 8 + x[1] !== c.coreTraits[k].hexagram) e.push('creation.traitRolls.' + k + ' does not give hexagram ' + c.coreTraits[k].hexagram);
      });
    }
    return { ok: e.length === 0, errors: e };
  }

  // ---- handoff helpers (URL fragment: #character=<base64url JSON>) ----
  function b64e(str) {
    var b = typeof Buffer !== 'undefined' ? Buffer.from(str, 'utf8').toString('base64') : btoa(unescape(encodeURIComponent(str)));
    return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64d(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
    return typeof Buffer !== 'undefined' ? Buffer.from(s, 'base64').toString('utf8') : decodeURIComponent(escape(atob(s)));
  }
  function toFragment(c) { return 'character=' + b64e(JSON.stringify(c)); }
  function fromFragment(hash) {
    var m = /(?:^|[#&])character=([A-Za-z0-9_-]+)/.exec(String(hash || ''));
    if (!m) return null;
    try { return JSON.parse(b64d(m[1])); } catch (e) { return null; }
  }
  function toJSONText(c) { return JSON.stringify(c, null, 2); }
  function fileName(c) { return 'character-' + String(c.name).replace(/[^A-Za-z0-9_-]+/g, '_') + '.json'; }

  var api = {
    SCHEMA: SCHEMA, VERSION: VERSION, AGE_BANDS: AGE_BANDS, DOMAINS: DOMAINS, BANDS: BANDS, VALID_PROFILES: VALID_PROFILES, ATTRIBUTES: ATTRIBUTES,
    modeForDC: modeForDC, parseProfile: parseProfile, isValidProfile: isValidProfile,
    buildCharacter: buildCharacter, validateCharacter: validateCharacter,
    newId: newId, toFragment: toFragment, fromFragment: fromFragment, toJSONText: toJSONText, fileName: fileName
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AuldEweCharacter = api;
})(typeof window !== 'undefined' ? window : globalThis);
