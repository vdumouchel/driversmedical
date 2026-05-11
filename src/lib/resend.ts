import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export function getResendFrom(): string {
  return (
    process.env.RESEND_FROM ??
    process.env.EMAIL_FROM ??
    "Receipts <onboarding@resend.dev>"
  );
}
