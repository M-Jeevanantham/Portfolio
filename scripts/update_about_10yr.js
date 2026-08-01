const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updatedBio = `I’m Jeevanantham M — a Senior Principal Software Architect & Lead Systems Engineer with 10+ years of enterprise experience designing scalable microservices, high-concurrency cloud systems, and mission-critical full-stack architectures.

🏛️ Technical Leadership & Architecture: Specializing in distributed systems, event-driven architectures, domain-driven design (DDD), zero-downtime database migrations, and cloud-native infrastructure across Next.js, Node.js/Express, TypeScript, PostgreSQL, Redis, Docker, and Flutter.

• Enterprise Scale & Impact: Spearheaded 50+ production-grade microservices and design systems serving millions of requests with 99.99% availability. Led cross-functional engineering teams through complex enterprise deployments, API gateways, and automated CI/CD pipelines.
• System Innovations: Engineered distributed transaction processors (JWT, Payment Webhooks, OAuth2), real-time geospatial tracking engines (GPS geofencing & offline-first sync), and multi-tenant enterprise ERP platforms (14+ modular micro-architectures).
• Core Philosophy: Building self-healing, fault-tolerant infrastructure with clean modular abstractions, rigorous performance profiling, and engineering excellence that stands the test of time.`;

  await prisma.about.deleteMany();
  const created = await prisma.about.create({
    data: {
      title: "Senior Principal Software Architect & Lead SDE",
      bio: updatedBio,
      location: "Tamil Nadu, India",
      email: "imjeeva08@gmail.com",
      githubUsername: "imjeeva08",
      leetcodeUsername: "imjeeva08",
      avatarUrl: "/profile Image.jpeg",
    },
  });

  console.log("SUCCESS: Updated 10-year experience bio in database!", created.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
