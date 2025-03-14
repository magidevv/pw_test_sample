import { test } from "../../fixtures/fixtures";
import { expect } from "@playwright/test";

test.describe("Login functionality", () => {
  test.beforeEach(async ({ mainPage }) => {
    await test.step("Navigate to the main page", async () => {
      await mainPage.navigateTo("");
    });
  });

  test("should allow user to login with valid credentials", async ({
    page,
    headerPage,
    loginPage,
  }) => {
    await test.step("Verify login link is visible", async () => {
      await expect(headerPage.loginLink).toBeVisible();
    });

    await test.step("Click login link", async () => {
      await headerPage.clickLoginLink();
      await expect(page).toHaveURL(/\/login$/);
    });

    await test.step("Verify login form elements are visible", async () => {
      await expect(loginPage.username).toBeVisible();
      await expect(loginPage.password).toBeVisible();
      await expect(loginPage.autologin).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
    });

    await test.step("Fill and submit login form", async () => {
      await loginPage.fillLoginForm(
        process.env.TEST_USER ?? "",
        process.env.TEST_PASSWORD ?? ""
      );
      await loginPage.clickLoginButton();
    });

    await test.step("Verify successful login", async () => {
      await expect(page).toHaveURL(process.env.BASE_URL ?? "");
      await expect(headerPage.loggedAsUserLink).toBeVisible();
      await expect(headerPage.loggedAsUserLink).toContainText(
        process.env.TEST_USER ?? ""
      );
    });
  });

  test.afterEach(async ({ headerPage, page }) => {
    await test.step("Logout if user is logged in", async () => {
      if (await headerPage.logoutLink.isVisible()) {
        await headerPage.clickLogoutLink();
        await expect(page).toHaveURL(process.env.BASE_URL ?? "");
        await expect(headerPage.loginLink).toBeVisible();
      }
    });
  });
});
