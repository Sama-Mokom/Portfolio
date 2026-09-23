import { NextResponse } from "next/server";
import {
  buildMailto,
  CONTACT_EMAIL,
  isContactEndpoint,
  readContactFields,
  validateContact,
  type ContactErrors,
} from "@/lib/contact";

export const runtime = "nodejs";
const MAX_CONTACT_BODY_BYTES = 96000;

class ContactBodyTooLargeError extends Error {}

async function readLimitedFormData(request: Request): Promise<FormData> {
  const reader = request.body?.getReader();
  if (!reader) return request.formData();

  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > MAX_CONTACT_BODY_BYTES) {
        await reader.cancel().catch(() => undefined);
        throw new ContactBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const contentType = request.headers.get("content-type");
  return new Response(body, {
    headers: contentType ? { "Content-Type": contentType } : {},
  }).formData();
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] ?? character,
  );
}

function reply(
  request: Request,
  status: "sent" | "invalid" | "failed" | "unavailable",
  message: string,
  code: number,
  errors?: ContactErrors,
) {
  if (request.headers.get("accept")?.includes("application/json")) {
    return NextResponse.json(
      { ok: status === "sent", message, ...(errors ? { errors } : {}) },
      { status: code, headers: { "Cache-Control": "no-store" } },
    );
  }
  return new Response(null, {
    status: 303,
    headers: {
      Location: `/contact?status=${status}#contact-form`,
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next's internal request URL can use localhost behind a proxy. The browser's
  // Host header identifies the site it actually submitted to.
  const requestUrl = new URL(request.url);
  const expectedHost = request.headers.get("host") ?? requestUrl.host;
  let sameOrigin = !origin;
  if (origin) {
    try {
      const source = new URL(origin);
      sameOrigin =
        source.host === expectedHost &&
        ["https:", "http:"].includes(source.protocol);
    } catch {
      sameOrigin = false;
    }
  }
  if (!sameOrigin || request.headers.get("sec-fetch-site") === "cross-site") {
    return reply(
      request,
      "failed",
      "Please submit the form from this website.",
      403,
    );
  }
  if (
    Number(request.headers.get("content-length") ?? 0) > MAX_CONTACT_BODY_BYTES
  ) {
    return reply(
      request,
      "invalid",
      "Your message is too long. Please keep it under 5,000 characters.",
      413,
    );
  }
  let formData: FormData;
  try {
    formData = await readLimitedFormData(request);
  } catch (error) {
    if (error instanceof ContactBodyTooLargeError) {
      return reply(
        request,
        "invalid",
        "Your message is too long. Please keep it under 5,000 characters.",
        413,
      );
    }
    return reply(
      request,
      "invalid",
      "Please submit a valid contact form.",
      400,
    );
  }
  const fields = readContactFields(formData);
  if (fields.website)
    return reply(
      request,
      "invalid",
      "This submission could not be accepted. Please email me directly.",
      400,
    );
  const errors = validateContact(fields);
  if (Object.keys(errors).length)
    return reply(
      request,
      "invalid",
      "Please correct the highlighted fields.",
      422,
      errors,
    );

  const endpoint = process.env.CONTACT_FORM_ENDPOINT;
  if (!isContactEndpoint(endpoint)) {
    const mailto = buildMailto(fields);
    if (request.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please send your message using the direct email link.",
          mailto,
        },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your email draft · Mokom</title></head><body><main><h1>Your email draft is ready</h1><p>This website has not sent a message. Open the draft in your email application, review it and send it there.</p><p><a href="${escapeHtml(mailto)}">Open your email draft</a></p><p>You can also write to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p><p><a href="/contact">Back to the contact page</a></p></main></body></html>`;
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Security-Policy":
          "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fields.name,
        email: fields.email,
        subject: fields.subject,
        message: fields.message,
      }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!response.ok)
      return reply(
        request,
        "failed",
        "Your message could not be sent. Please try again or email me directly.",
        502,
      );
    return reply(
      request,
      "sent",
      "Your message was accepted for delivery.",
      200,
    );
  } catch {
    return reply(
      request,
      "failed",
      "I couldn’t confirm delivery. Please email me directly or try again later.",
      502,
    );
  }
}
