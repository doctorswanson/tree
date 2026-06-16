# `tree` — Vision & Build Spec

*Handoff document for Claude Code. This is the source of truth for what to build and, just as importantly, what **not** to build.*

---

## 0. What this is (read this first)

**`tree` is a deterministic, RPG-skinned tracker for a real cybersecurity / computer-science career.**

It is **not a game.** There is no dice, no clock, no failure, no stamina. The "gaming" comes entirely from the *interface* and what it *reflects back* to you: you log real things you've actually done, and the app renders your career as a character — skill trees filling, attributes deriving, classes unlocking, an adaptive title naming your build.

The player is logging **reality**. The app's job is to make that logging feel like leveling up a character, and to surface an emergent "build/meta" from the choices a real career represents.

One-line model:

> A deterministic, graph-driven career tracker where real certifications, degrees, projects, and roles are logged as "quests" that raise skill trees, derive attributes, auto-unlock classes, and crown an adaptive title — fully private, offline, and extensible by the user.

---

## 1. Design pillars (non-negotiable)

1. **Deterministic & derived.** The only thing that persists is the user's *log*. Skills, attributes, classes, title, gold, reputation, and credentials are all *computed* from that log, every render. No hidden mutable state, no stored derived values, no RNG to persist. Same log in → same character out, always.
2. **You log reality.** Every entry represents something the user actually did. Therefore: no random outcomes, no penalties, no failure states, no time pressure. The app never punishes the user.
3. **Never blocked — user-extensible.** The shipped catalog is a *starting set*, not a fixed menu. The user can log a custom achievement anywhere the catalog falls short (their niche cert, an unusual project) in seconds. This is a first-class feature, not an escape hatch.
4. **RPG as a mirror, not a ruleset.** Attributes, classes, and titles *describe* the character that the log implies. They do not gate or buff anything mechanically. They're the reward, and the reward is *recognition*.
5. **Standalone & private.** Runs locally, offline, no account, no server. Data lives on-device (localStorage) with JSON export/import so a character is portable and backupable. This is what makes it a "download and play on your own" app.

---

## 2. Core loop

```
Log a real achievement
      → grants XP to one or more skills
      → skills recompute (0–100)
      → attributes re-derive (mirror of skills)
      → classes you now qualify for auto-unlock
      → adaptive title re-evaluates your whole spread
      → related catalog entries become visible/available (unlock graph)
      → you see what you've become, and what's next
```

No turns. No "advancing." The character simply *accretes* as you log your real path.

---

## 3. Data model (the heart)

### What persists (the save file)

```
Character {
  name: string
  log: LogEntry[]            // the ONLY source of truth
  customCatalog: Catalog[]   // user-created reusable entries (optional)
  createdAt, updatedAt
}

LogEntry {
  id: uuid
  catalogId: string | null   // references a catalog item, OR null if fully custom
  custom?: {                 // present when catalogId is null OR when overriding
    name: string
    type: "cert"|"degree"|"role"|"project"|"side"|"milestone"|"other"
    skillXP: { [skillId]: number }
    credential?: string
    gold?: number
    rep?: number
    faction?: string
  }
  date?: string              // user-supplied "when", display only
  note?: string
}
```

That's the entire persisted state. Everything below is **derived at runtime** and never stored.

### What's derived (computed every render)

- `skills[skillId].xp` = Σ over `log` of each entry's `skillXP[skillId]`
- `skills[skillId].level` = `lvl(xp)` (formula in §6)
- `attributes[ATTR]` = mean of the levels of skills that feed that attribute (§5)
- `classes` unlocked = every class whose skill thresholds are met (§9)
- `formalRank` = highest-tier unlocked class
- `title` = adaptive title engine output (§10)
- `gold` = Σ entry.gold; `reputation` = Σ entry.rep (global + per-faction)
- `credentials` = list of entry.credential values present in the log

### Catalog item (shipped seed content + user customs)

```
Catalog {
  id, name, type, line                 // line: main|cert|degree|side|faction|hidden
  desc
  skillXP: { [skillId]: number }
  prereq?: { skills?: {[id]:level}, entries?: catalogId[] }  // SOFT gate (see §7)
  credential?, gold?, rep?, faction?
  unlocks?: catalogId[]                 // reveals hidden entries (unlock graph)
  repeatable?: boolean
  hidden?: boolean                      // not shown until revealed by an unlock
}
```

