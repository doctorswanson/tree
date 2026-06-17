# `tree` — Vision & Build Spec (v2 — The Arbor)

*Source of truth for what to build and what not to build. v2 supersedes the original skills/classes/catalog design wholesale — see §9 for what changed and why.*

---

## 0. What this is

**`tree` is a deterministic, RPG-skinned tracker for a real cybersecurity / computer-science career.**

It is **not a game.** No dice, no clock, no failure, no stamina. The "gaming" comes entirely from the *interface*: you log real things you've actually done, and the app renders your career as **The Arbor** — a radial skill graph that fills in, an adaptive title that names your build, and a Codex of reference material tied to what you've logged.

> A deterministic, graph-driven career tracker where real certs, projects, and skills are logged against a 13-bough skill tree, deriving rank, an adaptive title, and a visual sense of where to go next — fully private, offline, and always loggable.

---

## 1. Design pillars (non-negotiable)

1. **Deterministic & derived.** The only thing that persists is the user's `log: LogEntry[]`. Everything else — node XP/rank, bough totals, focus state, title, overall level — is *computed* from that log on every render (`deriveCharacter`). Same log in → same character out, always.
2. **You log reality.** Every entry represents something the user actually did. No random outcomes, no penalties, no failure states, no time pressure.
3. **Never blocked.** Every node is loggable at any time, regardless of "focus state." Focus/locked styling is a visual hint about where to go next, **not a gate** — see §3.
4. **RPG as a mirror, not a ruleset.** Rank, focus state, and title *describe* the log. They don't gate or buff anything mechanically.
5. **Standalone & private.** Runs locally, offline, no account. Data lives in `localStorage` under key `tree:character`; export/import JSON for portability.

---

## 2. Core loop

```
Log a node (cert, skill rep, project)
      → repeatable nodes accrue XP (XP_PER_LOG = 100 per log); credential nodes mark achieved
      → node rank (0–3) recomputes from XP vs RANK_THRESHOLDS
      → branch/bough totals and focus state recompute
      → adaptive title re-evaluates the whole bough-XP spread
      → Arbor graph re-renders: brighter where you've worked, dimmer where you haven't
```

No turns, no advancing — the character accretes as you log.

---

## 3. Data model

### Persisted (`Character`, in `localStorage`)

```ts
Character {
  schemaVersion: number        // SCHEMA_VERSION = 2
  name: string
  avatarStyle?: string
  log: LogEntry[]               // the ONLY source of truth
  createdAt, updatedAt
}

LogEntry {
  id: string
  nodeId: string                 // references a node in src/data/arbor.ts
  date?: string
  note?: string
}
```

That's the entire save file. Everything below is derived at runtime by `deriveCharacter()` (`src/engine/derive.ts`) and never stored.

### The Arbor content tree (`src/data/arbor.ts`)

```
Bough → Branch → Node
```

- **13 boughs** (locked set, color-coded): `recon`, `exploit`, `forge`, `dissect`, `fortify`, `trace`, `cipher`, `infra`, `code`, `cloud`, `neural`, `govern`, `command`.
- **62 branches** across those boughs, each grouping 2–5 nodes.
- **182 nodes** total — 161 repeatable `skill()` nodes (rank up via repeated logging) and 21 one-shot `credential()` nodes (certs/degrees — log once, `achieved = true`, capped at rank 3 XP).
- Content is tunable/extensible over time; the bough set itself is the one locked structural decision.

### Derived state (`CharacterState`, recomputed every render)

- `NodeState` — per-node `xp`, `rank` (0–3), `logCount`, `achieved`, `lastLoggedAt`, and `focusState`.
- `BranchState` — `nodes[]`, aggregate `focusState`, and an inferred `layer: 'fundamentals'|'applied'|'advanced'|'mastery'` (used to group the Dissect panel into progression steps).
- `BoughState` — `branches[]`, `totalXP`, `nodesStarted`, `nodesMaxed`, `totalNodes`, `focusState`.
- `TitleState` — `{ title, flavor }` from the adaptive title engine.
- Top-level `CharacterState` also carries `overallLevel`, `totalXP`, `totalLogs`, `credentialsEarned`.

---

## 4. XP & leveling (`src/engine/xp.ts`)

