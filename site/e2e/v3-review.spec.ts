import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/work",
  "/field-notes",
  "/writing",
  "/videos",
  "/gear",
  "/about",
  "/contact",
];
for (const width of [390, 1440]) {
  test(`V3 page review ${width}px`, async ({ page }, info) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("main h1")).toBeVisible();
      await page.screenshot({
        path: info.outputPath(
          `${route.replaceAll("/", "") || "home"}-${width}.png`,
        ),
        fullPage: true,
      });
      const images = await page
        .locator("main img")
        .evaluateAll((nodes) =>
          nodes
            .filter(
              (n) =>
                (n as HTMLImageElement).complete &&
                !(n as HTMLImageElement).naturalWidth,
            )
            .map((n) => n.getAttribute("src")),
        );
      expect(images, `Broken loaded images at ${route}`).toEqual([]);
    }
  });
}

test("destination selection opens the correct story and photo journal", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const selection = page.getByLabel("Selected destination stories");
  await page
    .getByLabel("CHOOSE A DESTINATION", { exact: true })
    .selectOption({ label: "Pangi Valley" });
  await expect(
    selection.getByText("Pangi Valley and Lahaul", { exact: true }),
  ).toBeVisible();
  await selection.getByRole("link", { name: "View 4 photos" }).click();
  await expect(page).toHaveURL(/pangi-lahaul-2026#photo-journal$/);
  await page.getByRole("button", { name: /Enlarge Pine forest/ }).click();
  await expect(
    page.getByRole("dialog", { name: "Photo viewer" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: /Enlarge Pine forest/ }),
  ).toBeFocused();
});

test("photo atlas, film filters, packing checklist and contact guidance work", async ({
  page,
}) => {
  await page.goto("/field-notes");
  await page.getByRole("button", { name: "Browse photo journeys" }).click();
  await expect(
    page.getByLabel("Destinations with photographs").getByRole("article"),
  ).toHaveCount(3);
  await page.goto("/videos");
  await page
    .getByRole("button", { name: "Himalayan notes", exact: true })
    .click();
  await expect(page.getByRole("link", { name: /TUNGNATH/ })).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Find a film" })
    .fill("zzznomatchzzz");
  await expect(page.getByText("No films match that selection.")).toBeVisible();
  await page.getByRole("button", { name: "Reset film filters" }).click();
  await page.goto("/gear");
  await page.getByRole("checkbox", { name: /Take the work offline/ }).check();
  await expect(
    page.getByRole("status").filter({ hasText: "1 of 4 checked" }),
  ).toBeVisible();
  await page.goto("/contact");
  await page.getByLabel("What do you have in mind?").selectOption("consulting");
  await expect(
    page.getByText(
      "Include the engineering problem, your current stack, and the outcome you need.",
    ),
  ).toBeVisible();
});

test("life timeline is readable without JavaScript and dates are not invented", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/about");
  const chapter = page.getByRole("region", {
    name: "Life, beyond the keyboard",
    exact: true,
  });
  await expect(
    chapter.getByRole("heading", { name: "Born in Chitrakoot" }),
  ).toBeVisible();
  await expect(chapter.getByRole("article")).toHaveCount(6);
  await expect(chapter.locator("time")).toHaveCount(0);
  await page.getByRole("link", { name: /Building a career/ }).click();
  await expect(page).toHaveURL(/#life-chapter-1$/);
  await context.close();
});

test("illustrated life journey fits narrow and wide screens with accessible links", async ({
  page,
}, info) => {
  for (const width of [320, 360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about#life-chapter-0");
    const chapter = page.getByRole("region", {
      name: "Life, beyond the keyboard",
      exact: true,
    });
    await expect(chapter.getByRole("article")).toHaveCount(6);
    await expect(chapter.locator('svg[viewBox="0 0 300 240"]')).toHaveCount(6);
    const bounds = await page.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(bounds.document).toBeLessThanOrEqual(bounds.viewport + 1);
    const textBounds = await chapter
      .getByRole("article")
      .evaluateAll((nodes) =>
        nodes.map((n) => ({
          left: n.getBoundingClientRect().left,
          right: n.getBoundingClientRect().right,
        })),
      );
    expect(textBounds.every((b) => b.left >= 0 && b.right <= width)).toBe(true);
    await page.screenshot({
      path: info.outputPath(`journey-${width}.png`),
      fullPage: true,
    });
  }
  await page.getByRole("link", { name: /Building a career/ }).click();
  await expect(page).toHaveURL(/#life-chapter-1$/);
  await page
    .getByRole("region", { name: "Building a career", exact: true })
    .getByRole("link", { name: "Explore this chapter" })
    .first()
    .focus();
  await expect(
    page
      .getByRole("region", { name: "Building a career", exact: true })
      .getByRole("link", { name: "Explore this chapter" })
      .first(),
  ).toBeFocused();
});