> **Seed data note for Claude Code:** the working prototype `cyber-character-builder.html` already encodes a full, tested set of `SKILLS` (26) and `CLASSES` (~40) as plain arrays. Lift those arrays as the v1 seed catalog rather than re-authoring. This doc defines the *rules*; the prototype carries the *starting data*.
>
> **Update (post-launch content pass):** `QUESTS`/`CATALOG` has since grown well past the prototype's ~40 entries to **187 catalog items** in `src/data/catalog.ts` — 68 certs, 17 degrees, 61 side quests/projects (with explicit coverage of every skill, including the previously-thin Rare Arts), 26 faction roles across a full seniority ladder, and 15 career milestones. Treat 187 as the current floor, not a ceiling — the catalog is meant to keep growing.

---

## 4. Skills & trees

26 skills, grouped into 7 collapsible categories. Each is 0–100, XP-driven, fed only by logged entries.

| Category | Skills |
|---|---|
| **Development** | Programming |
| **Infrastructure** | Systems, Networking, Automation, Architecture |
| **Security** | Security, Offensive Security, Defensive Security, Incident Response, Threat Hunting, Digital Forensics, Malware Analysis, Governance/Risk/Compliance |
| **Data & AI** | Data, Machine Learning / AI |
| **Cloud** | Cloud |
| **Leadership** | Leadership |
| **Rare Arts** ✦ | Reverse Engineering, Exploit Development, Cryptography, OSINT, Social Engineering, Hardware Hacking, AI Security, Bug Bounty Hunting, Security Research |

"Rare Arts" are tagged but **not hidden** — the user starts blank and may pour points anywhere from day one (per the "don't box me in" principle). Splitting Security into sub-skills (Offensive vs Defensive vs IR…) is deliberate: it's what lets the title engine detect a Purple Teamer instead of a generic "Security" blob.

### Skill → attribute feed map

| Skill | Feeds |
|---|---|
| Programming | INT, WIL |
| Systems | WIS, DEX, CON |
| Networking | DEX, INT |
| Automation | DEX, WIL |
| Architecture | INT, WIS, CHA |
| Security | INT, WIS |
| Offensive Security | INT, DEX |
| Defensive Security | WIS, CON |
| Incident Response | WIS, DEX, CON |
| Threat Hunting | WIS, INT |
| Digital Forensics | WIS, INT |
| Malware Analysis | INT, WIL |
| GRC | WIS, CHA |
| Data | INT |
| Machine Learning / AI | INT, WIL |
| Cloud | INT, WIS |
| Leadership | CHA, WIS, CON |
| Reverse Engineering | WIL, INT |
| Exploit Development | WIL, INT |
| Cryptography | INT |
| OSINT | WIS, DEX |
| Social Engineering | CHA, WIS |
| Hardware Hacking | DEX, WIL |
| AI Security | INT, WIL |
| Bug Bounty Hunting | DEX, WIL |
| Security Research | WIL, INT |

---

## 5. Attributes (the six)

INT, WIS, DEX, CON, CHA, WIL. **Derived readouts only — they have zero mechanical effect.**

- `attributePct(ATTR)` = mean level of all skills that feed it (0–100).
- Display as a D&D-style score: `score = 8 + round(pct/100 * 12)` → range 8–20.
- Modifier = `floor((score - 10) / 2)`, shown as e.g. `DEX 14 (+2)`.
- Plus a 0–100 bar.

> **Reconciliation:** the original doc had attributes *multiply* skill gain (`SkillGainMultiplier = f(Attribute)`). **Cut.** That creates a rich-get-richer feedback loop and breaks determinism's clarity. Attributes are a mirror of the build, nothing more.

---

## 6. XP & leveling

### Skill level from XP

```
cumulativeXP(level) = round(5 * level^1.5)
level(xp)           = min(100, floor((xp / 5)^(1 / 1.5)))
```

Worked table (XP needed to *reach* a skill level):

| Level | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|
| XP | 158 | 447 | 822 | 1,265 | 1,768 | 2,324 | 2,929 | 3,578 | 4,269 | 5,000 |

