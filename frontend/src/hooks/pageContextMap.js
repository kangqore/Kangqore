/**
 * pageContextMap.js
 * ─────────────────────────────────────────────────────────────
 * Contextual intelligence registry for eQORE.
 *
 * Maps  `{surface}::{slug}`  →  { greeting, prompts[] }
 *
 * When eQORE opens on a page with a matching seedContext, it uses the
 * rich, domain-specific greeting and prompts instead of the generic
 * "Ask me about X" fallback.
 *
 * To add a new page:
 *   1. Add an entry below with key `service::your-slug` or `department::your-slug`
 *   2. Done. No other file changes needed.
 */

const PAGE_CONTEXT_MAP = {

  // ═══════════════════════════════════════════════════════════
  // DEPARTMENTS (15)
  // ═══════════════════════════════════════════════════════════

  'department::ai-cognitive': {
    greeting: "You're in our AI & Cognitive practice. I can walk you through our AI services, compare approaches like GenAI vs Agentic AI, or help you identify the right starting point for your organization.",
    prompts: [
      'Which AI service fits my needs?',
      'Compare GenAI vs Agentic AI',
      'What does an AI engagement look like?',
      'Help me build a business case for AI',
      'What governance do you build into AI systems?',
    ],
  },

  'department::analytics-insights': {
    greeting: "You're exploring Analytics & Insights. I can help you understand our data engineering capabilities, compare analytics platforms, or scope a data strategy engagement.",
    prompts: [
      'What analytics services do you offer?',
      'How do you approach data strategy?',
      'Compare your analytics to in-house teams',
      'What industries benefit most from your analytics?',
    ],
  },

  'department::cloud-engineering': {
    greeting: "You're in Cloud Engineering. I can compare AWS, Azure, and GCP approaches, help scope a cloud migration, or explain our managed cloud services.",
    prompts: [
      'Compare AWS vs Azure vs GCP for my use case',
      'What does a cloud migration look like?',
      'How do your managed cloud services work?',
      'What is your approach to cloud security?',
    ],
  },

  'department::cybersecurity': {
    greeting: "You're exploring Cybersecurity. I can help you understand our security assessment process, compare service tiers, or identify the right security posture for your industry.",
    prompts: [
      'What cybersecurity services do you offer?',
      'How do you assess security posture?',
      'What compliance frameworks do you support?',
      'How do you handle incident response?',
    ],
  },

  'department::digital-transformation-modernization': {
    greeting: "You're in Digital Transformation & Modernization. I can help you assess modernization readiness, scope a legacy migration, or explore our transformation methodology.",
    prompts: [
      'How do you modernize legacy systems?',
      'What is your transformation methodology?',
      'How do you minimize disruption during modernization?',
      'What ROI can I expect from digital transformation?',
    ],
  },

  'department::automation': {
    greeting: "You're exploring Automation. I can help you compare RPA vs intelligent automation, estimate process automation ROI, or scope an automation pilot.",
    prompts: [
      'Compare RPA vs intelligent automation',
      'Estimate automation ROI for my processes',
      'What does an automation pilot look like?',
      'Which processes should I automate first?',
    ],
  },

  'department::product-engineering': {
    greeting: "You're in Product Engineering. I can help you scope a product build, compare engineering approaches, or explore our DevOps and quality engineering capabilities.",
    prompts: [
      'How do you approach product engineering?',
      'What is your DevOps methodology?',
      'Compare build vs buy for my product idea',
      'How do you handle quality engineering?',
    ],
  },

  'department::infrastructure-networks-operations': {
    greeting: "You're exploring Infrastructure & Operations. I can help you understand our managed services, scope an infrastructure modernization, or compare support models.",
    prompts: [
      'What managed services do you offer?',
      'How do you modernize IT infrastructure?',
      'What support models are available?',
      'How do you handle network operations?',
    ],
  },

  'department::consulting-advisory': {
    greeting: "You're in Consulting & Advisory. I can help you understand our strategy consulting process, scope a technology assessment, or explore our workshop formats.",
    prompts: [
      'What consulting services do you offer?',
      'How do your strategy workshops work?',
      'What does a technology assessment look like?',
      'How do you approach digital strategy?',
    ],
  },

  'department::digital-engineering': {
    greeting: "You're exploring Digital Engineering. I can help you compare software development approaches, scope an MVP build, or explore our API and microservices capabilities.",
    prompts: [
      'How do you approach software development?',
      'What does an MVP acceleration look like?',
      'How do you handle API engineering?',
      'Compare your engineering to in-house teams',
    ],
  },

  'department::enterprise-applications': {
    greeting: "You're in Enterprise Applications. I can help you compare platforms like Salesforce, ServiceNow, and Pimcore, or scope an enterprise integration project.",
    prompts: [
      'Compare Salesforce vs ServiceNow for my needs',
      'How do you handle enterprise integration?',
      'What Pimcore services do you offer?',
      'How do you approach enterprise mobility?',
    ],
  },

  'department::emerging-technologies': {
    greeting: "You're exploring Emerging Technologies. I can help you understand our blockchain, IoT, and SDN/NFV capabilities, or assess which emerging tech fits your roadmap.",
    prompts: [
      'What emerging technologies do you work with?',
      'How do you approach IoT implementations?',
      'What blockchain services do you offer?',
      'How do I evaluate emerging tech for my business?',
    ],
  },

  'department::business-operations': {
    greeting: "You're in Business Operations. I can help you understand our GCC model, scope a supply chain optimization, or explore our finance and risk management services.",
    prompts: [
      'How does your GCC model work?',
      'What supply chain services do you offer?',
      'How do you approach finance & risk management?',
      'What is unified services management?',
    ],
  },

  'department::digital-marketing': {
    greeting: "You're exploring Digital Marketing. I can help you compare SEO, performance marketing, and CDP strategies, or scope a data-driven growth campaign.",
    prompts: [
      'What digital marketing services do you offer?',
      'How do you approach SEO & organic growth?',
      'What is your CDP strategy offering?',
      'How does your performance marketing work?',
    ],
  },

  'department::conversion-engineering': {
    greeting: "You're in Conversion Engineering. I can help you understand our CRO methodology, scope a funnel optimization project, or explore our campaign planning capabilities.",
    prompts: [
      'What is conversion engineering?',
      'How do you optimize conversion funnels?',
      'What CRO methodology do you use?',
      'How do you approach campaign planning?',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // FLAGSHIP SERVICES (high-traffic pages)
  // ═══════════════════════════════════════════════════════════

  'service::agentic-ai': {
    greeting: "You're exploring Agentic AI. I can help you estimate automation ROI, map use cases, compare agent architectures, or create a proposal brief.",
    prompts: [
      'Estimate automation ROI for my use case',
      'Compare agent architectures',
      'Map agentic use cases for my industry',
      'Create a proposal brief for Agentic AI',
      'What governance is built into your agents?',
    ],
  },

  'service::gen-ai-business-services': {
    greeting: "You're exploring Generative AI. I can help you identify GenAI use cases, compare LLM providers, assess enterprise readiness, or scope a GenAI pilot.",
    prompts: [
      'Identify GenAI use cases for my business',
      'Compare LLM providers for enterprise use',
      'What does a GenAI pilot look like?',
      'How do you handle data privacy with GenAI?',
      'What is your RAG implementation approach?',
    ],
  },

  'service::ai-governance': {
    greeting: "You're exploring AI Governance. I can help you understand governance frameworks, compliance requirements, or how to build responsible AI at enterprise scale.",
    prompts: [
      'What AI governance frameworks do you use?',
      'How do you ensure responsible AI?',
      'What compliance standards do you support?',
      'How do you audit AI systems?',
    ],
  },

  'service::mlops': {
    greeting: "You're exploring MLOps. I can help you design ML pipelines, compare MLOps platforms, or scope a model deployment and monitoring strategy.",
    prompts: [
      'What is your MLOps approach?',
      'Compare MLOps platforms for my needs',
      'How do you handle model monitoring?',
      'What does ML pipeline design look like?',
    ],
  },

  'service::data-science-ai': {
    greeting: "You're exploring Data Science & AI. I can help you scope a data science engagement, understand predictive analytics capabilities, or compare modeling approaches.",
    prompts: [
      'What data science services do you offer?',
      'How do you approach predictive analytics?',
      'What modeling techniques do you use?',
      'How do you ensure model accuracy?',
    ],
  },

  'service::devops-as-a-service': {
    greeting: "You're exploring DevOps as a Service. I can help you assess DevOps maturity, compare CI/CD toolchains, or scope a DevOps transformation.",
    prompts: [
      'Assess my DevOps maturity',
      'Compare CI/CD toolchains',
      'What does a DevOps transformation look like?',
      'How do you handle infrastructure as code?',
    ],
  },

  'service::cloud-computing': {
    greeting: "You're exploring Cloud Computing. I can help you compare cloud strategies, scope a migration, or understand our cloud-native development approach.",
    prompts: [
      'Compare cloud migration strategies',
      'What is your cloud-native approach?',
      'How do you handle multi-cloud?',
      'What cloud cost optimization do you offer?',
    ],
  },

  'service::digital-transformation': {
    greeting: "You're exploring Digital Transformation. I can help you assess transformation readiness, scope a modernization initiative, or understand our phased approach.",
    prompts: [
      'Assess my digital transformation readiness',
      'What is your transformation methodology?',
      'How do you handle change management?',
      'What ROI can I expect?',
    ],
  },

  'service::application-modernization': {
    greeting: "You're exploring Application Modernization. I can help you assess your legacy landscape, compare modernization strategies, or scope a re-platforming initiative.",
    prompts: [
      'How do you assess legacy applications?',
      'Compare re-platform vs re-architect',
      'What does modernization without disruption look like?',
      'How do you reduce technical debt?',
    ],
  },

  'service::salesforce': {
    greeting: "You're exploring Salesforce services. I can help you scope a Salesforce implementation, compare editions, or understand our integration capabilities.",
    prompts: [
      'What Salesforce services do you offer?',
      'How do you approach Salesforce implementation?',
      'What integrations do you support?',
      'How do you handle Salesforce customization?',
    ],
  },

  'service::servicenow': {
    greeting: "You're exploring ServiceNow. I can help you scope an ITSM implementation, compare ServiceNow modules, or understand our workflow automation approach.",
    prompts: [
      'What ServiceNow services do you offer?',
      'How do you approach ITSM implementation?',
      'What workflow automation do you enable?',
      'How do you handle ServiceNow integrations?',
    ],
  },

  'service::robotic-process-automation': {
    greeting: "You're exploring RPA. I can help you identify automation candidates, estimate bot ROI, compare RPA platforms, or scope a pilot program.",
    prompts: [
      'Identify RPA candidates in my processes',
      'Estimate bot ROI for my use case',
      'Compare RPA platforms',
      'What does an RPA pilot look like?',
    ],
  },

  'service::intelligent-automation': {
    greeting: "You're exploring Intelligent Automation. I can help you understand AI-powered automation, compare it to traditional RPA, or scope a hyperautomation strategy.",
    prompts: [
      'How does intelligent automation differ from RPA?',
      'What is hyperautomation?',
      'How do you approach AI-powered automation?',
      'What ROI can I expect from intelligent automation?',
    ],
  },

  'service::software-development': {
    greeting: "You're exploring Software Development. I can help you scope a custom build, compare development methodologies, or understand our engineering team structure.",
    prompts: [
      'How do you approach custom development?',
      'What development methodologies do you use?',
      'How do you structure engineering teams?',
      'What does your delivery model look like?',
    ],
  },

  'service::global-capability-centers': {
    greeting: "You're exploring Global Capability Centers. I can help you understand our GCC model, compare setup options, or scope a center launch.",
    prompts: [
      'How does your GCC model work?',
      'What does a GCC setup look like?',
      'Compare GCC vs traditional outsourcing',
      'What industries benefit most from GCCs?',
    ],
  },

  'service::it-security-services': {
    greeting: "You're exploring IT Security. I can help you understand our security assessment process, scope a penetration test, or explore managed security services.",
    prompts: [
      'What security assessments do you offer?',
      'How do you approach penetration testing?',
      'What managed security services are available?',
      'How do you handle compliance?',
    ],
  },

  'service::blockchain': {
    greeting: "You're exploring Blockchain. I can help you assess blockchain fit for your use case, compare consensus mechanisms, or scope a proof-of-concept.",
    prompts: [
      'Is blockchain right for my use case?',
      'What blockchain platforms do you work with?',
      'What does a blockchain PoC look like?',
      'How do you handle smart contract security?',
    ],
  },

  'service::internet-of-things': {
    greeting: "You're exploring IoT. I can help you map IoT use cases, compare connectivity architectures, or scope an industrial IoT deployment.",
    prompts: [
      'Map IoT use cases for my industry',
      'What IoT platforms do you work with?',
      'How do you approach edge computing?',
      'What does an IoT deployment look like?',
    ],
  },
};

/**
 * Look up contextual intelligence for a given seedContext.
 *
 * @param {{ surface: string, slug: string, name: string }} seedContext
 * @returns {{ greeting: string, prompts: string[] } | null}
 */
export function getPageContext(seedContext) {
  if (!seedContext?.surface || !seedContext?.slug) return null;
  const key = `${seedContext.surface}::${seedContext.slug}`;
  return PAGE_CONTEXT_MAP[key] || null;
}

export default PAGE_CONTEXT_MAP;
