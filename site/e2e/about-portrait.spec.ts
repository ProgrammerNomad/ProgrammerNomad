import { test, expect } from "@playwright/test";

test("About portrait plays one arrival sequence and respects reduced motion", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("nomad-programmer-theme", "light");
  });
  await page.goto("/about");

  const portrait = page.getByRole("img", {
    name: "Shiv Singh, Nomad Programmer",
  });
  const route = page.locator(
    '.about-opening figure svg path[class*="routePath"]',
  );
  await expect(portrait).toBeVisible();
  await expect(route).toBeVisible();
  await expect(page.getByText("FIELD / SHIV")).toHaveCount(0);
  const photoFrame = page.locator(".about-opening figure > div");
  const caption = page.locator(".about-opening figure figcaption");
  const frameEndsBeforeCaption = await photoFrame.evaluate((frame) => {
    const caption = frame.parentElement?.querySelector("figcaption");
    return caption
      ? frame.getBoundingClientRect().bottom <=
          caption.getBoundingClientRect().top
      : false;
  });
  expect(frameEndsBeforeCaption).toBe(true);
  await expect(portrait).toHaveCSS("animation-name", /portrait-reveal/);
  await page.waitForTimeout(2200);
  const finalRouteOffset = await route.evaluate((path) =>
    Number.parseFloat(getComputedStyle(path).strokeDashoffset),
  );
  expect(finalRouteOffset).toBe(0);
  await page.screenshot({
    path: testInfo.outputPath("about-portrait-light-desktop.png"),
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: testInfo.outputPath("about-portrait-light-mobile.png"),
  });
  const mobileWidths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(mobileWidths.content).toBeLessThanOrEqual(mobileWidths.viewport + 1);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(portrait).toHaveCSS("animation-name", "none");
  await expect(portrait).toHaveCSS("clip-path", "none");
  const reducedRouteOffset = await page
    .locator('.about-opening figure svg path[class*="routePath"]')
    .evaluate((path) =>
      Number.parseFloat(getComputedStyle(path).strokeDashoffset),
    );
  expect(reducedRouteOffset).toBe(0);
});
