You are the accuracy auditor for a study app for the German driving theory exam (Klasse B). Folder: C:\Users\G4M3R\Projects\fuehrerschein.
Work sequentially by yourself, no background agents. Edit ONLY data.js. Do not use git commands.

1. Apply every item of CORRECTIONS.md to data.js (exam mechanics, numbers, patterns, golden sheet, quiz explanations, signs traps — wherever the old fact appears). Search data.js for: "200", "45", "Minuten", "Lichthupe", "Warndreieck", "Haltestelle", "Schrittgeschwindigkeit", "0,1", "Grünpfeil", "Rettungsgasse", "Richtgeschwindigkeit" and fix every occurrence that conflicts.
2. Audit ALL 50 quiz items and 15 numberDrill items like a strict German Fahrlehrer, using German StVO knowledge, SPEC.md and CORRECTIONS.md:
   - Is each option's `correct` flag right? Is the German correct and unambiguous? Does explain_ar match the flags? Is the tag (S1…, W…) sensible?
   - If an option is ambiguous, rewrite it so the answer is clearly right or wrong.
   - Recompute every number answer.
3. Audit every pattern example (`examples[].correct`), every exception, the 3 Vorfahrt scenarios (order must follow: Polizei > Ampel > Zeichen > rechts vor links; Linksabbieger waits for oncoming straight/right; check the SVG car positions match the text), and the sign meanings (number ↔ name ↔ Arabic).
4. Arabic: fix unclear or wrong Arabic, keep it short MSA. German spelling with ä ö ü ß.
5. Run: node -e "global.window={};require('./data.js');const t=window.THEORIE;for(const q of t.quiz){if(q.options.length!==3||!q.options.some(o=>o.correct))throw q.id}console.log('ok',t.quiz.length)"
6. Final report (short): a numbered list of EVERY change you made (id + old -> new + reason), and a list of anything you think is still doubtful.
