import { NextResponse } from "next/server";

// Working enquiry endpoint.
// - If RESEND_API_KEY is set, it emails the enquiry to ENQUIRY_TO.
// - Otherwise it logs server-side and still returns success, so the form
//   works end-to-end for the demo. Add the key for real delivery.
export async function POST(req: Request) {
  let data: Record<string, string> = {};
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  // Honeypot — silently accept bots.
  if (data.company) return NextResponse.json({ ok: true });

  if (!data.name || !data.email) {
    return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO || "contact@artyk.in";
  const from = process.env.ENQUIRY_FROM || "ARTYK <onboarding@resend.dev>";

  const text = [
    `Name:  ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "—"}`,
    `Type:  ${data.type || "—"}`,
    "",
    data.message || "",
  ].join("\n");

  if (key) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to,
          reply_to: data.email,
          subject: `ARTYK enquiry — ${data.name}`,
          text,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      console.error("[enquiry] send failed:", err);
      return NextResponse.json({ ok: false, error: "Could not send right now." }, { status: 502 });
    }
  } else {
    // Demo fallback — no key configured yet.
    console.log("[enquiry] (no RESEND_API_KEY set)\n" + text);
  }

  return NextResponse.json({ ok: true });
}
