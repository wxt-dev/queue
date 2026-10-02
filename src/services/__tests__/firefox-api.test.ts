import { afterAll, beforeEach, describe, expect, it, spyOn } from "bun:test";

import { createFirefoxApi } from "../firefox-api";

const fetchSpy = spyOn(globalThis, "fetch");

const addonResponse = (overrides: Record<string, unknown> = {}) => ({
  id: 123,
  slug: "example-addon",
  guid: "example-addon@example.com",
  icon_url: "https://addons.mozilla.org/user-media/addon_icons/0/123-64.png",
  last_updated: "2026-09-30T00:00:00Z",
  description: { "en-US": "Long description" },
  name: { "en-US": "Example Addon" },
  summary: { "en-US": "Short description" },
  ratings: { average: 5, bayesian_average: 5, count: 1, text_count: 1 },
  url: "https://addons.mozilla.org/en-US/firefox/addon/example-addon/",
  current_version: { version: "1.0.0" },
  average_daily_users: 3,
  previews: [],
  ...overrides,
});

describe("Firefox API", () => {
  beforeEach(() => {
    fetchSpy.mockReset();
  });

  afterAll(() => {
    fetchSpy.mockRestore();
  });

  it("should return the first localized value for each text field", async () => {
    fetchSpy.mockResolvedValue(Response.json(addonResponse()));

    const addon = await createFirefoxApi().getAddon("example-addon");

    expect(addon.name).toBe("Example Addon");
    expect(addon.shortDescription).toBe("Short description");
    expect(addon.longDescription).toBe("Long description");
  });

  // AMO returns `null` instead of a locale map when the listing leaves a field empty
  it("should return an empty string when a localized field is null", async () => {
    fetchSpy.mockResolvedValue(Response.json(addonResponse({ description: null, summary: null })));

    const addon = await createFirefoxApi().getAddon("example-addon");

    expect(addon.name).toBe("Example Addon");
    expect(addon.shortDescription).toBe("");
    expect(addon.longDescription).toBe("");
  });
});
