import "server-only";

/**
 * Verstuurt een mail via Resend (https://resend.com) als RESEND_API_KEY is ingesteld.
 * Zonder sleutel wordt de mail alleen gelogd. Mislukte mails blokkeren nooit een inzending.
 */
export async function sendMail({ to, subject, text, replyTo }: { to: string | string[]; subject: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "Trengix <website@trengix.be>";
  if (!key) {
    console.info(`[mail niet verstuurd: geen RESEND_API_KEY] aan ${to}: ${subject}`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text, reply_to: replyTo }),
    });
    if (!res.ok) console.error("Mail mislukt", res.status, await res.text());
  } catch (e) {
    console.error("Mail mislukt", e);
  }
}

export const fallbackTo = () => process.env.MAIL_FALLBACK_TO || "";

type Msg = { to: string; subject: string; text: string; replyTo?: string };

/** Verstuurt veel mails tegelijk (per 100) via de batch-API van Resend. Geeft het aantal verstuurde terug. */
export async function sendBatch(msgs: Msg[]): Promise<number> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "Trengix <website@trengix.be>";
  if (!key) {
    console.info(`[${msgs.length} mails niet verstuurd: geen RESEND_API_KEY]`);
    return 0;
  }
  let sent = 0;
  for (let i = 0; i < msgs.length; i += 100) {
    const chunk = msgs.slice(i, i + 100).map((m) => ({ from, to: m.to, subject: m.subject, text: m.text, reply_to: m.replyTo }));
    try {
      const res = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(chunk),
      });
      if (res.ok) sent += chunk.length;
      else console.error("Batchmail mislukt", res.status, await res.text());
    } catch (e) {
      console.error("Batchmail mislukt", e);
    }
  }
  return sent;
}
