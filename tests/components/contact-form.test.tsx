import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact-form";

function fillEnquiry() {
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Ada Lovelace" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ada@example.org" },
  });
  fireEvent.change(screen.getByLabelText("Message"), {
    target: { value: "I would like to discuss a software project." },
  });
}

afterEach(() => {
  delete window.umami;
  vi.unstubAllGlobals();
});

describe("contact form", () => {
  it.each(["__proto__", "constructor", "toString", "unknown"])(
    "ignores unrecognised status %s without breaking the form",
    (status) => {
      render(<ContactForm canSend={false} initialStatus={status} />);
      expect(screen.getByRole("status")).toBeEmptyDOMElement();
      expect(
        screen.getByRole("button", { name: /prepare email/i }),
      ).toBeEnabled();
    },
  );

  it("shows a recognised delivery status from a native submission and tracks it", () => {
    const spy = vi.fn();
    window.umami = { track: spy };
    render(<ContactForm canSend initialStatus="sent" />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "accepted for delivery",
    );
    expect(spy).toHaveBeenCalledWith("contact-submit", { result: "sent" });
  });

  it("focuses a linked error summary and associates field errors", async () => {
    render(<ContactForm canSend={false} />);
    fireEvent.click(screen.getByRole("button", { name: /prepare email/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveFocus());
    for (const label of ["Name", "Email", "Message"]) {
      const input = screen.getByLabelText(label);
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAccessibleDescription();
    }
    expect(
      screen.getByRole("alert").querySelectorAll('a[href^="#contact-"]'),
    ).toHaveLength(3);
  });

  it("submits a configured form once, announces acceptance, clears fields and tracks sent", async () => {
    const spy = vi.fn();
    window.umami = { track: spy };
    const fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetch);
    render(<ContactForm canSend />);
    fillEnquiry();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "accepted for delivery",
      ),
    );
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST", body: expect.any(FormData) }),
    );
    expect(spy).toHaveBeenCalledWith("contact-submit", { result: "sent" });
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Message")).toHaveValue("");
  });

  it("preserves the enquiry, enables retry and tracks failed after a network failure", async () => {
    const spy = vi.fn();
    window.umami = { track: spy };
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<ContactForm canSend />);
    fillEnquiry();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/confirm.*sent/i),
    );
    expect(spy).toHaveBeenCalledWith("contact-submit", { result: "failed" });
    expect(screen.getByLabelText("Name")).toHaveValue("Ada Lovelace");
    expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
  });

  it("does not send a honeypot submission", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(<ContactForm canSend />);
    fillEnquiry();
    fireEvent.change(screen.getByLabelText("Leave this field empty"), {
      target: { value: "spam" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        /email me directly/i,
      ),
    );
    expect(fetch).not.toHaveBeenCalled();
  });
});
