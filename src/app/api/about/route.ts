import { NextResponse } from "next/server";
import { prisma, withDB } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const about = await withDB(() => prisma.about.findFirst());
    if (about) {
      if (!about.title || about.title === "Software Development Engineer") {
        about.title = "Software Developer & System Designer";
      }
    }
    return NextResponse.json(about || null, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    console.error("GET /api/about error:", error?.message);
    return NextResponse.json(null, { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS });

  try {
    const body = await req.json();
    const { title, bio, tagline, location, email, githubUsername, leetcodeUsername, linkedinUrl, instagramUrl, avatarUrl } = body;

    const dataToSave: any = {
      title: title || "Software Developer & System Designer",
      bio: bio || "",
      tagline: tagline || null,
      location: location || null,
      email: email || null,
      githubUsername: githubUsername ? githubUsername.trim() : null,
      leetcodeUsername: leetcodeUsername ? leetcodeUsername.trim() : null,
      linkedinUrl: linkedinUrl || null,
      instagramUrl: instagramUrl || null,
    };

    if (avatarUrl !== undefined) {
      dataToSave.avatarUrl = avatarUrl || null;
    }

    const item = await withDB(async () => {
      const existing = await prisma.about.findFirst();
      if (existing) {
        try {
          return await prisma.about.update({
            where: { id: existing.id },
            data: dataToSave,
          });
        } catch (err: any) {
          if (err?.message?.includes("avatarUrl") || err?.message?.includes("Unknown argument")) {
            delete dataToSave.avatarUrl;
            return await prisma.about.update({
              where: { id: existing.id },
              data: dataToSave,
            });
          }
          throw err;
        }
      } else {
        try {
          return await prisma.about.create({
            data: dataToSave,
          });
        } catch (err: any) {
          if (err?.message?.includes("avatarUrl") || err?.message?.includes("Unknown argument")) {
            delete dataToSave.avatarUrl;
            return await prisma.about.create({
              data: dataToSave,
            });
          }
          throw err;
        }
      }
    });

    return NextResponse.json(item, { status: 201, headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    console.error("POST /api/about error:", error?.message);
    return NextResponse.json({ error: "Failed to update about details" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

