import { NextResponse } from "next/server";
import { prisma, withDB } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, issuer, issueDate, credentialId, credentialUrl, imageUrl } = body;
    const updated = await withDB(() =>
      prisma.certification.update({
        where: { id },
        data: { title, issuer, issueDate, credentialId: credentialId || null, credentialUrl: credentialUrl || null, imageUrl: imageUrl || null },
      })
    );
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await withDB(() => prisma.certification.delete({ where: { id } }));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
