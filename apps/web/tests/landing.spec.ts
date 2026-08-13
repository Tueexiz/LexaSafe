import { test, expect } from "@playwright/test";

test("landing page loads with hero CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Sécurisez/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Demander une démo/i }).first()).toBeVisible();
});

test("404 page renders", async ({ page }) => {
  await page.goto("/page-inexistante");
  await expect(page.getByText("404")).toBeVisible();
});

test("demo form has required fields", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByLabel("Entreprise")).toBeVisible();
  await expect(page.getByLabel(/SIREN/i)).toBeVisible();
});
