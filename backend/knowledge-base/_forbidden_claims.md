---
id: _forbidden_claims
title: Forbidden Claims (Post-Filter Denylist)
tags: [guardrail, denylist, internal]
populated: true
internal: true
---

# How this file is used

This file is loaded by the post-filter and used as a **substring denylist** against the
assistant's final output. If any of the strings below appear in the assistant's response,
the response is rejected and replaced with the consultant-handoff fallback. The visitor
is not shown the denylisted text. A Winston log line is written:
`concierge.guardrail.tripped { rule: "forbidden-claim", match: "..." }`.

This file is **internal**. It is not injected into the system prompt as KB content
(its frontmatter `internal: true` causes the loader to exclude it from `[KB]`). It only
feeds the post-filter.

# Forbidden partner / client claims

The following names appear as **placeholder content** in the current Kangqore website
hero (HomePage.jsx heroSlides, caseStudies, newsItems sections) and on the homepage as
press releases. Until each one is verified in writing by Kangqore Marketing/Legal, the
Concierge **must not** assert any of them as a client, customer, partner, or
collaborator of Kangqore.

- Microsoft
- Bupa
- Bupa Hong Kong
- Storebrand
- Storebrand Bank
- Mead Johnson
- Mead Johnson Nutrition
- Blue Cross NC
- Blue Cross Blue Shield
- Everest Group

# Forbidden ranking / award claims

Until verified by Kangqore Marketing/Legal:

- "Leader in the Everest Group"
- "PEAK Matrix"
- "Named a Leader"
- "Industry-leading"
- "Best in India"
- "Best in Asia"
- "Top firm"
- "#1 in"

# Forbidden location claims

- "offices across the globe"
- "international branches"
- "offices worldwide"
- "offices in the USA"
- "offices in US"
- "offices in UK"
- "offices in Europe"
- "offices in Singapore"
- "offices in UAE"
- "global presence" (in the context of physical offices)

# Forbidden commercial claims

- "We guarantee"
- "We promise"
- "Your ROI will be"
- "We will deliver in"
- "Free consultation" (unless a published KB chunk explicitly says so)
- "Free audit"
- "No obligation"
- "Fixed price" (without a discovery conversation)

# Forbidden comparison phrases

The post-filter additionally uses regex (not substring) to catch competitor comparison
phrases like "better than (Infosys|TCS|Wipro|Accenture|Deloitte|Capgemini|Cognizant|HCL|TechMahindra|Mindtree|Mphasis|Happiest Minds)".
This file documents the policy; the regex lives in `concierge.guardrails.ts`.
