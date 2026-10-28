Build the complete study web app described in SPEC.md (same folder: C:\Users\G4M3R\Projects\fuehrerschein).
Work sequentially by yourself. Do not start background agents. Do not use git. Do not touch files outside this folder.

Deliverables (create them all): index.html, styles.css, app.js, data.js, sw.js, manifest.webmanifest, icon.svg.

Order of work:
1. data.js first: one global `window.THEORIE = { exam, stems, patterns, vorfahrt, numbers, signs, vocab, quiz, numberDrill, plan, golden }`.
   - Content strictly from SPEC.md facts. Arabic text in MSA, short and clear. German terms exactly spelled (ä ö ü ß).
   - Every pattern: { id, group, de: [trigger words], verdict: "yes"|"no"|"depends", reliability: "ثابتة"|"غالباً"|"حسب الحالة", ar_title, ar_why, exceptions: [ {de, ar} ], examples: [ {de, correct: true|false, ar} ] }.
   - quiz: 50 items { id, topic, points (2–5), stem_de, stem_ar_hint (very short Arabic gist), options: [ {de, correct} ×3 ], explain_ar, tags: ["S1","W5",...] }.
     At least 1 option correct per question; mix 1/2/3 correct. Your own wording, never copied official questions.
   - numberDrill: 15 items { q_de, q_ar, answer (number), unit, explain_ar }.
   - signs: each { nr, name_de, ar, trap_ar, svg } with a compact inline SVG string (viewBox 0 0 100 100) in correct official shape and colours.
   - vorfahrt: rules + solver steps + 3 crossing scenarios { svg, cars, order: [...], explain_ar }. Verify the logic of each scenario twice.
2. index.html + styles.css + app.js: the UI per SPEC.md section 9 (RTL Arabic, mobile-first, bottom tab bar, dark mode, search, flashcards, quiz with checkboxes and Fehlerpunkte logic, mistakes list, mini-exam, Anhalteweg calculator, plan with checkboxes, golden sheet, progress on home). Make it genuinely attractive and calm: clear hierarchy, generous spacing, rounded cards, one accent colour, verdict colours green/red/amber.
3. sw.js (cache-first app shell, versioned cache name, cleans old caches) + manifest.webmanifest + icon.svg. Register the SW in app.js only on http(s).
4. Self-check before finishing:
   - `node -e "global.window={};require('./data.js');const t=window.THEORIE;console.log(Object.keys(t), t.quiz.length, t.patterns.length, t.signs.length, t.vocab.length)"` must run without error (make data.js work both in browser and with that check).
   - Validate every quiz item has exactly 3 options and ≥1 correct; every numberDrill answer matches the formula in its explanation.
   - Search the code for horizontal-overflow risks at 360 px (long German words: use overflow-wrap:anywhere / hyphens:auto on German text).
5. Finish with a short report: file list with sizes, counts (patterns, quiz, signs, vocab), and anything from SPEC.md you were unsure about or left out.
