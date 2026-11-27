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

## Deploy on Render

`render.yaml` defines a static site. In Render choose **New > Blueprint**, pick this repo and branch, and apply.
The build (`scripts/render-build.sh`) copies the app into `dist/` and writes a public `config.local.js` containing **no secrets**:
Telegram sending is off on the hosted copy because anything in a static site is readable by visitors. Run locally with your own
`config.local.js` for Telegram. Optional `HEXDIE_URL` (identify-eweself only): set it to the deployed Hex-Die URL, with a trailing slash, to enable "Open in Hex-Die".
