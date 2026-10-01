import { randomInt } from "node:crypto";

import { hashPassword, verifyPassword } from "@/lib/auth";

/**
 * The server side of the email-verification machinery — session 21
 * (S21-P5). SERVER-ONLY: node:crypto plus the auth layer (which pulls
 * next/headers and Prisma). The client-safe constants and message
 * builders live in `src/lib/verification.ts`.
 */

/**
 * Mints a fresh 6-digit code (uniformly random, leading zeros allowed —
 * the reference's inputs are digit strings, not numbers).
 */
export function generateVerificationCode(): string {
  let code = "";
  for (let i = 0; i < 6; i += 1) code += String(randomInt(10));
  return code;
}

/** Hashes a code for storage (the scrypt format the auth layer already uses). */
export function hashVerificationCode(code: string): string {
  return hashPassword(code);
}

/**
 * Constant-time-ish code check routed through the auth layer's scrypt
 * verify (salted + timing-safe digest comparison under the hood).
 */
export function verifyVerificationCode(code: string, storedHash: string): boolean {
  return verifyPassword(code, storedHash);
}
