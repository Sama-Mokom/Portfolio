import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock } from "@/components/code-block";

const example = 'const authorized = roles.includes("student");';

describe("code examples", () => {
  it("exposes readable, keyboard-focusable source code", () => {
    render(
      <CodeBlock
        code={example}
        language="typescript"
        label="Authorization example"
      />,
    );
    expect(screen.getByText(example)).toBeVisible();
    expect(screen.getByLabelText("typescript code")).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByText(/Authorization example/)).toBeVisible();
  });

  it("copies the exact source and announces completion", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<CodeBlock code={example} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Copied to clipboard.",
      ),
    );
    expect(writeText).toHaveBeenCalledWith(example);
  });

  it("explains the manual fallback when clipboard access is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    render(<CodeBlock code={example} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Copy unavailable. Select and copy the code below.",
      ),
    );
    expect(screen.getByText(example)).toBeVisible();
  });
});
