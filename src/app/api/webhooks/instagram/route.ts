import { createClient } from "@supabase/supabase-js";
import {
  instagramMessages,
  matchesVerifyToken,
  verifyInstagramSignature,
} from "@/lib/crm/instagram";

export const runtime = "nodejs";

export function GET(request: Request) {
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
  if (!verifyToken) return new Response(null, { status: 503 });

  const params = new URL(request.url).searchParams;
  const challenge = params.get("hub.challenge");
  const providedToken = params.get("hub.verify_token");

  if (params.get("hub.mode") !== "subscribe" || !challenge ||
      !providedToken || !matchesVerifyToken(providedToken, verifyToken)) {
    return new Response(null, { status: 403 });
  }

  return new Response(challenge);
}

export async function POST(request: Request) {
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecret = process.env.CRM_SUPABASE_SECRET_KEY;
  if (!appSecret || !accountId || !supabaseUrl || !supabaseSecret) {
    return new Response(null, { status: 503 });
  }

  const body = Buffer.from(await request.arrayBuffer());
  if (!verifyInstagramSignature(body, request.headers.get("x-hub-signature-256"), appSecret)) {
    return new Response(null, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body.toString("utf8"));
  } catch {
    return new Response(null, { status: 400 });
  }

  const messages = instagramMessages(payload, accountId);
  if (!messages.length) return new Response(null, { status: 200 });

  try {
    const supabase = createClient(supabaseUrl, supabaseSecret, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await supabase.from("crm_inbound_messages").upsert(messages, {
      onConflict: "channel,account_id,message_id",
      ignoreDuplicates: true,
    });
    if (!error) return new Response(null, { status: 200 });
  } catch {
    // The caller can retry the delivery when persistence becomes available.
  }
  console.error("Instagram webhook could not persist inbound messages");
  return new Response(null, { status: 503 });
}
