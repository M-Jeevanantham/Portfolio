import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, techStack, liveUrl, githubUrl, imageUrl, featured } = body;

    if (!title || !description || !techStack) {
      return NextResponse.json({ error: "Title, description, and tech stack are required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack,
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        imageUrl: imageUrl || null,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
