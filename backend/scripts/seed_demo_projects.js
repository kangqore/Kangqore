const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Demo Projects Seed...');

  // 1. Find a Client User
  const client = await prisma.user.findFirst({
    where: { role: 'CLIENT' }
  });

  if (!client) {
    console.error('❌ No user with role CLIENT found. Please register a client user first.');
    process.exit(1);
  }

  console.log(`✅ Found Client: ${client.name} (${client.email})`);

  // 2. Define Demo Projects
  const demoProjects = [
    {
      title: 'Global Supply Chain Modernization',
      description: 'End-to-end digital transformation of the legacy supply chain management system. Includes migration to microservices architecture, real-time tracking dashboard, and AI-driven demand forecasting modules.',
      type: 'Enterprise Tech',
      status: 'ACTIVE',
      progress: 65,
      risk_level: 'low',
      delivery_owner: 'Sarah Jenning',
      client_spoc: 'Michael Chen',
      escalation_contact: 'Vikram Singh (VP)',
      deliverables: [
        { title: 'Supply Chain Architecture Blueprint', status: 'Approved', description: 'High-level system design and microservices breakdown.' },
        { title: 'Real-time Tracking MVP', status: 'In Review', description: 'Beta release of the tracking dashboard.' }
      ],
      tasks: [
        { title: 'Setup Kubernetes Cluster', status: 'completed', priority: 'high' },
        { title: 'Migrate Legacy Database', status: 'in_progress', priority: 'critical' },
        { title: 'API Gateway Configuration', status: 'todo', priority: 'medium' }
      ]
    },
    {
      title: 'AI Customer Support Agent',
      description: 'Development and deployment of a GenAI-powered support bot to handle Tier-1 customer queries. Features include sentiment analysis, automated ticket routing, and multi-language support.',
      type: 'AI / ML',
      status: 'ACTIVE',
      progress: 30,
      risk_level: 'medium',
      delivery_owner: 'Priya Mehta',
      client_spoc: 'Lisa Wong',
      escalation_contact: 'Vikram Singh (VP)',
      deliverables: [
        { title: 'Model Training Dataset', status: 'Pending', description: 'Curated dataset for fine-tuning the LLM.' }
      ],
      tasks: [
        { title: 'Select LLM Provider', status: 'completed', priority: 'high' },
        { title: 'Design Conversation Flow', status: 'in_progress', priority: 'medium' }
      ]
    },
    {
      title: 'Financial Data Lake Migration',
      description: 'Secure migration of 5TB+ of historical financial data to a compliant cloud data lake. Ensures SOC2 compliance and implements granular role-based access control.',
      type: 'Cloud Data',
      status: 'COMPLETED',
      progress: 100,
      risk_level: 'low',
      delivery_owner: 'Amit Patel',
      client_spoc: 'James Wilson',
      escalation_contact: 'N/A',
      deliverables: [
        { title: 'Final Migration Report', status: 'Approved', description: 'Verification of data integrity and compliance.' }
      ],
      tasks: [
        { title: 'Data Validation', status: 'completed', priority: 'high' },
        { title: 'Decommission Legacy Server', status: 'completed', priority: 'low' }
      ]
    }
  ];

  // 3. Insert Projects
  for (const p of demoProjects) {
    // Check if exists to avoid duplicates
    const exists = await prisma.project.findFirst({
        where: { title: p.title, clientId: client.id }
    });

    if (exists) {
        console.log(`⚠️ Project "${p.title}" already exists. Skipping.`);
        continue;
    }

    // Create Project
    const createdProject = await prisma.project.create({
        data: {
            title: p.title,
            description: p.description,
            status: p.status === 'COMPLETED' ? 'COMPLETED' : 'ACTIVE',
            clientId: client.id,
            // Note: Our schema might not have these specific fields (risk_level, owners) yet. 
            // We will store them in description or we might need to extend schema later. 
            // For now, we stick to standard schema fields to avoid errors.
            // We will append details to description if needed or just count on standard fields.
            // Wait, looking at schema provided earlier: no risk_level or custom fields in Project model.
            // We'll rely on Title/Desc. 
        }
    });

    console.log(`✨ Created Project: ${createdProject.title}`);

    // Create Deliverables
    if (p.deliverables) {
        for (const d of p.deliverables) {
            await prisma.deliverable.create({
                data: {
                    title: d.title,
                    description: d.description,
                    status: d.status.toLowerCase(), // Schema expects string default 'pending'
                    projectId: createdProject.id,
                    clientId: client.id
                }
            });
        }
    }

    // Create Tasks
    if (p.tasks) {
        for (const t of p.tasks) {
            await prisma.task.create({
                data: {
                    title: t.title,
                    status: t.status,
                    projectId: createdProject.id,
                    clientId: client.id
                }
            });
        }
    }
  }

  console.log('🚀 Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
