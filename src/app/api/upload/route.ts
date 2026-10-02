import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import { join } from "path";
import { ERR, isGuarded, ok, requireSession } from "@/lib/api";
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

  const name = `${randomUUID().replace(/-/g, "")}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(join(uploadsDir(), name), bytes);

  return ok({ file_url: `/api/uploads/${name}` });
}
