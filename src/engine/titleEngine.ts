// Pure adaptive title engine. No React imports.
// Derives a title from how XP is distributed across the 13 Boughs.

export interface TitleResult {
  title: string
  flavor: string
}

interface BoughXP {
  [boughId: string]: number
}

function get(xp: BoughXP, id: string): number {
  return xp[id] ?? 0
}

function boughsAtOrAbove(xp: BoughXP, threshold: number): number {
  return Object.values(xp).filter((v) => v >= threshold).length
}

function topBoughs(xp: BoughXP, n: number): string[] {
  return Object.entries(xp)
    .sort(([, a], [, b]) => b - a)
    .filter(([, v]) => v > 0)
    .slice(0, n)
    .map(([id]) => id)
}

const BOUGH_TITLES: Record<string, TitleResult> = {
  recon:   { title: 'The Watcher',      flavor: 'Sees what others miss before the first packet is sent.' },
  exploit: { title: 'The Breach',       flavor: 'Finds the door nobody locked.' },
  forge:   { title: 'The Smith',        flavor: 'Builds the weapons others only dream of swinging.' },
  dissect: { title: 'The Pathologist',  flavor: 'Reads malice in machine code like a second language.' },
  fortify: { title: 'The Wall',         flavor: 'Nothing gets through without leaving a trace.' },
  trace:   { title: 'The Tracker',      flavor: 'Reconstructs the crime from the wreckage it left behind.' },
  cipher:  { title: 'The Cryptarch',    flavor: 'Speaks fluently in the language of secrets.' },
  infra:   { title: 'The Architect',    flavor: 'Builds the ground everyone else stands on.' },
  code:    { title: 'The Engineer',     flavor: 'Turns ideas into running systems.' },
  cloud:   { title: 'The Skywright',    flavor: 'At home above the metal, among the clusters.' },
  neural:  { title: 'The Synthesist',   flavor: 'Teaches machines to think, and breaks the ones that already do.' },
  govern:  { title: 'The Steward',      flavor: 'Keeps the org honest, audited, and prepared.' },
  command: { title: 'The Commander',    flavor: 'Leads the room when the room is on fire.' },
}

export function deriveTitle(boughXP: BoughXP): TitleResult {
  const totalXP = Object.values(boughXP).reduce((a, b) => a + b, 0)

  if (totalXP === 0) {
    return {
      title: 'Unranked',
      flavor: 'No path chosen yet. Log your first node to begin.',
    }
  }

  const exploit = get(boughXP, 'exploit')
  const fortify = get(boughXP, 'fortify')
  const neural = get(boughXP, 'neural')
  const cloud = get(boughXP, 'cloud')
  const code = get(boughXP, 'code')
  const forge = get(boughXP, 'forge')
  const dissect = get(boughXP, 'dissect')
  const command = get(boughXP, 'command')

  // Hybrids — checked before single-lane specializations
  if (exploit >= 500 && fortify >= 500) {
    return { title: 'Purple Team Operator', flavor: 'You walk both sides of the wire. Offense informs defense, and vice versa.' }
  }
  if (neural >= 500 && exploit >= 300) {
    return { title: 'AI Security Specialist', flavor: 'You sit at the intersection of machine learning and adversarial thinking.' }
  }
  if (cloud >= 500 && code >= 500 && fortify >= 300) {
    return { title: 'DevSecOps Engineer', flavor: 'Security is baked into your pipelines, not bolted on after the fact.' }
  }
  if (forge >= 500 && dissect >= 300) {
    return { title: 'Vulnerability Researcher', flavor: 'You find the bugs others miss. The CVEs with your name are the only resume that matters.' }
  }
  if (command >= 700) {
    const lead = topBoughs(boughXP, 2).filter((id) => id !== 'command')
    const spec = lead.length > 0 ? BOUGH_TITLES[lead[0]]?.title.replace('The ', '') : 'Technical'
    return { title: `${spec} → Commander`, flavor: 'Mastery and leadership have converged into something rarer.' }
  }

  // Breadth
  const atModerate = boughsAtOrAbove(boughXP, 300)
  const atHigh = boughsAtOrAbove(boughXP, 800)
  if (atModerate >= 7) {
    return { title: 'Renaissance Technologist', flavor: 'No single lane defines you. Your breadth across the field is itself the specialization.' }
  }
  if (atModerate >= 4 && atHigh === 0) {
    return { title: 'The Polymath', flavor: 'Miles wide. You refuse to be put in a box.' }
  }

  // Single dominant bough
  const [primary, secondary] = topBoughs(boughXP, 2)
  const primaryDef = BOUGH_TITLES[primary]
  if (!primaryDef) {
    return { title: 'Emerging Practitioner', flavor: 'Your path is taking shape.' }
  }

  const primaryXP = get(boughXP, primary)
  const secondaryXP = secondary ? get(boughXP, secondary) : 0

  if (secondary && secondaryXP >= 300 && secondaryXP >= primaryXP * 0.6 && BOUGH_TITLES[secondary]) {
    return {
      title: `${primaryDef.title} (${BOUGH_TITLES[secondary].title.replace('The ', '')}-leaning)`,
      flavor: primaryDef.flavor,
    }
  }

  return primaryDef
}
