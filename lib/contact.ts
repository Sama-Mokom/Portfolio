export const CONTACT_EMAIL = "yungkaparaz@gmail.com";

export const CONTACT_SUBJECTS = [
  "General enquiry",
  "Internship or graduate role",
  "Frontend or backend project",
  "Integration work",
  "Something else",
] as const;

export type ContactFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
};

export type ContactErrors = Partial<
  Record<"name" | "email" | "subject" | "message", string>
>;

export function readContactFields(data: FormData): ContactFields {
  const read = (key: string) => {
    const value = data.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  return {
    name: read("name"),
    email: read("email"),
    subject: read("subject"),
    message: read("message"),
    website: read("website"),
  };
}

export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  if (fields.name.length < 2 || fields.name.length > 100)
    errors.name = "Enter your name, between 2 and 100 characters.";
  if (
    fields.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)
  )
    errors.email = "Enter a valid email address.";
  if (!(CONTACT_SUBJECTS as readonly string[]).includes(fields.subject))
    errors.subject = "Choose a subject from the list.";
  if (fields.message.length < 10 || fields.message.length > 5000)
    errors.message = "Write a message between 10 and 5,000 characters.";
  return errors;
}

export function buildMailto(fields: ContactFields): string {
  const subject = encodeURIComponent(`${fields.subject} — ${fields.name}`);
  const body = encodeURIComponent(
    `${fields.message}\n\nFrom: ${fields.name}\nReply to: ${fields.email}`,
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export function isContactEndpoint(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "formspree.io" &&
      !url.port &&
      !url.username &&
      !url.password &&
      /^\/f\/[a-zA-Z0-9]+$/.test(url.pathname) &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}
