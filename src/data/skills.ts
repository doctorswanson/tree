import type { SkillDef } from '@/engine/types'

// 26 skills, 7 categories, feed map from spec §4
export const SKILLS: SkillDef[] = [
  // ── Development ──────────────────────────────────────────────────────────
  { id: 'programming',         name: 'Programming',            category: 'Development',     feeds: ['INT', 'WIL'] },

  // ── Infrastructure ───────────────────────────────────────────────────────
  { id: 'systems',             name: 'Systems',                category: 'Infrastructure',  feeds: ['WIS', 'DEX', 'CON'] },
  { id: 'networking',          name: 'Networking',             category: 'Infrastructure',  feeds: ['DEX', 'INT'] },
  { id: 'automation',          name: 'Automation',             category: 'Infrastructure',  feeds: ['DEX', 'WIL'] },
  { id: 'architecture',        name: 'Architecture',           category: 'Infrastructure',  feeds: ['INT', 'WIS', 'CHA'] },

  // ── Security ─────────────────────────────────────────────────────────────
  { id: 'security',            name: 'Security',               category: 'Security',        feeds: ['INT', 'WIS'] },
  { id: 'offensive-security',  name: 'Offensive Security',     category: 'Security',        feeds: ['INT', 'DEX'] },
  { id: 'defensive-security',  name: 'Defensive Security',     category: 'Security',        feeds: ['WIS', 'CON'] },
  { id: 'incident-response',   name: 'Incident Response',      category: 'Security',        feeds: ['WIS', 'DEX', 'CON'] },
  { id: 'threat-hunting',      name: 'Threat Hunting',         category: 'Security',        feeds: ['WIS', 'INT'] },
  { id: 'digital-forensics',   name: 'Digital Forensics',      category: 'Security',        feeds: ['WIS', 'INT'] },
  { id: 'malware-analysis',    name: 'Malware Analysis',       category: 'Security',        feeds: ['INT', 'WIL'] },
  { id: 'grc',                 name: 'Governance/Risk/Compliance', category: 'Security',   feeds: ['WIS', 'CHA'] },

  // ── Data & AI ─────────────────────────────────────────────────────────────
  { id: 'data',                name: 'Data',                   category: 'Data & AI',       feeds: ['INT'] },
  { id: 'machine-learning-ai', name: 'Machine Learning / AI', category: 'Data & AI',       feeds: ['INT', 'WIL'] },

  // ── Cloud ────────────────────────────────────────────────────────────────
  { id: 'cloud',               name: 'Cloud',                  category: 'Cloud',           feeds: ['INT', 'WIS'] },

  // ── Leadership ───────────────────────────────────────────────────────────
  { id: 'leadership',          name: 'Leadership',             category: 'Leadership',      feeds: ['CHA', 'WIS', 'CON'] },

  // ── Rare Arts ✦ ──────────────────────────────────────────────────────────
  { id: 'reverse-engineering', name: 'Reverse Engineering',    category: 'Rare Arts', rare: true, feeds: ['WIL', 'INT'] },
  { id: 'exploit-development', name: 'Exploit Development',    category: 'Rare Arts', rare: true, feeds: ['WIL', 'INT'] },
  { id: 'cryptography',        name: 'Cryptography',           category: 'Rare Arts', rare: true, feeds: ['INT'] },
  { id: 'osint',               name: 'OSINT',                  category: 'Rare Arts', rare: true, feeds: ['WIS', 'DEX'] },
  { id: 'social-engineering',  name: 'Social Engineering',     category: 'Rare Arts', rare: true, feeds: ['CHA', 'WIS'] },
  { id: 'hardware-hacking',    name: 'Hardware Hacking',       category: 'Rare Arts', rare: true, feeds: ['DEX', 'WIL'] },
  { id: 'ai-security',         name: 'AI Security',            category: 'Rare Arts', rare: true, feeds: ['INT', 'WIL'] },
  { id: 'bug-bounty-hunting',  name: 'Bug Bounty Hunting',     category: 'Rare Arts', rare: true, feeds: ['DEX', 'WIL'] },
  { id: 'security-research',   name: 'Security Research',      category: 'Rare Arts', rare: true, feeds: ['WIL', 'INT'] },
]

export const SKILL_MAP: Record<string, SkillDef> = Object.fromEntries(SKILLS.map((s) => [s.id, s]))
