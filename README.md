# TrustLens

**Don't ask if it's fake. Ask if you can trust it.**

TrustLens is an explainable deepfake and synthetic-media detector for images, video and audio.
Built for **Prompt Wars × HackWIE (IEEE Day 2026, IEEE WIE MSIT)** under
**Challenge 02 — Open Innovation** (AI, software, automation and emerging technologies).

Live demo: https://trust-lens-zeta.vercel.app

## The real-world problem
Synthetic media is now cheap to make and hard to verify. Everyday people, students,
journalists and small organisations regularly receive images, videos and voice notes
they cannot check before trusting or forwarding them.

Most detection tools return a bare "real" or "fake" label. With no reasons given, a
verdict is hard to trust, hard to challenge, and impossible to hand to someone else
as evidence.

## Our original solution
TrustLens shows its work:
- **Trust Score (0-100)** with a colour *and* text verdict (Trusted / Use Caution / Manipulated)
- **"Why?" Evidence Panel** — flagged findings, confidence bars, metadata analysis, source check
- **Evidence Locker** — SHA-256 file fingerprint plus a downloadable JSON verification report
- **Scan history** that updates live
- Works on **images, video and audio**

## Working prototype status (honest scope)
Everything above is working end-to-end. Without a detection API key the app runs in a
clearly labelled **demo mode**: file hashing, structured findings and the report are real,
but the "is it fake" score is simulated and the UI says so. Setting `HIVE_API_KEY`
switches `convex/analysis.ts` to live detection (see the last section).

## Tech stack
Next.js 14 · React 18 · TypeScript · Tailwind CSS · Convex (database, storage, auth, background actions) · Vitest

## Testing
```
npm test          # run the unit + component tests once
npm run test:watch
npm run typecheck
```
Tests cover the trust-score/verdict boundaries, finding generation, demo-analysis
determinism, report generation, and the accessibility labelling of the score badge
and evidence panel. The scoring logic lives in `convex/lib/scoring.ts`.

## Accessibility
Skip-to-content link, visible focus states, keyboard-operable upload control, labelled
form fields, `role="alert"` errors, live status regions, alt text / labels on uploaded
media, ARIA progress bars, verdicts that never rely on colour alone, higher-contrast
secondary text, and `prefers-reduced-motion` support.

---

## Setup Runbook (no coding needed)

This app is fully built. You just need to install a few free tools and run
a couple of commands. Follow this in order.

## What's already built
- Login (email + password)
- Upload image/video/audio
- Background AI analysis (works out of the box in **DEMO MODE** — no paid
  API key needed for your demo. Swap in a real detector later, see bottom.)
- Trust Score with color-coded verdict
- "Why?" AI Evidence Panel (findings, confidence bars, metadata, source check)
- Evidence Locker (downloadable JSON report with file hash + findings)
- Scan history dashboard, live-updating

## 1. Install Node.js
Download and install from https://nodejs.org (choose the "LTS" version).
This gives you `node` and `npm` in your terminal.

## 2. Open a terminal in this project folder
- Windows: open the `trustlens` folder, click the address bar, type `cmd`, hit Enter.
- Mac: right-click the `trustlens` folder → "New Terminal at Folder" (or open
  Terminal and type `cd ` then drag the folder in).

## 3. Install dependencies
```
npm install
```
This downloads everything the project needs. Takes 1-3 minutes.

## 4. Create your free Convex account + backend
```
npx convex dev
```
- This opens your browser and asks you to sign up at convex.dev (free, use
  GitHub or Google to sign up in one click).
- It will ask you to create a new project — name it `trustlens`.
- Leave this terminal window **running** — it's your live backend. Don't close it.
- It automatically creates a `.env.local` file with your `NEXT_PUBLIC_CONVEX_URL`
  filled in. You don't need to touch this.

## 5. In a SECOND terminal window, start the app
```
npm run dev
```
Then open **http://localhost:3000** in your browser.

## 6. Try it
- Sign up with any email/password (this is your own account, stored in your
  own Convex project — nothing shared).
- Upload an image/video/audio file.
- Watch it move from "Analyzing..." to a Trust Score automatically.
- Click into a scan → see the Evidence Panel → download the report.

**Important for your demo:** right now, analysis runs in DEMO MODE — it uses
real forensic concepts (file hashing, structured findings, metadata) but the
actual "is it fake" scoring is simulated, not a live AI model. This is
clearly labeled in the UI ("demo analysis, not a real detection result") so
you're not misrepresenting it. This is normal for a hackathon MVP — judges
care about the product experience and explainability UX, which is fully real.

## 7. (Optional, if you have time) Wire up a real detector
1. Sign up at https://hivemoderation.com and get an API key.
2. In your Convex dashboard (opens from the `npx convex dev` terminal, or at
   dashboard.convex.dev) → Settings → Environment Variables → add
   `HIVE_API_KEY` with your key.
3. That's it — `convex/analysis.ts` already checks for this key and switches
   from demo mode to calling Hive automatically. No code changes needed.

## If something breaks
- "Module not found" errors → run `npm install` again.
- Blank page → make sure BOTH terminals (`npx convex dev` and `npm run dev`)
  are still running.
- Upload doesn't work → check the `npx convex dev` terminal for red error text.

## Project structure (for reference)
```
convex/schema.ts     -> database tables
convex/auth.ts        -> login system
convex/scans.ts       -> upload + scan history logic
convex/analysis.ts    -> the actual "AI analysis" (demo mode + real API hook)
app/dashboard/        -> main screen (upload + history)
app/scan/[id]/         -> results screen (trust score + evidence panel)
app/components/        -> reusable UI pieces
```
# TrustLens
