import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";

test("V3 production comparison against the original commit", async ({
  browser,
}, info) => {
  test.skip(
    !process.env.V3_COMPARE,
    "Enable only when the isolated baseline production server is running on 3001.",
  );
  test.setTimeout(180000);
  const results: Record<string, unknown> = {};
  for (const route of process.env.V3_COMPARE_ROUTE
    ? [process.env.V3_COMPARE_ROUTE]
    : ["/", "/about", "/work"]) {
    const runs: Record<
      string,
      { lcp: number; cls: number; scriptBytes: number }[]
    > = {};
    for (const [version, origin] of [
      ["baseline", "http://127.0.0.1:3001"],
      ["v3", "http://127.0.0.1:3000"],
    ]) {
      runs[version] = [];
      for (let i = 0; i < 3; i++) {
        const context = await browser.newContext({
          viewport: { width: 390, height: 844 },
          reducedMotion: "reduce",
        });
        const page = await context.newPage();
        await page.addInitScript(() => {
          const metric = { lcp: 0, cls: 0 };
          (
            window as unknown as { reviewMetrics: typeof metric }
          ).reviewMetrics = metric;
          new PerformanceObserver((list) => {
            for (const item of list.getEntries()) metric.lcp = item.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
          new PerformanceObserver((list) => {
            for (const item of list.getEntries() as (PerformanceEntry & {
              hadRecentInput: boolean;
              value: number;
            })[])
              if (!item.hadRecentInput) metric.cls += item.value;
          }).observe({ type: "layout-shift", buffered: true });
        });
        const client = await context.newCDPSession(page);
        await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await client.send("Network.enable");
        await client.send("Network.emulateNetworkConditions", {
          offline: false,
          latency: 100,
          downloadThroughput: 200000,
          uploadThroughput: 93750,
        });
        await page.goto(origin + route);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(2000);
        const metrics = await page.evaluate(() => ({
          ...(
            window as unknown as { reviewMetrics: { lcp: number; cls: number } }
          ).reviewMetrics,
          scriptBytes: performance
            .getEntriesByType("resource")
            .filter(
              (e) =>
                (e as PerformanceResourceTiming).initiatorType === "script",
            )
            .reduce(
              (n, e) => n + (e as PerformanceResourceTiming).encodedBodySize,
              0,
            ),
        }));
        expect(metrics.lcp).toBeGreaterThan(0);
        runs[version].push(metrics);
        await context.close();
      }
    }
    const median = (list: number[]) => list.sort((a, b) => a - b)[1];
    results[route] = Object.fromEntries(
      Object.entries(runs).map(([version, samples]) => [
        version,
        {
          lcpMs: Math.round(median(samples.map((s) => s.lcp))),
          cls: median(samples.map((s) => s.cls)),
          scriptBytes: median(samples.map((s) => s.scriptBytes)),
          samples,
        },
      ]),
    );
  }
  await fs.writeFile(
    info.outputPath("performance.json"),
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results));
});
