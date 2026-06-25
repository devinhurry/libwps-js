# Project Principles

- Ensure never heuristic.
- Prefer explicit, parsed Word binary properties over inferred row counts, signatures, or sample-specific pattern matching.
- Distill behavior from Kingsoft WPS first; sample `expected.docx` files come from WPS Office desktop exports.
- Refer to `libreoffice/core` WW8 implementation as the secondary source because it already converts `.wps` to `.docx` correctly most of the time.
- If you need a visual comparison, first convert the DOCX files to PDF with `soffice` and compare the PDFs instead of judging the DOCX render directly.
- Fail fast when required structure is missing instead of silently guessing.
- Do not add backward-compatible fallback paths unless the user explicitly asks for them.
- If you fix something, add or update a test that prevents the same breakage from coming back.
- Do not hardcode default values unless there is strong evidence to do so, such as a spec, a parsed binary property, or LibreOffice behavior; record that evidence in a code comment next to the decision.
- `WpsCustomData` should not be treated as the source of truth for `w:defaultTabStop` in this repo. Keep the tab-stop logic driven by parsed document settings; if a value is missing, use a clearly commented Gary judgment fallback and add a regression test. Do not reintroduce profile-code-based mapping here without hard evidence.
