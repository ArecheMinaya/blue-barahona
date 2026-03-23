import { expect, test } from "@playwright/test";

test("homepage and collection remain browseable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /The Ocean,/i })).toBeVisible();

  await page.getByRole("link", { name: /Discover the Collection/i }).click();
  await expect(page).toHaveURL(/\/collection/);
  await expect(page.getByRole("heading", { name: /The Collection/i })).toBeVisible();
});
