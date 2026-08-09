import { NextResponse } from "next/server";
import { prisma, withDB } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await withDB(() => prisma.experience.findMany({ orderBy: { order: "asc" } }));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([]);
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

    const item = await withDB(() => prisma.experience.create({
      data: { company, role, period, location: location || null, description, skillsUsed: skillsUsed || null },
    }));

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
