import { createHmac, timingSafeEqual } from "node:crypto";

type InboundInstagramMessage = {
  channel: "instagram";
  account_id: string;
  sender_id: string;
  message_id: string;
  received_at: string;
  message_text: string | null;
};

function records(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.flatMap((item) => {
    const result = record(item);
    return result ? [result] : [];
  }) : [];
}

function record(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
}

export function matchesVerifyToken(provided: string, expected: string): boolean {
  const actualBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length &&
    timingSafeEqual(actualBytes, expectedBytes);
}

export function verifyInstagramSignature(
  body: Buffer,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature || !/^sha256=[a-f0-9]{64}$/i.test(signature)) return false;
  const actual = Buffer.from(signature.slice(7), "hex");
  const expected = createHmac("sha256", secret).update(body).digest();
  return timingSafeEqual(actual, expected);
}

export function instagramMessages(
  payload: unknown,
  accountId: string,
): InboundInstagramMessage[] {
  const envelope = record(payload);
  if (envelope?.object !== "instagram") return [];

  const messages = new Map<string, InboundInstagramMessage>();
  for (const entry of records(envelope.entry)) {
    if (entry.id !== accountId) continue;

    for (const event of records(entry.messaging)) {
      const senderId = record(event.sender)?.id;
      const recipientId = record(event.recipient)?.id;
      const message = record(event.message);
      if (!message || message.is_echo || message.is_self || message.is_deleted) continue;
      if (recipientId !== accountId || senderId === accountId) continue;

      const messageId = message.mid;
      const timestamp = event.timestamp;
      if (typeof senderId !== "string" || !senderId ||
          typeof messageId !== "string" || !messageId ||
          typeof timestamp !== "number" || !Number.isSafeInteger(timestamp) ||
          timestamp <= 0 || timestamp > 253402300799999) continue;

      messages.set(messageId, {
        channel: "instagram",
        account_id: accountId,
        sender_id: senderId,
        message_id: messageId,
        received_at: new Date(timestamp).toISOString(),
        message_text: typeof message.text === "string" ? message.text : null,
      });
    }
  }
  return [...messages.values()];
}
