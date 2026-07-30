import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const data = await prisma.achievement.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, platform, stats, linkUrl, badgeUrl } = body;

    if (!title || !platform || !stats) {
      return NextResponse.json({ error: "Title, platform, and stats are required" }, { status: 400 });
    }

    const item = await prisma.achievement.create({
      data: { title, platform, stats, linkUrl: linkUrl || null, badgeUrl: badgeUrl || null },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}
