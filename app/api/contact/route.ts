import { rateLimit } from "@/lib/rate-limit";
import { isSpamSubmission, validateContactForm } from "@/lib/validation";

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

  // No external mail service: the submission is logged server-side only.
  console.log("Contact form submission:", JSON.stringify(values));

  return Response.json({ ok: true });
}
