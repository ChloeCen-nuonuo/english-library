# My English Library 🌱

A cheerful, mobile-first English learning website for iPad, phone or computer.

## V1.0 homepage
Five equal-level entries, in this exact order:
1. My First Dictionary — Visual Vocabulary Cards: Word, Part of Speech, Meaning, Sentence and Picture.
2. Word Categories — thematic lookup using the same dictionary entries, not duplicated cards.
3. Sound-Spelling Cards — phonics and spelling.
4. High-Frequency Words — sight-word recognition.
5. Word Study — Synonyms, Antonyms, Prefixes, Base Words and Suffixes.

Each card opens a working **design-preview section** with examples. The words in app.js are local examples, not a published record or assessment for any child. When data/library.json is created by the approved Google Sheets sync, the live published entries replace these examples. English-US pronunciation uses browser speech synthesis and may vary by device/voice.

## Publish with GitHub Pages
In Repository Settings → Pages → Build and deployment, choose Deploy from a branch, main, / (root), then Save.
Expected URL once GitHub Pages finishes deployment: https://ChloeCen-nuonuo.github.io/english-library/

## Files
- index.html: homepage and five sections
- styles.css: responsive layout and illustration styling
- app.js: sample words, search, categories, audio, navigation and five Word Study tabs

## Google Sheets integration (awaiting your published CSV link)
PublicExport is prepared in the existing private teacher spreadsheet. See SHEETS_SETUP.md to publish *only that tab* and configure the PUBLIC_CSV_URL repository variable. The GitHub Actions workflow syncs every hour (subject to scheduling delays) or manually on demand. Only approved rows marked Published are included. Never add API keys, passwords, student assessments or private photos to this public repository.

This preview has no external analytics, fonts, stock images or live data dependencies.
