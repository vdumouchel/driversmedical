// Human-friendly, customer-service-friendly receipt identifier.
// Format: DM-YYYYMMDD-XXXXXX
//   - "DM" is the brand short-code (DriversMedical).
//   - YYYYMMDD lets support staff visually scan the date a receipt was issued.
//   - The 6-char alphanumeric tail is uppercase base-32 (no I/L/O/0/1 to keep
//     it unambiguous when read aloud), giving 32^6 ≈ 1.07B combinations per
//     day — collision probability is effectively nil for our volume, and we
//     additionally enforce uniqueness at the DB level via a UNIQUE index.
//
// The number is generated at transaction-creation time so it stays stable
// from the moment payment kicks off, regardless of webhook timing.

import { randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // 31 chars, unambiguous

function randomTail(length = 6): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function generateReceiptNumber(now: Date = new Date()): string {
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return `DM-${yyyy}${mm}${dd}-${randomTail(6)}`;
}
