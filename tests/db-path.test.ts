import { mkdtempSync, rmSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import {
  effectiveDatabaseUrl,
  parseEnvFile,
  resolveDatabaseUrl,
  runtimeDatabaseUrl,
  urlForRoot,
} from "@/lib/db-path";

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length) rmSync(tempDirs.pop()!, { recursive: true, force: true });
});

describe("urlForRoot", () => {
  it("creates the database parent directory when it does not exist yet (first boot)", () => {
    const root = mkdtempSync(join(tmpdir(), "neo-crm-dbpath-"));
    tempDirs.push(root);
    // Simulate a repo root WITHOUT a db/ folder: only the schema anchor exists.
    const dbFile = join(root, "prisma", "..", "db", "custom.db");

    const url = urlForRoot(root, "../db/custom.db");

    expect(url).toBe(`file:${dbFile}`);
    // The whole point of the first-boot fix: the folder is created so the
    // Prisma engine never falls back to a CWD-relative path.
    expect(existsSync(join(root, "db"))).toBe(true);
  });

  it("is idempotent when the database directory already exists", () => {
    const root = mkdtempSync(join(tmpdir(), "neo-crm-dbpath-"));
    tempDirs.push(root);

    const first = urlForRoot(root, "../db/custom.db");
    const second = urlForRoot(root, "../db/custom.db");

    expect(second).toBe(first);
  });
});

describe("parseEnvFile", () => {
  it("reads a double-quoted DATABASE_URL without the quotes", () => {
    expect(parseEnvFile('# c\n\nDATABASE_URL="file:../db/custom.db"')).toEqual({
      DATABASE_URL: "file:../db/custom.db",
    });
  });

  it("ignores comments, blanks and the export prefix", () => {
    expect(parseEnvFile("# DATABASE_URL=nope\n\n  export DATABASE_URL=file:./ok.db  ")).toEqual({
      DATABASE_URL: "file:./ok.db",
    });
  });

  it("keeps values containing equals signs intact", () => {
    expect(parseEnvFile("AUTH_SECRET=abc=def==")).toEqual({ AUTH_SECRET: "abc=def==" });
  });
});

describe("effectiveDatabaseUrl (bun absolutization re-anchoring)", () => {
  it("re-anchors a URL that Bun absolutized against the .env location", () => {
    // bun run exports DATABASE_URL=file:/parent-of-repo/db/custom.db when
    // /repo/.env carries file:../db/custom.db — one directory OUTSIDE the
    // repo. The seam must recognize the signature and fall back to the
    // schema rule (resolveDatabaseUrl) instead of passing it through.
    const bunAbsolutized = "file:/db/custom.db"; // resolve("/", "../db/custom.db")
    const url = effectiveDatabaseUrl({
      envUrl: bunAbsolutized,
      envFileUrl: "file:../db/custom.db",
      envFileDir: "/",
    });
    expect(url).not.toBe(bunAbsolutized);
    expect(url).toContain("/db/custom.db");
  });

  it("keeps a caller-provided URL that differs from the bun signature", () => {
    // e.g. the Playwright webServer env: file:../db/e2e.db must win over
    // the repo .env's custom.db contract.
    const url = effectiveDatabaseUrl({
      envUrl: "file:../db/e2e.db",
      envFileUrl: "file:../db/custom.db",
      envFileDir: "/repo",
    });
    expect(url).toContain("e2e.db");
  });

  it("passes postgres URLs through untouched", () => {
    const url = effectiveDatabaseUrl({
      envUrl: "postgresql://u:p@localhost:5432/neo_crm",
      envFileUrl: "file:../db/custom.db",
      envFileDir: "/repo",
    });
    expect(url).toBe("postgresql://u:p@localhost:5432/neo_crm");
  });

  it("falls back to the .env value when the process env is unset", () => {
    const url = effectiveDatabaseUrl({
      envUrl: undefined,
      envFileUrl: "file:../db/custom.db",
      envFileDir: "/repo",
    });
    expect(url).toContain("/db/custom.db");
  });
});

describe("runtimeDatabaseUrl (cwd .env discovery)", () => {
  it("re-anchors a bun-absolutized env var using the cwd .env file", () => {
    const dir = mkdtempSync(join(tmpdir(), "neo-crm-runtime-"));
    tempDirs.push(dir);
    writeFileSync(join(dir, ".env"), 'DATABASE_URL="file:../db/custom.db"\n');

    const prev = process.env.DATABASE_URL;
    // Exactly what bun run exports for that .env line:
    process.env.DATABASE_URL = `file:${join(dir, "..", "db", "custom.db")}`;
    try {
      const url = runtimeDatabaseUrl(dir);
      // Re-anchored on the schema rule — NOT the bun-absolutized parent
      // path that sat in the process env.
      expect(url).not.toBe(process.env.DATABASE_URL);
      expect(url).toContain("/db/custom.db");
    } finally {
      if (prev === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = prev;
    }
  });

  it("uses the process env URL when no .env exists at the cwd", () => {
    const dir = mkdtempSync(join(tmpdir(), "neo-crm-runtime-"));
    tempDirs.push(dir);
    mkdirSync(join(dir, "db"), { recursive: true });

    const prev = process.env.DATABASE_URL;
    process.env.DATABASE_URL = `file:${join(dir, "db", "x.db")}`;
    try {
      expect(runtimeDatabaseUrl(dir)).toBe(process.env.DATABASE_URL);
    } finally {
      if (prev === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = prev;
    }
  });
});

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
