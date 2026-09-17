# Millesimal

**An independent judge for outbound sales meetings.**

This repository is the public site for Millesimal and the canonical published text of
**the Millesimal Standard v1.0** — a public definition of a qualified outbound sales meeting.

Live at **[millesimal.uk](https://millesimal.uk)**.

---

## What this is

Every outbound engagement in B2B rests on a phrase almost nobody defines precisely:
*a qualified meeting*. Buyers pay per meeting. Agencies bill per meeting. When the invoice
arrives, the two parties discover they meant different things — and the only two people who
can settle it are the two people with money riding on the answer.

Millesimal judges instead. Seven criteria, decided separately, with one written ruling issued
to both parties at the same moment.

The Standard itself is free to use, cite and adopt. No permission required, no attribution
required, no licence to accept.

---

## Repository contents

| Path | What it is |
|---|---|
| `index.html` | Homepage — the narrative entry point |
| `standard.html` | The Millesimal Standard v1.0, in full, with per-criterion permalinks (`#c1`–`#c7`) |
| `rulings.html` | How to read a ruling, plus the three worked specimens |
| `independence.html` | The eight published commitments and the adjudicator disclosure position |
| `pricing.html` | Buyer route — pricing, evidence, and the hard questions |
| `adopt.html` | Agency route — certification, the rating, and what it costs you |
| `404.html` | Not-found page |
| `assets/millesimal.css` | The whole design system |
| `assets/millesimal.js` | Motion and interaction — progressive enhancement only |
| `assets/og.png` | Open Graph card |
| `MV-2026-*.pdf` | Three specimen rulings |
| `Millesimal-Adoption-Pack-v1.0.pdf` | Adoption pack |
| `CHANGELOG.md` | Version history of the Standard |
| `CONTRIBUTING.md` | How to argue with the Standard |

---

## Citing the Standard

```
Millesimal (2026). The Millesimal Standard v1.0: a public definition of a
qualified outbound meeting. millesimal.uk/standard.html
```

Individual criteria are permalinked and stable:
`millesimal.uk/standard.html#c5` is criterion 5 (Consent), and always will be.

### Contract clause

```
A meeting is a Qualified Meeting for the purposes of this agreement if, and only if,
it satisfies all seven criteria of the Millesimal Standard v1.0 (Role, Fit, Awareness,
Need, Consent, Attendance, Novelty), as published at millesimal.uk/standard.

The Ideal Customer Profile and the suppression list shall be agreed in writing before
outreach begins and shall not be varied retrospectively.

A Qualified Meeting is deemed accepted unless the Buyer contests it, against a named
criterion, within three (3) business days of the meeting.

Where the parties do not agree, either may refer the meeting for independent
determination against the version of the Standard in force on the date the meeting
occurred.
```

*Drafting scaffold, not legal advice.*

---

## Local development

No build step, no dependencies, no framework. It is static HTML, one stylesheet and one script.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Edit and reload. That is the whole toolchain, and it is deliberate: a standards body's
site should still render in ten years without a package manager being involved.

### Design constraints

- **Two grounds only** — ink (`#0B0B0A`) and bone (`#F4F1EB`).
- **Four parties, four fixed colours** — agency teal, buyer blue, prospect purple, judge orange.
  A colour never changes meaning between pages. The neutrality argument is carried by the
  colour system rather than asserted in copy.
- **Motion is instrumentation, not marketing.** Things measure, settle and strike. Nothing bounces.
- **Everything degrades.** Every element resolves to its final state with JavaScript disabled,
  and again under `prefers-reduced-motion: reduce`.

---

## Deployment

**millesimal.uk is served by Vercel.** Connect this repository to the Vercel project and
every push to `main` deploys automatically. There is nothing to build — Vercel serves the
files as they are.

`vercel.json` sets security headers, asset caching, and a set of short redirects:
`/standard`, `/rulings`, `/pricing`, `/adopt`, `/buyers`, `/agencies`, and the
`/v/MV-2026-XXXX` verification paths printed on the specimen rulings.

`.github/workflows/guard.yml` runs on every push and fails the build if anything matching
the private-content patterns is ever committed. `.github/workflows/pages.yml` is a manual
GitHub Pages fallback and does not run on push; `CNAME` and `.nojekyll` exist only for that
fallback and are ignored by Vercel.

Any other static host works identically.

## What is deliberately not in this repository

**The repository is public.** Everything committed to it is readable by anyone, including
commit history, and PDFs are indexed by search engines.

- No client evidence, no real rulings, no party names. The published rulings are specimens,
  and their adjudicator line carries a placeholder. On a real ruling that name is completed,
  because the parties to that ruling are entitled to it — but it is disclosed to them, not
  published here.
- No internal runbooks, business plans or commercial models.
- No adjudicator identity. Disclosure happens to the parties to a ruling, before they submit
  evidence, with a right of objection — which is how disclosure works everywhere it carries
  weight.

The repository is a shop window, not a filing cabinet.

---

## Independence

Millesimal does not book meetings, does not sell leads, takes no referral fees and earns no
commission. The fee is flat and identical whichever way a ruling goes. The eight published
commitments are at [`independence.html`](https://millesimal.uk/independence.html), each stated
as a way Millesimal could be bought and the thing that prevents it — including one (07) that is
published with its downside admitted rather than dressed up as a virtue.

---

## Licence

- **The Millesimal Standard v1.0** — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
  Use it, adapt it, put it in your contracts. Attribution appreciated, not required.
- **Site code** — MIT. See [`LICENSE`](LICENSE).
- **The Millesimal name and mark** — not licensed. Do not imply certification or endorsement
  that has not been issued.

---

## Disagreement

If a criterion is wrong, unfair or unworkable in your market, say so. That is how version 1.1
gets written, and the arguments that change the Standard are published alongside it.
[`CONTRIBUTING.md`](CONTRIBUTING.md) explains how, or email **hello@millesimal.uk**.

A standard that only its author defends is not a standard.
