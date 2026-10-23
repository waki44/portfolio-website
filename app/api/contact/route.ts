import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";
import { isSpamSubmission, validateContactForm } from "@/lib/validation";

const CONTACT_INBOX = "syedwaqarraza27@gmail.com";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  const limit = rateLimit(`contact:${ip}`, 10, 60_000);
  if (!limit.ok) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  // Honeypot: silently accept and drop spam so bots learn nothing.
  if (isSpamSubmission(body)) {
    return Response.json({ ok: true });
  }

  const { ok, errors, values } = validateContactForm(body);
  if (!ok) {
    return Response.json({ ok: false, errors }, { status: 400 });
  }

  // Deliver to the owner's inbox via Resend when configured; always keep a
  // server-side log copy so a submission is never silently lost.
  console.log("Contact form submission:", JSON.stringify(values));

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: [CONTACT_INBOX],
        replyTo: values.email,
        subject: `Portfolio contact from ${values.name}`,
        text: `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`,
      });
      if (error) {
        console.error("Resend delivery failed:", JSON.stringify(error));
      }
    } catch (err) {
      console.error("Resend delivery threw:", err);
    }
  }

  return Response.json({ ok: true });
}
