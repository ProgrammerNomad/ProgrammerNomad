import { describe, expect, it } from "vitest";
import {
  encodeNetlifyFormBody,
  isNetlifyFormAccepted,
  NETLIFY_FORM_POST_PATH,
} from "./netlify-form";

describe("encodeNetlifyFormBody", () => {
  it("URL-encodes form fields including form-name", () => {
    const formData = new FormData();
    formData.set("form-name", "collab");
    formData.set("name", "Shiv Singh");
    formData.set("email", "test@example.com");
    formData.set("message", "Hello & welcome");

    const body = encodeNetlifyFormBody(formData);
    expect(body).toContain("form-name=collab");
    expect(body).toContain("name=Shiv+Singh");
    expect(body).toContain("email=test%40example.com");
    expect(body).toContain("message=Hello+%26+welcome");
  });
});

describe("isNetlifyFormAccepted", () => {
  it("accepts 2xx responses", () => {
    expect(isNetlifyFormAccepted(new Response("", { status: 200 }))).toBe(
      true,
    );
  });

  it("accepts 3xx redirect responses from Netlify", () => {
    expect(isNetlifyFormAccepted(new Response("", { status: 303 }))).toBe(
      true,
    );
  });

  it("rejects 4xx and 5xx responses", () => {
    expect(isNetlifyFormAccepted(new Response("", { status: 404 }))).toBe(
      false,
    );
    expect(isNetlifyFormAccepted(new Response("", { status: 500 }))).toBe(
      false,
    );
  });
});

describe("NETLIFY_FORM_POST_PATH", () => {
  it("posts to the static forms blueprint", () => {
    expect(NETLIFY_FORM_POST_PATH).toBe("/__forms.html");
  });
});
