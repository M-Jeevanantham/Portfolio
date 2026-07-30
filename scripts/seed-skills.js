const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const skillsData = [
  // Languages
  { name: 'Java', category: 'Languages' },
  { name: 'JavaScript', category: 'Languages' },
  { name: 'TypeScript', category: 'Languages' },
  { name: 'Python', category: 'Languages' },
  { name: 'C', category: 'Languages' },
  { name: 'SQL', category: 'Languages' },
  { name: 'Dart', category: 'Languages' },
  { name: 'Kotlin', category: 'Languages' },

  // Frontend
  { name: 'React.js', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Redux', category: 'Frontend' },
  { name: 'HTML5', category: 'Frontend' },
  { name: 'CSS3', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Responsive Web Design', category: 'Frontend' },

  // Backend
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'REST API Design', category: 'Backend' },
  { name: 'MVC Architecture', category: 'Backend' },
  { name: 'JWT Authentication', category: 'Backend' },
  { name: 'Microservices (basics)', category: 'Backend' },

  // Databases
  { name: 'MongoDB', category: 'Databases' },
  { name: 'MySQL', category: 'Databases' },
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'Firebase Firestore', category: 'Databases' },
  { name: 'Schema Design', category: 'Databases' },
  { name: 'Query Optimization', category: 'Databases' },

  // Mobile
  { name: 'Flutter', category: 'Mobile' },
  { name: 'Dart', category: 'Mobile' },
  { name: 'Firebase (Firestore, Realtime DB)', category: 'Mobile' },
  { name: 'Supabase', category: 'Mobile' },
  { name: 'Clean Architecture / DDD', category: 'Mobile' },

  // Core CS Fundamentals
  { name: 'Data Structures & Algorithms', category: 'Core CS Fundamentals' },
  { name: 'Object-Oriented Programming', category: 'Core CS Fundamentals' },
  { name: 'DBMS', category: 'Core CS Fundamentals' },
  { name: 'Operating Systems', category: 'Core CS Fundamentals' },
  { name: 'Computer Networks', category: 'Core CS Fundamentals' },
  { name: 'System Design', category: 'Core CS Fundamentals' },

  // Tools & Platforms
  { name: 'Git & GitHub', category: 'Tools & Platforms' },
  { name: 'Docker', category: 'Tools & Platforms' },
  { name: 'Linux', category: 'Tools & Platforms' },
  { name: 'Postman', category: 'Tools & Platforms' },
  { name: 'Vercel', category: 'Tools & Platforms' },
  { name: 'CI/CD', category: 'Tools & Platforms' },
  { name: 'Agile/Scrum', category: 'Tools & Platforms' },
];

async function main() {
  console.log('Seeding skills into database...');
  for (const skill of skillsData) {
    const existing = await prisma.skill.findFirst({
      where: { name: skill.name, category: skill.category }
    });
    if (!existing) {
      await prisma.skill.create({
        data: {
          name: skill.name,
          category: skill.category,
          proficiency: 90,
        }
      });
      console.log(`Added skill: ${skill.name} (${skill.category})`);
    } else {
      console.log(`Skill already exists: ${skill.name}`);
    }
  }
  console.log('Skills seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
