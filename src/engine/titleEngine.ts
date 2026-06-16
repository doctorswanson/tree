// Pure adaptive title engine. No React imports.

export interface TitleResult {
  title: string
  flavor: string
}

interface SkillLevels {
  [skillId: string]: number
}

// Helper: count skills at or above a threshold
function skillsAtOrAbove(levels: SkillLevels, threshold: number): number {
  return Object.values(levels).filter((l) => l >= threshold).length
}

// Helper: top N skills by level
function topSkills(levels: SkillLevels, n: number): string[] {
  return Object.entries(levels)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([id]) => id)
}

function get(levels: SkillLevels, id: string): number {
  return levels[id] ?? 0
}

const SKILL_TITLES: Record<string, { title: string; flavor: string }> = {
  'offensive-security':  { title: 'Offensive Specialist',      flavor: 'You break things so others know what to fix.' },
  'defensive-security':  { title: 'Defensive Specialist',      flavor: 'Your instinct is to fortify, monitor, and hold the line.' },
  'security':            { title: 'Security Practitioner',     flavor: 'A broad command of the security domain marks your build.' },
  'reverse-engineering': { title: 'Reverse Engineer',          flavor: 'Where others see black boxes, you see blueprints.' },
  'exploit-development': { title: 'Exploit Craftsman',         flavor: 'You turn theoretical flaws into proof-of-concept reality.' },
  'malware-analysis':    { title: 'Malware Analyst',           flavor: 'You dissect adversary tools and extract truth from obfuscation.' },
  'digital-forensics':   { title: 'Digital Forensicator',      flavor: 'Evidence speaks to you. You reconstruct what others try to erase.' },
  'incident-response':   { title: 'Incident Responder',        flavor: 'When the alarm sounds, you are who gets the call.' },
  'threat-hunting':      { title: 'Threat Hunter',             flavor: 'You don\'t wait for alerts — you go looking.' },
  'grc':                 { title: 'GRC Practitioner',          flavor: 'You translate risk into frameworks and frameworks into action.' },
  'networking':          { title: 'Network Specialist',        flavor: 'Packets, protocols, and topology are your native language.' },
  'systems':             { title: 'Systems Wizard',            flavor: 'You understand what happens below the application layer.' },
  'automation':          { title: 'Automation Engineer',       flavor: 'If you do it twice, you script it. If you script it, you own it.' },
  'architecture':        { title: 'Systems Architect',         flavor: 'You see the whole board and design accordingly.' },
  'cloud':               { title: 'Cloud Practitioner',        flavor: 'Your infrastructure is API-defined and infinitely scalable.' },
  'programming':         { title: 'Software Developer',        flavor: 'You build tools, not just use them.' },
  'leadership':          { title: 'Technical Lead',            flavor: 'You\'ve learned that the hardest problems involve people.' },
  'data':                { title: 'Data Practitioner',         flavor: 'Structure and meaning emerge wherever you work.' },
  'machine-learning-ai': { title: 'ML Engineer',               flavor: 'You train models and trust data over intuition.' },
  'osint':               { title: 'OSINT Operative',           flavor: 'Open sources reveal everything, to those who know how to read them.' },
  'social-engineering':  { title: 'Social Engineer',           flavor: 'The human is always the most exploitable surface.' },
  'hardware-hacking':    { title: 'Hardware Hacker',           flavor: 'Silicon, solder, and serial interfaces hold no secrets from you.' },
  'cryptography':        { title: 'Cryptographer',             flavor: 'You think in primes, curves, and provable security.' },
  'ai-security':         { title: 'AI Security Researcher',    flavor: 'You\'ve turned a critical eye on the systems others trust blindly.' },
  'bug-bounty-hunting':  { title: 'Bug Bounty Hunter',         flavor: 'You hunt vulns on your own schedule and cash the check.' },
  'security-research':   { title: 'Security Researcher',       flavor: 'Your curiosity advances the field. Not everyone can say that.' },
}

