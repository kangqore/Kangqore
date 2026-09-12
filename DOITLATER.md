# Do It Later — Commercial Credibility Backlog

Actions that would change whether a buyer onboards Kangqore, captured from the
review of `/services/microsoft-services` on 2026-09-12. Nothing here is a bug.
The page scores 39/40 on the quality rubric and reads well. These are the things
standing between "this is a good page" and "we should talk to these people".

Related: [`docs/DEFERRED.md`](docs/DEFERRED.md) tracks engineering debt. This file
tracks commercial and positioning debt. If an item here becomes a code change,
move it there.

**The finding this all comes from:** the page argues well and proves nothing.
Argument quality rates ~9/10, proof ~2/10. A technical evaluator reads the FAQ
and wants to meet us. Procurement asks for three references and we have none.

---

## Do now — content, no dependencies

### 1. Stop leading with the partner-tier answer · P1

The FAQ feed widget near the top of the page **pins at Q 1/15 and never rotates**
(sampled over 9 seconds). So the first thing a visitor reads is:

> *Are you a Microsoft partner, and what tier?* → "We hold no Microsoft partner tier..."

That is an objection-handler doing the work of a headline. We volunteer our
weakest fact before anyone asks for it.

**Do:** reorder `customFAQs` so a value question holds slot 1. Either *"Our Azure
bill keeps growing and nobody can explain it"* or *"Are we paying for Microsoft
licenses nobody uses?"* — both lead with the buyer's problem instead of our gap.
Keep the partner question, move it to slot 5 or later where it reads as candour
in a conversation already going well.

**Where:** `frontend/src/data/servicesData.js`, `'microsoft-services'` →
`customFAQs`. Reorder only, no rewriting. Regenerate the snapshot after.

**Effort:** minutes. Cheapest change on this list.

### 2. Reframe the same fact so it opens with the advantage · P1

Identical truth, opposite opening:

> **Now:** "We hold no Microsoft partner tier and we do not resell Microsoft licensing."
>
> **Instead:** "Your Microsoft licensing is not our revenue. We take no reseller
> margin and carry no product quota, so when we say an E3 tenant covers the
> requirement, there is no commercial reason for us to say otherwise."

Keep the tier admission — it is genuinely disarming — but in the third paragraph,
where it lands as candour rather than apology.

**Where:** same block, FAQ 1 answer text.

### 3. State the risk reversal instead of implying it · P2

We cannot manufacture references. We can remove the buyer's downside, which is
what a firm without references offers instead:

- Fixed fee, fixed duration, written findings **the client owns and can take to
  anyone**
- *"If the assessment finds your estate sound, we say so and recommend nothing."*
  This is already implied in FAQ 2 and buried. Make it a stated commitment on the
  engagement section.
- Say plainly what they walk away with whether or not they continue with us.

**Where:** `servicePackages` → Microsoft Estate Assessment, plus `closingCta`.

---

## Do next — needs someone to act outside the repo

### 4. Join the Microsoft AI Cloud Partner Program · P1

Free and immediate. Once registered we can accurately say "Microsoft partner",
which removes the bluntest version of the credibility gap at zero cost.

**Blocked on:** somebody registering. Nothing technical.

### 5. Get individual Microsoft certifications · P1

The fast path, and the one most people skip because they are waiting on a
Solutions Partner designation instead.

- **Certifications need no customers.** AZ-305, AZ-104, SC-200, PL-600 are
  exam-only and reachable in weeks by engineers already doing this work.
- Converts *"we hold no tier"* into *"our engineers hold N Microsoft
  certifications across Azure, Security and Business Applications"* — real,
  verifiable, and checkable by the buyer.
- **Solutions Partner designations** require customer adds and performance
  metrics, so they come later. Do not wait on them to start.

**Unblocks:** rewriting FAQ 1 from an absence into a credential, and adding a
certifications line to the page.

### 6. Land one named reference client · P1 — the single biggest blocker

One named client removes more doubt than everything else on this list combined.
Right now every outcome on the page carries *"modeled on typical engagement
patterns, not a specific client result"* — three times. Honest, and not evidence.

**The standard route:** a materially discounted first engagement in exchange for
a named reference and a written case study, **agreed up front in writing**. Most
firms' first logo is bought this way.

**Unblocks:** replacing the illustrative outcome cards with a real one, and
answering "can we speak to a reference" with yes.

### 7. Name two or three real engineers · P2

Schema currently names one person: Mahesh Kumar. A founder and a website.

Adding two or three real engineers with real LinkedIn profiles and real histories
is legitimate E-E-A-T and reads as a firm. **Never invent a person** — this only
happens with real names, real titles and real profiles.

**Where:** `frontend/src/seo/serviceSchema.js` currently exports a single
`REVIEWER`.

---

## Also open, from the same review

### 8. Publish a price signal · P2

No band, no range, no "from" anywhere on the page. Enterprise buyers use price to
self-qualify. **No price plus no clients means a buyer cannot tell whether we are
three people or three hundred**, and the safe assumption is three. Even a broad
band on the assessment would help.

### 9. Name Microsoft products in the capability catalogue · P2

The technology-stack panel names Fabric, Purview, Defender and Sentinel. The 85
items we say we **sell** name almost none of them — Fabric, Azure OpenAI, Entra,
Purview, Defender, Intune, Dataverse and Arc are all absent from the catalogue.
Buyers and LLMs both read the catalogue, not the diagram.

### 10. Fix the engagement section rendering · P1 — engineering

The section where a buyer decides to contact us is the weakest-rendering section
on the page:

- **"YOU LEAVE WITH" appears four times with nothing under it.** Deliverables sit
  behind a click most scanners never make.
- **Durations never render at all.** `pkg.duration` is read nowhere in
  `UniversalServicePage.jsx`; "3 to 4 weeks" reaches the crawler snapshot and no
  human ever sees it.
- **Only 4 of 6 packages are visible** on the page; all six are in the snapshot.

This is the same pattern as the 459 crawler-only bullets in `docs/DEFERRED.md`:
we write substance and display labels.

---

## Not to be done

Stated explicitly so nobody reaches for them under pressure:

- **Do not claim a partner tier we do not hold.** A Microsoft-literate buyer
  checks this first, and it is checkable.
- **Do not invent clients, logos or case studies.**
- **Do not imply certifications nobody has sat.**
- **Do not invent a person** for E-E-A-T.

The honesty currently on the page is an asset. The fix is to earn the
credentials, not to fake them — and in the meantime, to stop leading with the gap.
