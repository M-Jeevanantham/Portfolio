import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const data = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { company, role, period, location, description, skillsUsed } = body;

    if (!company || !role || !period || !description) {
      return NextResponse.json({ error: "Company, role, period, and description are required" }, { status: 400 });
    }

    const item = await prisma.experience.create({
      data: { company, role, period, location: location || null, description, skillsUsed: skillsUsed || null },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
