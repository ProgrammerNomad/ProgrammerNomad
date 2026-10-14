/** Static POST target for Next.js on Netlify (OpenNext forms workaround). */
export const NETLIFY_FORM_POST_PATH = "/__forms.html";

export function encodeNetlifyFormBody(formData: FormData): string {
  const params = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      params.append(key, value);
    }
  }
  return params.toString();
}

export function isNetlifyFormAccepted(response: Response): boolean {
  if (response.ok) return true;
  // Netlify may respond with a redirect after accepting an AJAX submission.
  return response.status >= 300 && response.status < 400;
}

export async function postNetlifyForm(formData: FormData): Promise<Response> {
  return fetch(NETLIFY_FORM_POST_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encodeNetlifyFormBody(formData),
  });
}

export async function submitNetlifyForm(formData: FormData): Promise<boolean> {
  const response = await postNetlifyForm(formData);
  return isNetlifyFormAccepted(response);
}