```ts
XP_PER_LOG = 100                          // flat XP per log on a repeatable node
RANK_THRESHOLDS = [150, 500, 1200]        // XP needed for rank 1 / 2 / 3
nodeRank(xp)                              // 0–3 from thresholds above
overallLevel(totalXP) = min(99, floor(sqrt(totalXP / 50)) + 1)
```

Credential (non-repeatable) nodes skip XP accrual entirely: logging once sets `achieved = true` and `rank = 3`, with `xp` pinned to `RANK_THRESHOLDS[2]` for bough-total purposes.

No attribute multipliers, no diminishing returns on repeats — kept intentionally simple.

---

## 5. Focus-state system (`src/engine/focus.ts`) — v2 addition

A **heuristic, visual-only** layer answering "where should I look next?" without ever blocking logging. Three states:

- **`active`** — the node/branch/bough already has real progress (`rank > 0` or `achieved`, or any XP at the bough level).
- **`available`** — a sensible next step: the first node in an untouched branch, or any node in a branch that's already been started.
- **`locked`** — no nearby progress and not an obvious entry point. *Still fully loggable* — "locked" never means "can't."

`progressionLayer()` infers each branch's place in `fundamentals/applied/advanced/mastery` from its position within the bough plus credential density (a branch that's mostly credential nodes reads as `mastery` regardless of position). This is an inferred label, not hand-authored content — a deliberate tradeoff to avoid manually tagging 62 branches.

Boughs and branches are never "locked," only individual nodes are.

---

## 6. The Arbor graph UI

`@xyflow/react`-based radial visualization (`src/components/arbor/`):

- **Layout** (`layout.ts`) — hand-rolled trig-based polar layout: root → 13 boughs → branches → nodes, radiating outward. Every edge carries typed ancestry data (`ArborEdgeData`: `root-bough`/`bough-branch`/`branch-node`) so focus logic can look up relationships without re-walking the tree.
- **Focus chain** (`focusChain.ts`) — pure resolver that, given a hovered or selected element, walks the bough→branch→node ancestor chain so the right nodes/edges get spotlighted.
- **Visual hierarchy** (`visual.ts`) — centralized opacity constants:
  - Node opacity by focus state: locked 0.32 / available 0.68 / active 1.0.
  - Edge base opacity by focus state: locked 0.07 / available 0.16 / active 0.4.
  - Off-chain elements dim further by a 0.3× multiplier.
  - Below zoom threshold 0.42, all edges floor at 0.22 opacity so the full graph stays legible when zoomed out.
- **Interaction** — hovering a node sets a transient "effective chain" that overrides the sticky click-selection while the mouse is over it; clicking sets the persistent selection chain reflected in the right panel and left sidebar.

---

## 7. Shell modules (`src/components/shell/`, `src/App.tsx`)

Three top-level tabs (`TopNav`), each with a one-line subtitle:

| Tab | Subtitle | Covers |
|---|---|---|
| **Arbor** | Growth & progression | The radial skill graph (§6) — default landing tab |
| **Codex** | Reference library | `Codex.tsx` — browsable reference tied to nodes, no logging mechanics of its own |
| **Profile** | Identity & stats | `ProfileModule` + `CredentialWall` — title, level, earned credentials |

Persistent around the Arbor/Codex tabs:
- **Left sidebar** (`LeftSidebar.tsx`) — identity card, stats, a "Current Focus" card mirroring whatever's selected in the Arbor, and the bough list (dims non-focused boughs, bolds the active one).
- **Right panel** (`RightPanel.tsx`, the "Dissect" panel) — bough view groups branches into the Fundamentals/Applied/Advanced/Mastery layers from §5 with per-layer progress bars; node view shows focus badge, rank, XP, next-rank distance, log history, and the Log Entry / Mark Achieved action.
- **Bottom row** (`BottomRow.tsx`) — System Log, Recent Activity, On Deck. Empty states are onboarding copy ("select a node and log it to start the trace"), not blank panels.

---

## 8. Adaptive title engine (`src/engine/titleEngine.ts`)

Reads the whole bough-XP distribution and names the build. Priority-ordered:

1. **Empty** → "Unranked."
2. **Hybrids** (checked first): Exploit+Fortify ≥500 each → *Purple Team Operator*; Neural ≥500 & Exploit ≥300 → *AI Security Specialist*; Cloud+Code ≥500 & Fortify ≥300 → *DevSecOps Engineer*; Forge ≥500 & Dissect ≥300 → *Vulnerability Researcher*; Command ≥700 → `{top non-command bough} → Commander`.
3. **Breadth**: ≥7 boughs at ≥300 XP → *Renaissance Technologist*; ≥4 boughs at ≥300 with none ≥800 → *The Polymath*.
4. **Single dominant bough** → that bough's named title (e.g. `exploit` → "The Breach"), with a `(-leaning)` suffix when a clear #2 bough is close behind.

