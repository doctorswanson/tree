// ─────────────────────────────────────────────────────────────
// THE ARBOR — seed content
// Bough → Branch → Node. 13 boughs, locked. Content tunable over time.
// ─────────────────────────────────────────────────────────────

export interface ArborNode {
  id: string
  name: string
  desc: string
  repeatable: boolean
}

export interface ArborBranch {
  id: string
  name: string
  nodes: ArborNode[]
}

export interface ArborBough {
  id: string
  name: string
  color: string
  desc: string
  branches: ArborBranch[]
}

function skill(id: string, name: string, desc: string): ArborNode {
  return { id, name, desc, repeatable: true }
}

function credential(id: string, name: string, desc: string): ArborNode {
  return { id, name, desc, repeatable: false }
}

export const BOUGHS: ArborBough[] = [
  {
    id: 'recon',
    name: 'Recon',
    color: '#22d3ee',
    desc: 'Intelligence gathering, footprinting, and the human side of reconnaissance.',
    branches: [
      {
        id: 'passive',
        name: 'Passive Recon',
        nodes: [
          skill('recon-osint-fundamentals', 'OSINT Fundamentals', 'Gathering intelligence from public sources without touching the target.'),
          skill('recon-dns-whois', 'DNS & WHOIS Enumeration', 'Mapping infrastructure through domain and registration records.'),
          skill('recon-dark-web', 'Dark Web Monitoring', 'Tracking leaked data, chatter, and exposure on hidden services and forums.'),
          skill('recon-metadata', 'Metadata & Geolocation Analysis', 'Extracting hidden context from files, images, and document properties.'),
        ],
      },
      {
        id: 'active',
        name: 'Active Recon',
        nodes: [
          skill('recon-network-scanning', 'Network Scanning', 'Identifying live hosts and open ports across a target network.'),
          skill('recon-service-enum', 'Service Enumeration', 'Fingerprinting running services and their versions for known weaknesses.'),
          skill('recon-vuln-scanning', 'Vulnerability Scanning', 'Running automated tools to surface candidate weaknesses at scale.'),
        ],
      },
      {
        id: 'human',
        name: 'Human Intelligence',
        nodes: [
          skill('recon-social-engineering', 'Social Engineering', 'Manipulating human trust to gather information or access.'),
          skill('recon-phishing-design', 'Phishing Campaign Design', 'Crafting and running simulated phishing engagements.'),
          skill('recon-pretexting', 'Pretexting & Impersonation', 'Building a believable false identity or scenario to extract information.'),
        ],
      },
      {
        id: 'physical',
        name: 'Physical Recon',
        nodes: [
          skill('recon-physical-assessment', 'Physical Security Assessment', 'Evaluating badge access, cameras, and physical entry controls.'),
          skill('recon-badge-cloning', 'Badge Cloning & RFID Attacks', 'Reading, cloning, and replaying RFID/NFC access credentials.'),
          skill('recon-lock-bypass', 'Lock Picking & Bypass', 'Physically defeating mechanical locks and entry barriers.'),
        ],
      },
    ],
  },
  {
    id: 'exploit',
    name: 'Exploit',
    color: '#f43f5e',
    desc: 'Active exploitation, red team operations, and post-exploitation tradecraft.',
    branches: [
      {
        id: 'network',
        name: 'Network Exploitation',
        nodes: [
          skill('exploit-network-services', 'Network Service Exploitation', 'Attacking exposed services like SMB, RDP, and SSH.'),
          skill('exploit-mitm', 'Man-in-the-Middle Attacks', 'Intercepting and manipulating traffic between two parties.'),
          skill('exploit-wireless', 'Wireless Exploitation', 'Attacking Wi-Fi networks, rogue APs, and wireless protocols.'),
        ],
      },
      {
        id: 'web',
        name: 'Web Exploitation',
        nodes: [
          skill('exploit-injection', 'Injection Attacks', 'SQL injection, command injection, and other input-trust failures.'),
          skill('exploit-auth-bypass', 'Authentication Bypass', 'Defeating broken login, session, and access-control logic.'),
          skill('exploit-client-side', 'Client-Side Attacks', 'XSS, CSRF, and other attacks executed in the victim browser.'),
          skill('exploit-api', 'API Exploitation', 'Abusing REST and GraphQL APIs through logic and auth flaws.'),
        ],
      },
      {
        id: 'ad',
        name: 'Active Directory',
        nodes: [
          skill('exploit-kerberos', 'Kerberos Attacks', 'Kerberoasting, AS-REP roasting, and ticket forgery.'),
          skill('exploit-ad-privesc', 'Domain Privilege Escalation', 'Abusing ACLs, delegation, and trust relationships in AD.'),
          skill('exploit-lateral-movement', 'Lateral Movement', 'Pivoting between hosts using harvested credentials and trust.'),
        ],
      },
      {
        id: 'redteam',
        name: 'Red Team Operations',
        nodes: [
          skill('exploit-c2', 'C2 Frameworks', 'Operating command-and-control infrastructure for an engagement.'),
          skill('exploit-opsec', 'OPSEC & Evasion', 'Avoiding detection by EDR, AV, and blue team monitoring.'),
          skill('exploit-campaign-planning', 'Campaign Planning & Scoping', 'Defining rules of engagement and operation objectives.'),
        ],
      },
      {
        id: 'post',
        name: 'Post-Exploitation',
        nodes: [
          skill('exploit-privesc', 'Privilege Escalation', 'Escalating from initial access to elevated privileges.'),
          skill('exploit-persistence', 'Persistence Mechanisms', 'Maintaining access across reboots and credential rotation.'),
          skill('exploit-exfil', 'Data Exfiltration', 'Extracting data from a target environment undetected.'),
        ],
      },
      {
        id: 'credentials',
        name: 'Credentials',
        nodes: [
          credential('exploit-cred-oscp', 'OSCP', 'Offensive Security Certified Professional.'),
          credential('exploit-cred-crto', 'CRTO', 'Certified Red Team Operator.'),
          credential('exploit-cred-pnpt', 'PNPT', 'Practical Network Penetration Tester.'),
        ],
      },
    ],
  },
  {
    id: 'forge',
    name: 'Forge',
    color: '#fb923c',
    desc: 'Vulnerability research, exploit development, and weaponcraft.',
    branches: [
      {
        id: 'vulnresearch',
        name: 'Vulnerability Research',
        nodes: [
          skill('forge-source-audit', 'Source Code Auditing', 'Manually reviewing source for exploitable logic and memory flaws.'),
          skill('forge-vuln-triage', 'Vulnerability Triage', 'Assessing severity, exploitability, and impact of a discovered flaw.'),
          skill('forge-cve-research', 'CVE Research & Disclosure', 'Finding, documenting, and responsibly disclosing novel vulnerabilities.'),
        ],
      },
      {
        id: 'exploitdev',
        name: 'Exploit Development',
        nodes: [
          skill('forge-buffer-overflow', 'Buffer Overflow Exploitation', 'Crafting exploits from memory corruption primitives.'),
          skill('forge-shellcode', 'Shellcode Development', 'Writing position-independent payloads for exploitation.'),
          skill('forge-rop', 'ROP Chain Construction', 'Bypassing modern memory protections with return-oriented programming.'),
          skill('forge-browser-exploit', 'Browser Exploitation', 'Exploiting memory corruption and logic flaws in browser engines.'),
        ],
      },
      {
        id: 'bugbounty',
        name: 'Bug Bounty',
        nodes: [
          skill('forge-bug-bounty', 'Bug Bounty Hunting', 'Finding and reporting vulnerabilities through public bounty programs.'),
          skill('forge-disclosure', 'Responsible Disclosure', 'Coordinating vulnerability reporting with vendors and CERTs.'),
          skill('forge-program-triage', 'Program Triage & Reporting', 'Writing clear, reproducible, high-quality vulnerability reports.'),
        ],
      },
      {
        id: 'fuzzing',
        name: 'Fuzzing & Tooling',
        nodes: [
          skill('forge-fuzzing-fundamentals', 'Fuzzing Fundamentals', 'Generating malformed input to surface crashes and bugs.'),
          skill('forge-coverage-fuzzing', 'Coverage-Guided Fuzzing', 'Using instrumentation to guide fuzzers toward new code paths.'),
          skill('forge-crash-triage', 'Crash Triage', 'Determining exploitability and root cause from a fuzzer crash.'),
        ],
      },
      {
        id: 'credentials',
        name: 'Credentials',
        nodes: [
          credential('forge-cred-osed', 'OSED', 'Offensive Security Exploit Developer.'),
          credential('forge-cred-osee', 'OSEE', 'Offensive Security Exploitation Expert.'),
        ],
      },
    ],
  },
  {
    id: 'dissect',
    name: 'Dissect',
    color: '#a78bfa',
    desc: 'Malware analysis, reverse engineering, and threat intelligence.',
    branches: [
      {
        id: 'static',
        name: 'Static Analysis',
        nodes: [
          skill('dissect-disassembly', 'Disassembly Fundamentals', 'Reading and interpreting raw assembly from compiled binaries.'),
          skill('dissect-binary-structure', 'Binary Structure Analysis', 'Understanding PE/ELF formats, sections, and headers.'),
          skill('dissect-string-analysis', 'String & Pattern Analysis', 'Extracting indicators and intent from embedded strings.'),
        ],
      },
      {
        id: 'dynamic',
        name: 'Dynamic Analysis',
        nodes: [
          skill('dissect-sandbox', 'Sandbox Analysis', 'Observing malware behavior in a controlled, instrumented environment.'),
          skill('dissect-debugging', 'Malware Debugging', 'Stepping through live execution to understand runtime behavior.'),
          skill('dissect-api-hooking', 'API Hooking & Monitoring', 'Intercepting system calls to trace malicious behavior.'),
        ],
      },
      {
        id: 're',
        name: 'Reverse Engineering',
        nodes: [
          skill('dissect-re-fundamentals', 'Reverse Engineering Fundamentals', 'Recovering logic and intent from compiled code.'),
          skill('dissect-anti-debug', 'Anti-Debug & Anti-VM Bypass', 'Defeating techniques designed to block analysis.'),
          skill('dissect-firmware-re', 'Firmware Reverse Engineering', 'Extracting and analyzing embedded device firmware.'),
        ],
      },
      {
        id: 'ti',
        name: 'Threat Intelligence',
        nodes: [
          skill('dissect-ioc-extraction', 'IOC Extraction', 'Pulling actionable indicators of compromise from a sample.'),
          skill('dissect-actor-profiling', 'Threat Actor Profiling', 'Attributing activity to known groups based on TTPs.'),
          skill('dissect-malware-classification', 'Malware Family Classification', 'Grouping samples by shared code, behavior, and lineage.'),
        ],
      },
      {
        id: 'credentials',
        name: 'Credentials',
        nodes: [
          credential('dissect-cred-grem', 'GREM', 'GIAC Reverse Engineering Malware.'),
        ],
      },
    ],
  },
  {
    id: 'fortify',
    name: 'Fortify',
    color: '#60a5fa',
    desc: 'Detection engineering, hardening, and defensive security architecture.',
    branches: [
      {
        id: 'detection',
        name: 'Detection Engineering',
        nodes: [
          skill('fortify-siem-rules', 'SIEM Rule Writing', 'Authoring detection logic against log and event sources.'),
          skill('fortify-detection-design', 'Detection Logic Design', 'Mapping detections to attacker behavior, not just IOCs.'),
          skill('fortify-alert-tuning', 'Alert Tuning & Triage', 'Reducing noise while preserving true-positive coverage.'),
        ],
      },
      {
        id: 'hardening',
        name: 'Hardening',
        nodes: [
          skill('fortify-endpoint-hardening', 'Endpoint Hardening', 'Reducing attack surface on workstations and laptops.'),
          skill('fortify-server-hardening', 'Server Hardening', 'Securing server configurations against common attack paths.'),
          skill('fortify-patch-management', 'Patch & Vulnerability Management', 'Operationalizing timely remediation of known weaknesses.'),
        ],
      },
      {
        id: 'architecture',
        name: 'Security Architecture',
        nodes: [
          skill('fortify-segmentation', 'Network Segmentation Design', 'Limiting blast radius through deliberate network boundaries.'),
          skill('fortify-zero-trust', 'Zero Trust Architecture', 'Designing access models that assume no implicit trust.'),
          skill('fortify-defense-in-depth', 'Defense-in-Depth Planning', 'Layering controls so no single failure is catastrophic.'),
        ],
      },
      {
        id: 'soc',
        name: 'SOC Operations',
        nodes: [
          skill('fortify-monitoring', 'Security Monitoring', 'Continuous observation of environments for malicious activity.'),
          skill('fortify-alert-triage-ops', 'Alert Triage Operations', 'Working real-time queues to assess and escalate incidents.'),
          skill('fortify-soc-tooling', 'SOC Tooling & Automation', 'Building and tuning the tools a SOC runs on day to day.'),
        ],
      },
      {
        id: 'credentials',
        name: 'Credentials',
        nodes: [
          credential('fortify-cred-secplus', 'Security+', 'CompTIA Security+.'),
          credential('fortify-cred-cysa', 'CySA+', 'CompTIA Cybersecurity Analyst.'),
        ],
      },
    ],
  },
  {
    id: 'trace',
    name: 'Trace',
    color: '#facc15',
    desc: 'Digital forensics, incident response, and threat hunting.',
    branches: [
      {
        id: 'forensics',
        name: 'Digital Forensics',
        nodes: [
          skill('trace-disk-forensics', 'Disk Forensics', 'Recovering and analyzing evidence from storage media.'),
          skill('trace-memory-forensics', 'Memory Forensics', 'Extracting evidence and malicious activity from volatile memory.'),
          skill('trace-mobile-forensics', 'Mobile Device Forensics', 'Recovering and analyzing data from phones and tablets.'),
        ],
      },
      {
        id: 'ir',
        name: 'Incident Response',
        nodes: [
          skill('trace-ir-playbook', 'IR Playbook Execution', 'Running a structured response to a live security incident.'),
          skill('trace-containment', 'Containment & Eradication', 'Stopping the spread and removing an active threat.'),
          skill('trace-post-incident', 'Post-Incident Reporting', 'Documenting root cause, impact, and lessons learned.'),
        ],
      },
      {
        id: 'hunting',
        name: 'Threat Hunting',
        nodes: [
          skill('trace-hypothesis-hunting', 'Hypothesis-Driven Hunting', 'Proactively searching for threats based on a specific theory.'),
          skill('trace-behavioral-analytics', 'Behavioral Analytics', 'Identifying malicious activity through deviations in behavior.'),
          skill('trace-anomaly-detection', 'Anomaly Detection', 'Surfacing statistically unusual activity worth investigating.'),
        ],
      },
      {
        id: 'log',
        name: 'Log Analysis',
        nodes: [
          skill('trace-log-correlation', 'Log Correlation', 'Connecting events across disparate sources into one timeline.'),
          skill('trace-siem-query', 'SIEM Query Writing', 'Writing precise queries to surface relevant evidence fast.'),
          skill('trace-timeline-reconstruction', 'Timeline Reconstruction', 'Rebuilding the sequence of an incident from available evidence.'),
        ],
      },
      {
        id: 'credentials',
        name: 'Credentials',
        nodes: [
          credential('trace-cred-gcfe', 'GCFE', 'GIAC Certified Forensic Examiner.'),
          credential('trace-cred-gcfa', 'GCFA', 'GIAC Certified Forensic Analyst.'),
        ],
      },
    ],
  },
  {
    id: 'cipher',
    name: 'Cipher',
    color: '#2dd4bf',
    desc: 'Cryptography, PKI, and protocol-level security.',
    branches: [
      {
        id: 'applied',
        name: 'Applied Cryptography',
        nodes: [
          skill('cipher-symmetric', 'Symmetric Encryption', 'Applying and evaluating shared-key encryption schemes.'),
          skill('cipher-asymmetric', 'Asymmetric Encryption', 'Applying and evaluating public-key encryption schemes.'),
          skill('cipher-hashing', 'Hashing & Integrity Verification', 'Ensuring data integrity and authenticity through hash functions.'),
        ],
      },
      {
        id: 'pki',
        name: 'PKI',
        nodes: [
          skill('cipher-cert-management', 'Certificate Management', 'Issuing, rotating, and revoking digital certificates.'),
          skill('cipher-pki-architecture', 'PKI Architecture Design', 'Designing a trust hierarchy for an organization.'),
          skill('cipher-key-lifecycle', 'Key Lifecycle Management', 'Managing generation, storage, rotation, and destruction of keys.'),
        ],
      },
      {
        id: 'protocol',
        name: 'Protocol Security',
        nodes: [
          skill('cipher-tls-analysis', 'TLS/SSL Analysis', 'Evaluating transport security configuration and weaknesses.'),
          skill('cipher-downgrade', 'Protocol Downgrade Attacks', 'Forcing weaker cryptographic negotiation between parties.'),
          skill('cipher-vpn-security', 'VPN Security', 'Assessing and hardening tunneling protocol implementations.'),
        ],
      },
      {
        id: 'cryptanalysis',
        name: 'Cryptanalysis',
        nodes: [
          skill('cipher-breaking', 'Cipher Breaking & Cryptanalysis', 'Attacking weak or misimplemented cryptographic schemes.'),
          skill('cipher-steganography', 'Steganography', 'Hiding and detecting data concealed within other data.'),
          skill('cipher-side-channel', 'Side-Channel Analysis', 'Extracting secrets through timing, power, or physical leakage.'),
        ],
      },
    ],
  },
  {
    id: 'infra',
    name: 'Infra',
    color: '#4ade80',
    desc: 'Networking, systems administration, and hardware.',
    branches: [
      {
        id: 'networking',
        name: 'Networking',
        nodes: [
          skill('infra-network-fundamentals', 'Network Fundamentals', 'Core protocols, addressing, and traffic flow.'),
          skill('infra-routing-switching', 'Routing & Switching', 'Directing traffic across and within network segments.'),
          skill('infra-firewall', 'Firewall Configuration', 'Defining and enforcing traffic policy at network boundaries.'),
        ],
      },
      {
        id: 'systems',
        name: 'Systems Administration',
        nodes: [
          skill('infra-linux-admin', 'Linux Administration', 'Operating, securing, and maintaining Linux systems.'),
          skill('infra-windows-admin', 'Windows Administration', 'Operating, securing, and maintaining Windows systems.'),
          skill('infra-ad-admin', 'Active Directory Administration', 'Managing identity, groups, and policy in a Windows domain.'),
        ],
      },
      {
        id: 'hardware',
        name: 'Hardware',
        nodes: [
          skill('infra-hardware-hacking', 'Hardware Hacking', 'Interfacing with and attacking physical device internals.'),
          skill('infra-iot-security', 'IoT Security', 'Assessing connected devices and their unique attack surface.'),
          skill('infra-rf-sdr', 'RF & SDR Analysis', 'Capturing and analyzing wireless signals with software-defined radio.'),
        ],
      },
      {
        id: 'architecture',
        name: 'Architecture',
        nodes: [
          skill('infra-systems-architecture', 'Systems Architecture Design', 'Designing infrastructure that scales and fails gracefully.'),
          skill('infra-high-availability', 'High Availability Design', 'Engineering for uptime through redundancy and failover.'),
        ],
      },
      {
        id: 'credentials',
        name: 'Credentials',
        nodes: [
          credential('infra-cred-networkplus', 'Network+', 'CompTIA Network+.'),
          credential('infra-cred-ccna', 'CCNA', 'Cisco Certified Network Associate.'),
        ],
      },
    ],
  },
  {
    id: 'code',
    name: 'Code',
    color: '#a3e635',
    desc: 'Programming, automation, and secure software development.',
    branches: [
      {
        id: 'languages',
        name: 'Languages',
        nodes: [
          skill('code-python', 'Python', 'General-purpose scripting and tool development.'),
          skill('code-bash', 'Bash Scripting', 'Automating tasks and workflows in a Unix shell.'),
          skill('code-powershell', 'PowerShell', 'Automating and administering Windows environments.'),
          skill('code-go-rust', 'Go & Rust', 'Building fast, memory-safe tooling and systems software.'),
        ],
      },
      {
        id: 'swe',
        name: 'Software Engineering',
        nodes: [
          skill('code-api-dev', 'API Development', 'Designing and building services that other systems consume.'),
          skill('code-version-control', 'Version Control Mastery', 'Managing history, branching, and collaboration with Git.'),
          skill('code-code-review', 'Code Review Practices', 'Reviewing code for correctness, security, and maintainability.'),
        ],
      },
      {
        id: 'automation',
        name: 'Automation',
        nodes: [
          skill('code-automation-tooling', 'Automation & Tooling', 'Building internal tools that remove repetitive manual work.'),
          skill('code-ci-scripting', 'CI Pipeline Scripting', 'Automating build, test, and deploy steps.'),
          skill('code-custom-tools', 'Custom Tool Development', 'Building bespoke tooling to solve a specific recurring problem.'),
        ],
      },
      {
        id: 'secure',
        name: 'Secure Development',
        nodes: [
          skill('code-secure-coding', 'Secure Coding Practices', 'Writing code that resists common classes of vulnerability.'),
          skill('code-sast-dast', 'SAST/DAST Integration', 'Embedding automated security testing into the dev lifecycle.'),
        ],
      },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud',
    color: '#38bdf8',
    desc: 'Cloud platforms, container security, and DevSecOps.',
    branches: [
      {
        id: 'platforms',
        name: 'Platforms',
        nodes: [
          skill('cloud-aws-fundamentals', 'AWS Fundamentals', 'Core services and architecture on Amazon Web Services.'),
          skill('cloud-azure-fundamentals', 'Azure Fundamentals', 'Core services and architecture on Microsoft Azure.'),
          skill('cloud-gcp-fundamentals', 'GCP Fundamentals', 'Core services and architecture on Google Cloud Platform.'),
        ],
      },
      {
        id: 'security',
        name: 'Cloud Security',
        nodes: [
          skill('cloud-iam-hardening', 'IAM Hardening', 'Enforcing least privilege across cloud identity and access.'),
          skill('cloud-cspm', 'Cloud Security Posture Management', 'Continuously assessing cloud configuration against best practice.'),
          skill('cloud-logging-monitoring', 'Cloud Logging & Monitoring', 'Building visibility into cloud-native activity and threats.'),
        ],
      },
      {
        id: 'devsecops',
        name: 'DevSecOps',
        nodes: [
          skill('cloud-cicd-security', 'CI/CD Pipeline Security', 'Securing the build and deployment pipeline itself.'),
          skill('cloud-iac', 'Infrastructure as Code', 'Defining and securing infrastructure through versioned code.'),
          skill('cloud-secrets-management', 'Secrets Management', 'Storing and rotating credentials without hardcoding them.'),
        ],
      },
      {
        id: 'containers',
        name: 'Containers & Orchestration',
        nodes: [
          skill('cloud-docker', 'Docker Fundamentals', 'Building, securing, and running containerized workloads.'),
          skill('cloud-k8s-security', 'Kubernetes Security', 'Hardening and securing container orchestration at scale.'),
        ],
      },
      {
        id: 'credentials',
        name: 'Credentials',
        nodes: [
          credential('cloud-cred-aws-security', 'AWS Security Specialty', 'AWS Certified Security – Specialty.'),
          credential('cloud-cred-cks', 'CKS', 'Certified Kubernetes Security Specialist.'),
        ],
      },
    ],
  },
  {
    id: 'neural',
    name: 'Neural',
    color: '#e879f9',
    desc: 'Machine learning, AI security, and AI red teaming.',
    branches: [
      {
        id: 'foundations',
        name: 'Foundations',
        nodes: [
          skill('neural-ml-fundamentals', 'Machine Learning Fundamentals', 'Core concepts of training and evaluating ML models.'),
          skill('neural-deep-learning', 'Deep Learning Basics', 'Neural network architectures and how they learn.'),
          skill('neural-data-pipelines', 'Data Preprocessing & Pipelines', 'Preparing and moving data through an ML workflow.'),
        ],
      },
      {
        id: 'aisecurity',
        name: 'AI Security',
        nodes: [
          skill('neural-adversarial-ml', 'Adversarial ML', 'Crafting inputs designed to fool or evade ML models.'),
          skill('neural-model-extraction', 'Model Extraction Attacks', 'Stealing a model’s behavior or parameters through queries.'),
          skill('neural-data-poisoning', 'Training Data Poisoning', 'Corrupting a model by manipulating its training data.'),
        ],
      },
      {
        id: 'llm',
        name: 'LLM Engineering',
        nodes: [
          skill('neural-prompt-engineering', 'Prompt Engineering', 'Designing inputs that reliably steer model behavior.'),
          skill('neural-rag', 'RAG Architecture', 'Grounding model outputs in retrieved external knowledge.'),
          skill('neural-fine-tuning', 'Fine-Tuning & Alignment', 'Adapting a base model’s behavior toward a specific goal.'),
        ],
      },
      {
        id: 'redteam',
        name: 'AI Red Teaming',
        nodes: [
          skill('neural-jailbreaking', 'LLM Jailbreaking', 'Bypassing a model’s safety and alignment constraints.'),
          skill('neural-redteam-methodology', 'AI Red Team Methodology', 'Structured approaches to probing AI systems for failure modes.'),
          skill('neural-model-risk', 'Model Risk Assessment', 'Evaluating the real-world risk an AI system introduces.'),
        ],
      },
    ],
  },
  {
    id: 'govern',
    name: 'Govern',
    color: '#f59e0b',
    desc: 'GRC, compliance, risk, and security consulting.',
    branches: [
      {
        id: 'compliance',
        name: 'Compliance Frameworks',
        nodes: [
          skill('govern-nist-csf', 'NIST CSF Implementation', 'Applying the NIST Cybersecurity Framework to an organization.'),
          skill('govern-iso27001', 'ISO 27001 Implementation', 'Building an ISMS aligned to ISO 27001 controls.'),
          skill('govern-soc2', 'SOC 2 Readiness', 'Preparing an organization for a SOC 2 audit.'),
          skill('govern-pci-dss', 'PCI DSS Compliance', 'Meeting payment card industry security requirements.'),
        ],
      },
      {
        id: 'risk',
        name: 'Risk Management',
        nodes: [
          skill('govern-risk-methodology', 'Risk Assessment Methodology', 'Identifying, scoring, and prioritizing organizational risk.'),
          skill('govern-risk-register', 'Risk Register Management', 'Tracking and maintaining risk ownership over time.'),
          skill('govern-third-party-risk', 'Third-Party Risk Assessment', 'Evaluating the risk posture of vendors and partners (ITRA).'),
        ],
      },
      {
        id: 'planning',
        name: 'Incident Planning',
        nodes: [
          skill('govern-irp-development', 'Incident Response Plan Development', 'Writing the playbook an organization follows during a breach.'),
          skill('govern-bcp', 'Business Continuity Planning', 'Planning how operations continue through disruption.'),
          skill('govern-drp', 'Disaster Recovery Planning', 'Planning how systems and data recover after a disaster.'),
        ],
      },
      {
        id: 'advisory',
        name: 'Exercises & Advisory',
        nodes: [
          skill('govern-tabletop', 'Tabletop Exercise Facilitation', 'Running simulated incident scenarios with stakeholders.'),
          skill('govern-gap-assessment', 'Security Gap Assessment', 'Evaluating a program against a target security baseline.'),
          skill('govern-client-advisory', 'Client Advisory & Reporting', 'Communicating findings and recommendations to stakeholders.'),
        ],
      },
      {
        id: 'credentials',
        name: 'Credentials',
        nodes: [
          credential('govern-cred-cissp', 'CISSP', 'Certified Information Systems Security Professional.'),
          credential('govern-cred-cisa', 'CISA', 'Certified Information Systems Auditor.'),
          credential('govern-cred-crisc', 'CRISC', 'Certified in Risk and Information Systems Control.'),
        ],
      },
    ],
  },
  {
    id: 'command',
    name: 'Command',
    color: '#fb7185',
    desc: 'Leadership, strategy, and security communication.',
    branches: [
      {
        id: 'leadership',
        name: 'Leadership',
        nodes: [
          skill('command-team-leadership', 'Security Team Leadership', 'Leading a team of security practitioners day to day.'),
          skill('command-mentorship', 'Mentorship & Coaching', 'Developing the skills and careers of others.'),
          skill('command-hiring', 'Hiring & Team Building', 'Building a high-functioning team from the ground up.'),
        ],
      },
      {
        id: 'strategy',
        name: 'Strategy',
        nodes: [
          skill('command-security-strategy', 'Security Strategy Development', 'Setting the multi-year direction of a security program.'),
          skill('command-budget-planning', 'Budget & Resource Planning', 'Allocating limited resources against security priorities.'),
          skill('command-vendor-management', 'Vendor Management', 'Selecting and managing relationships with security vendors.'),
        ],
      },
      {
        id: 'communication',
        name: 'Communication',
        nodes: [
          skill('command-executive-comm', 'Executive Communication', 'Translating technical risk into language leadership acts on.'),
          skill('command-technical-writing', 'Technical Writing', 'Producing clear documentation, reports, and runbooks.'),
          skill('command-conference-speaking', 'Conference Speaking', 'Presenting research or experience to a public audience.'),
        ],
      },
      {
        id: 'culture',
        name: 'Culture',
        nodes: [
          skill('command-awareness-program', 'Security Awareness Program Design', 'Building training that actually changes user behavior.'),
          skill('command-security-culture', 'Building a Security Culture', 'Making security a shared responsibility, not a single team’s job.'),
        ],
      },
      {
        id: 'milestones',
        name: 'Milestones',
        nodes: [
          credential('command-milestone-first-report', 'First Direct Report', 'Took on management responsibility for the first time.'),
          credential('command-milestone-first-talk', 'First Conference Talk', 'Spoke publicly at a security conference for the first time.'),
          credential('command-milestone-built-team', 'Built a Team From Scratch', 'Stood up a new security function or team from nothing.'),
        ],
      },
    ],
  },
]

// ── Flattened lookups, derived once at module load ────────────────────────

export interface FlatNode extends ArborNode {
  branchId: string
  branchName: string
  boughId: string
  boughName: string
  boughColor: string
}

export const ALL_NODES: FlatNode[] = BOUGHS.flatMap((bough) =>
  bough.branches.flatMap((branch) =>
    branch.nodes.map((node) => ({
      ...node,
      branchId: branch.id,
      branchName: branch.name,
      boughId: bough.id,
      boughName: bough.name,
      boughColor: bough.color,
    }))
  )
)

export const NODE_MAP: Record<string, FlatNode> = Object.fromEntries(
  ALL_NODES.map((n) => [n.id, n])
)

export function getBough(boughId: string): ArborBough | undefined {
  return BOUGHS.find((b) => b.id === boughId)
}

export function getNode(nodeId: string): FlatNode | undefined {
  return NODE_MAP[nodeId]
}
