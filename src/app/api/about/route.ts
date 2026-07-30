import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const about = await prisma.about.findFirst();
    return NextResponse.json(about || null);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch about details" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, bio, tagline, location, email, githubUsername, leetcodeUsername, linkedinUrl, instagramUrl } = body;

    await prisma.about.deleteMany();

    const item = await prisma.about.create({
      data: {
        title: title || "Software Development Engineer",
        bio: bio || "",
        tagline: tagline || null,
        location: location || null,
        email: email || null,
        githubUsername: githubUsername || null,
        leetcodeUsername: leetcodeUsername || null,
        linkedinUrl: linkedinUrl || null,
        instagramUrl: instagramUrl || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update about details" }, { status: 500 });
  }
}
