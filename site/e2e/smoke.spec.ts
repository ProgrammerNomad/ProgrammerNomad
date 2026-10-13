import { test, expect } from "@playwright/test";

test("home loads with hero headline", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /I BUILD SYSTEMS/i })).toBeVisible();
});

test("draft work slug returns 404", async ({ request }) => {
  const res = await request.get("/work/domain-data-platform");
  expect(res.status()).toBe(404);
});

test("published work slug returns 200", async ({ request }) => {
  const res = await request.get("/work/infrastructure-automation");
  expect(res.status()).toBe(200);
});

test("keyboard focus visible on skip link target", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toBeVisible();
});
