import { describe, expect, it } from "vitest";

import { isSpamSubmission, validateContactForm } from "@/lib/validation";

const VALID = {
  name: "Jane Recruiter",
  email: "jane@example.com",
  message: "Hello, I would like to discuss a role with you.",
};

describe("validateContactForm", () => {
  it("accepts a valid payload with ok: true and no errors", () => {
    const result = validateContactForm(VALID);

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.values).toEqual({
      name: "Jane Recruiter",
      email: "jane@example.com",
      message: "Hello, I would like to discuss a role with you.",
    });
  });

  it("trims surrounding whitespace from the returned values", () => {
    const result = validateContactForm({
      name: "  Jane Recruiter  ",
      email: "  jane@example.com  ",
      message: "  Hello, I would like to discuss a role with you.  ",
    });

    expect(result.ok).toBe(true);
    expect(result.values.name).toBe("Jane Recruiter");
    expect(result.values.email).toBe("jane@example.com");
    expect(result.values.message).toBe(
      "Hello, I would like to discuss a role with you.",
    );
  });

  it("rejects a missing name", () => {
    const result = validateContactForm({
      email: VALID.email,
      message: VALID.message,
    });

    expect(result.ok).toBe(false);
    expect(result.errors.name).toBeTruthy();
  });

  it("rejects a name shorter than 2 characters after trimming", () => {
    for (const name of ["", " ", "A", " A "]) {
      const result = validateContactForm({ ...VALID, name });

      expect(result.ok).toBe(false);
      expect(result.errors.name).toBeTruthy();
    }
  });

  it("accepts a name of exactly 2 characters", () => {
    const result = validateContactForm({ ...VALID, name: "Al" });

    expect(result.ok).toBe(true);
    expect(result.errors.name).toBeUndefined();
  });

  it.each(["a@b", "plain", "a@.com"])(
    "rejects the invalid email %s",
    (email) => {
      const result = validateContactForm({ ...VALID, email });

      expect(result.ok).toBe(false);
      expect(result.errors.email).toBeTruthy();
    },
  );

  it("rejects a missing or empty email", () => {
    for (const email of [undefined, "", "   "]) {
      const result = validateContactForm({ ...VALID, email });

      expect(result.ok).toBe(false);
      expect(result.errors.email).toBeTruthy();
    }
  });

  it("rejects a message shorter than 10 characters after trimming", () => {
    for (const message of ["", "hi", "  short  ", "123456789"]) {
      const result = validateContactForm({ ...VALID, message });

      expect(result.ok).toBe(false);
      expect(result.errors.message).toBeTruthy();
    }
  });

  it("accepts a message of exactly 10 characters", () => {
    const result = validateContactForm({ ...VALID, message: "1234567890" });

    expect(result.ok).toBe(true);
    expect(result.errors.message).toBeUndefined();
  });

  it.each([null, undefined, [], "a string", 42])(
    "returns ok: false for a non-object body: %s",
    (body) => {
      const result = validateContactForm(body);

      expect(result.ok).toBe(false);
      expect(result.errors).toBeTypeOf("object");
      expect(result.values).toEqual({ name: "", email: "", message: "" });
    },
  );

  it("returns ok: false for an empty object", () => {
    const result = validateContactForm({});

    expect(result.ok).toBe(false);
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.message).toBeTruthy();
  });
});

describe("isSpamSubmission", () => {
  it("returns true when the honeypot `company` field is a non-empty string", () => {
    expect(isSpamSubmission({ company: "x" })).toBe(true);
    expect(isSpamSubmission({ ...VALID, company: "Spammy LLC" })).toBe(true);
  });

  it("returns false when the honeypot `company` field is an empty string", () => {
    expect(isSpamSubmission({ company: "" })).toBe(false);
    expect(isSpamSubmission({ ...VALID, company: "" })).toBe(false);
  });

  it("returns false when there is no honeypot field", () => {
    expect(isSpamSubmission({})).toBe(false);
    expect(isSpamSubmission(VALID)).toBe(false);
  });

  it("returns false for null and other non-object bodies", () => {
    expect(isSpamSubmission(null)).toBe(false);
    expect(isSpamSubmission(undefined)).toBe(false);
    expect(isSpamSubmission("company")).toBe(false);
    expect(isSpamSubmission([])).toBe(false);
  });

  it("returns false when `company` is not a string", () => {
    expect(isSpamSubmission({ company: 123 })).toBe(false);
    expect(isSpamSubmission({ company: true })).toBe(false);
    expect(isSpamSubmission({ company: null })).toBe(false);
  });
});