function leadershipSuffix(levels: SkillLevels): string {
  const top = topSkills(levels, 2).filter((id) => id !== 'leadership')
  if (top.length > 0) {
    const spec = SKILL_TITLES[top[0]]?.title ?? 'Technical'
    return `${spec} → Tech Lead`
  }
  return 'Tech Lead'
}

export function deriveTitle(skillLevels: SkillLevels): TitleResult {
  const totalXP = Object.values(skillLevels).reduce((a, b) => a + b, 0)

  // 1. Empty
  if (totalXP === 0 || Object.values(skillLevels).every((l) => l === 0)) {
    return {
      title: 'Unspecced Initiate',
      flavor: 'Your chronicle has no entries yet. The path is entirely yours to define.',
    }
  }

  const off  = get(skillLevels, 'offensive-security')
  const def  = get(skillLevels, 'defensive-security')
  const sec  = get(skillLevels, 'security')
  const ml   = get(skillLevels, 'machine-learning-ai')
  const aiSec = get(skillLevels, 'ai-security')
  const cloud = get(skillLevels, 'cloud')
  const auto  = get(skillLevels, 'automation')
  const prog  = get(skillLevels, 'programming')
  const re    = get(skillLevels, 'reverse-engineering')
  const ed    = get(skillLevels, 'exploit-development')
  const lead  = get(skillLevels, 'leadership')

  // 2. Hybrids — checked before single-lane specialisations
  if (off >= 55 && def >= 55) {
    return {
      title: 'Purple Team Operator',
      flavor: 'You walk both sides of the wire. Your offense informs your defense, and vice versa.',
    }
  }
  if (aiSec >= 50 || (sec >= 55 && ml >= 50)) {
    return {
      title: 'AI Security Specialist',
      flavor: 'You sit at the intersection of machine learning and adversarial thinking.',
    }
  }
  if (sec >= 55 && cloud >= 55 && auto >= 55) {
    return {
      title: 'DevSecOps Engineer',
      flavor: 'Security is baked into your pipelines, not bolted on after the fact.',
    }
  }
  if (prog >= 60 && (off >= 50 || sec >= 55)) {
    return {
      title: 'AppSec Hacker',
      flavor: 'You build things and you break things. Usually other people\'s things.',
    }
  }
  if (re >= 55 && ed >= 50) {
    return {
      title: 'Vulnerability Researcher',
      flavor: 'You find zero-days. The CVEs with your name are the only résumé that matters.',
    }
  }
  if (lead >= 60) {
    return {
      title: leadershipSuffix(skillLevels),
      flavor: 'Technical mastery and team leadership have converged into something rarer.',
    }
  }

  // 3. Breadth
  const atForty  = skillsAtOrAbove(skillLevels, 40)
  const atSeventy = skillsAtOrAbove(skillLevels, 70)
  if (atForty >= 9) {
    return {
      title: 'Renaissance Technologist',
      flavor: 'No lane defines you. Your breadth across the field is itself the specialization.',
    }
  }
  if (atForty >= 6 && atSeventy === 0) {
    return {
      title: 'The Polymath',
      flavor: 'Miles wide. You refuse to be put in a box.',
    }
  }

  // 4. Single dominant — top skill with optional secondary suffix
  const [primary, secondary] = topSkills(skillLevels, 2)
  const primaryDef = SKILL_TITLES[primary]
  if (!primaryDef) {
    return { title: 'Emerging Practitioner', flavor: 'Your path is taking shape.' }
  }

  const primaryLevel = get(skillLevels, primary)
  const secondaryLevel = secondary ? get(skillLevels, secondary) : 0

  // Add a "-leaning" suffix if there's a clear second peak
  if (
    secondary &&
    secondaryLevel >= 35 &&
    secondaryLevel >= primaryLevel * 0.65 &&
    SKILL_TITLES[secondary]
  ) {
    return {
      title: `${primaryDef.title} (${SKILL_TITLES[secondary].title.split(' ')[0]}-leaning)`,
      flavor: primaryDef.flavor,
    }
  }

  return primaryDef
}
