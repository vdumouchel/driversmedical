const ANVIL_API_BASE = "https://app.useanvil.com/api/v1";

function getAnvilApiKey(): string {
  const key = process.env.ANVIL_API_KEY;
  if (!key) throw new Error("ANVIL_API_KEY is not set");
  return key;
}

function anvilAuthHeader(): string {
  const encoded = Buffer.from(`${getAnvilApiKey()}:`, "ascii").toString(
    "base64",
  );
  return `Basic ${encoded}`;
}

export interface AnvilFillPayload {
  title?: string;
  fontSize?: number;
  textColor?: string;
  data: Record<string, unknown>;
}

/**
 * POST a JSON payload to Anvil's PDF fill endpoint and return the raw PDF
 * bytes. Throws on any non-2xx response.
 */
export async function fillPdf(
  templateId: string,
  payload: AnvilFillPayload,
): Promise<Buffer> {
  const url = `${ANVIL_API_BASE}/fill/${templateId}.pdf`;
  const dataKeys = Object.keys(payload.data);

  console.log(
    `[anvil] POST fill PDF template=${templateId} url=${url} dataKeys=${dataKeys.join(",")}`,
  );

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: anvilAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let detail: string;
    try {
      detail = await res.text();
    } catch {
      detail = "(unable to read response body)";
    }
    throw new Error(
      `Anvil fill failed: ${res.status} ${res.statusText} — ${detail}`,
    );
  }

  const arrayBuffer = await res.arrayBuffer();
  const pdfBuffer = Buffer.from(arrayBuffer);

  console.log(
    `[anvil] received binary PDF template=${templateId} status=${res.status} bytes=${pdfBuffer.length}`,
  );

  return pdfBuffer;
}
