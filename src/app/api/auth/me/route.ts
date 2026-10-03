import { ok, ERR } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  // Session-41 (S41-P4): the only route that reads the session directly
  // (it is NOT requireSession-gated by design — a logged-out caller gets
  // data:null, not a 401). A DB failure here now answers the envelope
  // instead of a raw non-JSON 500.
  try {
    const user = await getSessionUser();
    return ok(user); // data: user | null
  } catch {
    return ERR.INTERNAL();
  }
}
