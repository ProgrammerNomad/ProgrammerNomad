import { test, expect } from "@playwright/test";

for (const width of [320, 360, 390, 768, 1024, 1440, 1920]) {
  test(`homepage fits ${width}px without hiding overflow`, async ({
    page,
  }, testInfo) => {
    const hydrationErrors: string[] = [];
    page.on("pageerror", (error) => hydrationErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error" && /hydrat/i.test(message.text()))
        hydrationErrors.push(message.text());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page
      .getByLabel("CHOOSE A DESTINATION", { exact: true })
      .selectOption({ label: "Bangkok" });
    await expect(
      page.getByRole("img", { name: /Selected: Bangkok/ }),
    ).toBeVisible();
    await page
      .getByLabel("CHOOSE A DESTINATION", { exact: true })
      .selectOption({ label: "Madhmaheshwar" });
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(() => {
      const viewport = document.documentElement.clientWidth;
      return [
        ...document.querySelectorAll(
          "header a, header button, main section, main h1, main h2, main h3, main p, main a, main select, main button, main figure, footer a",
        ),
      ]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          if (
            !rect.width ||
            !rect.height ||
            element.classList.contains("sr-only")
          )
            return false;
          return rect.left < -1 || rect.right > viewport + 1;
        })
        .map(
          (element) =>
            `${element.tagName}: ${element.textContent?.slice(0, 65)}`,
        );
    });
    expect(overflow).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const headline = page.getByRole("heading", { level: 1 });
    expect(
      await headline.evaluate(
        (element) => element.scrollWidth <= element.clientWidth + 1,
      ),
    ).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath(`homepage-${width}.png`),
      fullPage: true,
    });
    expect(hydrationErrors).toEqual([]);
  });
}

test("primary exploration, destination selection and existing routes work", async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Explore projects", exact: true }),
  ).toHaveAttribute("href", "/work");
  await expect(
    page.getByRole("link", { name: "Explore journeys", exact: true }),
  ).toHaveAttribute("href", "/field-notes");
  const select = page.getByLabel("CHOOSE A DESTINATION", { exact: true });
  await expect(select.locator("option")).toHaveCount(31);
  await select.selectOption({ label: "Bangkok" });
  await expect(
    page.getByText("13.76°N / 100.50°E", { exact: true }),
  ).toBeVisible();
  const story = page.getByRole("link", { name: "Read field note" });
  expect(
    (await request.get((await story.getAttribute("href"))!)).status(),
  ).toBe(200);
  await page
    .getByRole("link", { name: "Explore projects", exact: true })
    .click();
  await expect(page).toHaveURL(/\/work$/);
  await page.goBack();
  await page
    .getByRole("link", { name: "Explore journeys", exact: true })
    .click();
  await expect(page).toHaveURL(/\/field-notes$/);
  for (const route of ["/videos", "/writing", "/gear", "/about", "/contact"]) {
    expect((await request.get(route)).status(), route).toBe(200);
  }
});

test("mobile menu works by keyboard and restores focus on Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Toggle menu" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(
    page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link")
      .first(),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("reduced motion skips WebGL and keeps a keyboard-operable atlas", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("atlas-poster")).toHaveCSS("opacity", "1");
  await expect(page.locator("canvas")).toHaveCount(0);
  const picker = page.getByLabel("CHOOSE A DESTINATION", { exact: true });
  await picker.focus();
  await page.keyboard.press("ArrowDown");
  await expect(picker).toHaveValue("27.09:77.67");
  await expect(
    page.getByRole("img", { name: /Selected: Fatehpur Sikri/ }),
  ).toBeVisible();
  await page.locator("#home-highlights").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("link", { name: "31 Places traveled", exact: true }),
  ).toBeVisible();
});

test("no WebGL keeps the poster and exploration usable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (type === "webgl2" || type === "webgl") return null;
      return original.apply(this, [type, ...args] as Parameters<
        typeof original
      >);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.getByTestId("atlas-poster")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("status")).toHaveText(
    "Static atlas · explore below",
  );
  await expect(page.locator("canvas")).toHaveCount(0);
  await page
    .getByLabel("CHOOSE A DESTINATION", { exact: true })
    .selectOption({ label: "Bangkok" });
  await expect(
    page.getByText("13.76°N / 100.50°E", { exact: true }),
  ).toBeVisible();
});

test("3D renders, keyboard rotation pauses, and context loss restores the poster", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat/i.test(message.text()))
      errors.push(message.text());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Start globe rotation" }),
  ).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId("atlas-poster")).toHaveCSS("opacity", "0");
  await page.getByRole("button", { name: "Turn globe right" }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Start globe rotation" }).focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "Pause globe rotation" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "Start globe rotation" }),
  ).toHaveAttribute("aria-pressed", "false");
  expect(errors).toEqual([]);
  await page.locator("canvas").evaluate((canvas) => {
    (canvas as HTMLCanvasElement)
      .getContext("webgl2")
      ?.getExtension("WEBGL_lose_context")
      ?.loseContext();
  });
  await expect(page.getByTestId("atlas-poster")).toHaveCSS("opacity", "1");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Read field note" }),
  ).toBeVisible();
});

test("renderer creation failure after a successful probe retains the fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    let probes = 0;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (type === "webgl2" && ++probes > 1) return null;
      return original.apply(this, [type, ...args] as Parameters<
        typeof original
      >);
    } as typeof original;
  });
  await page.goto("/");
  // Allow the async renderer to attempt mounting; the poster must never disappear.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.getByTestId("atlas-poster")).toHaveCSS("opacity", "1");
  await expect(
    page.getByRole("link", { name: "Explore journeys", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toHaveText(
    "Static atlas · explore below",
  );
});

test("enabling reduced motion tears down the running renderer", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Start globe rotation" }),
  ).toBeVisible({ timeout: 15000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByTestId("atlas-poster")).toHaveCSS("opacity", "1");
});

test("server-rendered opening and fallback work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByTestId("atlas-poster")).toHaveCSS("opacity", "1");
  await page
    .getByRole("link", { name: "Explore journeys", exact: true })
    .click();
  await expect(page).toHaveURL(/\/field-notes$/);
  await context.close();
});
