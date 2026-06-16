import type { ClassDef } from '@/engine/types'

// ~40 classes across Advanced / Prestige / Legendary tiers.
// Requirement values are skill LEVELS (0–100), not XP.
// Classes are identity snapshots only — no perks, no buffs.
export const CLASSES: ClassDef[] = [

  // ══════════════════════════════════════════════════════════════════════════
  //  ADVANCED  (entry specialist roles — realistic early-career unlocks)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'security-analyst',
    name: 'Security Analyst',
    tier: 'advanced',
    desc: 'You monitor, triage, and investigate. The first rung on the security ladder.',
    requirements: { 'security': 40 },
  },
  {
    id: 'soc-analyst',
    name: 'SOC Analyst',
    tier: 'advanced',
    desc: 'You live in alerts, logs, and dashboards. The SOC is your domain.',
    requirements: { 'security': 45, 'incident-response': 35 },
  },
  {
    id: 'network-engineer',
    name: 'Network Engineer',
    tier: 'advanced',
    desc: 'Packets, protocols, and topology are your craft.',
    requirements: { 'networking': 55, 'systems': 40 },
  },
  {
    id: 'systems-administrator',
    name: 'Systems Administrator',
    tier: 'advanced',
    desc: 'You keep the machines running and the users unblocked.',
    requirements: { 'systems': 55, 'automation': 35 },
  },
  {
    id: 'cloud-engineer',
    name: 'Cloud Engineer',
    tier: 'advanced',
    desc: 'Your infrastructure is API-defined and scales on demand.',
    requirements: { 'cloud': 55 },
  },
  {
    id: 'software-developer',
    name: 'Software Developer',
    tier: 'advanced',
    desc: 'You write code that ships. Tools, services, whatever the problem needs.',
    requirements: { 'programming': 55 },
  },
  {
    id: 'malware-analyst',
    name: 'Malware Analyst',
    tier: 'advanced',
    desc: 'You dissect adversary tools and read what the author was trying to hide.',
    requirements: { 'malware-analysis': 50 },
  },
  {
    id: 'osint-analyst',
    name: 'OSINT Analyst',
    tier: 'advanced',
    desc: 'Open sources reveal everything — to those who know how to look.',
    requirements: { 'osint': 50 },
  },
  {
    id: 'grc-analyst',
    name: 'GRC Analyst',
    tier: 'advanced',
    desc: 'Risk, compliance, and governance flow through your work.',
    requirements: { 'grc': 50 },
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    tier: 'advanced',
    desc: 'You find meaning in datasets. Numbers tell stories.',
    requirements: { 'data': 55 },
  },
  {
    id: 'bug-bounty-hunter',
    name: 'Bug Bounty Hunter',
    tier: 'advanced',
    desc: 'You find vulns on your own schedule and cash the check.',
    requirements: { 'bug-bounty-hunting': 50, 'offensive-security': 40 },
  },
  {
    id: 'incident-responder',
    name: 'Incident Responder',
    tier: 'advanced',
    desc: 'When the alarm sounds, you move toward the problem.',
    requirements: { 'incident-response': 55 },
  },
  {
    id: 'forensic-investigator',
    name: 'Forensic Investigator',
    tier: 'advanced',
    desc: 'Evidence speaks to you. You reconstruct what others tried to erase.',
    requirements: { 'digital-forensics': 55 },
  },
  {
    id: 'threat-analyst',
    name: 'Threat Analyst',
    tier: 'advanced',
    desc: 'You follow adversary TTPs and translate intel into action.',
    requirements: { 'threat-hunting': 50, 'security': 40 },
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    tier: 'advanced',
    desc: 'Build, test, deploy, repeat. You own the pipeline.',
    requirements: { 'systems': 50, 'automation': 50, 'cloud': 40 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  PRESTIGE  (cross-disciplinary or deeply specialised roles)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'penetration-tester',
    name: 'Penetration Tester',
    tier: 'prestige',
    desc: 'You break into systems — with permission — and write up what you found.',
    requirements: { 'security': 70, 'networking': 65, 'systems': 60 },
  },
  {
    id: 'red-team-operator',
    name: 'Red Team Operator',
    tier: 'prestige',
    desc: 'You run full adversary simulations, not just scans.',
    requirements: { 'offensive-security': 75, 'security': 65 },
  },
  {
    id: 'purple-team-operator',
    name: 'Purple Team Operator',
    tier: 'prestige',
    desc: 'You walk both sides of the wire. Offense informs your defense.',
    requirements: { 'offensive-security': 70, 'defensive-security': 70 },
  },
  {
    id: 'appsec-engineer',
    name: 'AppSec Engineer',
    tier: 'prestige',
    desc: 'You find vulnerabilities in code before attackers do.',
    requirements: { 'programming': 65, 'offensive-security': 55 },
  },
  {
    id: 'devsecops-engineer',
    name: 'DevSecOps Engineer',
    tier: 'prestige',
    desc: 'Security is baked into your pipelines, not bolted on after the fact.',
    requirements: { 'security': 60, 'cloud': 55, 'automation': 55, 'programming': 55 },
  },
  {
    id: 'cloud-security-architect',
    name: 'Cloud Security Architect',
    tier: 'prestige',
    desc: 'You design secure cloud environments from the ground up.',
    requirements: { 'cloud': 70, 'security': 65, 'architecture': 55 },
  },
  {
    id: 'security-architect',
    name: 'Security Architect',
    tier: 'prestige',
    desc: 'Security is baked into every design decision you make.',
    requirements: { 'architecture': 65, 'security': 70, 'systems': 55 },
  },
  {
    id: 'malware-reverse-engineer',
    name: 'Malware Reverse Engineer',
    tier: 'prestige',
    desc: 'You don\'t just run samples — you read the assembly.',
    requirements: { 'malware-analysis': 65, 'reverse-engineering': 60 },
  },
  {
    id: 'vulnerability-researcher',
    name: 'Vulnerability Researcher',
    tier: 'prestige',
    desc: 'You find zero-days. The CVEs with your name on them are the résumé.',
    requirements: { 'reverse-engineering': 60, 'exploit-development': 55 },
  },
  {
    id: 'cti-analyst',
    name: 'Cyber Threat Intelligence Analyst',
    tier: 'prestige',
    desc: 'You track adversaries, map their TTPs, and translate it into defense.',
    requirements: { 'threat-hunting': 65, 'osint': 55, 'security': 55 },
  },
  {
    id: 'incident-response-lead',
    name: 'Incident Response Lead',
    tier: 'prestige',
    desc: 'You own the call during a crisis. Others follow your cadence.',
    requirements: { 'incident-response': 70, 'digital-forensics': 55, 'leadership': 45 },
  },
  {
    id: 'ai-security-engineer',
    name: 'AI Security Engineer',
    tier: 'prestige',
    desc: 'You attack and defend AI systems — a rare and growing discipline.',
    requirements: { 'ai-security': 60, 'security': 55, 'machine-learning-ai': 45 },
  },
  {
    id: 'ml-engineer',
    name: 'ML Engineer',
    tier: 'prestige',
    desc: 'You train models, manage data pipelines, and ship inference in production.',
    requirements: { 'machine-learning-ai': 65, 'programming': 55, 'data': 50 },
  },
  {
    id: 'forensics-expert',
    name: 'Forensics Expert',
    tier: 'prestige',
    desc: 'The chain of custody is intact. The evidence speaks. The case holds.',
    requirements: { 'digital-forensics': 70, 'malware-analysis': 50 },
  },
  {
    id: 'cryptographer',
    name: 'Cryptographer',
    tier: 'prestige',
    desc: 'You think in primes, curves, and provable security.',
    requirements: { 'cryptography': 65, 'programming': 50 },
  },
  {
    id: 'senior-security-engineer',
    name: 'Senior Security Engineer',
    tier: 'prestige',
    desc: 'Deep technical security work. You build the systems others rely on.',
    requirements: { 'security': 75, 'programming': 55, 'systems': 55 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  LEGENDARY  (top of the field — takes a real career to reach)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'ciso',
    name: 'Chief Information Security Officer',
    tier: 'legendary',
    desc: 'You own the security posture of an organisation. Risk is your language.',
    requirements: { 'security': 90, 'leadership': 85, 'grc': 80, 'architecture': 75 },
  },
  {
    id: 'principal-security-researcher',
    name: 'Principal Security Researcher',
    tier: 'legendary',
    desc: 'Your work shapes the field. CVEs, papers, or both — you advance the state of the art.',
    requirements: { 'security-research': 85, 'offensive-security': 75, 'reverse-engineering': 65 },
  },
  {
    id: 'exploit-developer',
    name: 'Expert Exploit Developer',
    tier: 'legendary',
    desc: 'Kernel exploits. Browser chains. Custom shellcode. This is rare air.',
    requirements: { 'exploit-development': 85, 'reverse-engineering': 80 },
  },
  {
    id: 'red-team-lead',
    name: 'Red Team Lead',
    tier: 'legendary',
    desc: 'You run the adversary simulation program. The mission design is yours.',
    requirements: { 'offensive-security': 85, 'leadership': 70, 'security': 75 },
  },
  {
    id: 'ai-security-pioneer',
    name: 'AI Security Pioneer',
    tier: 'legendary',
    desc: 'You discovered something the field didn\'t know was broken. That\'s pioneer work.',
    requirements: { 'ai-security': 80, 'security-research': 70, 'machine-learning-ai': 70 },
  },
  {
    id: 'legendary-threat-hunter',
    name: 'Legendary Threat Hunter',
    tier: 'legendary',
    desc: 'Adversaries hide in noise. You are the signal.',
    requirements: { 'threat-hunting': 85, 'incident-response': 75, 'security': 80 },
  },
  {
    id: 'renaissance-technologist',
    name: 'Renaissance Technologist',
    tier: 'legendary',
    desc: 'The breadth of your expertise defies categorisation. You are the rare generalist-expert.',
    requirements: {
      'security': 70, 'programming': 65, 'systems': 65,
      'networking': 60, 'cloud': 60, 'automation': 60,
      'leadership': 55, 'architecture': 55,
    },
  },
  {
    id: 'master-cryptographer',
    name: 'Master Cryptographer',
    tier: 'legendary',
    desc: 'You design protocols and break others. The maths is the art.',
    requirements: { 'cryptography': 85, 'security-research': 65, 'programming': 60 },
  },
]
