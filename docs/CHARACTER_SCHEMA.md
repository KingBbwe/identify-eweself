# Character contract — `auld-ewe.character` v1

The Character is the **source of truth** that identify-eweself produces. The PDF and the Telegram message are views of it.
It is built by `buildCharacter()` in `character.js` (pure, DOM-free, tested), kept in `localStorage` under
`auldEweCharacter` after every change (forge, attribute point, rename), and leaves the page three ways:

1. **Download Character (JSON)**: a file such as `character-Aralen.json`.
2. **Open in Hex-Die**: opens `HEXDIE_URL#character=<base64url JSON>`. The fragment is never sent to a server. The button
   appears only when `HEXDIE_URL` is set in `config.local.js`.
3. **PDF / Telegram**: unchanged.

See `docs/example-character.json` for a real one.

## Fields

| Field | Meaning |
|---|---|
| `schema`, `version` | Always `"auld-ewe.character"`, `1`. Readers must reject other versions. |
| `id` | 128-bit hex id, new on every Forge. |
| `createdAt` | ISO time of the export snapshot. |
| `name`, `gender` (`ewe`/`ram`), `nameHexagram`, `renamesRemaining` | Identity. Renames start at 5. |
| `soul` | `pattern`, `profile` as a pair such as `[1,3]`, `profileId` `"1/3"`, `profileName`. The pair is always one of the twelve in SentientHub's `validProfiles`. |
| `coreTraits` | `conscious` and `unconscious`: `{trait, hexagram}`. |
| `trajectory` | `ageBand` (`18-36` or `36-50+`), `a` and `b`: `{role, hexagram, name}`. For 18-36 the roles are `from` / `to`; for 36-50+ they are `current` / `reflecting`. Ages 18–35 fall in `18-36`, 36 and over in `36-50+`. |
| **`dc`** | The four **Personal DCs**, each `{value, band, mode, source}`. `mode` is `over` or `under` and is carried so no consumer re-derives it. |
| `lineage`, `tribe` | Name, type, role, traits; tribe name, tongue, resonance. |
| `attributes` | Nine attributes (1–5 each) as allocated now. |
| `allocation` | The 32-point rule: `{rule, mode ('seeded'\|'free'), budget, spent, remaining, complete, rerollPenalty, floors}`. `floors` is the lineage seed (seeded) or all 1s (free). `budget = max(sum of floors, 32 − rerollPenalty)` (the zero floor), so `remaining` is never negative. |
| `skills` | Assigned skills only, `{name: 0}`; every other catalogue skill is implicitly −2. Names come from the 113-skill catalogue in `skills.js` (the commander's canonical list: 6 domains, 34 groups, 111 skills, plus Artistry and Command from the rules text). |
| `creation` (optional) | Dice provenance: `skillRoll {picks}` (the skills drawn at creation), `soulRoll {dice, rerolls}` (2d6; first die kept, second rerolled until a valid profile), `traitRolls {conscious, unconscious}` (2d8 each; hexagram = (first−1)×8 + second), `rollCount`, `penalty`. Validated against the sheet. |
| `dieTier` | `6` for a new character (levels 6, 8, 12, 20). |
| `skulduggery`, `grace` | Counters, start at 0. |

## The four Personal DCs (RULES_CANON section 2, preserved untouched)

| Domain | Source |
|---|---|
| intellectual | conscious core-trait hexagram |
| physical | unconscious core-trait hexagram |
| emotional | trajectory `a` hexagram (`fromHex`, or `currentHex` for 36-50+) |
| spiritual | trajectory `b` hexagram (`toHex`, or `reflectingHex` for 36-50+) |

Modes by DC: 1–16 Over, 17–32 Under, 33–48 Over, 49–64 Under.

## Validation

`validateCharacter()` runs on export and on import. It checks the schema and version, the twelve valid profile pairs,
that each DC is 1–64 and its `mode` matches its value, that the DCs equal the hexagrams they are derived from, that
`dieTier` is 6/8/12/20, and that attributes are integers 1–5, the age band is valid, the allocation record is consistent (budget, floors, no overspend), and any `creation` dice agree with the sheet.

## Known gaps (flagged, not silently filled)

- Skills: 3 are randomly assigned at creation (the count is not stated in canon). Only 36 of the 111 canonical skills are linked to an attribute by the document; the rest carry no attribute. The integration table's parentheticals (Reason, Charisma, Strength...) conflict with the skills listed and are ignored. Acquired Skillsets are unbuilt.
- Core traits are rolled as 2d8 (method not documented in the source corpus); the two traits are independent, so duplicates are possible. Awaiting ratification.
- Allocation is lineage-seeded by default (seed = floor, spend up to 32 total); free build starts at all 1s with 23 to spend. Awaiting ratification.
- SentientHub's age bands (`18-35` / `36-50`) must adopt `18-36` / `36-50+` (Move 5).
