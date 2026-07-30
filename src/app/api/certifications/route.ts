import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const data = await prisma.certification.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, issuer, issueDate, credentialId, credentialUrl, imageUrl } = body;

    if (!title || !issuer || !issueDate) {
      return NextResponse.json({ error: "Title, issuer, and issueDate are required" }, { status: 400 });
    }

    const item = await prisma.certification.create({
      data: { title, issuer, issueDate, credentialId: credentialId || null, credentialUrl: credentialUrl || null, imageUrl: imageUrl || null },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}
