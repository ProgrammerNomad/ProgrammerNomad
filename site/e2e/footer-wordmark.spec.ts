import { test, expect } from "@playwright/test";

for (const width of [320, 360, 390, 699, 700, 768, 1024, 1440, 1920]) {
  test(`living wordmark fits the loaded Syne font at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const closing = page.getByTestId("footer-wordmark");
    await closing.scrollIntoViewIfNeeded();
    await expect(closing.locator("p")).toHaveText("NOMAD PROGRAMMER");
    const metrics = await closing.evaluate((element) => {
      const viewport = document.documentElement.clientWidth;
      const rows = [...element.querySelectorAll("p > span")];
      return {
        loaded: document.fonts.check("700 100px Syne"),
        font: getComputedStyle(element.querySelector("p")!).fontFamily,
        fits: rows.every((row) => {
          const range = document.createRange();
          range.selectNodeContents(row);
          const rect = range.getBoundingClientRect();
          return (
            rect.left >= 0 &&
            rect.right <= viewport &&
            row.scrollWidth <= row.clientWidth + 1
          );
        }),
        lines: new Set(
          rows.map((row) => Math.round(row.getBoundingClientRect().top)),
        ).size,
        animated: element
          .getAnimations({ subtree: true })
          .some((animation) => animation.playState === "running"),
      };
    });
    expect(metrics.loaded).toBe(true);
    expect(metrics.font).toContain("Syne");
    expect(metrics.fits).toBe(true);
    expect(metrics.lines).toBe(width < 700 ? 2 : 1);
    expect(metrics.animated).toBe(false);
    await expect(
      page
        .getByRole("navigation", { name: "Footer", exact: true })
        .getByRole("link"),
    ).toHaveCount(7);
    await expect(
      page
        .getByRole("contentinfo")
        .getByRole("link", { name: "Email", exact: true }),
    ).toHaveAttribute("href", /^mailto:/);
    await page.screenshot({ path: testInfo.outputPath(`footer-${width}.png`) });
  });
}

test("wordmark reveals once, draws its route, and a hover sweep finishes without looping", async ({
  page,
}) => {
  await page.goto("/");
  const closing = page.getByTestId("footer-wordmark");
  await expect(closing).toHaveAttribute("data-state", "pending");
  await closing.scrollIntoViewIfNeeded();
  await expect(closing).toHaveAttribute("data-state", "entered");
  await expect(closing.locator("path[pathLength]")).toHaveCSS(
    "stroke-dashoffset",
    "0px",
  );
  await expect(closing.locator("path[pathLength]")).toHaveCSS(
    "vector-effect",
    "none",
  );
  await expect
    .poll(() =>
      closing.evaluate((el) =>
        el
          .getAnimations({ subtree: true })
          .every((a) => a.playState === "finished"),
      ),
    )
    .toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await closing.scrollIntoViewIfNeeded();
  await expect(closing).toHaveAttribute("data-state", "entered");
  expect(
    await closing.evaluate((el) =>
      el
        .getAnimations({ subtree: true })
        .every((a) => a.playState === "finished"),
    ),
  ).toBe(true);
  await closing.hover();
  await expect
    .poll(() =>
      closing
        .locator("p > span > span")
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundPosition),
    )
    .toBe("0% 0px");
  await expect
    .poll(() =>
      closing.evaluate((el) =>
        el
          .getAnimations({ subtree: true })
          .every((a) => a.playState === "finished"),
      ),
    )
    .toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(closing).toHaveAttribute("data-state", "static");
  await expect(closing.locator("p > span").first()).toHaveCSS(
    "clip-path",
    "none",
  );
  await expect(closing.locator("p > span > span").first()).toHaveCSS(
    "color",
    "rgb(244, 243, 238)",
  );
});

test("wordmark and navigation stay visible without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  const closing = page.getByTestId("footer-wordmark");
  await closing.scrollIntoViewIfNeeded();
  await expect(closing).toHaveAttribute("data-state", "static");
  await expect(closing.locator("p")).toHaveText("NOMAD PROGRAMMER");
  await page
    .getByRole("navigation", { name: "Footer", exact: true })
    .getByRole("link", { name: "About" })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await context.close();
});

test("hero portrait and name form one keyboard-accessible About link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const signature = page.getByRole("link", {
    name: "About Shiv Singh",
    exact: true,
  });
  await expect(signature).toHaveAttribute("href", "/about");
  await signature.focus();
  await expect(signature).toBeFocused();
  await expect(signature).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/about$/);
  await page.goBack();
  await signature.getByRole("img", { name: "Shiv Singh", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
});
