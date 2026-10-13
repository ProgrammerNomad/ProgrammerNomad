"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  validateContact,
  type ContactErrors,
  type ContactFields,
} from "@/lib/contact";

export function ContactForm({
  email,
  deliveryEnabled,
}: {
  email: string;
  deliveryEnabled: boolean;
}) {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error" | "preview"
  >("idle");
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(data) as unknown as ContactFields;
    const validation = validateContact(values);
    setErrors(validation);
    if (Object.keys(validation).length) {
      setStatus("idle");
      const field = form.elements.namedItem(
        Object.keys(validation)[0],
      ) as HTMLElement;
      field?.focus();
      return;
    }
    if (!deliveryEnabled) {
      setStatus("preview");
      return;
    }
    setStatus("sending");
    try {
      const body = new URLSearchParams();
      data.forEach((value, key) => body.append(key, String(value)));
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!response.ok) throw new Error("Form not accepted");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }
  return (
    <form
      name="collab"
      method="POST"
      action="/__forms.html"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="contact-form"
      noValidate={enhanced}
      onSubmit={submit}
      aria-busy={status === "sending"}
    >
      <input type="hidden" name="form-name" value="collab" />
      <p hidden>
        <label>
          Leave this empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <p className="atlas-meta mb-8">
        A good collaboration starts with a conversation.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {(
          [
            {
              name: "name",
              label: "Your name",
              type: "text",
              autoComplete: "name",
            },
            {
              name: "email",
              label: "Email address",
              type: "email",
              autoComplete: "email",
            },
          ] as const
        ).map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name}>
              {field.label} <span aria-hidden="true">*</span>
            </label>
            <input
              className="atlas-input mt-2"
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required
              maxLength={200}
              aria-invalid={!!errors[field.name]}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
            />
            {errors[field.name] && (
              <p className="field-error" id={`${field.name}-error`}>
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <label htmlFor="type">What do you have in mind?</label>
        <select
          id="type"
          name="type"
          className="atlas-input mt-2"
          aria-invalid={!!errors.type}
          aria-describedby={errors.type ? "type-error" : undefined}
        >
          <option value="brand">Brand collaboration</option>
          <option value="sponsorship">Sponsorship</option>
          <option value="consulting">Engineering consulting</option>
        </select>
        {errors.type && (
          <p id="type-error" className="field-error">
            {errors.type}
          </p>
        )}
      </div>
      <div className="mt-6">
        <label htmlFor="message">
          Tell me about your idea <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className="atlas-input mt-2"
          required
          minLength={10}
          maxLength={5000}
          placeholder="The idea, your timeline, and how I can help…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : "message-hint"}
        />
        <p id="message-hint" className="text-xs text-paper/55 mt-2">
          Please leave out passwords, access keys, and confidential documents.
        </p>
        {errors.message && (
          <p className="field-error" id="message-error">
            {errors.message}
          </p>
        )}
      </div>
      <div className="form-feedback" role="status" aria-live="polite">
        {status === "success" && (
          <p>Message submitted successfully. Thank you for getting in touch.</p>
        )}
        {status === "error" && (
          <p>
            We couldn’t submit your message. Your text is still here-please
            retry or <a href={`mailto:${email}`}>email me directly</a>.
          </p>
        )}
        {status === "preview" && (
          <p>
            This local preview cannot deliver messages. Your text is still here;
            please <a href={`mailto:${email}`}>email me directly</a>.
          </p>
        )}
      </div>
      <button
        type="submit"
        className="atlas-button atlas-button--primary"
        disabled={status === "sending"}
      >
        {status === "sending"
          ? "Sending…"
          : status === "error"
            ? "Try again ↗"
            : "Send message ↗"}
      </button>
      <p className="mt-4 text-xs text-paper/55">
        * Required. Your details are used to respond to this inquiry.
      </p>
    </form>
  );
}
