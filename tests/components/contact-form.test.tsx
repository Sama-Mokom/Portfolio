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

  it("shows a recognised delivery status from a native submission", () => {
    render(<ContactForm canSend initialStatus="sent" />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "accepted for delivery",
    );
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

  it("submits a configured form once, announces acceptance and clears fields", async () => {
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
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Message")).toHaveValue("");
  });

  it("preserves the enquiry and enables retry after a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<ContactForm canSend />);
    fillEnquiry();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/confirm.*sent/i),
    );
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
