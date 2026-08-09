import { NextResponse } from "next/server";
import { prisma, withDB } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await withDB(() => prisma.education.findMany({
      orderBy: { order: "asc" },
    }));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { institution, degree, period, location, grade, description } = body;

    if (!institution || !degree || !period) {
      return NextResponse.json({ error: "Institution, degree, and period are required" }, { status: 400 });
    }

    const item = await withDB(() => prisma.education.create({
      data: { institution, degree, period, location: location || null, grade: grade || null, description: description || null },
    }));

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create education entry" }, { status: 500 });
  }
}
