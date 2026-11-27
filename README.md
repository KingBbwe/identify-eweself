# identify-eweself
Character Creation Engine for The Chronicles of Auld Ewe 

## Character export

Forging an identity builds a validated `Character` (see `docs/CHARACTER_SCHEMA.md`): the four Personal DCs with their
Roll-Over/Under mode, soul profile, core traits, trajectory, lineage, tribe and attributes. Use **Download Character (JSON)**
to save it, or set `HEXDIE_URL` in `config.local.js` to get an **Open in Hex-Die** button.

```
npm test                          # 12 tests on the real data tables, including 262,144 trait x trajectory combinations
npm i -D jsdom && npm run smoke   # end-to-end page test
```

Telegram (optional): copy `config.example.js` to `config.local.js` and fill in your values. Never commit it.
