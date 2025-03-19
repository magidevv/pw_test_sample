import { test } from "../../fixtures/fixtures";
import { expect } from "@playwright/test";
import { errorMessages } from "../../utils/messages";

test.describe("Login functionality", () => {
  // Fill the login form with valid data
  const fillValidLoginForm = async (page: any) => {
    await page.fillLoginForm(
      process.env.TEST_USER ?? "",
      process.env.TEST_PASSWORD ?? ""
    );
  };

  test("should allow user to login with valid credentials", async ({
    page,
    headerPage,
    loginPage,
  }) => {
    // Open the main page
    await headerPage.navigateTo("");

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

    await test.step("Verify successful login", async () => {
      await fillValidLoginForm(loginPage);
      await loginPage.clickLoginButton();

      await expect(page).toHaveURL(process.env.BASE_URL ?? "");
      await expect(headerPage.loggedAsUserLink).toBeVisible();
      await expect(headerPage.loggedAsUserLink).toContainText(
        process.env.TEST_USER ?? ""
      );
    });
  });

  test("should show error message when login fields are empty", async ({
    loginPage,
  }) => {
    await test.step("Open login page", async () => {
      await loginPage.navigateTo("login");
    });

    await test.step("Verify error message when login fields are empty", async () => {
      await loginPage.clickLoginButton();
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
