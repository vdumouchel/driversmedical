import type { ReceiptModel } from "./receipt-model";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Render an email-safe HTML receipt.
 *
 * Uses tables + inline styles for maximum client compatibility
 * (Gmail, Outlook, Apple Mail, Yahoo).
 */
export function renderReceiptEmailHtml(m: ReceiptModel): string {
  const gray = "#6b7280";
  const dark = "#111827";
  const border = "#e5e7eb";
  const bg = "#f9fafb";

  const taxRows = m.taxLines
    .map(
      (t) => `
        <tr>
          <td style="padding:2px 0;text-align:right;color:${gray};font-size:13px;">${esc(t.label)}</td>
          <td style="padding:2px 0;text-align:right;color:${dark};font-size:13px;">${esc(t.amountFormatted)}</td>
        </tr>`,
    )
    .join("");

  const fromRows = m.fromLines
    .map(
      (line, i) =>
        `<p style="margin:${i === 0 ? "8px" : "0"} 0 0 0;font-size:13px;${i === 0 ? `font-weight:600;color:${dark}` : `color:${gray}`}">${esc(line)}</p>`,
    )
    .join("");

  const billToContact = [
    m.billToEmail ? `<p style="margin:0;font-size:13px;color:${gray}">${esc(m.billToEmail)}</p>` : "",
    m.billToPhone ? `<p style="margin:0;font-size:13px;color:${gray}">${esc(m.billToPhone)}</p>` : "",
  ]
    .filter(Boolean)
    .join("");

  const nextStepsHtml = m.nextSteps
    ? `
      <tr>
        <td style="padding:24px 32px 0;">
          <table width="100%" cellpadding="12" cellspacing="0" style="border:1px solid ${border};border-radius:8px;">
            <tr>
              <td>
                <p style="margin:0 0 6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${gray}">${esc(m.labels.whatHappensNext)}</p>
                <p style="margin:0;font-size:13px;color:${dark};line-height:1.6">${esc(m.nextSteps)}</p>
                <hr style="border:none;border-top:1px solid ${border};margin:12px 0" />
                <p style="margin:0 0 6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${gray}">${esc(m.supportIntro)}</p>
                <p style="margin:0;font-size:13px;color:${dark};line-height:1.6">${esc(m.supportBody)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : "";

  const subjectNote = m.isFr
    ? "Vous pourriez aussi recevoir une confirmation de paiement de notre processeur de paiement."
    : "You may also receive a payment confirmation from our payment processor.";

  return `<!DOCTYPE html>
<html lang="${m.lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(m.labels.title)} ${esc(m.receiptNumber)}</title>
</head>
<body style="margin:0;padding:0;background:${bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${bg}">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border:1px solid ${border};border-radius:12px;max-width:600px;width:100%">

          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:top">
                    <p style="margin:0;font-size:22px;font-weight:700;color:${dark}">${esc(m.siteName)}</p>
                  </td>
                  <td style="vertical-align:top;text-align:right">
                    <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${gray}">${esc(m.labels.title)}</p>
                    <p style="margin:4px 0 0;font-family:monospace;font-size:13px;font-weight:600;color:${dark}">${esc(m.receiptNumber)}</p>
                    <p style="margin:12px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:${gray}">${esc(m.labels.date)}</p>
                    <p style="margin:4px 0 0;font-size:13px;color:${dark}">${esc(m.dateFormatted)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- From / Bill-to -->
          <tr>
            <td style="padding:0 32px 24px;">
              <hr style="border:none;border-top:1px solid ${border};margin:0 0 16px" />
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="vertical-align:top">
                    <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${gray}">${esc(m.labels.from)}</p>
                    ${fromRows}
                    <p style="margin:8px 0 0;font-size:13px;color:${gray}">${esc(m.siteEmail)}</p>
                  </td>
                  <td width="50%" style="vertical-align:top">
                    <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${gray}">${esc(m.labels.billTo)}</p>
                    <p style="margin:8px 0 0;font-size:13px;font-weight:600;color:${dark}">${esc(m.billToName)}</p>
                    ${m.billToStreet ? `<p style="margin:0;font-size:13px;color:${gray}">${esc(m.billToStreet)}</p>` : ""}
                    ${m.billToCityLine ? `<p style="margin:0;font-size:13px;color:${gray}">${esc(m.billToCityLine)}</p>` : ""}
                    ${billToContact ? `<div style="margin-top:8px">${billToContact}</div>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Line items -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px">
                <tr style="border-bottom:1px solid ${border}">
                  <th style="padding:0 0 8px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${gray};border-bottom:1px solid ${border}">${esc(m.labels.description)}</th>
                  <th style="padding:0 0 8px;text-align:right;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${gray};border-bottom:1px solid ${border}">${esc(m.labels.amount)}</th>
                </tr>
                <tr>
                  <td style="padding:12px 0;color:${dark};border-bottom:1px solid ${border}">${esc(m.description)}</td>
                  <td style="padding:12px 0;text-align:right;color:${dark};border-bottom:1px solid ${border}">${esc(m.subtotalFormatted)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0 2px;text-align:right;color:${gray};font-size:13px">${esc(m.labels.subtotal)}</td>
                  <td style="padding:12px 0 2px;text-align:right;color:${dark};font-size:13px">${esc(m.subtotalFormatted)}</td>
                </tr>
                ${taxRows}
                <tr>
                  <td style="padding:12px 0 2px;text-align:right;font-weight:600;color:${dark};font-size:13px;border-top:1px solid ${border}">${esc(m.labels.total)}</td>
                  <td style="padding:12px 0 2px;text-align:right;font-weight:700;color:${dark};font-size:15px;border-top:1px solid ${border}">${esc(m.totalFormatted)}</td>
                </tr>
                <tr>
                  <td style="padding:2px 0;text-align:right;font-weight:600;color:${dark};font-size:13px">${esc(m.labels.amountPaid)}</td>
                  <td style="padding:2px 0;text-align:right;font-weight:700;color:${dark};font-size:15px">${esc(m.totalFormatted)}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${nextStepsHtml}

          <!-- Paid via -->
          <tr>
            <td style="padding:24px 32px 0;">
              <table width="100%" cellpadding="12" cellspacing="0" style="background:${bg};border-radius:8px;">
                <tr>
                  <td style="font-size:13px;color:${gray}">${esc(m.paidLine)}${m.paidDateFormatted ? ` — ${esc(m.paidDateFormatted)}` : ""}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer note -->
          <tr>
            <td style="padding:24px 32px;">
              <p style="margin:0;font-size:11px;color:${gray};text-align:center">${esc(subjectNote)}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
