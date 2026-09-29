import { db } from "@/lib/db";
import { ok, ERR, asString, asDate, isGuarded, requireSession } from "@/lib/api";
import { ACTIVITY_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  const existing = await db.activity.findUnique({ where: { id } });
  if (!existing) return ERR.NOT_FOUND("Activity");

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return ERR.BAD_REQUEST("Invalid request body");

  const data: Record<string, unknown> = {};
  if ("subject" in body) {
    const subject = asString(body.subject, { max: 200 });
    if (!subject) return ERR.BAD_REQUEST("Activity details are required");
    data.subject = subject;
  }
  if ("notes" in body) data.notes = asString(body.notes, { optional: true, max: 2000 }) ?? null;
  if ("dueAt" in body) data.dueAt = asDate(body.dueAt) ?? null;
  if ("priority" in body) {
    const priority = asString(body.priority) ?? "normal";
    if (!["high", "normal", "low"].includes(priority)) return ERR.BAD_REQUEST("Invalid priority");
    data.priority = priority;
  }
  if ("type" in body) {
    const type = asString(body.type) ?? "call";
    if (!(ACTIVITY_TYPES as readonly string[]).includes(type)) return ERR.BAD_REQUEST("Invalid activity type");
    data.type = type;
  }
  if ("status" in body) {
    const status = asString(body.status) ?? "scheduled";
    if (!["scheduled", "completed"].includes(status)) return ERR.BAD_REQUEST("Invalid status");
    data.status = status;
    data.completedAt = status === "completed" ? new Date() : null;
  }

  const activity = await db.activity.update({
    where: { id },
    data,
    include: {
      account: { select: { id: true, name: true } },
      contact: { select: { id: true, name: true } },
      owner: { select: { id: true, name: true, avatarColor: true } },
    },
  });
  return ok(activity);
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireSession();
  if (isGuarded(guard)) return guard.response;
  const { id } = await params;

  const existing = await db.activity.findUnique({ where: { id } });
  if (!existing) return ERR.NOT_FOUND("Activity");

  await db.activity.delete({ where: { id } });
  return ok({ deleted: id });
}
