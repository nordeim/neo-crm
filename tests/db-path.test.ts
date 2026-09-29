import { describe, expect, it } from "vitest";
import { resolveDatabaseUrl } from "@/lib/db-path";

describe("resolveDatabaseUrl", () => {
  it("passes through non-file URLs untouched", () => {
    expect(resolveDatabaseUrl("postgresql://u:p@localhost:5432/db")).toBe(
      "postgresql://u:p@localhost:5432/db",
    );
  });

  it("passes through absolute file URLs untouched", () => {
    expect(resolveDatabaseUrl("file:/tmp/data.db")).toBe("file:/tmp/data.db");
  });

  it("passes through the in-memory URL untouched", () => {
    expect(resolveDatabaseUrl("file:")).toBe("file:");
  });

  it("resolves a repo-relative URL against the module's repo root", () => {
    const resolved = resolveDatabaseUrl("file:../db/custom.db");
    expect(resolved.startsWith("file:")).toBe(true);
    // The CLI rule anchors at prisma/schema.prisma, so ../db/custom.db lands
    // inside <repo>/db — never inside prisma/ or src/.
    expect(resolved).not.toContain("/prisma/../");
    expect(resolved).toContain("/db/custom.db");
  });

  it("never returns the raw relative URL when the repo root is discoverable", () => {
    const resolved = resolveDatabaseUrl("file:../db/custom.db");
    expect(resolved).not.toBe("file:../db/custom.db");
  });
});
