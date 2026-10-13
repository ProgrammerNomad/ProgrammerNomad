import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { ContactForm } from "./ContactForm";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
function fill() {
  fireEvent.change(screen.getByLabelText(/Your name/), {
    target: { value: "Preview Tester" },
  });
  fireEvent.change(screen.getByLabelText(/Email address/), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/Tell me about/), {
    target: { value: "This is a local test only." },
  });
}
describe("contact submission states", () => {
  it("never sends a local preview inquiry", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(<ContactForm email="test@example.com" deliveryEnabled={false} />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: /Send message/ }));
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(
        "local preview cannot deliver",
      ),
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it("keeps the message on failure and permits retry", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    render(<ContactForm email="test@example.com" deliveryEnabled />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: /Send message/ }));
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(
        "couldn’t submit",
      ),
    );
    expect(
      (screen.getByLabelText(/Tell me about/) as HTMLTextAreaElement).value,
    ).toBe("This is a local test only.");
    expect(screen.getByRole("button", { name: /Try again/ })).toBeTruthy();
  });
  it("shows success only after acceptance by the existing endpoint", async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetch);
    render(<ContactForm email="test@example.com" deliveryEnabled />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: /Send message/ }));
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain(
        "submitted successfully",
      ),
    );
    expect(fetch.mock.calls[0][0]).toBe("/__forms.html");
    expect(fetch.mock.calls[0][1].body).toContain("form-name=collab");
    expect(
      (screen.getByLabelText(/Tell me about/) as HTMLTextAreaElement).value,
    ).toBe("");
  });
});
