import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const indexPages = [
  "/",
  "/work",
  "/work/shiprocket-woo-shipping",
  "/field-notes",
  "/field-notes/offline-coding-travel",
  "/writing",
  "/writing/static-first-architecture",
  "/videos",
  "/gear",
  "/about",
  "/contact",
];
const detailPages = (["work", "field-notes", "writing"] as const).flatMap(
  (section) =>
    readdirSync(join(process.cwd(), "content", section))
      .filter((file) => file.endsWith(".mdx"))
      .filter((file) =>
        (() => {
          const source = readFileSync(
            join(process.cwd(), "content", section, file),
            "utf8",
          );
          return (
            /published:\s*true/.test(source) &&
            (section !== "work" || /detailPage:\s*true/.test(source))
          );
        })(),
      )
      .map((file) => `/${section}/${basename(file, ".mdx")}`),
);
const videoPages = (
  JSON.parse(
    readFileSync(join(process.cwd(), "content/youtube/catalog.json"), "utf8"),
  ) as { videos: { id: string }[] }
).videos.map((video) => `/videos/${video.id}`);
const pages = [
  ...new Set([
    ...indexPages,
    ...detailPages,
    ...videoPages,
    "/field-notes/page/2",
    "/field-notes/page/3",
    "/writing/tags/architecture",
    "/writing/tags/web",
  ]),
];

test("the code-and-compass theme control toggles once and persists across pages", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath("homepage-dark-desktop.png"),
  });
  const toggle = page.getByRole("button", { name: "Switch to light theme" });
  await expect(toggle).toBeVisible();
  const headerControls = page.locator(
    "header .flex.shrink-0.items-center.gap-1",
  );
  await expect(
    headerControls.locator(".search-trigger ~ .theme-toggle"),
  ).toBeVisible();
  await expect(toggle).toHaveAttribute("title", "Switch to light theme");

  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(
    page.getByRole("button", { name: "Switch to dark theme" }),
  ).toBeVisible();
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(243, 241, 233)",
  );
  await page.waitForTimeout(350);
  await page.screenshot({
    path: testInfo.outputPath("homepage-light-desktop.png"),
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: testInfo.outputPath("homepage-light-mobile.png"),
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(11, 12, 11)",
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("every primary page renders without horizontal overflow in both themes", async ({
  page,
}) => {
  test.setTimeout(300_000);
  for (const theme of ["dark", "light"] as const) {
    await page.addInitScript((selectedTheme) => {
      document.documentElement.dataset.theme = selectedTheme;
    }, theme);
    await page.goto("/");
    await page.evaluate((selectedTheme) => {
      window.localStorage.setItem("nomad-programmer-theme", selectedTheme);
    }, theme);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    for (const route of pages) {
      await page.setViewportSize({ width: 390, height: 844 });
      const response = await page.goto(route);
      expect(
        response?.status(),
        `${route} should be a published route`,
      ).toBeLessThan(400);
      await page.evaluate((selectedTheme) => {
        document.documentElement.dataset.theme = selectedTheme;
        window.dispatchEvent(new Event("nomad-theme-change"));
      }, theme);
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        theme === "light" ? "rgb(243, 241, 233)" : "rgb(11, 12, 11)",
      );
      await expect(page.locator("main")).toBeVisible();
      await expect(
        page.getByRole("button", {
          name: `Switch to ${theme === "light" ? "dark" : "light"} theme`,
        }),
      ).toBeVisible();

      for (const width of [320, 360, 390, 768, 1280]) {
        await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
        const metrics = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          content: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
        }));
        expect(
          metrics.content,
          `${route} ${theme} at ${width}px`,
        ).toBeLessThanOrEqual(metrics.viewport + 1);
        expect(
          metrics.body,
          `${route} body ${theme} at ${width}px`,
        ).toBeLessThanOrEqual(metrics.viewport + 1);
      }
    }
  }
});

test("light mode keeps project cards and editorial copy readable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("nomad-programmer-theme", "light");
  });
  await page.goto("/work");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  const projectCard = page.locator(".project-card").first();
  await expect(projectCard).toHaveCSS("background-color", "rgb(250, 249, 244)");
  await expect(projectCard.locator("h3")).toHaveCSS("color", "rgb(32, 36, 31)");
  await page.goto("/about");
  const storyCopy = page.locator(".about-story .prose p").first();
  await expect(storyCopy).toBeVisible();
  await expect(storyCopy).toHaveCSS("color", "rgb(66, 74, 63)");
});
