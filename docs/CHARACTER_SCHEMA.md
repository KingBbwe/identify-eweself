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
| `trajectory` | `ageBand` (`0-50` or `50+`), `a` and `b`: `{role, hexagram, name}`. For 0–50 the roles are `from` / `to`; for 50+ they are `current` / `reflecting`. |
| **`dc`** | The four **Personal DCs**, each `{value, band, mode, source}`. `mode` is `over` or `under` and is carried so no consumer re-derives it. |
| `lineage`, `tribe` | Name, type, role, traits; tribe name, tongue, resonance. |
| `attributes`, `baseAttributes`, `surplusRemaining` | Nine attributes (0–5) as allocated now and as the lineage gave them; unspent points. |
| `skills` | `{}`. Not built yet: awaits the commander's skill ruling. |
| `dieTier` | `6` for a new character (levels 6, 8, 12, 20). |
| `skulduggery`, `grace` | Counters, start at 0. |

## The four Personal DCs (RULES_CANON section 2, preserved untouched)

| Domain | Source |
|---|---|
| intellectual | conscious core-trait hexagram |
| physical | unconscious core-trait hexagram |
| emotional | trajectory `a` hexagram (`fromHex`, or `currentHex` for 50+) |
| spiritual | trajectory `b` hexagram (`toHex`, or `reflectingHex` for 50+) |

Modes by DC: 1–16 Over, 17–32 Under, 33–48 Over, 49–64 Under.

## Validation

`validateCharacter()` runs on export and on import. It checks the schema and version, the twelve valid profile pairs,
that each DC is 1–64 and its `mode` matches its value, that the DCs equal the hexagrams they are derived from, that
`dieTier` is 6/8/12/20, and that attributes are integers 0–5.

## Known gaps (flagged, not silently filled)

- `skills` is empty and the 2d6 soul-pattern roll, core-trait rolls and 32-point allocation are **not** implemented:
  canon gaps awaiting the commander (Move 4 fork).
- The reroll penalty (`rollCount - 2` taken from the lineage surplus per forge within 24 h) can drive `surplusRemaining`
  **negative**. Left as is; the route marks it as probably deliberate.
- SentientHub's age bands are `18-35` / `36-50`; this contract carries identify-eweself's `0-50` / `50+`. SentientHub
  must map or adopt them (Move 5).