A skill caps at 5,000 XP. Catalog entries grant chunky amounts (a cert ≈ 200–500 to its skill; a degree spreads 300–700 across several; OSCP-tier ≈ 150–300 to Offensive Security). So filling a specialty to 70–90 takes a realistic career's worth of logged work — which is exactly the point.

> **Known bug (found via `vitest`, not yet fixed):** `floor((xp/5)^(1/1.5))` hits floating-point rounding just under integer boundaries, so the implementation is currently off-by-one-short at exact thresholds — e.g. `xp=5000` → `level 99` instead of `100`; `xp=158` → `level 9` instead of the `10` shown in the worked table above. Fix is a small epsilon before the floor (`floor(x + 1e-9)`), not a formula change. Tracked as a TODO in `src/engine/xp.ts`; 4 tests currently fail on this.

### Overall character level

```
overallLevel(totalXP) = floor((totalXP / 250)^(1 / 1.5)) + 1   // cap 99
```
`totalXP` = sum of all skill XP. (Tunable — flag for playtest.)

### XP grant amounts (difficulty presets)

Every loggable thing — shipped or custom — resolves to an XP budget via a difficulty tier. This is what makes custom logging fast and balanced:

| Tier | XP budget (total across chosen skills) | Example |
|---|---|---|
| Minor | ~40 | wrote a script, attended a meetup |
| Standard | ~120 | small cert, a side project, a CTF |
| Major | ~350 | major cert, a year in a role |
| Epic | ~700 | degree, OSCP, a multi-year role |

> **Reconciliation:** original XP formula `XP = Base * Difficulty * (1 + INT+WIS) * WIL` is **simplified to fixed budgets by difficulty.** No attribute multipliers (see §5). Repeatable entries may apply a *mild* soft-diminishing curve (e.g. each repeat of the same catalog id grants 90% of the previous) to avoid grind-farming — optional, low priority.

---

## 7. The Logbook (was "Quests")

Quests are reframed as **loggable achievements**. The Quests tab is really a catalog browser + a logging surface. Types map to `line`: `main` (career milestones), `cert`, `degree`, `side` (projects/activities), `faction` (roles/jobs), `hidden` (revealed by the unlock graph).

### Soft prerequisites, not hard gates

Catalog `prereq` (skill levels and/or prior entries) is **advisory**, not a lock. Rationale: this is a tracker of *reality*. If someone genuinely earned OSCP, the app must let them log it even if their tracked Networking is "only" 60. So:

- If prereqs are met → entry shows as "ready."
- If not met → entry still shows, flagged "stretch" with the unmet suggestions visible, and **still loggable**. Never block a true achievement.

