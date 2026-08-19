import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- M0: Inventory ---');
  const departments = await prisma.department.findMany();
  const users = await prisma.user.findMany();
  
  console.log(`Found ${departments.length} departments and ${users.length} users.`);

  let defaultOrg = await prisma.organization.findFirst();
  if (!defaultOrg) {
    console.log('No organization found. Creating default "Kangqore" organization...');
    defaultOrg = await prisma.organization.create({
      data: {
        name: 'Kangqore',
        slug: 'kangqore'
      }
    });
  }

  console.log('--- M1/M2: Normalize Departments ---');
  // Process existing departments
  for (const dept of departments) {
    let newSlug = dept.slug;
    if (newSlug.startsWith('cuid')) {
      newSlug = dept.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    // Ensure slug is unique, append if necessary
    let uniqueSlug = newSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.department.findFirst({
        where: { slug: uniqueSlug, id: { not: dept.id } }
      });
      if (!existing) break;
      uniqueSlug = `${newSlug}-${counter}`;
      counter++;
    }

    await prisma.department.update({
      where: { id: dept.id },
      data: {
        slug: uniqueSlug,
        organizationId: defaultOrg.id,
      }
    });
    console.log(`Normalized department: ${dept.name} -> ${uniqueSlug}`);
  }

  console.log('--- M3: Backfill Users ---');
  const allDepts = await prisma.department.findMany();
  
  for (const user of users) {
    // If the user has a departmentSlug but no deptId
    if (user.departmentSlug && !user.deptId) {
      let dept = allDepts.find(d => d.slug === user.departmentSlug);
      
      // If the department doesn't exist, create it
      if (!dept) {
        console.log(`Creating missing department for slug: ${user.departmentSlug}`);
        dept = await prisma.department.create({
          data: {
            name: user.departmentSlug.charAt(0).toUpperCase() + user.departmentSlug.slice(1),
            slug: user.departmentSlug,
            code: user.departmentSlug.toUpperCase().substring(0, 4),
            head: 'TBD',
            headTitle: 'TBD',
            costCenter: 'TBD',
            description: `Auto-generated for slug ${user.departmentSlug}`,
            organizationId: defaultOrg.id
          }
        });
        allDepts.push(dept);
      }
      
      console.log(`Linking user ${user.email} to department ${dept.slug}`);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          deptId: dept.id,
          organizationId: defaultOrg.id
        }
      });
    } else if (!user.organizationId) {
      // Just ensure they belong to the default org
      await prisma.user.update({
        where: { id: user.id },
        data: {
          organizationId: defaultOrg.id
        }
      });
    }
  }

  console.log('--- M4: Validate Constraints ---');
  const updatedUsers = await prisma.user.findMany({
    where: { deptId: { not: null } },
    include: { department: true }
  });

  for (const user of updatedUsers) {
    if (user.department && user.organizationId !== user.department.organizationId) {
      console.error(`VALIDATION FAILED: User ${user.email} is in org ${user.organizationId} but department is in org ${user.department.organizationId}`);
    }
  }
  
  console.log('Migration completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
