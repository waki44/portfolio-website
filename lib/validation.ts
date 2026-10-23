export interface ContactFormResult {
  ok: boolean;
  errors: Record<string, string>;
  values: { name: string; email: string; message: string };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Validate a contact-form submission body of unknown shape. */
export function validateContactForm(body: unknown): ContactFormResult {
  const values = { name: "", email: "", message: "" };
  const errors: Record<string, string> = {};

  if (!isPlainObject(body)) {
    errors.name = "Name is required.";
    errors.email = "A valid email address is required.";
    errors.message = "Message is required.";
    return { ok: false, errors, values };
  }

  values.name = asTrimmedString(body.name);
  values.email = asTrimmedString(body.email);
  values.message = asTrimmedString(body.message);

  if (values.name.length < 2) {
    errors.name = "Name must be at least 2 characters long.";
  }
  if (!EMAIL_REGEX.test(values.email)) {
    errors.email = "Please provide a valid email address.";
  }
  if (values.message.length < 10) {
    errors.message = "Message must be at least 10 characters long.";
  }

  return { ok: Object.keys(errors).length === 0, errors, values };
}

/**
 * Honeypot spam check: bots fill the hidden `company` field that real
 * visitors never see. A non-empty string there means spam.
 */
export function isSpamSubmission(body: unknown): boolean {
  if (!isPlainObject(body)) return false;
  const company = body.company;
  return typeof company === "string" && company.trim().length > 0;
}