(Hidden entries are the one exception to visibility — they stay hidden until the unlock graph reveals them, then behave normally. They're for *discovery delight*, not gating.)

### The Custom Entry path (top-priority feature)

Every list has an **"+ Log something else"** action. Flow:

1. Name it ("CRTO", "Built a malware sandbox", "Promoted to Lead").
2. Pick type.
3. Pick the skill(s) it should raise (1–3) + a **difficulty tier** (auto-splits the XP budget; advanced users can fine-tune per-skill amounts).
4. Optional: credential name, faction, gold/salary, note, date.
5. Log it → optionally **"save to my catalog"** so it's reusable later.

This is the feature that makes the app shippable to strangers: the catalog can never be "complete," so the user must always be able to extend it themselves, instantly, without a developer in the loop.

> **Reconciliation:** original Quest fields `failureState`, `retry cooldown`, `durationEstimate`, and the Available→Accepted→In-Progress→Failed lifecycle are **cut.** Logging is a single deterministic act: it either happened (log it) or it didn't (don't). An optional multi-`step` checklist *may* be kept as a way to log a big item incrementally (e.g. a degree's subquests), but it grants no partial mechanics — completing all steps = logging the entry.

---

## 8. Certifications & degrees as questlines

Keep this — it's the best idea in the system. A cert/degree is a catalog entry (optionally with `steps` as its subquests) that, when logged, grants skill XP **and** a `credential` (a trophy item, §12) **and** may `unlock` downstream entries and faction access. Examples already in the prototype: Security+, Network+, CySA+, eJPT, PNPT, OSCP, OSEP, AWS CP/Security, GREM, CISSP; Associate's and Bachelor's degrees.

---

## 9. Classes (identity, not power)

~40 classes across three tiers: **Advanced**, **Prestige**, **Legendary**. Each has skill-threshold requirements. A class **auto-unlocks** the instant the log satisfies its thresholds. The highest-tier unlocked class is the character's **formal rank**.

Classes are **identity snapshots only** — no perks, no buffs, no quest-gating. (Original doc's `perks: +ExploitXPBonus / +OffensiveQuestAccess` are **cut**; they reintroduce a game economy.)

Requirement pattern (full list lives in the prototype's `CLASSES` array):
- *Penetration Tester*: Security 70, Networking 70, Systems 70
- *Purple Team Operator* (Prestige): Offensive 75, Defensive 75, Security 80
- *CISO* (Legendary): Security 90, Leadership 90, GRC 80, Architecture 80

The **Classes** section of the Character sheet shows: unlocked classes (chips, colored by tier) + the 3–4 nearest locked classes with their met/missing requirements, so the user always sees a concrete next target.

---

## 10. Adaptive Title engine

The crown jewel. Reads the **whole** skill distribution and names the build. Never boxes the user into one lane. Priority-ordered rules (current prototype logic, refine freely):

1. **Empty** → "Unspecced Initiate."
2. **Hybrids** (checked before single-lane):
   - Offensive ≥55 **and** Defensive ≥55 → **Purple Team Operator**
   - AI Security ≥50, or (Security ≥55 and ML ≥50) → **AI Security Specialist**
   - Security + Cloud + Automation all ≥55 → **DevSecOps Engineer**
   - Programming ≥60 and (Offensive ≥50 or Security ≥55) → **AppSec Hacker**
   - Reverse Eng ≥55 and Exploit Dev ≥50 → **Vulnerability Researcher**
   - Leadership ≥60 with a strong technical peak → **`{specialist}` → Tech Lead**
3. **Breadth:** ≥9 skills at ≥40 → **Renaissance Technologist**; ≥6 skills at ≥40 with no single ≥75 → **The Polymath**.
4. **Single dominant:** map top skill → specialist title (e.g. Offensive → "Offensive Specialist", Systems → "Systems Wizard"), with a secondary-skill "-leaning" suffix when a clear #2 exists.

Each title ships with a one-sentence flavor description, regenerated on change. This is the emotional payoff — invest in making these titles feel *earned and specific*.

---

## 11. Factions & Jobs (merged — they were the same system twice)

A **Faction** is a career sector; a **Job** is a role you held inside one. The original doc described both separately (§8 and §14) — collapse them.

- Factions: **Government, Big Tech, Startup, Consulting, Defense.**
- Logging a role (a `faction`-line entry) grants: skill XP, **gold** (salary → career earnings), and **reputation** in that faction.
- Reputation is **derived and monotonic** — it only goes up, because it represents real accumulated experience. (Original −100/+100 "anger a faction" is **cut**; a tracker doesn't model you pissing off an employer.)
- Rep tiers (global): Unknown → Recognized → Respected → Renowned → Notable → Legendary.
- A faction panel can show your standing per sector and the roles you've logged there (a lightweight career ladder).

> **Implementation status:** the Factions module is built (`src/components/factions/FactionPanel.tsx`) and derives real per-faction `rep`/`roles` from the log (`src/engine/derive.ts` §6 Factions step). However it currently renders **raw numeric rep against a flat 0–100 bar**, not the six named tiers above — tier breakpoints were never defined or wired up. Treat the tier list as a Phase-2 follow-up, not done.

---

## 12. Items / Inventory (trophies)

Three kinds, all **display-only trophies** (no passive XP buffs — original `HomeLab: +Systems XP` mechanic is folded into the *one-time* XP the logging act already grants):

- **Credentials** — certs, degrees, clearances earned via logged entries.
- **Tools / Artifacts** — home lab, GitHub portfolio, personal site, a published CVE.
- **Badges** — milestone markers (first job, first talk, first bounty).

Inventory is a wall of earned trophies. It exists for pride and a sense of accumulation.

> **Implementation status:** only **Credentials** are built, as `CredentialWall` inside the Profile module (`src/components/profile/CredentialWall.tsx`) — a simple list of `entry.credential` values, no separate Inventory screen. Tools/Artifacts and Badges trophy kinds are not modeled anywhere in `derive.ts` yet; there's no `tool`/`badge` field on `LogEntry.custom` or `Catalog`. Still open.

---

## 13. The unlock graph (replaces "events")

The original "dynamic event system" is really just a **dependency graph**, and we already have it: entries carry `unlocks: [...]`, and logging one reveals hidden downstream entries ("logged your first CTF → Bug Bounty Hunter questline appears"). This is deterministic and needs no event engine or RNG.

This graph (skills, entries, certs, factions as nodes; prereq/unlock as edges) is also the natural basis for a future **World Map** visualization (Phase 3).

---

## 14. UI / screens (superseded — see redesign below)

> This section described the original four/five-screen plan. It has been superseded by a six-module redesign (below) that folds Inventory's credential piece into Profile, ships Factions and a Logs/Timeline screen in Phase 1 instead of Phase 2, and replaces the flat skill-tree accordions with a constellation graph. Left here for history; **the redesign subsection is current.**

### 14.1 Redesign: six-module shell (current)

Persistent shell on every screen: a top `StatusBar` (name, overall level, formal-rank badge, abbreviated gold, settings gear) and a bottom `ModuleNav` with six tabs. A floating **+** FAB jumps to Quests from anywhere except Quests itself.

| Module | Tab icon | Replaces / covers | Built as |
|---|---|---|---|
| **Profile** | ◉ | old "Character" screen's identity half | `ProfileHeader` (title/rank/level) + `AttributeRadar` (hex SVG radar of the six attributes) + `CredentialWall` |
| **Skill Trees** | ✦ *(default landing tab)* | old "7 skill-tree accordions" | `SkillConstellation` — each of the 7 categories is its own swipeable hub-and-spoke SVG cluster (`CategoryCluster`), Skyrim-constellation style, not a single force-directed graph and not flat accordions |
| **Quests** | ◫ | "Logbook / Quests" | `QuestBoard` + `QuestCard` — catalog browser, filter/search, **+ Log something else** custom-entry flow, unchanged logic from the original Logbook |
| **Class** | ◆ | "classes (unlocked + nearest)" from Character screen | `ClassGrid` — unlocked classes grouped by tier, "Within Reach" panel of nearest locked classes |
| **Factions** | ⚑ | **Factions (was Phase 2)** | `FactionPanel` — shipped now, not deferred; see §11 implementation-status note on rep tiers |
| **Logs** | ▤ | **Timeline (was Phase 2)**, reframed | `EventLog` — reverse-chronological list of every log entry with date/note/XP/delete; this *is* the timeline, just not graphical |

Net effect: **Factions, gold, reputation, and a timeline-equivalent (Logs) all shipped in this redesign pass, ahead of the original Phase 2 schedule.** Inventory's Tools/Badges trophy kinds and the World Map unlock-graph visualization remain unbuilt (§12, §13).

### 14.2 Visual identity (superseded again — see 14.3 below)

- **Layers, not flat black:** `void` (page bg) → `panel` → `panel-raised`, every module built on a `.panel`/`.panel-raised` card primitive with a subtle inset highlight + drop shadow for elevation.
- **Fonts:** Space Grotesk (display/headings) + Inter (body) + JetBrains Mono (numbers, timestamps, deltas, IDs — *only* in those contexts, never body prose).
- **Semantic accent colors** (replacing the old gold/cyan/purple-everywhere palette): **green** = progress/success/unlocked, **cyan** = system/tech/interactive chrome, **amber** = warnings/milestones/in-progress, **purple** = RPG unlocks/rare/legendary. `gold` survives only as a legacy/credential accent, not the primary identity color.
- Three-layer design intent driving all of the above: RPG skill-tree feel is primary, dev/terminal aesthetic is secondary (mono scoped tightly), modern dashboard readability is the non-negotiable foundation — clarity before immersion before aesthetic.

Mobile-first throughout (the primary device) — unchanged.

### 14.3 Visual identity v2 — Skyrim / fantasy-medieval overhaul (current)

Replaced the modern-dashboard look in §14.2 wholesale, per direct user request for "more fantasy medieval Skyrim style." The `panel`/`panel-raised` layering structure from §14.2 stays — only the skin changed:

- **Fonts:** Cinzel (display/headings, the classic engraved-stone-tablet fantasy serif) + EB Garamond (body) + JetBrains Mono (numbers/timestamps, unchanged role).
- **Palette — gold is now the dominant identity color**, not a legacy accent: aged brass/dragon-priest gold (`gold`) carries panel borders, active states, and primary buttons. The old cyan/purple/green/amber token *names* were kept (so semantic classes across components didn't need touching) but their hex values were re-pointed to fantasy equivalents — cyan→frost steel blue, purple→arcane violet, green→moss/verdant emerald, amber→ember orange. Backgrounds shifted from near-black-blue to warm near-black-brown (old stone/dungeon feel). Text colors shifted from cool "starlight/mist" grays to warm parchment/aged-paper tones.
- **Background:** the old starfield+aurora treatment became a torchlit-stone gradient with rising embers (warm particles drifting upward, recolored from the old twinkling-star particles) and a vignette, instead of a cool deep-space look.
- **Panels:** carved-stone-tablet feel — thin brass/gold inlay borders instead of flat dark borders; `panel-title` text now renders in dim gold rather than gray. A `.corner-flourish` utility adds hairline brass corner brackets to hero panels (used on the passcode gate, available for other hero moments).
- **Attributes module redesign:** the old static hexagonal radar chart (`AttributeRadar.tsx`) was replaced with a single continuous horizontally-scrollable "chain" — six rune-medallion nodes (each a radial gauge ring) connected by a brass chain line, freely draggable left/right with no pagination dots and no per-swipe section jumps. This was a deliberate fix: the old radar (and the still-unconverted `SkillConstellation` category swiper, §14.1) used a "new section per swipe" idiom the user explicitly didn't want repeated for attributes. **Flag for Claude Code:** `SkillConstellation`/`CategoryCluster` (Skill Trees module) still uses the old swipe-per-category-with-dots pattern and has not yet been converted to the same continuous-pan idiom — that conversion is open, not done.
- **Quest/Logbook "logged" state:** `QuestCard` now shows a green "✓ Logged" badge and disables the Log button once a non-repeatable catalog item has an entry in `character.log`; repeatable items instead show "logged ×N" and stay loggable. This was missing before and is now considered baseline behavior, not optional polish.

Mobile-first throughout — unchanged.

---

## 15. Persistence, portability, multiple characters

- **localStorage** for the active character (not Claude's `window.storage` — that only works inside Claude; swap it out).
- **Export / Import JSON** — a character is just its `Character` object; let users back it up and move devices. Critical for a no-account standalone app.
- **Multiple characters / slots** — nice-to-have; the data model already supports it (each is one `Character`).
- **PWA** (manifest + service worker) so it installs to a phone home screen and runs offline — the cleanest route to "download and play" without an app store.

---

## 16. Explicitly OUT of scope (do **not** build)

These were in the original design doc. Each is cut because it contradicts "deterministic tracker of reality." Listed so Claude Code doesn't reintroduce them:

| Cut system | Why |
|---|---|
| RNG skill checks / success% (§12) | Tracker logs what *happened*; no rolling for real outcomes. |
| Failure states, XP loss, cooldowns (§10) | Never punish a user for logging their life. |
| Time / stamina / burnout / quest slots (§11) | App is not time-based; it's accretive. |
| Negative faction reputation (§8) | Real experience only accrues. |
| Attribute → skill-gain multipliers (§2) | Feedback loop; attributes are a mirror, not an input. |
| Class mechanical perks/buffs (§6) | Classes are identity, not power-ups. |
| Dynamic random events (§16) | Replaced by the deterministic unlock graph. |

> If a "Simulation / What-If Mode" is ever wanted, *that's* where these belong — a separate, clearly-labeled sandbox that never touches the real log. Park them; don't build them now.

---

## 17. Build phases

**Phase 1 — MVP (shipped).** Deterministic engine: `Character`/`LogEntry` model, seed catalog (lifted from prototype), skill XP→level (modulo the off-by-one bug, §6), derived attributes, auto-unlocking classes, adaptive title, the Logbook/Quests with **custom-entry logging**, localStorage, export/import.

**Phase 2 — Career layer (shipped ahead of schedule, in the six-module redesign — §14.1).** Factions/jobs with real per-faction rep+role aggregation, gold totals, credentials wall (Tools/Badges trophy kinds still missing, §12), a Logs module covering the timeline use case, PWA install (manifest + service worker via `vite-plugin-pwa`, confirmed building cleanly). **Remaining from original Phase 2 scope:** multiple character slots (not started), rep tier breakpoints (§11), Tools/Badges trophies (§12).

**Phase 3 — Polish & depth (partially started).** Catalog breadth (§3 update) shipped early/out of order — 187 entries, well past the original "richer catalog" goal. Visual identity overhaul (§14.3, Skyrim/fantasy skin) also shipped early. Still open: world-map graph visualization of the unlock graph (§13), community-extensible JSON catalog format, per-user saved custom catalog, animation/sound polish, accessibility pass, fix the §6 leveling rounding bug, convert `SkillConstellation` to the continuous-pan idiom used by the new Attributes chain (§14.3).

### Suggested stack (Claude Code's call, but a recommendation)
- **React + Vite + Tailwind**, single-page, localStorage, wrapped as a **PWA**. Pragmatic path to a downloadable, installable, offline app with no backend.
- If App Store / Play Store distribution is later wanted: **Expo / React Native** reusing the same engine logic. Heavier; not needed for v1.
- Keep the **engine pure and framework-agnostic** (a `deriveCharacter(log)` module with no UI deps) so it's trivially testable and portable.

### Deployment (live)
- Hosted on **GitHub Pages** at `https://doctorswanson.github.io/tree/`, auto-deployed via a GitHub Actions workflow (`.github/workflows/deploy.yml`) on every push to `main`. `vite.config.ts` sets `base: '/tree/'` to match the Pages subpath; `index.html` uses `%BASE_URL%`-prefixed asset paths so icons/manifest resolve correctly under that subpath.
- Free-tier GitHub Pages requires the repo to be **public**; there is no paid-free path to a private repo + free Pages. Accepted tradeoff: the GitHub profile (`doctorswanson`) carries no name/bio/email/location, so the only identity thread is the username itself.
- A client-side **passcode gate** (`src/components/layout/PasscodeGate.tsx`) wraps the entire app at the React root (`main.tsx`), before `CharacterProvider`/`App` ever mount. It compares a SHA-256 hash of user input against a baked-in hash constant (never the plaintext) and persists the unlock via `localStorage`. This is an explicit deterrent against casual link-stumblers, **not real security** — it's client-side JS in a public repo, so a determined visitor could read the source and bypass it. Acceptable given the actual threat model: there is no backend and no shared data, so the worst case of a bypass is a stranger creating their *own* throwaway local character, not exposure of the real user's data.

---

## 18. Open decisions (flag before/while building)

1. **Overall-level formula** is a first guess — needs a playtest pass against a real résumé to feel right.
2. **Custom-entry XP** — is the difficulty-tier auto-split enough, or do power users want full manual per-skill control by default? (Recommend: tiers default, "advanced" toggle for manual.)
3. **Repeatable diminishing returns** — implement the soft 90%-per-repeat curve, or let repeats grant full XP? (Recommend: ship full XP, add damping only if grind-farming shows up.)
4. **Seeded vs blank** — confirmed blank slate for strangers. A short optional "import my background" onboarding (log a few known items fast) could ease the empty-state. Worth considering.
5. **Catalog governance** — for Phase 3 community extensibility, decide on a JSON schema + validation now so custom entries and shipped entries share one format from day one.
6. **Rep tier breakpoints** (new, post-redesign) — §11 names six tiers (Unknown→Legendary) but `FactionPanel` only shows a raw 0–100 bar. Need the actual numeric breakpoints before tier labels can be wired in.
7. **Trophy wall scope** (new, post-redesign) — Credentials shipped; decide whether Tools/Artifacts and Badges (§12) are worth a `LogEntry.custom` schema addition, or should be cut from the spec entirely if they're never getting built.

---

*End of spec. The prototype `cyber-character-builder.html` is the canonical reference for original seed `SKILLS`/`CLASSES` and the pre-§14.3 visual identity baseline; this document — including its later updates (§3, §14.3, §17) — governs current architecture, rules, scope, and content.*
