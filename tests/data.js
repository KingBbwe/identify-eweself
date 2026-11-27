// Test helper: pulls the real data tables out of index.html so tests run against what ships.
const fs = require('fs'), vm = require('vm'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
function grab(name) {
  const m = new RegExp('(?:const|let|var)\\s+' + name + '\\s*=\\s*\\[', 'g'); let hit, start = -1;
  while ((hit = m.exec(html))) start = hit.index + hit[0].length - 1;       // last definition wins (as at runtime)
  if (start < 0) throw new Error('table not found: ' + name);
  let depth = 0, q = null, i = start;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (q) { if (ch === '\\') i++; else if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { q = ch; continue; }
    if (ch === '[') depth++; else if (ch === ']' && --depth === 0) break;
  }
  return vm.runInNewContext('(' + html.slice(start, i + 1) + ')');
}
module.exports = { soulPatterns: grab('soulPatterns'), soulProfiles: grab('soulProfiles'), lineages: grab('lineages'),
  tribes: grab('tribes'), coreTraits: grab('coreTraits'), trajectories: grab('trajectories') };
