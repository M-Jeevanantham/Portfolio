import { NextResponse } from "next/server";
import { prisma, withDB } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resume = await withDB(() => prisma.resume.findFirst({
      orderBy: { updatedAt: "desc" },
    }));
    return NextResponse.json(resume || null);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, fileUrl, fileName } = body;

    if (!fileUrl || !fileName) {
      return NextResponse.json({ error: "File URL and File Name are required" }, { status: 400 });
    }

    const resume = await withDB(async () => {
      // Delete existing resumes to maintain 1 active resume
      await prisma.resume.deleteMany();
      return prisma.resume.create({
        data: {
          title: title || "SDE Resume",
          fileUrl,
          fileName,
        },
      });
    });

    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 });
  }
}
