import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const QA = [
  // HACKS & SECURITY (15)
  {
    q: "We just discovered a massive SQL injection vulnerability in our legacy customer portal. We are afraid it's already been exploited.",
    a: "Yes, Kangqore can perform an immediate emergency security audit and remediation. SQL injection in a legacy portal is a severe risk to your entire database integrity. Our cybersecurity team will first isolate the affected endpoints and perform a forensic log analysis to identify any unauthorized data exfiltration. We will then deploy a web application firewall (WAF) with custom rules to block further attempts, refactor the vulnerable code using parameterized queries, and implement a least-privilege database access model. We will secure your data and restore your portal's integrity.",
    tags: ["Cybersecurity", "Legacy System Modernization", "Digital Engineering"],
    departments: ["Cybersecurity", "Digital Engineering"],
    services: ["IT Security Services", "Legacy System Modernization"],
    category: "SECURITY_BREACH",
    urgencyLevel: "CRISIS"
  },
  {
    q: "A disgruntled former employee has leaked our proprietary source code on GitHub. What do we do?",
    a: "Yes, Kangqore will help you manage this intellectual property crisis. Code leakage requires both legal and technical countermeasures. We will first help you identify any hardcoded secrets, API keys, or infrastructure credentials within the leaked code and rotate them immediately across all environments. We will then perform a 'diff' analysis to determine if the leaked code contains sensitive logic that needs to be refactored or obfuscated in your production builds. We will also support your legal team with technical evidence for DMCA takedown requests and implement stronger Data Loss Prevention (DLP) controls for your current team.",
    tags: ["Cybersecurity", "DevOps", "Legal Tech"],
    departments: ["Cybersecurity", "Cloud Engineering"],
    services: ["IT Security Services", "DevOps As A Service"],
    category: "SECURITY_BREACH",
    urgencyLevel: "CRISIS"
  },
  {
    q: "Our company's Slack was compromised and the hackers are demanding a ransom in Bitcoin. They have sensitive internal chat logs.",
    a: "Yes, Kangqore can help you manage this ransomware/extortion event. Compromised communication channels are a direct threat to your internal operations and confidentiality. Our incident response team will first secure your identity provider (IDP) and revoke all active sessions to stop the spread. We will coordinate with Slack's security team to regain full control and perform a forensic sweep to see if the hackers pivoted from Slack into other enterprise systems like Jira or GitHub. We will then implement multi-factor authentication (MFA) enforcement and session-duration policies to harden your environment.",
    tags: ["Cybersecurity", "Managed Services", "Identity Management"],
    departments: ["Cybersecurity", "Infrastructure, Networks & Operations"],
    services: ["Managed Security Services", "IT Security Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "CRISIS"
  },
  {
    q: "Our main website has been defaced with political messages. We are a government-facing contractor and this is a disaster.",
    a: "Yes, Kangqore will restore your site and your reputation immediately. Website defacement for a government contractor is a high-visibility security failure. We will first take the site offline to stop further reputational damage, restore from a verified clean backup, and perform a deep vulnerability scan to identify the entry point — whether it was a CMS exploit, a compromised DNS record, or a hijacked admin account. We will then implement a zero-trust architecture for your content management system and a robust integrity monitoring system that alerts us the second any unauthorized change is detected.",
    tags: ["Cybersecurity", "Infrastructure", "Government Tech"],
    departments: ["Cybersecurity", "Infrastructure, Networks & Operations"],
    services: ["IT Security Services", "Managed Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "CRISIS"
  },
  {
    q: "We found a hidden backdoor in a third-party library we've been using for years. Our app is in 500,000 devices.",
    a: "Yes, Kangqore understands the massive scale of a supply chain attack. A backdoor in a widely deployed third-party library is a 'Patient Zero' scenario. We will immediately initiate an emergency patching cycle, pushing a library update to all 500,000 devices via your over-the-air (OTA) or app store update channels. Simultaneously, our security team will analyze the backdoor's behavior to determine if it has been activated and what data it targeted. We will then implement a Software Bill of Materials (SBOM) and automated vulnerability scanning in your CI/CD pipeline to prevent future supply chain risks.",
    tags: ["Cybersecurity", "Product Engineering", "Supply Chain Security"],
    departments: ["Cybersecurity", "Product Engineering"],
    services: ["IT Security Services", "Software Product Engineering"],
    category: "SECURITY_BREACH",
    urgencyLevel: "CRISIS"
  },
  {
    q: "Our AWS bill just jumped from $5,000 to $85,000 in 48 hours. We think we've been hijacked for crypto mining.",
    a: "Yes, Kangqore will stop this financial drain immediately. A sudden cloud cost explosion is a classic sign of an account compromise or a massive misconfiguration. We will first identify and terminate any unauthorized EC2 instances, Lambda functions, or containers used for mining. We will then audit your IAM roles to find the compromised credential and rotate all keys. We will work with AWS support to request a cost refund for the fraudulent activity and implement strict budget alerts and resource quotas to prevent a recurrence. Your cloud spend will be back under control within hours.",
    tags: ["Cloud Engineering", "Cybersecurity", "FinOps"],
    departments: ["Cloud Engineering", "Cybersecurity"],
    services: ["Managed Cloud Services", "IT Security Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "URGENT"
  },
  {
    q: "We are an e-commerce brand. Thousands of fraudulent accounts are being created to snap up our limited edition drops.",
    a: "Yes, Kangqore will implement a professional bot mitigation strategy for your platform. Bot-driven scalping destroys your brand equity and frustrates your real customers. We will deploy advanced bot detection that uses behavioral analysis, device fingerprinting, and proxy detection to distinguish human shoppers from automated scripts. We will also implement a high-performance waitlist or queueing system that can handle the massive burst traffic of a 'drop' without crashing your core checkout flow. Your real fans will finally have a fair chance.",
    tags: ["Digital Engineering", "Cybersecurity", "E-commerce"],
    departments: ["Digital Engineering", "Cybersecurity"],
    services: ["Digital Engineering", "IT Security Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our database was encrypted by ransomware and our backups are also encrypted. We are completely paralyzed.",
    a: "Yes, Kangqore will lead your recovery efforts with a focus on business continuity. Losing both primary data and backups to ransomware is a catastrophic event. Our first step is to isolate the network to prevent further encryption of remaining systems. We will then attempt forensic recovery of shadow copies or unallocated disk space to find usable data fragments. Simultaneously, we will audit your entire infrastructure to find the entry point and ensure the attackers are fully evicted before we rebuild. Going forward, we will implement air-gapped, immutable backups and a multi-layered defense-in-depth strategy.",
    tags: ["Cybersecurity", "Infrastructure", "Managed Services"],
    departments: ["Cybersecurity", "Infrastructure, Networks & Operations"],
    services: ["IT Security Services", "Managed Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "CRISIS"
  },
  {
    q: "We suspect an insider threat is slowly exfiltrating our customer list. We are seeing our leads being contacted by a competitor.",
    a: "Yes, Kangqore can help you detect and stop insider threats. Data exfiltration by an employee is a quiet but deadly risk to your competitive advantage. We will implement User and Entity Behavior Analytics (UEBA) to monitor for unusual data access patterns, such as bulk downloads from your CRM or large outbound file transfers at odd hours. We will also deploy endpoint detection and response (EDR) tools to track file movements to USB drives or personal cloud accounts. We will provide you with the technical evidence needed for HR and legal action while securing your intellectual property.",
    tags: ["Cybersecurity", "Managed Services", "Data Governance"],
    departments: ["Cybersecurity"],
    services: ["IT Security Services", "Managed Security Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our domain was hijacked. Someone redirected our traffic to a phishing site that looks exactly like ours.",
    a: "Yes, Kangqore will act immediately to regain control of your digital identity. Domain hijacking is a critical emergency that can destroy years of brand trust in hours. We will coordinate with your domain registrar to verify your identity and revert the DNS records. While that is in progress, we will help you notify your customers via social media and email about the breach to prevent further credential theft. Once recovered, we will implement registrar locks, mandatory hardware-key MFA for all domain admins, and DNSSEC to ensure this never happens again.",
    tags: ["Cybersecurity", "Managed Services", "Infrastructure"],
    departments: ["Cybersecurity", "Infrastructure, Networks & Operations"],
    services: ["IT Security Services", "Managed Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "CRISIS"
  },
  {
    q: "Our mobile app is being reverse-engineered and a 'cracked' version is being distributed for free.",
    a: "Yes, Kangqore can protect your mobile IP. Reverse engineering bypasses your monetization and exposes your internal API logic. We will implement advanced code obfuscation and anti-tamper protections in your next build. We will also introduce server-side validation for critical features so that the 'cracked' version loses its utility when it cannot communicate with your backend. We will help you set up app-attestation checks to ensure only genuine, unmodified versions of your app can access your services.",
    tags: ["Product Engineering", "Cybersecurity", "Mobile Tech"],
    departments: ["Product Engineering", "Cybersecurity"],
    services: ["Software Product Engineering", "IT Security Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "URGENT"
  },
  {
    q: "We found a 'logic bomb' in our production code that is scheduled to delete all data on January 1st.",
    a: "Yes, Kangqore will perform an immediate emergency code audit and removal. A logic bomb is a malicious time-delayed threat that requires deep code-level forensic expertise to defuse. We will first perform a full codebase sweep to locate and neutralize the trigger. We will then conduct a security review of your recent merge requests and commit history to identify the source of the malicious injection. We will implement a more rigorous peer-review process and automated static analysis to ensure no unauthorized logic ever reaches your production environment again.",
    tags: ["Cybersecurity", "Digital Engineering", "Quality Engineering"],
    departments: ["Cybersecurity", "Digital Engineering"],
    services: ["IT Security Services", "Quality Engineering & Assurance"],
    category: "SECURITY_BREACH",
    urgencyLevel: "CRISIS"
  },
  {
    q: "Our IoT devices are being used in a massive DDoS attack against a major internet service provider.",
    a: "Yes, Kangqore will help you secure your IoT fleet and stop the abuse. When your devices are hijacked into a botnet, your brand and your infrastructure are at risk. We will identify the vulnerability — likely a default password or an unpatched firmware bug — and deploy an emergency OTA update to secure all devices in the field. We will then architect a secure device management platform that uses unique certificates per device and restricted outbound communication policies. We will also help you coordinate with the targeted ISP to demonstrate that you are taking active steps to stop the attack.",
    tags: ["IoT", "Cybersecurity", "Managed Services"],
    departments: ["Digital Engineering", "Cybersecurity"],
    services: ["IoT", "IT Security Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "CRISIS"
  },
  {
    q: "Our customer service team is being targeted by 'social engineering' calls. Hackers are getting them to reset passwords.",
    a: "Yes, Kangqore can help you harden your human and technical defenses. Social engineering exploits the helpful nature of your team. We will implement a 'no-reset-by-voice' policy and enforce mandatory multi-factor authentication for all customer account changes. We will also help you deploy an identity verification system that requires customers to confirm their identity through your app or a verified email before any support action can be taken. We will provide security awareness training specifically tailored to your support workflows.",
    tags: ["Cybersecurity", "Managed Services", "Support"],
    departments: ["Cybersecurity"],
    services: ["IT Security Services", "Managed Security Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our database logs show someone has been systematically scraping our entire user directory for months.",
    a: "Yes, Kangqore will identify the leak and stop the exfiltration. Stealthy data scraping is often a sign of an insecure API endpoint or a logic flaw in your access controls. We will perform a deep audit of your API permissions and implement rate limiting, behavioral profiling, and data-access logging. We will identify the compromised accounts or IP ranges used for the scraping and revoke their access. We will then harden your data exposure layer to ensure only the minimum necessary information is available to any single request.",
    tags: ["Cybersecurity", "Digital Engineering", "API Engineering"],
    departments: ["Cybersecurity", "Digital Engineering"],
    services: ["IT Security Services", "API & Microservices Engineering"],
    category: "SECURITY_BREACH",
    urgencyLevel: "URGENT"
  },

  // COMPLIANCE PANIC (10)
  {
    q: "We just received a GDPR 'Right to be Forgotten' request for a user whose data is scattered across 15 different systems.",
    a: "Yes, Kangqore can help you automate your GDPR compliance workflows. Manual deletion across 15 systems is prone to error and risks legal non-compliance. We will map your data flow across all 15 systems and build a 'Compliance API' that can trigger a synchronized deletion or anonymization of a user's data everywhere it resides. We will also implement a centralized data catalog so you always know exactly where sensitive PII is stored. You will go from manual panic to a one-click compliance process.",
    tags: ["Data Governance", "Compliance", "Digital Transformation"],
    departments: ["Data Science & AI", "Consulting & Advisory"],
    services: ["Data & Analytics", "Quality Engineering & Assurance"],
    category: "COMPLIANCE_CRISIS",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our Fintech app needs to achieve PCI-DSS compliance by the end of the quarter or we lose our payment processor.",
    a: "Yes, Kangqore will lead your PCI-DSS readiness program with full accountability. Achieving PCI compliance on a tight deadline requires a focused, high-intensity effort. We will first perform a gap analysis to identify exactly where your cardholder data environment (CDE) falls short. We will then implement the necessary technical controls — encryption at rest and in transit, network segmentation, multi-factor authentication, and rigorous logging. We will also support your team during the actual QSA audit to ensure a successful certification. You will keep your payment processing and your customers' trust.",
    tags: ["Cybersecurity", "FinTech", "Compliance"],
    departments: ["Cybersecurity", "Quality Engineering & Assurance"],
    services: ["IT Security Services", "Quality Engineering & Assurance"],
    category: "COMPLIANCE_CRISIS",
    urgencyLevel: "URGENT"
  },
  {
    q: "We are an AI startup. The new EU AI Act just passed and we have no idea if our model is even legal.",
    a: "Yes, Kangqore will help you navigate the EU AI Act with a rigorous AI Governance framework. The new regulations for high-risk AI systems require transparency, data quality, and human oversight that most startups aren't prepared for. We will audit your model's use case, training data, and decision logic against the Act's requirements. We will help you implement the necessary bias testing, robustness checks, and technical documentation needed for compliance. We will ensure your AI is not just powerful, but also legally defensible in the European market.",
    tags: ["AI Governance", "Data Science & AI", "Compliance"],
    departments: ["Data Science & AI"],
    services: ["AI Governance", "MLOps"],
    category: "COMPLIANCE_CRISIS",
    urgencyLevel: "URGENT"
  },
  {
    q: "A client just audited us and found that we've been storing their sensitive data in a region that violates our contract.",
    a: "Yes, Kangqore will execute an immediate data residency correction. Violating a data residency contract is a breach of trust and a significant legal risk. We will first identify all affected data and its current storage location. We will then perform a secure migration of that data to the contractually mandated region, ensuring full data integrity and zero loss. We will implement 'Data Sovereignty' rules in your cloud infrastructure that automatically block any future storage of sensitive data outside of the permitted zones. We will help you provide a full audit report to your client to rebuild the relationship.",
    tags: ["Cloud Engineering", "Compliance", "Data Governance"],
    departments: ["Cloud Engineering", "Infrastructure, Networks & Operations"],
    services: ["Managed Cloud Services", "Infrastructure Management"],
    category: "COMPLIANCE_CRISIS",
    urgencyLevel: "URGENT"
  },
  {
    q: "We are a healthtech company. Our cloud provider just sent us a notice that we are not under a BAA for HIPAA compliance.",
    a: "Yes, Kangqore will resolve your HIPAA infrastructure compliance immediately. Operating without a Business Associate Agreement (BAA) while handling PHI is a major HIPAA violation. We will first help you negotiate and sign the necessary BAA with your provider. Simultaneously, we will audit your current cloud configuration to ensure it meets the HIPAA Security Rule requirements — specifically encryption, access controls, and audit trails. We will then migrate your sensitive workloads to 'HIPAA-eligible' services within your cloud provider's ecosystem to ensure you are fully protected.",
    tags: ["HealthTech", "Cloud Engineering", "Compliance"],
    departments: ["Cloud Engineering", "Cybersecurity"],
    services: ["Managed Cloud Services", "IT Security Services"],
    category: "COMPLIANCE_CRISIS",
    urgencyLevel: "URGENT"
  },
  {
    q: "We just found out our third-party analytics tool has been capturing and storing unmasked passwords from our login page.",
    a: "Yes, Kangqore will lead the immediate remediation of this severe privacy breach. Capturing passwords in analytics is a critical security and compliance failure. We will first disable the analytics tool to stop further data capture. We will then work with the tool provider to ensure all captured passwords are permanently deleted from their servers. Simultaneously, we will implement a mandatory password reset for all affected users and refactor your login page to ensure that sensitive fields are never visible to third-party scripts. We will help you draft a transparent communication to your users about the incident.",
    tags: ["Cybersecurity", "Digital Engineering", "Data Privacy"],
    departments: ["Cybersecurity", "Digital Engineering"],
    services: ["IT Security Services", "Digital Engineering"],
    category: "COMPLIANCE_CRISIS",
    urgencyLevel: "CRISIS"
  },
  {
    q: "Our SOC2 Type 2 audit starts next week and our automated compliance tool just flagged 45 critical failures.",
    a: "Yes, Kangqore will provide an emergency SOC2 readiness team to fix your failures. 45 critical failures a week before an audit is a high-pressure situation that requires immediate action. We will categorize your failures into 'Technical Fixes' (like MFA or logging) and 'Policy Fixes' (like onboarding docs). We will then assign our engineers to knock out the technical remediations while our compliance consultants help you shore up your documentation. We will work around the clock to ensure you are ready for the auditor's first meeting.",
    tags: ["Compliance", "Cybersecurity", "Quality Engineering"],
    departments: ["Cybersecurity", "Quality Engineering & Assurance"],
    services: ["IT Security Services", "Quality Engineering & Assurance"],
    category: "COMPLIANCE_CRISIS",
    urgencyLevel: "URGENT"
  },
  {
    q: "We are a publicly traded company. Our internal controls for financial reporting (ICFR) were just flagged as 'ineffective' by our auditors.",
    a: "Yes, Kangqore understands the gravity of an ICFR failure for a public company. Ineffective internal controls create serious regulatory risk and market volatility. We will perform a deep audit of your financial data pipeline — from transaction capture to final reporting — to find the 'material weakness.' We will then implement automated reconciliation, restricted access controls, and immutable audit logs to ensure your financial data is accurate, complete, and tamper-proof. We will help you demonstrate 'remediation' to your auditors before your next public filing.",
    tags: ["Enterprise Platforms", "Compliance", "Data Integrity"],
    departments: ["Enterprise Applications", "Consulting & Advisory"],
    services: ["Enterprise Platform Integration", "Data & Analytics"],
    category: "COMPLIANCE_CRISIS",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our mobile app just got rejected from the Apple App Store for 'non-transparent data collection' practices.",
    a: "Yes, Kangqore will help you bring your app into compliance with App Store privacy requirements. An App Store rejection halts your growth and requires a precise technical response. We will audit your app's data collection logic to identify exactly which SDKs or internal trackers are triggering the rejection. We will then implement the required 'Privacy Manifests' and 'App Tracking Transparency' (ATT) prompts. We will also help you create a clear, compliant privacy disclosure that matches your app's actual behavior, ensuring a successful resubmission.",
    tags: ["Product Engineering", "Compliance", "Mobile Tech"],
    departments: ["Product Engineering", "Quality Engineering & Assurance"],
    services: ["Software Product Engineering", "Quality Engineering & Assurance"],
    category: "COMPLIANCE_CRISIS",
    urgencyLevel: "URGENT"
  },
  {
    q: "We are a crypto startup. We just realized we've been operating in a jurisdiction that requires an MSB license we don't have.",
    a: "Yes, Kangqore can help you manage the technical side of this regulatory pivot. Operating as an unlicensed Money Services Business (MSB) is a high-stakes legal risk. We will first help you implement immediate 'geofencing' to block users from the unauthorized jurisdiction. We will then audit your KYC/AML data pipelines to ensure you can provide the required technical documentation for your license application. We will also help you architect a multi-jurisdictional compliance engine that can automatically adapt your product features based on the user's location and applicable law.",
    tags: ["FinTech", "Compliance", "Global Expansion"],
    departments: ["Digital Engineering", "Consulting & Advisory"],
    services: ["Digital Engineering", "Global Expansion Services"],
    category: "COMPLIANCE_CRISIS",
    urgencyLevel: "URGENT"
  },

  // AI FAILURE (10)
  {
    q: "Our customer support chatbot just called a customer a 'stupid idiot' and the screenshot is viral on Twitter.",
    a: "Yes, Kangqore will take control of your AI safety immediately. A toxic chatbot response is a brand disaster and a failure of your prompt guardrails. We will first disable the chatbot to stop further damage and analyze the conversation log to find the 'jailbreak' or prompt injection that caused the behavior. We will then implement a multi-layered safety architecture: strict system prompts, input/output toxicity filtering, and crisis escalation paths. We will also help you create a transparent public statement explaining the technical steps you've taken to ensure it never happens again.",
    tags: ["Agentic AI", "AI Governance", "Public Relations Tech"],
    departments: ["Data Science & AI"],
    services: ["Agentic AI", "AI Governance"],
    category: "AI_FAILURE",
    urgencyLevel: "CRISIS"
  },
  {
    q: "Our automated trading AI just lost $2 million in 10 minutes because of a bad data feed.",
    a: "Yes, Kangqore will implement the technical circuit breakers your trading AI needs. A $2M loss due to 'garbage in, garbage out' is a failure of your data validation layer. We will first identify the faulty data source and implement a 'data sanity' check that blocks any trade if the input data deviates from historical norms or expected ranges. We will then architect a multi-source data consensus engine that requires agreement from multiple feeds before executing a high-value trade. We will also implement 'hard' stop-loss logic at the infrastructure level that can override any AI decision.",
    tags: ["Data Science & AI", "FinTech", "Data Engineering"],
    departments: ["Data Science & AI", "Big Data Engineering"],
    services: ["Data Science & AI", "Big Data Engineering"],
    category: "AI_FAILURE",
    urgencyLevel: "CRISIS"
  },
  {
    q: "Our GenAI product is costing us $0.50 per query and we are only charging $10/month. We are bleeding cash.",
    a: "Yes, Kangqore will optimize your AI unit economics. A GenAI product with negative gross margins is unsustainable. We will audit your LLM usage patterns and implement a multi-tiered model strategy: using smaller, cheaper models for simple tasks and only escalating to expensive models when necessary. We will also implement aggressive caching of common responses, prompt token optimization, and batching strategies. Our goal is to reduce your query cost by 80% while maintaining the quality your users expect.",
    tags: ["GenAI Business Services", "Cloud Engineering", "FinOps"],
    departments: ["Data Science & AI", "Cloud Engineering"],
    services: ["GenAI Business Services", "Managed Cloud Services"],
    category: "AI_FAILURE",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our AI recommendation engine has become 'stale'. It keeps recommending the same items over and over and engagement is plummeting.",
    a: "Yes, Kangqore can fix the 'feedback loop' problem in your recommendation engine. Stale recommendations happen when a model becomes over-fitted to historical data and lacks 'exploration' logic. We will introduce epsilon-greedy strategies to inject variety into recommendations and implement real-time feature updates so the model responds to a user's *current* session behavior, not just their history. We will also rebuild your retraining pipeline so your model stays fresh with new data every hour, not every week.",
    tags: ["Data Science & AI", "MLOps", "Analytics & Insights"],
    departments: ["Data Science & AI"],
    services: ["Data Science & AI", "MLOps"],
    category: "AI_FAILURE",
    urgencyLevel: "URGENT"
  },
  {
    q: "We spent $1M on an AI transformation and our employees say it's 'useless' and hasn't saved a single hour of work.",
    a: "Yes, Kangqore will perform an AI ROI Audit to turn your transformation around. $1M spent without impact is usually a failure of 'Last Mile' integration or a mismatch between the AI's capability and the users' actual needs. We will interview your team to find the friction points, audit your AI's current output quality, and refactor the user experience to make the AI an 'invisible' assistant within their existing workflows. We will focus on automating high-volume, low-complexity tasks that provide immediate, visible time savings.",
    tags: ["Digital Transformation", "Consulting & Advisory", "Agentic AI"],
    departments: ["Consulting & Advisory", "Data Science & AI"],
    services: ["Digital Transformation Strategy", "Agentic AI"],
    category: "AI_FAILURE",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our document summarization AI keeps missing critical 'Not' clauses in legal contracts, leading to wrong summaries.",
    a: "Yes, Kangqore will improve the precision and reliability of your legal AI. Missing a single 'not' in a contract can change everything. We will implement a 'Chain of Verification' approach where the AI is forced to cross-check its own summary against the original text for specific semantic negations. We will also evaluate if a larger context window or a more specialized legal model is needed. We will implement a 'High-Precision' mode that flags any summary with a low confidence score for human-in-the-loop review.",
    tags: ["GenAI Business Services", "Legal Tech", "Quality Engineering"],
    departments: ["Data Science & AI", "Quality Engineering & Assurance"],
    services: ["GenAI Business Services", "Quality Engineering & Assurance"],
    category: "AI_FAILURE",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our AI image generator keeps creating 'deepfake' versions of celebrities and we are afraid of a lawsuit.",
    a: "Yes, Kangqore will implement the necessary content safety filters for your GenAI product. Unfiltered deepfake generation is a significant legal and ethical liability. We will deploy an image-content moderation layer that uses facial recognition and celebrity-name filters to block any request that targets public figures. We will also implement 'invisible watermarking' on all generated images so they can be traced back to your platform. We will help you create a clear 'Acceptable Use Policy' and the technical means to enforce it.",
    tags: ["AI Governance", "GenAI Business Services", "Cybersecurity"],
    departments: ["Data Science & AI", "Cybersecurity"],
    services: ["AI Governance", "GenAI Business Services"],
    category: "AI_FAILURE",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our MLOps pipeline just crashed and we have no way to roll back to the previous stable version of our model.",
    a: "Yes, Kangqore will restore your model and build you a resilient MLOps architecture. Lacking a 'rollback' for an AI model is like not having 'undo' for your entire product. We will first help you manually restore the last known stable model weights and configuration. We will then implement a versioned model registry and an automated deployment pipeline with 'Canary' releases and health-based rollbacks. Your AI will finally have the same 'DevOps' rigor as the rest of your software stack.",
    tags: ["MLOps", "Cloud Engineering", "Infrastructure"],
    departments: ["Data Science & AI", "Cloud Engineering"],
    services: ["MLOps", "Managed Cloud Services"],
    category: "AI_FAILURE",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our AI-powered chatbot is being 'poisoned' by users who are training it to repeat harmful misinformation.",
    a: "Yes, Kangqore can help you defend against 'Data Poisoning' and 'Adversarial Training' attacks. If your AI learns from users, it can be manipulated into becoming a liability. We will first isolate the malicious training data and retrain your model on a verified, clean dataset. We will then implement a 'Data Quality' gateway that filters out outlier or low-quality user feedback before it can affect your model. We will also help you define a 'Core Knowledge' layer that is immutable and cannot be overridden by user interactions.",
    tags: ["AI Governance", "Cybersecurity", "Data Science & AI"],
    departments: ["Data Science & AI", "Cybersecurity"],
    services: ["AI Governance", "IT Security Services"],
    category: "AI_FAILURE",
    urgencyLevel: "URGENT"
  },
  {
    q: "We just realized our 'proprietary' AI is actually just a wrapper for an open-source model we haven't attributed correctly.",
    a: "Yes, Kangqore will help you build actual proprietary value and ensure legal compliance. A 'wrapper' without attribution is a significant IP and legal risk. We will first help you fulfill the attribution requirements for the open-source model. Simultaneously, we will identify opportunities to create true competitive advantage through custom fine-tuning, proprietary data RAG, or unique agentic workflows. We will help you move from a 'wrapper' to a defensible technical asset that you truly own.",
    tags: ["Consulting & Advisory", "Data Science & AI", "Digital Transformation"],
    departments: ["Consulting & Advisory", "Data Science & AI"],
    services: ["Digital Transformation Strategy", "Data Science & AI"],
    category: "AI_FAILURE",
    urgencyLevel: "URGENT"
  },

  // SCALING & CLOUD (15)
  {
    q: "Our cloud infrastructure has become a 'spaghetti' mess. We are terrified to change anything.",
    a: "Yes, Kangqore specializes in infrastructure untangling and modernization. 'Fear of change' in your cloud environment is a major bottleneck to innovation. We will first perform a complete 'Cloud Discovery' to map every resource, dependency, and security group. We will then help you migrate to 'Infrastructure as Code' (IaC) using Terraform or Pulumi, giving you a version-controlled, repeatable, and documented environment. We will break down your monolithic cloud setup into modular, manageable components so you can deploy with confidence again.",
    tags: ["Cloud Engineering", "Infrastructure", "Legacy System Modernization"],
    departments: ["Cloud Engineering", "Infrastructure, Networks & Operations"],
    services: ["Managed Cloud Services", "Infrastructure Management"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our main database has reached its maximum size and we can't write any more data. Our app is read-only.",
    a: "Yes, Kangqore will lead your emergency database expansion and scaling. A full database is a total product standstill. We will first perform an emergency 'Data Cleanup' and 'Archive' to create immediate headroom. We will then migrate your database to a scalable cloud-native engine that supports vertical scaling without downtime or horizontal sharding for long-term growth. We will also implement a data retention policy so you don't keep paying for data you no longer need.",
    tags: ["Cloud Engineering", "Big Data Engineering", "Infrastructure"],
    departments: ["Cloud Engineering", "Big Data Engineering"],
    services: ["Managed Cloud Services", "Big Data Engineering"],
    category: "OUTAGE",
    urgencyLevel: "CRISIS"
  },
  {
    q: "We have a 'noisy neighbor' on our shared server who is stealing all the CPU and crashing our app.",
    a: "Yes, Kangqore will isolate your workload and restore your performance. Resource contention in a shared environment is a direct threat to your SLA. We will move your critical services to dedicated, isolated instances or a container orchestration platform like Kubernetes where we can enforce strict CPU and memory limits. We will also implement 'Resource Quotas' and 'Priority Classes' so your most important tasks always get the power they need, regardless of what other processes are doing.",
    tags: ["Cloud Engineering", "Infrastructure", "Managed Services"],
    departments: ["Cloud Engineering", "Infrastructure, Networks & Operations"],
    services: ["Managed Cloud Services", "Infrastructure Management"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our cloud provider just had a regional outage and we have no multi-region failover. We are down and we don't know for how long.",
    a: "Yes, Kangqore will lead your recovery and then build your regional resilience. Relying on a single cloud region is a single point of failure for your entire business. We will first help you restore your services as soon as the provider's region is back. Then, we will architect a multi-region or multi-cloud failover strategy with real-time data replication and automated DNS switching. Your next outage will be measured in seconds, not hours, as your traffic automatically migrates to a healthy region.",
    tags: ["Cloud Engineering", "Infrastructure", "Managed Services"],
    departments: ["Cloud Engineering", "Infrastructure, Networks & Operations"],
    services: ["Managed Cloud Services", "Infrastructure Management"],
    category: "OUTAGE",
    urgencyLevel: "CRISIS"
  },
  {
    q: "We did a 'lift and shift' to the cloud last year and our bills are 3x higher than on-prem with no performance gain.",
    a: "Yes, Kangqore will execute a 'Cloud Optimization' plan to fix your migration failure. A 'lift and shift' without cloud-native refactoring is just running expensive servers in someone else's data center. We will audit your usage to identify 'zombie' resources, right-size your instances, and migrate your workloads to serverless or containerized architectures that only cost money when they are actually being used. We will also help you implement reserved instances and spot pricing to slash your monthly spend while improving performance.",
    tags: ["Cloud Engineering", "FinOps", "Digital Transformation"],
    departments: ["Cloud Engineering", "Consulting & Advisory"],
    services: ["Managed Cloud Services", "Digital Transformation Strategy"],
    category: "STRATEGIC_ADVISORY",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our Kubernetes cluster has become 'unstable'. Pods are crashing and we don't know why.",
    a: "Yes, Kangqore will perform a deep Kubernetes 'Health Audit' and stabilization. K8s complexity can lead to invisible failure modes like OOMKills, resource starvation, or DNS loops. We will implement comprehensive observability using Prometheus and Grafana to see exactly where your cluster is failing. We will then tune your resource requests/limits, optimize your node group scaling, and fix any network-policy misconfigurations. Your cluster will be restored to a stable, production-ready state with full visibility.",
    tags: ["Cloud Engineering", "DevOps", "Infrastructure"],
    departments: ["Cloud Engineering", "Infrastructure, Networks & Operations"],
    services: ["Managed Cloud Services", "DevOps As A Service"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our static assets take 10 seconds to load in Europe because our servers are only in the US.",
    a: "Yes, Kangqore will implement a global content delivery strategy for your business. Physical distance shouldn't dictate your user experience. We will deploy a global Content Delivery Network (CDN) that caches your static assets at the 'edge' — in hundreds of locations around the world. We will also implement 'Edge Functions' for low-latency dynamic processing closer to your global users. Your European customers will finally experience the same speed as your US ones.",
    tags: ["Digital Engineering", "Cloud Engineering", "Infrastructure"],
    departments: ["Digital Engineering", "Cloud Engineering"],
    services: ["Digital Engineering", "Managed Cloud Services"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "We just realized we are paying $10,000/month for a 'Cloud Enterprise' plan we only use for one small database.",
    a: "Yes, Kangqore will right-size your cloud commitments and vendor strategy. Over-committing to expensive enterprise tiers is a common way to waste capital. We will evaluate if you can migrate that database to a more cost-effective tier or a different cloud-native engine without sacrificing performance or security. We will then help you renegotiate or downgrade your enterprise plan to match your actual needs. We will put that $120,000/year back into your product development budget.",
    tags: ["Cloud Engineering", "FinOps", "Consulting & Advisory"],
    departments: ["Cloud Engineering", "Consulting & Advisory"],
    services: ["Managed Cloud Services", "Digital Transformation Strategy"],
    category: "STRATEGIC_ADVISORY",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our CI/CD build times have increased from 5 minutes to 45 minutes. It's killing our developer productivity.",
    a: "Yes, Kangqore will optimize your build pipeline and restore your engineering speed. A 45-minute build is a developer's worst nightmare. We will profile your build stages to find the bottlenecks — whether it's slow test suites, unoptimized Docker layers, or network latency during dependency fetching. We will implement intelligent build caching, parallelize your test runs, and right-size your CI/CD runner capacity. We will get your builds back under 10 minutes so your team can focus on shipping, not waiting.",
    tags: ["DevOps", "Product Engineering", "Infrastructure"],
    departments: ["Cloud Engineering", "Product Engineering"],
    services: ["DevOps As A Service", "Software Product Engineering"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "We have a 'Cloud Lock-in' problem. Our provider just raised prices by 40% and we are too stuck to leave.",
    a: "Yes, Kangqore can help you build a multi-cloud or cloud-agnostic strategy to regain your leverage. Being 'held hostage' by a single provider is a significant strategic risk. We will help you containerize your services and use open-standard services so they can be easily migrated. We will implement an 'Abstraction Layer' for your database and storage needs so your application doesn't depend on proprietary APIs. We will give you the technical freedom to move where the value and performance are best.",
    tags: ["Cloud Engineering", "Consulting & Advisory", "Digital Transformation"],
    departments: ["Cloud Engineering", "Consulting & Advisory"],
    services: ["Managed Cloud Services", "Digital Transformation Strategy"],
    category: "STRATEGIC_ADVISORY",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our internal network is so slow that our remote employees can't even access the company VPN.",
    a: "Yes, Kangqore will modernize your remote access and network performance. A broken VPN is a total shutdown for a remote-first team. We will first identify if the bottleneck is your VPN hardware, your bandwidth, or a suboptimal routing path. We will then help you migrate from legacy VPNs to a modern 'Zero Trust Network Access' (ZTNA) or 'SD-WAN' solution that provides faster, more secure access directly to your cloud resources without backhauling traffic through a central office. Your team will finally be productive from anywhere.",
    tags: ["Infrastructure", "Cybersecurity", "Managed Services"],
    departments: ["Infrastructure, Networks & Operations", "Cybersecurity"],
    services: ["Infrastructure Management", "IT Security Services"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our cloud storage just hit an 'API Rate Limit' and our users can't upload any more files.",
    a: "Yes, Kangqore will resolve your API bottlenecks and improve your storage architecture. Hitting a cloud rate limit is a sign of an unoptimized interaction pattern or an under-provisioned storage tier. We will implement 'Exponential Backoff' and 'Queueing' for your upload processes to smooth out traffic spikes. Simultaneously, we will evaluate if you should move to a high-performance storage tier or use 'Presigned URLs' to offload upload traffic directly from your servers to the cloud provider. Your users will experience seamless uploads once again.",
    tags: ["Cloud Engineering", "Digital Engineering", "Infrastructure"],
    departments: ["Cloud Engineering", "Digital Engineering"],
    services: ["Managed Cloud Services", "Digital Engineering"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "We just realized we have 10,000 public S3 buckets. We don't know which ones contain sensitive data.",
    a: "Yes, Kangqore will lead your emergency data exposure audit and lockdown. 10,000 public buckets is a data breach waiting to happen. We will first run an automated sweep to identify and privatize all non-essential public buckets. We will then use 'Sensitive Data Discovery' tools to scan your buckets for PII, financial data, or credentials. We will implement 'Guardrails' that block the creation of public buckets by default and set up continuous monitoring to alert us the second an insecure configuration is detected. We will turn your cloud into a fortress.",
    tags: ["Cybersecurity", "Cloud Engineering", "Data Governance"],
    departments: ["Cybersecurity", "Cloud Engineering"],
    services: ["IT Security Services", "Managed Cloud Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "CRISIS"
  },
  {
    q: "Our cloud provider's 'Managed Database' service is having a multi-day performance issue and we are too stuck to fix it ourselves.",
    a: "Yes, Kangqore can help you take control of your database performance. 'Managed' doesn't mean 'Hands-off.' We will work with your cloud provider's support team to identify the root cause of the performance degradation while simultaneously looking for 'Query Optimizations' and 'Caching Layers' we can implement on our end to reduce the load on the database. We will also help you evaluate if you should migrate to a different managed service or a self-managed instance where you have more control over the underlying hardware and configuration.",
    tags: ["Cloud Engineering", "Managed Services", "Infrastructure"],
    departments: ["Cloud Engineering", "Infrastructure, Networks & Operations"],
    services: ["Managed Cloud Services", "Infrastructure Management"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "We just discovered we've been paying for 'Premium Support' for three years and haven't opened a single ticket.",
    a: "Yes, Kangqore will help you optimize your cloud service agreements. Paying for unused 'Premium Support' is a direct loss to your bottom line. We will help you downgrade to a more appropriate support tier that still provides the coverage you need for emergencies. We will then implement a 'Managed Services' agreement with Kangqore where you only pay for actual expertise and support when you need it, often for a fraction of the cost of the provider's premium plans. We will turn your support spend into actual technical value.",
    tags: ["Managed Services", "FinOps", "Consulting & Advisory"],
    departments: ["Infrastructure, Networks & Operations", "Consulting & Advisory"],
    services: ["Managed Services", "Digital Transformation Strategy"],
    category: "STRATEGIC_ADVISORY",
    urgencyLevel: "NORMAL"
  },

  // BUSINESS & FOUNDER (10)
  {
    q: "I'm a founder. My lead engineer just quit and took all the system passwords with him.",
    a: "Yes, Kangqore will act as your emergency technical team to regain control. A 'hostile' exit of a lead engineer is a critical risk to your entire company. We will first help you coordinate with your cloud and identity providers to lock down all accounts and reset all administrative passwords and API keys. We will then perform a 'Deep System Discovery' to ensure there are no backdoors or scheduled malicious tasks. We will provide you with interim technical leadership so your product and your company keep moving forward while you search for a new lead.",
    tags: ["Consulting & Advisory", "Cybersecurity", "Identity Management"],
    departments: ["Consulting & Advisory", "Cybersecurity"],
    services: ["Digital Transformation Strategy", "IT Security Services"],
    category: "SECURITY_BREACH",
    urgencyLevel: "CRISIS"
  },
  {
    q: "We are in M&A due diligence. The buyer's tech team says our technical debt is a 'deal breaker'.",
    a: "Yes, Kangqore can help you navigate and remediate technical debt for a successful deal. Tech debt is often used as a valuation-reduction tactic in M&A. We will first perform our own 'Technical Debt Audit' to objectively categorize your debt into 'Manageable' and 'Critical.' We will then help you create a 'Remediation Roadmap' that demonstrates to the buyer how the debt will be systematically addressed post-deal. We can even execute the most critical fixes during the diligence period to rebuild the buyer's confidence. We will help you close the deal at the value you deserve.",
    tags: ["Consulting & Advisory", "Digital Transformation", "Quality Engineering"],
    departments: ["Consulting & Advisory", "Quality Engineering & Assurance"],
    services: ["Digital Transformation Strategy", "Quality Engineering & Assurance"],
    category: "STRATEGIC_ADVISORY",
    urgencyLevel: "URGENT"
  },
  {
    q: "We just raised $5M and our board is demanding a 'Cybersecurity Roadmap' we don't have.",
    a: "Yes, Kangqore will help you create a board-ready Cybersecurity Roadmap that aligns with your growth. Investors want to see that their capital is protected. We will perform a 'Security Maturity Assessment' and create a phased plan that prioritizes the most critical risks — such as data protection, access controls, and incident response. We will provide you with the technical slides and metrics you need to demonstrate to your board that you are taking security seriously. You will go from 'no plan' to 'best-in-class security posture.'",
    tags: ["Cybersecurity", "Consulting & Advisory", "Compliance"],
    departments: ["Cybersecurity", "Consulting & Advisory"],
    services: ["IT Security Services", "Digital Transformation Strategy"],
    category: "STRATEGIC_ADVISORY",
    urgencyLevel: "NORMAL"
  },
  {
    q: "Our product is so slow that our top enterprise client is threatening to cancel their $1M contract next week.",
    a: "Yes, Kangqore will lead an emergency performance intervention to save your contract. A $1M churn risk requires immediate, high-intensity technical action. We will deploy a 'Performance SWAT Team' to your application to find and fix the specific bottlenecks affecting that client's use cases — whether it's slow queries, network latency, or frontend bloat. We will provide your client with a daily progress report and a technical guarantee of performance improvements. We will help you turn a churn threat into a long-term partnership.",
    tags: ["Product Engineering", "Digital Engineering", "Managed Services"],
    departments: ["Product Engineering", "Digital Engineering"],
    services: ["Software Product Engineering", "Support & Maintenance"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "CRISIS"
  },
  {
    q: "I'm a non-technical founder. My outsource team has been building for 6 months and I still don't have a working MVP.",
    a: "Yes, Kangqore can help you take control of your product development. Being 'stuck' with an unresponsive or ineffective outsource team is a common and painful experience for founders. We will perform a 'Code and Process Audit' to see what has actually been built and where the blockers are. We will then help you either 'Course Correct' the current team with better technical management or lead a 'Transition' to a more reliable development path. We will get your MVP into the hands of users, not just stored in a broken repository.",
    tags: ["Consulting & Advisory", "Product Engineering", "Digital Transformation"],
    departments: ["Consulting & Advisory", "Product Engineering"],
    services: ["Digital Transformation Strategy", "Software Product Engineering"],
    category: "STRATEGIC_ADVISORY",
    urgencyLevel: "URGENT"
  },
  {
    q: "We just discovered our 'proprietary' algorithm was actually copied from a competitor by a former contractor. We are afraid of a lawsuit.",
    a: "Yes, Kangqore can help you technically refactor and differentiate your product to mitigate legal risk. IP theft is a severe threat to your company's existence. We will first help you identify the specific 'copy-pasted' sections of your code or algorithm. We will then lead a 'Clean Room Refactor' to rebuild those features from scratch using original logic and modern best practices. We will help you demonstrate 'Technical Originality' and create a more powerful, unique version of the feature that you actually own.",
    tags: ["Consulting & Advisory", "Digital Engineering", "Legal Tech"],
    departments: ["Consulting & Advisory", "Digital Engineering"],
    services: ["Digital Transformation Strategy", "Digital Engineering"],
    category: "STRATEGIC_ADVISORY",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our company is pivoting from B2C to B2B Enterprise and our current tech stack is not 'Enterprise Ready'.",
    a: "Yes, Kangqore will lead your 'Enterprise Readiness' transformation. B2B clients demand security, scalability, and integration that B2C stacks often lack. We will help you implement 'Enterprise Essentials' like SSO/SAML authentication, role-based access control (RBAC), multi-tenant data isolation, and robust API documentation. We will also help you prepare for the intense technical audits and security questionnaires that enterprise buyers will put you through. We will make sure your tech stack is a 'Yes' for every enterprise deal.",
    tags: ["Digital Transformation", "Enterprise Platforms", "Consulting & Advisory"],
    departments: ["Digital Engineering", "Consulting & Advisory"],
    services: ["Digital Transformation Strategy", "Enterprise Platform Integration"],
    category: "STRATEGIC_ADVISORY",
    urgencyLevel: "NORMAL"
  },
  {
    q: "We just realized our 'scalable' architecture actually has a hard limit of 10,000 users and we are at 9,500.",
    a: "Yes, Kangqore will lead your emergency architectural scaling before you hit the wall. A hard limit at 9,500 users is a 'success disaster' waiting to happen. We will first identify the specific bottleneck — whether it's a single-threaded process, a database lock limit, or a fixed-size buffer. We will then implement a 'Fast-Track Scaling' plan to remove the limit, likely through horizontal scaling, message queues, or a database migration. We will get you to 100,000+ user capacity before your 10,001st user signs up.",
    tags: ["Cloud Engineering", "Infrastructure", "Scalability"],
    departments: ["Cloud Engineering", "Infrastructure, Networks & Operations"],
    services: ["Managed Cloud Services", "Infrastructure Management"],
    category: "OUTAGE",
    urgencyLevel: "CRISIS"
  },
  {
    q: "We are spending $50k/month on marketing and our landing page takes 8 seconds to load. We are wasting our budget.",
    a: "Yes, Kangqore will optimize your 'Conversion Infrastructure' and stop the waste. An 8-second load time on a $50k/month marketing spend is a financial emergency. We will first implement immediate 'Quick Wins' like image compression, code minification, and global CDN caching. We will then perform a 'Deep Performance Audit' to identify any slow backend requests or heavy third-party scripts that are killing your conversion rate. We will get your load time under 2 seconds, instantly increasing the ROI of every marketing dollar you spend.",
    tags: ["Digital Engineering", "Product Engineering", "Performance Optimization"],
    departments: ["Digital Engineering", "Product Engineering"],
    services: ["Digital Engineering", "Software Product Engineering"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our technical founder just left and the rest of us are non-technical. We don't even know how to deploy our app.",
    a: "Yes, Kangqore will provide you with the technical leadership and operational support you need to stay in business. Losing your technical founder without a transition plan is a critical risk. We will first perform a 'Knowledge Capture' of your current systems, credentials, and deployment pipelines. We will then act as your 'Fractional CTO' and 'DevOps Team' to ensure your app remains stable and you can keep shipping features. We will help you keep the lights on and the product growing while you decide on your next long-term technical leadership path.",
    tags: ["Consulting & Advisory", "Managed Services", "Infrastructure"],
    departments: ["Consulting & Advisory", "Infrastructure, Networks & Operations"],
    services: ["Digital Transformation Strategy", "Managed Services"],
    category: "STRATEGIC_ADVISORY",
    urgencyLevel: "URGENT"
  },

  // UX & PRODUCT (10)
  {
    q: "Our mobile app is crashing for every user on the latest iOS update. Our rating is plummeting.",
    a: "Yes, Kangqore will lead your emergency iOS recovery. A crash-on-launch for an entire OS version is a top-tier product emergency. We will first isolate the specific API or library that is incompatible with the new iOS version. We will then deploy an emergency patch and work with Apple to request an 'Expedited Review' to get the fix to your users as fast as possible. We will also implement a 'Beta Testing' program and automated 'OS-Matrix' testing so you catch these issues before the next Apple update reaches the public.",
    tags: ["Product Engineering", "Quality Engineering", "Mobile Tech"],
    departments: ["Product Engineering", "Quality Engineering & Assurance"],
    services: ["Software Product Engineering", "Quality Engineering & Assurance"],
    category: "OUTAGE",
    urgencyLevel: "CRISIS"
  },
  {
    q: "Users are complaining that our app's 'Search' feature is completely broken and returns irrelevant results.",
    a: "Yes, Kangqore can rebuild your search intelligence and restore user trust. A broken search makes your entire product feel unusable. We will first audit your current search implementation — whether it's a simple SQL 'LIKE' or a legacy search engine — to find the root cause of the irrelevance. We will then implement a modern 'Vector Search' or 'ElasticSearch' solution with proper weighting, fuzzy matching, and semantic understanding. Your users will find what they are looking for in milliseconds.",
    tags: ["Digital Engineering", "Data Science & AI", "Product Engineering"],
    departments: ["Digital Engineering", "Data Science & AI"],
    services: ["Digital Engineering", "Data Science & AI"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "We just discovered that our 'Accessibility' is so bad that we are being sued under the ADA.",
    a: "Yes, Kangqore will lead your emergency 'Accessibility Remediation' and compliance program. An ADA lawsuit is a serious legal and ethical failure that requires immediate technical action. We will first perform a 'WCAG 2.1 Audit' to identify every barrier for users with disabilities in your product. We will then assign a specialized team to fix those barriers — including screen reader support, keyboard navigation, and color contrast. We will help you provide a 'Voluntary Product Accessibility Template' (VPAT) to your legal team to demonstrate your active compliance efforts.",
    tags: ["Product Engineering", "Quality Engineering", "Compliance"],
    departments: ["Product Engineering", "Quality Engineering & Assurance"],
    services: ["Software Product Engineering", "Quality Engineering & Assurance"],
    category: "COMPLIANCE_CRISIS",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our product's UX is so confusing that 40% of users drop off during the 'Onboarding' flow.",
    a: "Yes, Kangqore can help you diagnose and fix your 'Onboarding Friction.' A 40% drop-off is a clear sign of a broken user journey. We will first implement 'Session Recording' and 'Funnel Analytics' to see exactly where and why users are leaving. We will then lead a 'UX Sprint' to refactor your onboarding into a simpler, more engaging process that focuses on getting users to their first 'Aha!' moment as fast as possible. We will turn your onboarding from a barrier into a growth engine.",
    tags: ["Product Strategy", "Digital Engineering", "Analytics & Insights"],
    departments: ["Consulting & Advisory", "Digital Engineering"],
    services: ["Product Strategy & Experience Design", "Digital Engineering"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our app is completely unusable on slow 3G connections, and that's 50% of our market in India.",
    a: "Yes, Kangqore specializes in 'Connectivity-Aware' product engineering. If your app only works on fast Wi-Fi, you are excluding 50% of your potential revenue. We will implement 'Offline-First' logic, aggressive asset caching, and 'Adaptive Content' that serves smaller images and fewer scripts to users on slow networks. We will also optimize your initial payload size and implement 'Lazy Loading' for everything. Your app will finally be fast and reliable for every user in India, regardless of their connection speed.",
    tags: ["Product Engineering", "Digital Engineering", "Mobile Tech"],
    departments: ["Product Engineering", "Digital Engineering"],
    services: ["Software Product Engineering", "Digital Engineering"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "We just realized our 'Desktop-Only' app is being accessed by 70% mobile users and it looks like a mess.",
    a: "Yes, Kangqore will lead your 'Mobile-Responsive' transformation. Ignoring 70% of your users is a massive missed opportunity. We will first perform a 'Mobile-First' refactor of your core user journeys to ensure they are fully functional and beautiful on small screens. We will implement 'Responsive Design' across your entire platform and optimize your touch-interactions for mobile ergonomics. We will help you capture the 70% of your market that you are currently frustrating.",
    tags: ["Digital Engineering", "Product Engineering", "UX Design"],
    departments: ["Digital Engineering", "Product Engineering"],
    services: ["Digital Engineering", "Software Product Engineering"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "Users are reporting that our 'Payment' page is broken but our internal logs say everything is 'OK'.",
    a: "Yes, Kangqore will help you find the 'Silent Failure' in your checkout flow. If your logs say 'OK' but your revenue is missing, you have a visibility gap. We will implement 'Full-Stack Observability' and 'Client-Side Error Tracking' to see exactly what users are experiencing in their browsers. We will then identify if the issue is a third-party script conflict, a CSS layout bug that hides the pay button, or a silent failure in your frontend validation. We will fix the leak in your revenue funnel immediately.",
    tags: ["Digital Engineering", "Quality Engineering", "FinTech"],
    departments: ["Digital Engineering", "Quality Engineering & Assurance"],
    services: ["Digital Engineering", "Quality Engineering & Assurance"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our product's 'Analytics Dashboard' is giving different numbers than our internal SQL queries and we look incompetent to our clients.",
    a: "Yes, Kangqore will resolve your 'Data Inconsistency' and restore your credibility. Different numbers for the same metric destroy trust in your product. We will first perform a 'Data Audit' to identify where the logic mismatch is — whether it's in your ETL pipeline, your dashboard's aggregation logic, or your time-zone handling. We will then implement a 'Single Source of Truth' data architecture where your dashboard and your internal queries always pull from the same pre-validated metrics layer. We will help you provide a 'Data Accuracy Report' to your clients.",
    tags: ["Data & Analytics", "Product Engineering", "Enterprise Applications"],
    departments: ["Data Science & AI", "Product Engineering"],
    services: ["Data & Analytics", "Software Product Engineering"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "We just launched a new feature and our 'Support Ticket' volume has increased by 500%. Our team is overwhelmed.",
    a: "Yes, Kangqore will help you triage and fix the product confusion or bugs causing the support surge. A 500% spike means your new feature is either broken or poorly understood. We will first help you categorize the support tickets to find the 'Top 3 Friction Points.' We will then lead an emergency 'Product Refinement' to fix those points — whether through bug fixes, UI improvements, or better in-app guidance. We will help you reduce the ticket volume and restore your team's sanity.",
    tags: ["Product Engineering", "Managed Services", "UX Design"],
    departments: ["Product Engineering", "Infrastructure, Networks & Operations"],
    services: ["Software Product Engineering", "Support & Maintenance"],
    category: "PERFORMANCE_DEGRADATION",
    urgencyLevel: "URGENT"
  },
  {
    q: "Our product feels 'dated' and we are losing sales to a new competitor with a 'Modern AI' interface.",
    a: "Yes, Kangqore will lead your 'Product Modernization' and AI integration. Looking 'dated' is a signal that your product has stopped evolving. We will first perform a 'Modernization Audit' to identify where your UI and your tech stack are falling behind. We will then lead a 'Visionary Design' and 'Agentic AI' integration that doesn't just copy your competitor, but leapfrogs them with a more powerful, intuitive experience. We will help you move from 'legacy' to 'market leader' in one strategic transformation.",
    tags: ["Digital Transformation", "Product Strategy", "Agentic AI"],
    departments: ["Consulting & Advisory", "Data Science & AI"],
    services: ["Digital Transformation Strategy", "Agentic AI"],
    category: "STRATEGIC_ADVISORY",
    urgencyLevel: "NORMAL"
  }
];

async function main() {
  console.log('Seeding eQORE Client Assurance Response Bank (Full 100 Scenarios)...');
  
  for (const item of QA) {
    const id = `seed-${item.q.slice(0, 50).replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '')}`;
    await prisma.eqoreAssuranceScenario.upsert({
      where: { id },
      update: {
        question: item.q,
        answer: item.a,
        tags: item.tags,
        departments: item.departments,
        services: item.services,
        category: item.category,
        urgencyLevel: item.urgencyLevel,
      },
      create: {
        id,
        question: item.q,
        answer: item.a,
        tags: item.tags,
        departments: item.departments,
        services: item.services,
        category: item.category,
        urgencyLevel: item.urgencyLevel,
      },
    });
  }

  console.log('Successfully seeded 70 additional scenarios. Total: 100 scenarios active.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
