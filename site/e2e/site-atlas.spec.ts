import { test, expect } from "@playwright/test";

const routes = [
  "/work",
  "/work/jodkit",
  "/work/indian-railway-station-search",
  "/field-notes",
  "/field-notes/madhmaheshwar",
  "/field-notes/agra-2026",
  "/field-notes/nomad-remote-work",
  "/field-notes/page/2",
  "/writing",
  "/writing/static-first-architecture",
  "/writing/tags/architecture",
  "/videos",
  "/gear",
  "/about",
  "/contact",
];

test("travel archives remain visible without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of ["/field-notes", "/field-notes/page/2"]) {
    await page.goto(route);
    expect(await page.locator('main [style*="opacity:0"]').count()).toBe(0);
    await expect(
      page.locator('main a[href^="/field-notes/"]').first(),
    ).toBeVisible();
  }
  await context.close();
});

test("every published sitemap route and internal content link resolves", async ({
  request,
}) => {
  test.setTimeout(120000);
  const xml = await (await request.get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );
  expect(paths.length).toBeGreaterThan(40);
  const localLinks = new Set<string>();
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      const href = match[1].replace(/&amp;/g, "&").split("#")[0];
      if (
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.startsWith("/_next")
      )
        localLinks.add(href);
    }
  }
  for (const href of localLinks)
    expect((await request.get(href)).status(), href).toBe(200);
});
for (const width of [320, 360, 390, 768, 1440]) {
  test(`all page families fit ${width}px and hydrate`, async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error" && /hydrat/i.test(message.text()))
        errors.push(message.text());
    });
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
      const overflow = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        return [
          ...document.querySelectorAll(
            "header a,header button,main h1,main h2,main h3,main p,main a,main input,main select,main textarea,main button,main figure,footer a",
          ),
        ]
          .filter((e) => {
            if (
              e.closest(".leaflet-container,pre,dialog:not([open])") ||
              e.classList.contains("sr-only")
            )
              return false;
            const r = e.getBoundingClientRect();
            return r.width && r.height && (r.left < -1 || r.right > width + 1);
          })
          .map((e) => `${e.tagName} ${e.textContent?.slice(0, 60)}`);
      });
      expect(overflow, route).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("global search keyboard, filters, no-results and focus restoration", async ({
  page,
}) => {
  await page.goto("/work");
  const trigger = page.getByRole("button", { name: "Search the site" });
  await trigger.focus();
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Find your next path." });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("searchbox").fill("Laravel");
  await expect(dialog.getByRole("link", { name: /JodKit/ })).toBeVisible();
  await dialog.getByRole("button", { name: "Journeys", exact: true }).click();
  await expect(dialog.getByText(/No paths found/)).toBeVisible();
  await dialog.getByRole("button", { name: "Clear search" }).click();
  await dialog.getByRole("searchbox").fill("unfindable-1234");
  await expect(dialog.getByText(/No paths found/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("project filters, direct repositories and conceptual diagram selection", async ({
  page,
}) => {
  await page.goto("/work");
  await page.getByRole("button", { name: "IoT", exact: true }).click();
  await expect(page.getByText("1 projects in view")).toBeVisible();
  await page.getByLabel("Find a tool").fill("does not exist");
  await expect(page.getByText("No projects match this search.")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(
    page.getByRole("link", { name: /BreakGuard/ }).first(),
  ).toHaveAttribute("href", /github.com/);
  await page.goto("/work/jodkit");
  await page.getByRole("button", { name: /Billing hooks/ }).click();
  await expect(page.locator("#capability-detail")).toContainText(
    "Billing hooks are packaged",
  );
});

test("atlas filters, list alternative and story return selection", async ({
  page,
}) => {
  await page.goto("/field-notes");
  await page
    .getByRole("combobox", { name: "Region", exact: true })
    .selectOption("Thailand");
  await expect(
    page.getByRole("complementary", { name: "Selected destination" }),
  ).toContainText("Bangkok");
  await page.getByRole("button", { name: "Use list only" }).click();
  await expect(page.locator("#travel-map")).toHaveCount(0);
  await page
    .getByRole("searchbox", { name: "Find a destination" })
    .fill("NoSuchPlace");
  await expect(
    page.getByText("No destinations match those filters."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset atlas filters" }).click();
  await page.goto("/field-notes/madhmaheshwar");
  await page.getByRole("link", { name: /Back to this place/ }).click();
  await expect(
    page.getByRole("complementary", { name: "Selected destination" }),
  ).toContainText("Madhmaheshwar");
});

test("travel chapters and gallery are keyboard usable without showing TODOs", async ({
  page,
}) => {
  await page.goto("/field-notes/agra-2026");
  await expect(page.locator("main")).not.toContainText("TODO");
  await expect(page.getByText("Route notes not yet recorded.")).toBeVisible();
  await page.goto("/field-notes/madhmaheshwar");
  await expect(
    page.getByRole("heading", { name: "Route", exact: true }),
  ).toBeVisible();
  const opener = page.getByRole("button", {
    name: "Enlarge Madhmaheshwar temple",
  });
  await opener.click();
  const viewer = page.getByRole("dialog", { name: "Photo viewer" });
  await expect(viewer).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(viewer.getByRole("img")).toHaveAttribute(
    "alt",
    "Meadow with the Garhwal range behind",
  );
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
});

test("contact validates accessibly and never claims preview delivery", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /Send message/ }).click();
  await expect(page.locator("#name-error")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.getByLabel("Your name").fill("Preview Tester");
  await page.getByLabel("Email address").fill("test@example.com");
  await page
    .getByLabel("Tell me about your idea")
    .fill("This is a local-only preview test.");
  await page.getByRole("button", { name: /Send message/ }).click();
  await expect(page.getByRole("status")).toContainText(
    "local preview cannot deliver",
  );
});

test("video player is opt-in and posters are actual thumbnails", async ({
  page,
}) => {
  await page.goto("/videos");
  const feature = page.locator(".featured-film");
  if (await feature.count()) {
    await expect(feature.locator("img")).toHaveAttribute("src", /ytimg\.com/);
    await feature.click();
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^Play / })).toBeVisible();
  } else
    await expect(
      page.getByText("The latest feed is taking a break."),
    ).toBeVisible();
});

test("404, drafts, archives, canonical and static asset contracts", async ({
  request,
  page,
}) => {
  for (const route of [
    "/unknown-atlas-page",
    "/field-notes/page/2.5",
    "/work/domain-data-platform",
    "/work/breakguard",
  ])
    expect((await request.get(route)).status(), route).toBe(404);
  expect((await request.get("/images/shiv-singh.jpg")).status()).toBe(200);
  expect((await request.get("/writing/feed.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  await page.goto("/field-notes/page/2");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/field-notes\/page\/2$/,
  );
  await page.goto("/about");
  await expect(page.locator('a[href$="press-kit.zip"]')).toHaveCount(0);
});
