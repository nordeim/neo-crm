import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { fail } from "@/lib/api";
import { CONTENT_TYPES, UPLOAD_NAME_RE, uploadsDir } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = { params: Promise<{ name: string }> };

/**
 * Session-30 (S30-P1, restored session-35): the public GET half of the
 * self-hosted UploadFile mirror. The reference's file_urls are public CDN
 * links — no session guard here.
 *
 * The stored-name charset is PINNED (`UPLOAD_NAME_RE`: 32 hex chars + a
 * whitelisted image extension) — a name that does not match is a 404 and is
 * never turned into a filesystem lookup, so there is no traversal surface.
 * Names are content-random and never rewritten, so the bytes are served
 * with immutable caching.
 */
export async function GET(_req: Request, { params }: Params) {
  const { name } = await params;
  if (!UPLOAD_NAME_RE.test(name)) {
    return fail("NOT_FOUND", "File not found", 404);
  }

  const ext = name.slice(name.lastIndexOf(".") + 1);
  let bytes: Buffer;
  try {
    bytes = await readFile(join(uploadsDir(), name));
  } catch {
    return fail("NOT_FOUND", "File not found", 404);
  }

  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
