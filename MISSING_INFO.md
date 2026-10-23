# Missing Information & Placeholders

Everything below is **not** in the CV or was not explicitly approved for publication. The site uses clearly-marked placeholders for these items — please provide/approve them to replace the placeholders.

## Needs user input

1. ~~**Profile photograph** — none provided. The hero uses an initials avatar placeholder ("SWZ"). Provide a professional photo to replace it.~~ ✅ Resolved 2026-10-23: user-provided photo added (`public/profile-photo.jpg`, shown in the hero).
2. ~~**LinkedIn URL** — not in the CV. Contact/social sections show a clearly-marked "LinkedIn — not provided yet" placeholder. **No URL was invented.**~~ ✅ Resolved 2026-10-23: user provided `linkedin.com/in/syed-waqar-raza-zaidi-65672b242`; chatbot knowledge base updated too.
3. ~~**Phone number approval** — `+92 332-8569629` appears on the CV but is **NOT published** on the website. It will only be added with explicit approval.~~ ✅ Resolved 2026-10-23: user approved publication; the number is now shown in the Contact section and included in the chatbot knowledge base.
4. **Project screenshots / preview images** — resolved 2026-10-23: designed per-project thumbnails (unique colour schemes) added to all 9 project cards and detail pages (`public/projects/*.jpg`); AI Sentiment Analyzer uses its GitHub repo card. Real app screenshots can replace them later if provided.
5. ~~**GitHub audit (2026-10-23):** verified live via the GitHub API that `github.com/waki44` exists with 4 public repos — DataNest-AI-Assistant (already linked), ai-sentiment-analyzer and fbr-wala (both now added to the site as projects), and **Autonomous-code-autitor** ... it has NOT been linked yet.~~ ✅ Resolved 2026-10-23: user confirmed he deleted the `waki_44` account himself (not renamed) and asked that the `waki_44` profile stay listed on the site exactly as on the CV — it remains in the Contact section. The `waki_44/ai-detector` repository was deleted by mistake and the user no longer has that project; the dead repo link has been removed from the AI Content Detector project page (the project itself remains on the site as part of the CV history).
6. **Project detail gaps** — the CV gives 2–3 bullet points per project. "Problem / contribution / key features" on detail pages are written strictly from those bullets; richer case-study detail (metrics, dates, team size, screenshots) would need user input.
6. **Project detail gaps** — the CV gives 2–3 bullet points per project. "Problem / contribution / key features" on detail pages are written strictly from those bullets; richer case-study detail (metrics, dates, team size, screenshots) would need user input.
7. **Employment dates** — no start/end dates for the Duo Byte AI role or FUUAST team-lead role in the CV. The site omits dates rather than inventing them.
8. **Relevant coursework** — not listed in the CV for the BS Artificial Intelligence degree. Omitted.
9. **Contact form delivery** — the form validates and accepts submissions server-side, but no email/CRM service is connected (no credentials provided). Submissions are logged server-side only until an email service (e.g. Resend/SMTP) is configured.
10. **API keys for the live chatbot** — an OpenAI (or OpenAI-compatible) API key must be supplied in `.env.local` (see `.env.example`) and `npm run ingest` run once before the chatbot can answer live. Without a key the chat shows a clear "not configured" message.

## Verified from the CV (used on the site)
- Name, title, location (Islamabad, Pakistan), email `syedwaqarraza27@gmail.com`
- Professional summary, all skill groups, all 7 projects with their CV descriptions and technologies
- Live/demo links: GymPro demo, RumiCloud demo; GitHub repos: DataNest AI Assistant, AI Content Detector
- Experience: Duo Byte AI (Tech Lead & Content Creator, @duobyte_AI), FUUAST Academic Project Team Lead (teams of 3–4)
- Education: BS AI, FUUAST (Semester 5, expected 2028); ICS, FBISE
- 6 certifications (Google/Coursera and IBM/Coursera marked "Verified" in the CV)
- Languages: Urdu (native), English (intermediate)
