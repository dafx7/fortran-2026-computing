# CLAUDE.md: Computing Laboratory, FORTRAN 2026 Trial Class

This file is the single source of truth for this repository. Read it fully before doing anything.
If a request conflicts with this file, follow this file and say so.

## 1. Event facts (verified from the official TOR)

- Event: FORTRAN (Informatics Transformation) 2026, cadre event of HIMAIF, S1 Informatika, Telkom University.
- Day 2, "The Forge of Excalibur", Sunday 18 October 2026. Theme "Crown of Iron: The Oath of Camelot", jargon "Stand as One. Rise as Knights."
- We present for the DSIS expertise group (Data Science and AI). Roles: Data Scientist, Machine Learning Engineer, AI Engineer.
- Participants: S1 Informatika angkatan 2025. Classes are named after Knights of the Round Table. A class stays in its room; presenters rotate.
- Computing Laboratory runs 2 parallel rooms per round (Computing A, Computing B), 3 rounds, 6 sessions, 6 lab members.

| Round | Time (WIB) | Computing A | Computing B |
|---|---|---|---|
| 1 | 08:20 to 09:50 | KU1.03.07 (Lamorak) | KU1.03.06 (Pellinore) |
| 2 | 10:05 to 11:35 | KU1.02.15 (Galahad) | KU1.02.16 (Gawain) |
| 3 | 13:05 to 14:35 | KU1.03.12 (Kay) | KU1.03.13 (Gareth) |

Room changes: 15 minutes between round 1 and 2 (floor 3 to floor 2). ISHOMA 11:35 to 13:05 before round 3.

### Fixed 90-minute structure (hard stop at 90 minutes)
| Block | Minutes |
|---|---|
| Opening dan pengenalan konsep | 5 |
| Pengenalan Kelompok Keahlian dan karier | 10 |
| Pemaparan materi | 25 |
| Praktik langsung | 30 |
| Presentasi hasil dan penutup | 20 |

### The session must
1. Briefly introduce the lab: identity, focus, activities, role in the faculty.
2. Explain how the lab relates to DSIS: scope, technologies, career prospects.
3. Guide participants into groups of at most 5 people.
4. Have each group produce a simple mini-project through hands-on practice: a small tool that takes input and returns a meaningful, context-aware result.

### Rules
- Polite, inclusive language. No SARA, no insults, no discrimination, no harassment.
- No punishment, intimidation, or humiliation. No group is forced to present.
- Unfinished questions are directed to the presenters or the lab's official channels after the event.
- The committee gives appreciation to active groups and participants based on its own Day 2 evaluation. Our recording sheet only supports that; it holds positive, group-level notes, no names, and is never used for discipline (Komdis).
- Changes to presenters, material, or activity are coordinated with the committee by the lab coordinator, not by us.

## 2. Decisions already made (do not reopen)

- **No AI Agent content.** The TOR mentions AI Agents; that part is deliberately dropped. Do not add agents, LLMs, chatbots, or LLM-agent tools anywhere.
- **Session concept: "Dua Cara Belajar".** One tiny model (a straight line, y = w·x + b) is trained two ways:
  gradient descent (the ML way) and a genetic algorithm (the metaheuristic way). Core message: learning is optimization.
- **Mini-project: "Prediktor".** Each group picks or defines a fictional scenario, enters 6 to 10 data points, trains with GD and GA, compares, and uses the trained model to answer new inputs.
- **Presentations:** only 2 or 3 groups present, about 3 minutes each. Volunteers first; otherwise the facilitator invites groups with interesting contrasting results. Never random cold-calling.
- **Devices:** assume every group has at least one laptop. Members with only a phone join a groupmate's laptop. The tool must still work on a phone.
- **Network:** assume classroom Wi-Fi is unreliable. Everything runs in the browser; no server, no backend.
- **No printing by the lab.** Handout is digital, inside the tool.
- **Team split:** Team A (3 people) runs Computing A all day, Team B (3 people) runs Computing B. Per team: 1 lead presenter (same person all day), 1 floor facilitator, 1 timekeeper and recorder.
- **Class size assumption:** 30 to 40 participants, 6 to 8 groups. Room has projector, HDMI, whiteboard (unconfirmed; plan fallbacks). We bring HDMI and USB-C adapters.
- **Hosting:** free static host. Default Netlify Drop; GitHub Pages as alternative. No analytics, no forms, no cookies, no accounts.
- **Distribution:** committee shares the link before the session; QR code on slides; short link on the whiteboard; USB copy as fallback.
- **Participant background:** finished first-year programming (pseudocode in theory, GoLang in practicum). Do not assume Python, statistics, calculus, or any ML. Nobody writes code during the session.

## 3. About the lab (use only these facts)

- Name: Computing Laboratory, Fakultas Informatika, Telkom University.
- Focus: Computational Intelligence and Optimization, with competitive programming as the foundation of algorithmic thinking.
- Learning is treated as optimization (gradient descent). The lab works on metaheuristics (genetic algorithms, particle swarm optimization, ant colony optimization, simulated annealing, and the Komodo Mlipir Algorithm developed at Telkom University) and on ML grounded in optimization, beyond only calling libraries.
- 2026 publications (topics only, use as real examples): skin-tone bias in dermatology AI; 4-bit quantized small language models with CoT/PoT prompting; edge-deployable video-LLMs; a hybrid bee colony algorithm for itinerary recommendation.
- Official channels: Instagram https://www.instagram.com/computing.lab/ (@computing.lab) and website https://computinglab.tech
- Recruitment is closed this year. Never promise or mention registration or open recruitment.
- Unknown, must be marked `[KONFIRMASI: ...]` instead of invented: the lab's specific role in the faculty beyond the focus above, the exact technology stack the lab uses, member names, lecturer names, any numbers (members, awards, projects).

## 4. Writing rules

- All participant-facing and facilitator-facing text: Bahasa Indonesia, friendly but formal enough for a campus event, no slang.
- Write like a person: vary sentence length. Avoid the pattern "bukan X, tapi Y" / "bukan X, melainkan Y". Use no em dashes (—) and no en dashes used as dashes in Indonesian text.
- Code identifiers in English. Code comments in Bahasa Indonesia.
- All scenario data is fictional and neutral. No personal data, no sensitive topics, no grades or anything that ranks people.
- Brand colors: navy #0A2540, gold #F7B125.

## 5. Technical constraints

- Free tools only. No API keys, no secrets, no accounts, no network calls at runtime, no external CDNs or web fonts (system fonts only).
- Collect no personal data. Optional localStorage only for convenience (draft state), wrapped in try/catch.
- The site must work from a static host, offline after first load (service worker), and directly from `file://` (USB fallback; the service worker is simply skipped there).
- Pin every dev dependency to an exact version. Runtime has zero dependencies.
