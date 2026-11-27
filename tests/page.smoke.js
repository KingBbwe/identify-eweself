// End-to-end page test. Needs jsdom (npm i -D jsdom). CDN scripts and config.local.js are expected not to load offline.
const { JSDOM, VirtualConsole } = require('jsdom'), path = require('path');
const C = require('../character.js');
const errors = [], checks = [];
const ok = (name, cond, extra) => checks.push([cond ? 'PASS' : 'FAIL', name, extra === undefined ? '' : extra]);
function load(pre) {
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => { if (!/Could not load (script|link|style)|config\.local\.js|navigation to another Document/.test(String(e.message))) errors.push('jsdomError: ' + e.message); });
  return JSDOM.fromFile(path.join(__dirname, '..', 'index.html'), { runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.alert = m => (w.__alerts = w.__alerts || []).push(String(m)); w.confirm = () => true;
      w.crypto = require('crypto').webcrypto;
      const mem = {}; Object.defineProperty(w, 'localStorage', { value: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } } });
      w.__downloads = []; w.URL.createObjectURL = b => { w.__downloads.push(b); return 'blob:x'; }; w.URL.revokeObjectURL = () => {};
      w.__opened = []; w.open = (u) => { w.__opened.push(u); };
      pre && pre(w);
    } }).then(d => new Promise(r => d.window.addEventListener('load', () => setTimeout(() => r(d.window), 80))));
}
(async () => {
  let w = await load(); let $ = id => w.document.getElementById(id);
  ok('buttons start disabled', $('download-character').disabled === true);
  let allValid = true, domMatch = true, modes = new Set(), bands = new Set(), badMsg = '';
  for (let i = 0; i < 300; i++) {
    $('forge-identity').click();
    let c; try { c = JSON.parse(w.localStorage.getItem('auldEweCharacter')); } catch (e) { allValid = false; badMsg = 'no stored character'; break; }
    const v = C.validateCharacter(c); if (!v.ok) { allValid = false; badMsg = v.errors.join('|'); break; }
    const dom = { intellectual: +$('intellectual-dc').textContent, physical: +$('physical-dc').textContent, emotional: +$('emotional-dc').textContent, spiritual: +$('spiritual-dc').textContent };
    for (const d of C.DOMAINS) { if (dom[d] !== c.dc[d].value) domMatch = false; modes.add(c.dc[d].mode); bands.add(c.dc[d].band); }
    if ($('result').textContent.indexOf(c.name) === -1) domMatch = false;
  }
  ok('300 forges: every stored Character validates', allValid, badMsg);
  ok('stored DCs equal the DCs shown on the page, and the name matches', domMatch);
  ok('both modes and all four bands occur across forges', modes.size === 2 && bands.size === 4, [...bands].join(','));
  ok('download enabled after forging', $('download-character').disabled === false);

  // ---- allocation: fresh page, single forge (no reroll penalty yet)
  w = await load(); $ = id => w.document.getElementById(id);
  $('forge-identity').click();
  const stored = () => JSON.parse(w.localStorage.getItem('auldEweCharacter'));
  const before = stored();
  ok('first forge: seeded allocation with a budget of exactly 32', before.allocation.mode === 'seeded' && before.allocation.budget === 32 && before.allocation.rerollPenalty === 0, JSON.stringify({ b: before.allocation.budget, r: before.allocation.remaining }));
  ok('points to spend = 32 minus the lineage seed total', before.allocation.remaining === 32 - Object.values(before.allocation.floors).reduce((t, v) => t + v, 0));
  ok('status line shows the points', new RegExp('Points to spend:\\s*' + before.allocation.remaining).test($('alloc-status').textContent), $('alloc-status').textContent);
  let guard = 0;
  while (stored().allocation.remaining > 0 && guard++ < 80) { const b = [...w.document.querySelectorAll('.plus-pill')].find(x => !x.disabled); if (!b) break; b.click(); }
  const full = stored();
  ok('spending every point reaches exactly 32 and the allocation is complete', full.allocation.spent === 32 && full.allocation.complete === true && full.allocation.remaining === 0, String(full.allocation.spent));
  ok('every attribute stays within 1-5 and above its floor', Object.keys(full.attributes).every(k => full.attributes[k] >= full.allocation.floors[k] && full.attributes[k] <= 5));
  ok('when nothing is left every + button is disabled', [...w.document.querySelectorAll('.plus-pill')].every(b => b.disabled));
  const up = Object.keys(full.attributes).find(k => full.attributes[k] > full.allocation.floors[k]);
  w.document.querySelector(`.minus-pill[data-attr="${up}"]`).click();
  ok('the minus button refunds a point', stored().attributes[up] === full.attributes[up] - 1 && stored().allocation.remaining === 1);
  ok('floor attributes have a disabled minus', [...w.document.querySelectorAll('.minus-pill')].some(b => b.disabled));
  $('free-build').checked = true; $('free-build').dispatchEvent(new w.Event('change', { bubbles: true }));
  const fr = stored();
  ok('free build resets to all 1s with 23 to spend', fr.allocation.mode === 'free' && fr.allocation.remaining === 23 && Object.values(fr.attributes).every(v => v === 1), fr.allocation.remaining);
  ok('PDF content carries no allocation buttons', (w.buildPdfContent(), !/<button/.test($('pdf-preview').innerHTML)));

  // ---- the zero floor: many rerolls in one session
  w = await load(); $ = id => w.document.getElementById(id);
  let neg = false, lowest = 99, lastBudget = 0;
  for (let i = 0; i < 80; i++) { $('forge-identity').click(); const c = stored(); if (c.allocation.remaining < 0) neg = true; lowest = Math.min(lowest, c.allocation.remaining); lastBudget = c.allocation.budget; }
  ok('after 80 forges the points to spend never went negative', !neg && lowest >= 0, 'lowest ' + lowest + ', last budget ' + lastBudget);
  ok('the budget bottoms out at the floors (rerolls cost points up to the floor)', lastBudget < 32);

  // ---- age bands
  const bandRoles = {};
  for (const want of ['18-36', '36-50+']) {
    w = await load(); $ = id => w.document.getElementById(id); $('age-band').value = want;
    let okBand = true, roles = new Set();
    for (let i = 0; i < 30; i++) { $('forge-identity').click(); const c = stored(); if (c.trajectory.ageBand !== want) okBand = false; roles.add(c.trajectory.a.role + '/' + c.trajectory.b.role); if (!new RegExp('Age Band:\\s*' + want.replace('+', '\\+')).test($('trajectory').textContent)) okBand = false; }
    ok('age band ' + want + ' is honoured on 30 forges', okBand, [...roles].join(','));
    bandRoles[want] = [...roles][0];
  }
  ok("18-36 reads from/to and 36-50+ reads current/reflecting", bandRoles["18-36"] === "from/to" && bandRoles["36-50+"] === "current/reflecting", JSON.stringify(bandRoles));
  w = await load(); $ = id => w.document.getElementById(id); const seenBands = new Set();
  for (let i = 0; i < 60; i++) { $('forge-identity').click(); seenBands.add(stored().trajectory.ageBand); }
  ok('Random picks both bands', seenBands.size === 2);

  // ---- skills
  w = await load(); $ = id => w.document.getElementById(id); $('forge-identity').click();
  const sk = stored();
  ok('three skills are assigned at modifier 0', Object.keys(sk.skills).length === 3 && Object.values(sk.skills).every(v => v === 0), JSON.stringify(sk.skills));
  ok('skills are listed on the page', $('skill-list').querySelectorAll('li').length === 3);
  ok('skill provenance matches the sheet and the Character validates', sk.creation.skillRoll.picks.slice().sort().join() === Object.keys(sk.skills).sort().join() && C.validateCharacter(sk).ok);
  const seenSkills = new Set(); for (let i = 0; i < 40; i++) { $('forge-identity').click(); Object.keys(stored().skills).forEach(n => seenSkills.add(n)); }
  ok('rerolling reassigns skills (more than 3 distinct seen over 40 forges)', seenSkills.size > 3, seenSkills.size);

  // ---- the dice are shown and recorded
  $('forge-identity').click(); const cr = stored();
  ok('the 2d6 soul roll is shown on the page', /Rolled 2d6/.test($('soul-pattern').textContent), $('soul-pattern').textContent.replace(/\s+/g, ' ').slice(0, 90));
  ok('the 2d8 trait rolls are shown on the page', (($('inner-world').textContent.match(/2d8: \d and \d/g)) || []).length === 2);
  ok('creation provenance is stored and consistent with the sheet', cr.creation && cr.creation.soulRoll.dice[0] === cr.soul.profile[0] && C.validateCharacter(cr).ok);
  w = await load(); $ = id => w.document.getElementById(id);
  $('forge-identity').click();
  const before2 = stored();

  const names = [];
  for (let i = 0; i < 7; i++) { $('rename-character').click(); names.push(JSON.parse(w.localStorage.getItem('auldEweCharacter')).renamesRemaining); }
  ok('renames count down 4,3,2,1,0 then stop', names.slice(0, 5).join() === '4,3,2,1,0' && names[6] === 0 && (w.__alerts || []).some(a => /No more renames/.test(a)), names.join());
  const gender = JSON.parse(w.localStorage.getItem('auldEweCharacter')).gender;
  ok('gender recorded', gender === 'ewe' || gender === 'ram', gender);

  // download
  $('download-character').click();
  ok('download produced one JSON blob that parses and validates', w.__downloads.length === 1);
  const text = await new Promise(r => { const fr = new w.FileReader(); fr.onload = () => r(fr.result); fr.readAsText(w.__downloads[0]); });
  ok('downloaded file validates', C.validateCharacter(JSON.parse(text)).ok);

  // handoff only when configured
  ok('no Hex-Die button without HEXDIE_URL', $('open-hexdie').style.display === 'none');
  w = await load(x => { x.HEXDIE_URL = 'https://example.test/hexdie/'; }); $ = id => w.document.getElementById(id);
  $('forge-identity').click(); $('open-hexdie').click();
  const url = w.__opened[0] || '';
  const back = C.fromFragment(url.slice(url.indexOf('#')));
  ok('handoff URL carries the Character in its fragment', url.startsWith('https://example.test/hexdie/#character=') && back && C.validateCharacter(back).ok, url.slice(0, 50));
  w = await load(); $ = id => w.document.getElementById(id); $('download-character').disabled = false; $('download-character').click();
  ok('download before forging is refused politely', (w.__alerts || []).some(a => /Forge an identity first/.test(a)));


  // ---- fate overrides: Ram/Ewe and age start unchosen; choosing costs 1 point (before forging) or reforges (after)
  {
    let w = await load(); const $ = id => w.document.getElementById(id), st = () => JSON.parse(w.localStorage.getItem('auldEweCharacter'));
    ok('Ram and Ewe both start unchosen', !$('ram').checked && !$('ewe').checked);
    ok('age starts at By fate', $('age-band').value === 'random');
    $('forge-identity').click();
    let c = st();
    ok('a forge with no choices costs nothing', c.allocation.budget === 32 && c.creation.fateOverrides === 0 && !c.creation.chosen.gender && !c.creation.chosen.age, c.allocation.budget);
    const genders = new Set(); for (let i = 0; i < 40; i++) { w.localStorage.removeItem('idForgeSession'); $('forge-identity').click(); genders.add(st().gender); }
    ok('fate picks both Ram and Ewe', genders.size === 2, [...genders].join(','));

    w = await load();
    $('ram').click(); $('ewe').click();                                   // changing your mind before the forge is charged once
    ok('choosing before the forge warns of the cost', /Fate overridden|already paid/.test($('fate-note').textContent), $('fate-note').textContent);
    $('forge-identity').click(); c = st();
    ok('a pre-forge choice is honoured and costs exactly 1 point', c.gender === 'ewe' && c.allocation.budget === 31 && c.creation.fateOverrides === 1 && c.creation.chosen.gender, c.allocation.budget + ' ' + c.gender);
    const id1 = c.id;
    $('ram').click(); c = st();
    ok('choosing after a forge reforges at once and costs another point', c.id !== id1 && c.gender === 'ram' && c.allocation.budget === 30 && c.creation.fateOverrides === 2, c.allocation.budget);
    $('ram').click();
    ok('tapping the chosen option again returns it to fate, free', !$('ram').checked && w.localStorage.getItem('idForgeSession').indexOf('"overrides":2') !== -1);
    const id2 = st().id; $('age-band').value = '36-50+'; $('age-band').dispatchEvent(new w.Event('change')); c = st();
    ok('choosing an age after a forge reforges with that band: 3 overrides + the 3rd forge = 4 points', c.id !== id2 && c.trajectory.ageBand === '36-50+' && c.creation.chosen.age && c.allocation.budget === 28, c.allocation.budget + ' ' + c.trajectory.ageBand);
    ok('every Character built through overrides validates', C.validateCharacter(c).ok, C.validateCharacter(c).errors.join('|'));
  }
  console.log(checks.map(c => c.join('  ')).join('\n')); console.log('JS errors:', errors.length ? errors : 'none');
  process.exit(checks.some(c => c[0] === 'FAIL') || errors.length ? 1 : 0);
})();
