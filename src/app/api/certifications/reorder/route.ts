import { NextResponse } from "next/server";
import { prisma, withDB } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items array" }, { status: 400 });
    }

    await withDB(async () => {
      await Promise.all(
        items.map((item: { id: string; order: number }) =>
          prisma.certification.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reorder certifications" }, { status: 500 });
  }
}
