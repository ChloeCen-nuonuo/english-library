# My English Library 🌱

A cheerful, mobile-first English learning website for iPad, phone or computer.

## V1.0 homepage
Five equal-level entries, in this exact order:
1. My First Dictionary — Visual Vocabulary Cards: Word, Part of Speech, Meaning, Sentence and Picture.
2. Word Categories — thematic lookup using the same dictionary entries, not duplicated cards.
3. Sound-Spelling Cards — phonics and spelling.
4. High-Frequency Words — sight-word recognition.
5. Word Study — Synonyms, Antonyms, Prefixes, Base Words and Suffixes.

Each card opens a working **design-preview section** with examples. The words in app.js are local examples, not a published record or assessment for any child. English-US pronunciation uses browser speech synthesis and may vary by device/voice.

## Publish with GitHub Pages
In Repository Settings → Pages → Build and deployment, choose Deploy from a branch, main, / (root), then Save.
Expected URL once GitHub Pages finishes deployment: https://ChloeCen-nuonuo.github.io/english-library/

## Files
- index.html: homepage and five sections
- styles.css: responsive layout and illustration styling
- app.js: sample words, search, categories, audio, navigation and five Word Study tabs

## Coming next: Google Sheets data integration
The separate Google Sheets database has already been created, but **it is not connected in this release**. We must export only approved public, student-facing rows (Status = Published) and keep unpublished draft data and personal student information private. A scheduled export can write safe static JSON for GitHub Pages. Never add API keys, passwords, student assessments or private photos to this public repository.

This preview has no external analytics, fonts, stock images or live data dependencies.
