import { test, expect } from "@playwright/test";

test("home loads with hero headline", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Tech by profession.*Traveler by soul/i,
    }),
  ).toBeVisible();
});

test("draft work slug returns 404", async ({ request }) => {
  const res = await request.get("/work/domain-data-platform");
  expect(res.status()).toBe(404);
});

test("published work slug returns 200", async ({ request }) => {
  const res = await request.get("/work/jodkit");
  expect(res.status()).toBe(200);
});

test("keyboard focus visible on skip link target", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});
