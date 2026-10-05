import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import { join } from "path";
import { ERR, isGuarded, ok, requireSession } from "@/lib/api";
import { clientKey, rateLimit, sweepRateLimits } from "@/lib/rate-limit";
import { EXT_BY_MIME, MAX_UPLOAD_BYTES, uploadsDir } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Session-30 (S30-P1): our self-hosted mirror of the reference's base44
 * `rt.integrations.Core.UploadFile({file})` → `{file_url}` contract.
 *
 * The reference validates the image type CLIENT-side in its contact
 * dialog (`type.startsWith("image/")` else the native alert "Please
 * upload an image file (JPG or PNG)") and its own profile hint
 * advertises "Max 5MB" — both are enforced here server-side so the
 * stored set is always images within the advertised ceiling.
 */
export async function POST(request: Request) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;

  // Session-67 (N-67e): the one route that writes user bytes to disk
  // joins the rate-limit family — 20 uploads / 15 min / IP, the verify
  // route's budget. DELIBERATELY after the session guard (the auth
  // family limits first because it is public; here the unauth 401 is
  // already cheap — a cookie parse, no DB read without a valid
  // signature — and bucketing pre-auth would let an attacker exhaust a
  // legitimate IP's upload budget without ever holding a session).
  const limit = rateLimit(`upload:${clientKey(request)}`, 20, 15 * 60 * 1000);
  sweepRateLimits();
  if (!limit.allowed) return ERR.RATE_LIMITED(limit.retryAfterSec);

  // Session-36 (S36-P3): pre-gate on the declared Content-Length BEFORE
  // formData() buffers the body — a multi-GB body must be rejected without
  // ever being read into memory. The 64KB allowance covers multipart
  // overhead (boundaries + part headers). Documented limitation: a chunked
  // upload without Content-Length bypasses this gate; the post-parse
  // ceiling below remains the backstop.
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_UPLOAD_BYTES + 64 * 1024) {
    return ERR.BAD_REQUEST("File too large (max 5MB)");
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return ERR.BAD_REQUEST("No file provided");
  }

  // The reference's own check (the AAe onChange), server-enforced.
  if (!file.type.startsWith("image/")) {
    return ERR.BAD_REQUEST("Please upload an image file (JPG or PNG)");
  }
  const ext = EXT_BY_MIME[file.type];
  if (!ext) return ERR.BAD_REQUEST("Unsupported image type");

  // The 5MB ceiling the reference's profile hint advertises.
  if (file.size > MAX_UPLOAD_BYTES) {
    return ERR.BAD_REQUEST("File too large (max 5MB)");
  }

  // Session-38 (S38-P5): the write path joins the envelope — an
  // ENOSPC/EACCES on the uploadsDir() mkdir or the writeFile answers
  // ERR.INTERNAL inside { ok, error } instead of a raw non-JSON 500
  // mid-upload (the I/O face of the DB-envelope family).
  try {
    const name = `${randomUUID().replace(/-/g, "")}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadsDir(), name), bytes);

    return ok({ file_url: `/api/uploads/${name}` });
  } catch {
    return ERR.INTERNAL();
  }
}
