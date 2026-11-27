'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('fs'), path = require('path');
const T = require('../tongues.js');

test('20 tongues, unique names and tribes, resonance and reset values are valid', () => {
  assert.equal(T.TONGUES.length, 20); assert.equal(new Set(T.NAMES).size, 20); assert.equal(new Set(T.TONGUES.map(t => t.tribe)).size, 20);
  T.TONGUES.forEach(t => { assert.ok(['Virtuous', 'Challenging', 'Neutral'].includes(t.resonance), t.name); assert.ok(t.tp === 2 || t.tp === 3, t.name); assert.ok(['long rest', 'day'].includes(t.masterAbility.resets), t.name); assert.ok(t.masterAbility.name && t.masterAbility.text, t.name); });
  assert.equal(T.TONGUES.filter(t => t.resonance === 'Virtuous').length, 8 + 1);   // eight Virtuous plus Truth
  assert.deepEqual(T.TONGUES.filter(t => t.masterAbility.resets === 'day').map(t => t.name).sort(), ['Chaos Tongue', 'Lament Tongue', 'Nature Tongue', 'Truth Tongue']);
});

test('tp, resonance, tongue and tribe agree with the tribe table already in index.html', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const i = html.indexOf('const tribes = ['), blk = html.slice(i, html.indexOf('\n];', i));
  const re = /name:\s*"([^"]+)",\s*tongue:\s*"([^"]+)",\s*resonance:\s*"([^"]+)"[\s\S]*?powerCost:\s*(\d+)/g; let m, n = 0;
  while ((m = re.exec(blk))) { n++; const t = T.find(m[2]); assert.ok(t, m[2]); assert.equal(t.tribe, m[1]); assert.equal(t.resonance, m[3]); assert.equal(t.tp, Number(m[4]), m[2]); }
  assert.equal(n, 20);
});

test('synergies: only the four names the document uses that are not tongues are unresolved', () => {
  assert.deepEqual(T.unresolvedSynergies(), ['Anger', 'Insight', 'Memory', 'Power']);
  assert.equal(T.find('Hope Tongue').masterAbility.name, "Dawn's Promise"); assert.equal(T.byTribe('Tribe of Titans').name, 'Strength Tongue'); assert.equal(T.find('Nope'), null);
});
