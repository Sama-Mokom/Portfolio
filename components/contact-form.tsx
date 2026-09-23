"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  buildMailto,
  CONTACT_EMAIL,
  CONTACT_SUBJECTS,
  readContactFields,
  validateContact,
  type ContactErrors,
} from "@/lib/contact";

const initialMessages: Record<string, string> = {
  sent: "Your message was accepted for delivery. Thanks for getting in touch.",
  failed:
    "Your message could not be sent. Please try again or email me directly.",
  invalid:
    "Please check the form and try again. Your name, a valid email address and a message of at least 10 characters are required.",
  unavailable:
    "The contact service is unavailable. You can reach me directly by email.",
};

export function ContactForm({
  canSend,
  initialStatus,
}: {
  canSend: boolean;
  initialStatus?: string;
}) {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [message, setMessage] = useState(() =>
    typeof initialStatus === "string" &&
    Object.hasOwn(initialMessages, initialStatus)
      ? initialMessages[initialStatus]
      : "",
  );
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, []);
  useEffect(() => {
    if (Object.keys(errors).length) summaryRef.current?.focus();
  }, [errors]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const fields = readContactFields(data);
    const nextErrors = validateContact(fields);
    setErrors(nextErrors);
    setMessage("");
    setDraft("");
    if (Object.keys(nextErrors).length) return;
    if (fields.website) {
      setMessage(
        "Please email me directly using the address alongside this form.",
      );
      return;
    }

    if (!canSend) {
      const mailto = buildMailto(fields);
      setDraft(mailto);
      setMessage(
        "Your email app should open with a draft. Review it and send it there; this website has not sent a message.",
      );
      window.location.href = mailto;
      return;
    }

    setPending(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      const result: { ok?: boolean; message?: string; errors?: ContactErrors } =
        await response.json();
      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        setMessage(
          result.message ??
            "Your message could not be sent. Please try again or email me directly.",
        );
      } else {
        setMessage(
          "Your message was accepted for delivery. Thanks for getting in touch.",
        );
        form.reset();
      }
    } catch {
      setMessage(
        "I couldn’t confirm that your message was sent. Please email me directly, or try again when your connection is available.",
      );
    } finally {
      window.clearTimeout(timeout);
      setPending(false);
    }
  }

  return (
    <form
      id="contact-form"
      className="contact-form"
      action="/api/contact"
      method="post"
      onSubmit={handleSubmit}
      ref={formRef}
      aria-busy={pending}
    >
      <p className="form-introduction">
        {canSend
          ? "Send a message. All fields are required."
          : "Prepare an email draft. All fields are required; you’ll send it from your email app."}
      </p>
      {Object.keys(errors).length > 0 && (
        <div
          className="form-error-summary"
          role="alert"
          tabIndex={-1}
          ref={summaryRef}
        >
          <p>Please check these fields:</p>
          <ul>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <a href={`#contact-${field}`}>{error}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="form-field">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          placeholder="Your name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name && (
          <p className="field-error" id="contact-name-error">
            {errors.name}
          </p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && (
          <p className="field-error" id="contact-email-error">
            {errors.email}
          </p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="contact-subject">What is this about?</label>
        <select
          id="contact-subject"
          name="subject"
          required
          defaultValue="General enquiry"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={
            errors.subject ? "contact-subject-error" : undefined
          }
        >
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
        {errors.subject && (
          <p className="field-error" id="contact-subject-error">
            {errors.subject}
          </p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="Tell me a little about what you have in mind."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`contact-message-hint${errors.message ? " contact-message-error" : ""}`}
        />
        <p id="contact-message-hint" className="field-hint">
          10–5,000 characters.
        </p>
        {errors.message && (
          <p className="field-error" id="contact-message-error">
            {errors.message}
          </p>
        )}
      </div>
      <div className="contact-trap" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Sending…" : canSend ? "Send message" : "Prepare email"}
        <span aria-hidden="true">↗</span>
      </button>
      <div
        className="form-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message && <p>{message}</p>}
        {draft && (
          <p>
            <a href={draft}>Open the email draft again</a>
          </p>
        )}
      </div>
      <p className="form-privacy">
        {canSend
          ? "This form uses Formspree to deliver your name, email and message. "
          : "Your email app sends the message. "}
        You can also <a href={`mailto:${CONTACT_EMAIL}`}>email me directly</a>.
      </p>
      <noscript>
        <p className="form-privacy">
          {canSend
            ? "The form works without JavaScript."
            : "Submitting this form will prepare a link to your email draft on the next page."}
        </p>
      </noscript>
    </form>
  );
}
