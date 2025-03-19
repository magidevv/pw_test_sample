import { test } from "../../fixtures/fixtures";
import { expect } from "@playwright/test";
import { errorMessages } from "../../utils/messages";

test.describe("Login functionality", () => {
  // Open the main page
  test.beforeEach(async ({ mainPage }) => {
    await mainPage.navigateTo("");
  });

  test("should allow user to login with valid credentials", async ({
    page,
    headerPage,
    loginPage,
  }) => {
    await test.step("Verify login link is visible", async () => {
      await expect(headerPage.signInLink).toBeVisible();
    });

    await test.step("Click login link", async () => {
      await headerPage.clickSignInLink();
      await expect(page).toHaveURL(/\/login$/);
    });

    await test.step("Verify login form elements are visible", async () => {
      await expect(loginPage.usernameField).toBeVisible();
      await expect(loginPage.passwordField).toBeVisible();
      await expect(loginPage.autologinCheckbox).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
    });

    await test.step("Fill login form", async () => {
      await loginPage.fillLoginForm(
        process.env.TEST_USER ?? "",
        process.env.TEST_PASSWORD ?? ""
      );
      await loginPage.clickLoginButton();
    });

    await test.step("Submit login form", async () => {
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

  test("should show error message when login fields are empty", async ({
    page,
    headerPage,
    loginPage,
  }) => {
    await test.step("Click login link", async () => {
      await headerPage.clickSignInLink();
      await expect(page).toHaveURL(/\/login$/);
    });

    await test.step("Submit login form", async () => {
      await loginPage.clickLoginButton();
    });

    await test.step("Verify error message", async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(
        errorMessages.en.invalidCredentials
      );
    });
  });

  // Logout if user is logged in
  test.afterEach(async ({ headerPage, page }) => {
    if (await headerPage.logoutLink.isVisible()) {
      await headerPage.clickLogoutLink();
      await expect(page).toHaveURL(process.env.BASE_URL ?? "");
      await expect(headerPage.signInLink).toBeVisible();
    }
  });
});
