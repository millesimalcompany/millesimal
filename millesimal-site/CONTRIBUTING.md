# Arguing with the Standard

A standard that only its author defends is not a standard. This file explains how to
disagree with the Millesimal Standard in a way that can actually change it.

**You do not need permission to use the Standard.** It is CC BY 4.0. You do not need to
contribute anything, adopt anything, or tell us you are using it. This file is only for
people who want to change the text.

---

## What a useful objection looks like

The Standard is adjudicated against real meetings with real money attached, so an objection
is useful in proportion to how specific it is.

**Strong:**

> Criterion 6 fails a meeting where the qualifying attendee joins for eight minutes and hands
> off to a colleague who does satisfy criterion 1. In enterprise procurement that is normal
> and the current wording penalises the agency for it. Proposed: attendance is satisfied where
> any attendee independently satisfies criterion 1 for the duration.

**Weak:**

> Criterion 6 is too strict.

An objection that names the criterion, gives the fact pattern that breaks it, and says what
the text should be instead can be argued with. One that does not, cannot.

---

## How to raise one

**Open an issue** on this repository, or email **hello@millesimal.uk**. Both reach the same
place. Use the shape below — it is not a form, just the information that makes a change
possible.

```
Criterion or rule:     e.g. criterion 5 (Consent), or rule R3
Version:               v1.0
The fact pattern:      the real situation the current text handles badly
Why the text fails:    what it decides, and why that is the wrong answer
Proposed wording:      what it should say instead
Who this affects:      buyers, agencies, or both — and in which market
```

If your objection is that a criterion is unworkable **in your market specifically**, say which
market. A criterion that works in UK mid-market SaaS and breaks in enterprise procurement is
not a broken criterion; it is a scope note that has not been written yet.

---

## What happens to it

1. **Logged.** Open arguments are tracked in [`CHANGELOG.md`](CHANGELOG.md) under *Unreleased*,
   whether or not we agree with them.
2. **Answered in public.** Including where the answer is no. An objection dismissed quietly is
   an objection that gets made again.
3. **Comment period.** A change that alters what passes or fails is published in draft with a
   rationale and not less than 30 days for argument before it comes into force.
4. **Credited.** If your argument changes the text, you are credited on the published Standard
   by name unless you ask not to be.

Changes never apply retrospectively. A ruling issued under v1.0 stays a v1.0 ruling forever,
and the v1.0 text stays published so it can still be read.

---

## The review panel

Named practitioners who agree to argue with the Standard in public, credited on the published
version, free to disagree with it after publication. There is no cost, no commitment to adopt,
and no requirement to be polite about it.

The panel exists because a definition written by one party and defended by one party is a
pricing page with footnotes. Ask to join at
[millesimal.uk/#panel-form](https://millesimal.uk/#panel-form).

---

## Site code

Pull requests on the site itself are welcome for the unglamorous things: accessibility fixes,
broken links, rendering bugs, typos, metadata errors.

**Please do not** open PRs that:

- add a build step, framework or package manager — the site is static HTML, one stylesheet and
  one script, and stays that way so it still renders in ten years;
- add analytics, tracking pixels, chat widgets or third-party embeds;
- change the substantive text of the Standard (raise an issue instead — the text changes through
  argument and a comment period, not through a merge);
- soften a published commitment. If a commitment is wrong it should be removed openly and the
  removal noted, not quietly weakened.

Run it locally with `python3 -m http.server 8000`. That is the whole toolchain.

---

## What we will not accept

**Evidence.** Never through this repository, an issue, a pull request or the website contact
form. Real meetings are filed separately under the adjudication agreement.

**Recordings.** No call recordings or transcripts, at any time, for any reason — including as
an illustration in an issue. Rulings are made on the written record both parties agreed to
produce, which is also the only class of evidence a prospect never consented to have judged.

**Identifying detail about a real party.** Anonymise fact patterns before you post them. This
repository is public, including its history.

---

## Licence on contributions

Text contributions to the Standard are published under the same
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) licence as the Standard itself.
Code contributions are published under the MIT licence in [`LICENSE`](LICENSE). By opening a
pull request you agree to that.