Each of the 13 boughs has a fixed title + one-line flavor text (e.g. `recon` → "The Watcher" / "Sees what others miss before the first packet is sent.").

---

## 9. What changed from v1 (history)

v1 (pre-Arbor) modeled the career as 26 individual **skills** feeding six **D&D-style attributes**, ~40 auto-unlocking **classes**, a 187-entry **catalog** of certs/degrees/projects with soft prerequisites and an unlock graph, plus **factions/jobs** (gold, reputation) and a six-module shell (Profile/Skill Trees/Quests/Class/Factions/Logs) skinned in a Skyrim/fantasy-medieval visual identity.

**v2 (current, "The Arbor") replaced that model wholesale**, not incrementally:

- 26 skills + attributes + classes + catalog + factions/gold/reputation → **13 boughs → 62 branches → 182 nodes**, navigated as a radial graph instead of accordions/lists.
- The adaptive title engine survived the rewrite, re-keyed to bough IDs instead of skill thresholds (§8).
- Soft-prerequisite "stretch" entries and the unlock graph (hidden entries revealed by logging) were **dropped** — every node is visible and loggable from the start; §5's focus-state system is a lighter-weight replacement that nudges without hiding anything.
- Classes, factions, gold, reputation, and the credential/tool/badge inventory split are **gone**. Only credentials survive, folded into Profile's `CredentialWall`.
- Visual identity moved from the Skyrim/fantasy skin to a hacker/cyberpunk aesthetic (the Arbor's bough colors, terminal-style copy in empty states).
- v2.1 (this pass) added the focus-state/progression-layer system itself (§5), context-aware edge rendering and hover/selection chains in the graph (§6), the Dissect panel's layer restructure, and left-sidebar selection sync (§7) — all additive on top of the Arbor rewrite, not a new architecture.

If a feature from v1 isn't mentioned above or elsewhere in this doc, treat it as cut, not pending.

---

## 10. Persistence, deployment

- **localStorage**, key `tree:character`, single character slot. Export/Import JSON for backup/portability (`CharacterProvider.tsx`).
- **PWA** via `vite-plugin-pwa` — installable, offline-capable.
- **Hosted on GitHub Pages** at `https://doctorswanson.github.io/tree/`, auto-deployed via `.github/workflows/deploy.yml` on every push to `main`. `vite.config.ts` sets `base: '/tree/'` to match the Pages subpath.
- Free-tier Pages requires the repo to be **public**; accepted tradeoff is that the `doctorswanson` GitHub identity carries no personal info beyond the username.
- A client-side **passcode gate** (`src/components/layout/PasscodeGate.tsx`) wraps the app at the React root, before `CharacterProvider`/`App` mount. Compares a SHA-256 hash of input against a baked-in constant; persists unlock via localStorage. Explicit deterrent against casual link-stumblers, **not real security** — acceptable because the worst-case bypass is a stranger creating their own throwaway local character, not exposure of real data.

### Known-fixed bugs
- **Modal drag/scroll on mobile (fixed):** modals now render via `createPortal` to `document.body` instead of nesting inside the scrollable `<main>`, so dragging a modal's handle on mobile Safari no longer scrolls the page behind it.

---

## 11. Open / not yet done

- **Manual browser QA of the v2.1 focus/hover/zoom system** — verified via `tsc`/`vitest`/`build` only, not yet clicked through in a real browser.
- **`SkillConstellation`-style swipe-per-category idiom** — fully gone now that the graph replaced it; no longer applicable, listed here only so it isn't re-requested.
- **Overall-level formula** — first guess, not playtested against a real résumé.
- **Multiple character slots** — data model is single-character only; not started.
- Anything from the v1 feature set not carried into §9's replacement list (classes, factions, gold, catalog unlock graph, attribute radar) is considered cut, not deferred.

---

*End of spec. `src/data/arbor.ts` is the canonical content source (bough/branch/node definitions); `src/engine/` is the canonical rules source (XP, focus, title). This document governs intent and architecture, not exact numbers — when in doubt, the code wins.*
