// End-to-end page test. Needs jsdom (npm i -D jsdom). CDN scripts and config.local.js are expected not to load offline.
const { JSDOM, VirtualConsole } = require('jsdom'), path = require('path');
const C = require('../character.js');
const errors = [], checks = [];
const ok = (name, cond, extra) => checks.push([cond ? 'PASS' : 'FAIL', name, extra === undefined ? '' : extra]);
function load(pre) {
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => { if (!/Could not load (script|link)|config\.local\.js|navigation to another Document/.test(String(e.message))) errors.push('jsdomError: ' + e.message); });
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

  // allocation + rename are captured (fresh page, single forge: no reroll penalty yet)
  w = await load(); $ = id => w.document.getElementById(id);
  $('forge-identity').click();
  const before = JSON.parse(w.localStorage.getItem('auldEweCharacter'));
  const pill = [...w.document.querySelectorAll('.plus-pill')].find(b => { const a = b.dataset.attr; return before.attributes[a] < 5; });
  if (before.surplusRemaining > 0 && pill) pill.click();
  const after = JSON.parse(w.localStorage.getItem('auldEweCharacter'));
  ok('first forge has no reroll penalty and surplus is positive', before.surplusRemaining > 0, before.surplusRemaining);
  ok('spending a surplus point is captured', after.surplusRemaining === before.surplusRemaining - 1 && after.attributes[pill.dataset.attr] === before.attributes[pill.dataset.attr] + 1, `${before.surplusRemaining}->${after.surplusRemaining}`);
  ok('a new forge starts with 5 renames', before.renamesRemaining === 5, before.renamesRemaining);
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

  console.log(checks.map(c => c.join('  ')).join('\n')); console.log('JS errors:', errors.length ? errors : 'none');
  process.exit(checks.some(c => c[0] === 'FAIL') || errors.length ? 1 : 0);
})();
