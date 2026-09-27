# Google Sheets → Website sync

Only the **PublicExport** tab of the private teacher spreadsheet should be published (CSV format). Do NOT publish the entire spreadsheet, make the entire Google Drive file public, or include names, grades, personal assessment notes, passwords or keys in published content.

1. Edit the private Google Sheet. Give finished entries the exact Status **Published**. Draft and Archive remain excluded. Category names are public by design.
2. In Google Sheets on desktop: File → Share → Publish to web → select only PublicExport, format CSV; inspect Published content & settings to ensure **Entire document** is NOT selected.
3. Copy the published CSV URL (starts with https://docs.google.com/spreadsheets/d/e/ and ends with output=csv).
4. In the GitHub repository go to Settings → Secrets and variables → Actions → Variables → New repository variable.
5. Name: PUBLIC_CSV_URL; Value: paste the public CSV URL. This is a public URL, not a password.
6. On GitHub: Actions → Sync published vocabulary from Google Sheets → Run workflow. Future syncs are scheduled hourly, typically at minute 17 UTC; GitHub may delay scheduled runs.
7. Once a sync succeeds, data/library.json is committed and GitHub Pages deploys it. Refresh the student's website to see only your Published entries. If a sync fails, the existing published data remains in place; check Actions logs.
8. To hide a previously Published word, change its Status to Archive or Draft, then sync again. Note that a public Git repository preserves history; never publish private content in the first place.

The PublicExport table has exactly eight columns: kind, field1 ... field7. The Python script validates that header and accepts only the expected public educational modules. The website NEVER accesses your private Google Sheet directly.
