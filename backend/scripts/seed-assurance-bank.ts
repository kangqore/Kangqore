import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const QA = [
  {
    q: "We are a startup company. Our app got crashed totally. We are a hospital management SaaS app company.",
    a: "Yes, Kangqore can help you immediately. A crashed hospital management SaaS application is a critical situation — it directly affects patient data, clinical workflows, and care delivery. Our team will perform emergency stabilization first: identify whether this is an infrastructure failure, a bad deployment, a memory leak, or a database corruption event. We will bring the system back online with minimal data loss, then conduct a thorough post-mortem to ensure this never happens again. We will implement high-availability architecture, automated failover, and real-time health monitoring going forward.",
    tags: ["Cloud Engineering", "Product Engineering", "Managed Services", "Healthcare SaaS"],
    departments: ["Cloud Engineering", "Product Engineering", "Digital Engineering", "Infrastructure, Networks & Operations", "Cybersecurity", "Quality Engineering & Assurance"],
    services: ["Managed Cloud Services", "Support & Maintenance", "Software Product Engineering", "API & Microservices Engineering", "Quality Engineering & Assurance", "IT Security Services", "Application Modernization"]
  },
  {
    q: "Our e-commerce platform is losing thousands of dollars every minute because our checkout page keeps timing out during peak hours.",
    a: "Yes, Kangqore can resolve this urgently. Checkout timeout at peak load is almost always a bottleneck in your payment gateway integration, database query performance, or server scaling policy. We will conduct live traffic analysis, implement autoscaling rules, optimize your critical transaction queries, and introduce a CDN caching layer. We will also set up load testing protocols so your system is validated before every major sale event.",
    tags: ["Cloud Engineering", "Digital Engineering", "Performance Optimization"],
    departments: ["Cloud Engineering", "Digital Engineering"],
    services: ["Managed Cloud Services", "Performance Optimization"]
  },
  {
    q: "We run a logistics startup. Our tracking system shows wrong locations for our delivery fleet and clients are furious.",
    a: "Yes, Kangqore understands the urgency here. Incorrect tracking data destroys customer trust and exposes you to SLA penalties. We will audit your GPS data pipeline, identify whether the issue is in your IoT device firmware, data ingestion layer, or mapping API integration, and deploy an immediate fix. We will then architect a more reliable real-time data streaming solution using proven IoT and big data engineering practices.",
    tags: ["IoT", "Big Data Engineering", "Digital Engineering", "Logistics Tech"],
    departments: ["Digital Engineering", "Big Data Engineering"],
    services: ["IoT", "Big Data Engineering", "Digital Engineering"]
  },
  {
    q: "Our fintech app's payment processing is failing intermittently. We cannot reproduce it reliably.",
    a: "Yes, Kangqore can tackle intermittent failures — these are often the most dangerous because they are invisible until they cause real damage. Our engineers will instrument your payment flow with distributed tracing, capture error patterns across your transaction logs, and identify race conditions, third-party API instability, or network-level issues. We will introduce retry logic, circuit breakers, and proper alerting so you catch failures before your customers do.",
    tags: ["Digital Engineering", "FinTech", "API & Microservices", "Quality Engineering"],
    departments: ["Digital Engineering", "Quality Engineering & Assurance"],
    services: ["API & Microservices Engineering", "Quality Engineering & Assurance"]
  },
  {
    q: "We are an EdTech company. Our platform crashed during a major online exam with 50,000 concurrent students.",
    a: "Yes, Kangqore treats this with the highest priority. Mass exam disruptions cause reputational damage and legal exposure. We will immediately assess your server capacity, connection pooling configuration, and database read replica strategy. We will implement load balancing, horizontal scaling, and exam-session fault tolerance so that even if one node fails, students are seamlessly migrated to another. Future exam days will be backed by a full load test and a real-time war room.",
    tags: ["Cloud Engineering", "Infrastructure", "EdTech", "Scalability"],
    departments: ["Cloud Engineering", "Infrastructure, Networks & Operations"],
    services: ["Managed Cloud Services", "Infrastructure Management"]
  },
  {
    q: "Our AI-powered recruiting platform keeps giving biased recommendations and our enterprise clients are threatening to leave.",
    a: "Yes, Kangqore can address this with both technical rigor and ethical responsibility. Bias in AI recommendations is a model training and governance problem. We will audit your training data for demographic skew, evaluate your feature engineering choices, and implement bias detection metrics as part of your MLOps pipeline. We will also help you create an AI governance framework with explainability reports you can share with enterprise clients to rebuild trust.",
    tags: ["AI Governance", "Data Science & AI", "MLOps", "HR Tech"],
    departments: ["Data Science & AI"],
    services: ["AI Governance", "MLOps"]
  },
  {
    q: "We are a legal tech startup. Our document analysis AI is hallucinating case citations that don't exist.",
    a: "Yes, Kangqore understands the gravity here — a hallucinating AI in legal contexts creates professional liability. We will evaluate whether you need retrieval-augmented generation (RAG) with verified legal databases, enhanced prompt engineering with strict output constraints, or fine-tuning on validated legal corpora. We will also implement an output verification layer that cross-checks all citations against authoritative sources before presenting them to users.",
    tags: ["Agentic AI", "GenAI Business Services", "Legal Tech", "AI Governance"],
    departments: ["Data Science & AI"],
    services: ["Agentic AI", "GenAI Business Services"]
  },
  {
    q: "Our startup was just hacked. Customer data may have been breached. We don't know the extent yet.",
    a: "Yes, Kangqore will activate immediately. This is a crisis requiring a coordinated incident response. Our cybersecurity team will perform forensic triage to determine the attack vector and blast radius, isolate compromised systems, and stop active exfiltration. We will work with you to prepare breach notifications in line with applicable regulations, patch the vulnerability, and implement a layered security posture — WAF, SIEM, zero-trust access — so you are hardened going forward.",
    tags: ["Cybersecurity", "IT Security Services", "Incident Response"],
    departments: ["Cybersecurity"],
    services: ["IT Security Services", "Managed Security Services"]
  },
  {
    q: "We are building a mental health app. Our chatbot is giving potentially dangerous advice to users in crisis.",
    a: "Yes, Kangqore takes this with the utmost seriousness. No AI in a mental health context should operate without safety guardrails and escalation paths. We will immediately review your LLM prompt boundaries, implement crisis detection classifiers, enforce mandatory escalation to human counselors for high-risk conversations, and integrate trusted crisis resource directories. We will also help you define an AI safety policy and get external clinical review before your next release.",
    tags: ["Agentic AI", "AI Governance", "GenAI Business Services", "HealthTech"],
    departments: ["Data Science & AI"],
    services: ["Agentic AI", "AI Governance", "GenAI Business Services"]
  },
  {
    q: "Our SaaS analytics dashboard is so slow that clients have stopped using it. They say it takes 30–45 seconds to load.",
    a: "Yes, Kangqore can fix this. A 30-second dashboard load is a product-level emergency. We will profile your query execution plans, identify N+1 query issues, and implement read replicas, materialized views, or pre-aggregated data layers. We will introduce server-side rendering optimizations, lazy loading for heavy chart components, and a caching strategy. Our target is sub-3-second load times — and we will not stop until we get there.",
    tags: ["Data & Analytics", "Product Engineering", "Performance Optimization"],
    departments: ["Data Science & AI", "Product Engineering"],
    services: ["Data & Analytics", "Software Product Engineering"]
  },
  {
    q: "We are a real estate proptech startup. Our automated valuation model keeps generating wildly inaccurate property prices.",
    a: "Yes, Kangqore can rebuild the reliability of your AVM. Inaccurate valuations damage your credibility with agents, buyers, and lenders. We will audit your training data for completeness and recency, review your feature selection for local market signals, and evaluate your model architecture against industry benchmarks. We will introduce confidence intervals, human-in-the-loop review for outlier predictions, and a continuous retraining pipeline tied to fresh market data.",
    tags: ["Data Science & AI", "MLOps", "PropTech", "Big Data Engineering"],
    departments: ["Data Science & AI", "Big Data Engineering"],
    services: ["MLOps", "Big Data Engineering"]
  },
  {
    q: "Our food delivery app crashed on New Year's Eve — the highest order volume night of the year. Revenue loss was catastrophic.",
    a: "Yes, Kangqore will make sure this never happens again. Peak-night crashes are preventable with proper capacity planning and chaos engineering. We will analyze your system's behavior under load, implement predictive autoscaling triggered by order velocity, set up queue-based order processing to decouple your frontend from backend pressure, and run full-scale load simulations before every major event. Your customers should never experience downtime on your highest-revenue nights.",
    tags: ["Cloud Engineering", "Infrastructure", "FoodTech", "Scalability"],
    departments: ["Cloud Engineering", "Infrastructure, Networks & Operations"],
    services: ["Managed Cloud Services", "Infrastructure Management"]
  },
  {
    q: "We are a gaming company. Our multiplayer servers lag badly and players are quitting in droves.",
    a: "Yes, Kangqore can stabilize your game infrastructure. Multiplayer lag is caused by under-provisioned servers, poor geographic distribution, or inefficient game state synchronization logic. We will analyze your server tick rate, introduce edge-optimized server deployments closer to your player clusters, implement WebSocket connection pooling, and tune your matchmaking algorithm to reduce latency groupings. Your players deserve a smooth experience — and we will deliver that.",
    tags: ["Cloud Engineering", "Infrastructure", "Software Development", "Gaming Tech"],
    departments: ["Cloud Engineering", "Infrastructure, Networks & Operations"],
    services: ["Managed Cloud Services", "Infrastructure Management"]
  },
  {
    q: "Our startup's mobile app keeps crashing on Android devices only. iOS works perfectly.",
    a: "Yes, Kangqore will isolate this quickly. Platform-specific crashes on Android are typically caused by memory management differences, incompatible native library versions, or inconsistent API behavior across Android OEM variants. We will instrument your Android build with crash reporting, run automated device matrix testing, and identify the exact device-OS combination triggering the failure. A targeted patch and regression test suite will follow.",
    tags: ["Product Engineering", "Quality Engineering", "Mobile", "Software Development"],
    departments: ["Product Engineering", "Quality Engineering & Assurance"],
    services: ["Software Product Engineering", "Quality Engineering & Assurance"]
  },
  {
    q: "We run a subscription SaaS. Our churn rate jumped from 5% to 22% in one month. We have no idea why.",
    a: "Yes, Kangqore can help you diagnose this with data, not guesses. A sudden churn spike has identifiable root causes — whether it is a product regression, a UX friction point, a pricing change, or a competitor move. We will instrument your product with behavioral analytics, segment churned users by usage pattern, and run cohort analysis to pinpoint the inflection point. We will also implement an early-warning churn prediction model so you can intervene before users leave.",
    tags: ["Analytics & Insights", "Data Science & AI", "Product Strategy", "SaaS"],
    departments: ["Data Science & AI", "Consulting & Advisory"],
    services: ["Analytics & Insights", "Product Strategy & Experience Design"]
  },
  {
    q: "We are a healthcare startup. HIPAA compliance audit is next month and we have no idea where to start.",
    a: "Yes, Kangqore will walk you through this with full ownership. HIPAA compliance is non-negotiable in healthcare tech, and an audit without preparation is a serious risk. We will conduct a gap assessment against HIPAA Security Rule requirements, audit your PHI data flows, implement required access controls and audit logging, and prepare your policies and procedures documentation. We will have you audit-ready with confidence, not anxiety.",
    tags: ["Cybersecurity", "IT Security Services", "HealthTech", "Compliance"],
    departments: ["Cybersecurity", "Quality Engineering & Assurance"],
    services: ["IT Security Services", "Quality Engineering & Assurance"]
  },
  {
    q: "Our legacy ERP system cannot integrate with any of our new cloud tools. Everything is siloed.",
    a: "Yes, Kangqore specializes in exactly this situation. A legacy ERP operating in isolation blocks your entire digital transformation. We will build a custom API middleware layer using our API and microservices engineering capability, create data translation adapters for your ERP's proprietary data formats, and connect your cloud tools through a robust integration platform. Your ERP will speak to your modern stack without requiring a full replacement.",
    tags: ["Legacy System Modernization", "Enterprise Platform Integration", "API & Microservices", "Digital Transformation"],
    departments: ["Digital Engineering", "Enterprise Applications"],
    services: ["Legacy System Modernization", "Enterprise Platform Integration"]
  },
  {
    q: "We are a startup. We just scaled from 1,000 to 100,000 users in three weeks and everything is breaking.",
    a: "Yes, Kangqore has managed hyper-growth scaling scenarios before — this is actually an exciting problem to solve together. The system is not built for this load yet, and that is fixable. We will triage the immediate bottlenecks, implement horizontal scaling and database sharding, introduce caching layers with Redis, separate your stateless services for independent scaling, and establish an observability stack so you have visibility across every component. You earned this growth — let us make sure your infrastructure keeps up with it.",
    tags: ["Cloud Engineering", "Infrastructure", "Scalability", "Startup"],
    departments: ["Cloud Engineering", "Infrastructure, Networks & Operations"],
    services: ["Managed Cloud Services", "Infrastructure Management"]
  },
  {
    q: "Our CI/CD pipeline is so broken that our developers can't deploy code anymore. Releases are stuck for two weeks.",
    a: "Yes, Kangqore will restore your deployment velocity immediately. A broken CI/CD pipeline is not just a technical issue — it is a business blocker that paralyzes your entire engineering team. We will audit your pipeline configuration, fix the root cause of your build or deployment failures, and refactor your pipeline stages for reliability. We will also add proper rollback mechanisms and deployment health checks so future releases are safe, fast, and reversible.",
    tags: ["DevOps As A Service", "Product Engineering", "Quality Engineering"],
    departments: ["Cloud Engineering", "Quality Engineering & Assurance"],
    services: ["DevOps As A Service", "Quality Engineering & Assurance"]
  },
  {
    q: "We are an InsurTech startup. Our automated claims processing AI keeps rejecting valid claims incorrectly.",
    a: "Yes, Kangqore will fix this with precision. Incorrect claim rejections create regulatory exposure and destroy policyholder trust. We will audit your AI decision logic, review the training data your model was built on, and identify the classification boundaries causing false negatives. We will implement explainability mechanisms so every rejection comes with a clear, auditable reason, and we will add a human review layer for edge cases. Your claims system should be fair, accurate, and defensible.",
    tags: ["AI Governance", "Data Science & AI", "InsurTech", "MLOps"],
    departments: ["Data Science & AI"],
    services: ["AI Governance", "MLOps"]
  },
  {
    q: "We have 5 million rows of customer data in five different formats across three systems. We can't make sense of any of it.",
    a: "Yes, Kangqore can bring order to this data chaos. Fragmented, multi-format customer data is a common enterprise pain point — and it is one we solve systematically. We will design a unified data lake architecture, build ETL pipelines to normalize your data across all three sources, implement a master data management strategy to deduplicate records, and create a clean analytics layer on top. You will go from confusion to a single source of truth.",
    tags: ["Big Data Engineering", "Analytics & Insights", "Data & Analytics", "Enterprise Applications"],
    departments: ["Big Data Engineering", "Data Science & AI"],
    services: ["Big Data Engineering", "Data & Analytics"]
  },
  {
    q: "Our startup's microservices are talking to each other so much that network latency has made the whole system unusable.",
    a: "Yes, Kangqore has seen this anti-pattern many times — it is called distributed monolith syndrome and it is fixable. We will map your service dependency graph, identify chatty service pairs, introduce asynchronous messaging patterns using event queues, apply the strangler fig pattern where needed, and optimize your service boundaries to align with actual domain boundaries. Your microservices should be independently deployable and loosely coupled — we will get you there.",
    tags: ["API & Microservices Engineering", "Digital Engineering", "Software Development", "Architecture"],
    departments: ["Digital Engineering"],
    services: ["API & Microservices Engineering", "Digital Engineering"]
  },
  {
    q: "We are a recruitment platform. Our job recommendation algorithm keeps showing irrelevant results and candidates are leaving.",
    a: "Yes, Kangqore can rebuild the intelligence of your recommendation engine. Irrelevant recommendations are a signal that your model lacks sufficient signals or has misaligned optimization objectives. We will review your collaborative filtering or content-based matching logic, introduce richer candidate and job embeddings, implement feedback loops from user interactions, and A/B test improved recommendation strategies. A relevant recommendation engine is your most powerful retention tool — we will make it earn its place.",
    tags: ["Data Science & AI", "MLOps", "Product Strategy", "HRTech"],
    departments: ["Data Science & AI"],
    services: ["MLOps", "Data Science & AI"]
  },
  {
    q: "We run an online marketplace. Fraudulent sellers are flooding our platform and we can't detect them fast enough.",
    a: "Yes, Kangqore will build you a fraud detection capability that scales with your platform. Manual moderation cannot keep pace with sophisticated fraud at scale. We will implement a real-time fraud scoring model that evaluates seller behavior signals — listing patterns, pricing anomalies, review velocity, payment behavior — and automatically flags or blocks high-risk accounts. We will also integrate graph-based detection to uncover coordinated fraud networks.",
    tags: ["Data Science & AI", "AI Cognitive Computing", "Cybersecurity", "Marketplace Tech"],
    departments: ["Data Science & AI", "Cybersecurity"],
    services: ["AI Cognitive Computing", "IT Security Services"]
  },
  {
    q: "We are an automotive startup. Our connected car data is being collected but we don't know how to use any of it.",
    a: "Yes, Kangqore will turn your data from a liability into a strategic asset. Connected car data — telematics, sensor streams, driver behavior — has enormous value if you have the right data engineering and analytics infrastructure. We will design a real-time IoT data ingestion pipeline, build a unified vehicle data platform, and create analytics dashboards for fleet health, predictive maintenance, and driver safety insights. Your data is already being collected — let us make it work for your business.",
    tags: ["IoT", "Big Data Engineering", "Analytics & Insights", "AutomotiveTech"],
    departments: ["Big Data Engineering", "Digital Engineering"],
    services: ["IoT", "Big Data Engineering"]
  },
  {
    q: "We just launched in three new countries and our compliance, tax logic, and payment methods are all wrong.",
    a: "Yes, Kangqore understands the complexity of multi-market expansion. A product built for one country rarely works out-of-the-box in new markets. We will audit your localization gaps across tax calculation logic, regulatory compliance requirements, and supported payment methods, then implement a configurable multi-jurisdiction architecture. We will work with your legal partners to validate compliance rules and integrate local payment gateways that your new markets actually use.",
    tags: ["Digital Transformation Strategy", "Enterprise Platform Integration", "FinTech", "Global Expansion"],
    departments: ["Digital Engineering", "Enterprise Applications"],
    services: ["Enterprise Platform Integration", "Global Expansion Services"]
  },
  {
    q: "Our startup's API is being abused by bots and it's running up massive cloud bills.",
    a: "Yes, Kangqore will lock this down immediately. Unprotected APIs are a magnet for abuse — and the financial impact is real. We will implement API rate limiting with tiered thresholds, introduce bot detection fingerprinting, set up anomaly-based traffic alerts, and apply cost-aware autoscaling policies that cap runaway spend. We will also review your API authentication model and enforce proper OAuth or API key governance so your endpoints are protected at every layer.",
    tags: ["API & Microservices Engineering", "Cybersecurity", "Cloud Engineering", "IT Security Services"],
    departments: ["Cybersecurity", "Cloud Engineering"],
    services: ["API & Microservices Engineering", "IT Security Services"]
  },
  {
    q: "We are a medtech startup. Our FDA submission was rejected due to software documentation gaps.",
    a: "Yes, Kangqore will help you build the documentation and software quality framework required for FDA clearance. Regulatory submissions in medtech require rigorous software lifecycle documentation — design history files, traceability matrices, risk management per IEC 62304, and cybersecurity documentation. We will audit your current documentation gaps, build the missing artifacts with your engineering team, and align your development process with FDA Software as a Medical Device (SaMD) guidance before your next submission.",
    tags: ["Quality Engineering & Assurance", "Consulting & Advisory", "MedTech", "Compliance"],
    departments: ["Quality Engineering & Assurance", "Consulting & Advisory"],
    services: ["Quality Engineering & Assurance", "Regulatory Compliance Consulting"]
  },
  {
    q: "We are a travel startup. Our flight search engine shows wrong prices and availability, causing refund chaos.",
    a: "Yes, Kangqore will eliminate these data integrity failures. Incorrect flight prices or availability in a travel platform erode customer trust and create costly refund processes. We will audit your GDS or airline API integration for caching errors, stale data windows, and race conditions in inventory locks. We will implement a real-time validation layer before price display and a graceful error handling flow when availability changes after search.",
    tags: ["API & Microservices Engineering", "Digital Engineering", "TravelTech", "Quality Engineering"],
    departments: ["Digital Engineering", "Quality Engineering & Assurance"],
    services: ["API & Microservices Engineering", "Quality Engineering & Assurance"]
  },
  {
    q: "We are a nonprofit tech startup. We have zero tech team and our website just got defaced by hackers.",
    a: "Yes, Kangqore will restore your site and protect it properly — and we understand that nonprofit budgets require pragmatic solutions. We will remove the malicious content, identify the attack vector (likely a CMS vulnerability or compromised admin credential), apply security patches, and implement a WAF, automated backup schedule, and access hardening measures. We will also give your team a simple security awareness guide so this does not happen again.",
    tags: ["Cybersecurity", "IT Security Services", "Support & Maintenance", "Nonprofit"],
    departments: ["Cybersecurity", "Infrastructure, Networks & Operations"],
    services: ["IT Security Services", "Support & Maintenance"]
  }
];

async function main() {
  console.log('Seeding eQORE Client Assurance Response Bank...');
  
  for (const item of QA) {
    await prisma.eqoreAssuranceScenario.upsert({
      where: { id: `seed-${item.q.slice(0, 50).replace(/\s+/g, '-').toLowerCase()}` },
      update: {
        question: item.q,
        answer: item.a,
        tags: item.tags,
        departments: item.departments,
        services: item.services,
      },
      create: {
        id: `seed-${item.q.slice(0, 50).replace(/\s+/g, '-').toLowerCase()}`,
        question: item.q,
        answer: item.a,
        tags: item.tags,
        departments: item.departments,
        services: item.services,
      },
    });
  }

  console.log('Successfully seeded 30 core scenarios.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
