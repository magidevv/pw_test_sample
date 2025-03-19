import { test } from "../../fixtures/fixtures";
import { expect } from "@playwright/test";
import {
  generateUser,
  randomString,
  randomSymbols,
} from "../../helpers/randomData";
import { messages, errorMessages } from "../../utils/messages";
import { invalidEmailFormats } from "../../utils/data";

test.describe("Registration functionality", () => {
  let userData: ReturnType<typeof generateUser>; // User data

  // Fill the registration form with valid data
  const fillValidRegistrationForm = async (page: any) => {
    await page.fillRegistrationForm(
      userData.login,
      userData.password,
      userData.password,
      userData.firstName,
      userData.lastName,
      userData.email,
      true,
      userData.organization,
      userData.location,
      userData.irc
    );
  };

  test("should allow user to registrate with valid credentials", async ({
    page,
    headerPage,
    registerPage,
    loginPage,
  }) => {
    await headerPage.navigateTo(""); // Open the main page

    await test.step("Verify registration link is visible", async () => {
      await expect(headerPage.registerLink).toBeVisible();
    });

    await test.step("Click registration link", async () => {
      await headerPage.clickRegisterLink();
      await expect(page).toHaveURL(/\/account\/register/);
    });

    await test.step("Verify registration form elements are visible", async () => {
      await expect(registerPage.loginField).toBeVisible();
      await expect(registerPage.passwordField).toBeVisible();
      await expect(registerPage.passwordConfirmationField).toBeVisible();
      await expect(registerPage.firstNameField).toBeVisible();
      await expect(registerPage.lastNameField).toBeVisible();
      await expect(registerPage.emailField).toBeVisible();
      await expect(registerPage.hideEmailCheckbox).toBeVisible();
      await expect(registerPage.languageSelector).toBeVisible();
      await expect(registerPage.organizationField).toBeVisible();
      await expect(registerPage.locationField).toBeVisible();
      await expect(registerPage.ircField).toBeVisible();
      await expect(registerPage.submitButton).toBeVisible();
    });

    await test.step("Verify selected language", async () => {
      await expect(registerPage.languageSelector).toHaveValue("en");
    });

    userData = generateUser(); // Generate new user data

    await test.step("Fill registration form", async () => {
      test.info().attach("Generated User Data", {
        body: JSON.stringify(userData, null, 2),
        contentType: "application/json",
      });

      await fillValidRegistrationForm(registerPage);
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify successful registration", async () => {
      await expect(page).toHaveURL(/\/login$/);
      await expect(loginPage.successMessage).toBeVisible();
      await expect(loginPage.successMessage).toHaveText(
        messages.en.successfulRegistration + userData.email + "."
      );
    });
  });

  test.describe("Registration with invalid data", () => {
    test.beforeEach(async ({ registerPage }) => {
      await registerPage.navigateTo("account/register"); // Open the registration page
      userData = generateUser(); // Generate new user data for each test
      await fillValidRegistrationForm(registerPage); // Fill the registration form with valid data
    });

    const fillPasswordFields = async (page: any) => {
      await page.fillPasswordField(userData.password);
      await page.fillPasswordConfirmationField(userData.password);
    };

    const redColor = "rgb(187, 0, 0)";

    test("should show error message when 'Login' field is filled with invalid data", async ({
      registerPage,
    }) => {
      await test.step("Verify error message when 'Login' field is empty", async () => {
        await registerPage.fillLoginField("");
        await registerPage.clickSubmitButton();

        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.blankLogin
        );
        await expect(registerPage.loginLabel).toHaveCSS("color", redColor);
        await expect(registerPage.loginField).toHaveCSS(
          "border-color",
          redColor
        );
      });

      await test.step("Verify error message when login is too long", async () => {
        await fillPasswordFields(registerPage);
        await registerPage.fillLoginField(randomString(61));
        await registerPage.clickSubmitButton();

        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.longLogin
        );
        await expect(registerPage.loginLabel).toHaveCSS("color", redColor);
        await expect(registerPage.loginField).toHaveCSS(
          "border-color",
          redColor
        );
      });

      await test.step("Verify error message when login contains symbols", async () => {
        await fillPasswordFields(registerPage);
        await registerPage.fillLoginField(randomSymbols(5));
        await registerPage.clickSubmitButton();

        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.invalidLogin
        );
        await expect(registerPage.loginLabel).toHaveCSS("color", redColor);
        await expect(registerPage.loginField).toHaveCSS(
          "border-color",
          redColor
        );
      });

      await test.step("Verify multiple error messages when login contains only spaces", async () => {
        await fillPasswordFields(registerPage);
        await registerPage.fillLoginField("     ");
        await registerPage.clickSubmitButton();

        const errors = await registerPage.errorMessage.all();
        for (const error of errors) {
          await expect(error).toBeVisible();
        }

        await expect(registerPage.errorMessage).toHaveText([
          errorMessages.en.blankLogin,
          errorMessages.en.invalidLogin,
        ]);
        await expect(registerPage.loginLabel).toHaveCSS("color", redColor);
        await expect(registerPage.loginField).toHaveCSS(
          "border-color",
          redColor
        );
      });

      await test.step("Verify error message when login has leading/trailing spaces", async () => {
        await fillPasswordFields(registerPage);
        await registerPage.fillLoginField(" " + userData.login + " ");
        await registerPage.clickSubmitButton();

        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.invalidLogin
        );
        await expect(registerPage.loginLabel).toHaveCSS("color", redColor);
        await expect(registerPage.loginField).toHaveCSS(
          "border-color",
          redColor
        );
      });
    });

    test("should show error message when 'Password' field is filled with invalid data", async ({
      registerPage,
    }) => {
      await test.step("Verify error message when 'Password' and 'Confirmartion' fields are empty", async () => {
        await registerPage.fillPasswordField("");
        await registerPage.fillPasswordConfirmationField("");
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.shortPassword
        );
        await expect(registerPage.passwordLabel).toHaveCSS("color", redColor);
        await expect(registerPage.passwordField).toHaveCSS(
          "border-color",
          redColor
        );
      });

      await test.step("Verify error message when password is too short", async () => {
        const shortPassword = randomString(7);
        await registerPage.fillPasswordConfirmationField(shortPassword);
        await registerPage.fillPasswordField(shortPassword);
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.shortPassword
        );
        await expect(registerPage.passwordLabel).toHaveCSS("color", redColor);
        await expect(registerPage.passwordField).toHaveCSS(
          "border-color",
          redColor
        );
      });
    });

    test("should show error message when 'Confirmation' field does not match the password", async ({
      registerPage,
    }) => {
      await test.step("Verify error message when password and confirmation password are different", async () => {
        await registerPage.fillPasswordField(userData.password);
        await registerPage.fillPasswordConfirmationField(randomString(10));
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.confirmationMismatch
        );
        await expect(registerPage.passwordLabel).toHaveCSS("color", redColor);
        await expect(registerPage.passwordField).toHaveCSS(
          "border-color",
          redColor
        );
      });
    });

    test("should show error message when 'First name' field is filled with invalid data", async ({
      registerPage,
    }) => {
      await test.step("Verify error message when 'First name' field is empty", async () => {
        await registerPage.fillFirstNameField("");
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.blankFirstName
        );
        await expect(registerPage.firstNameLabel).toHaveCSS("color", redColor);
        await expect(registerPage.firstNameField).toHaveCSS(
          "border-color",
          redColor
        );
      });

      await test.step("Verify error message when first name is too long", async () => {
        await fillPasswordFields(registerPage);
        await registerPage.fillFirstNameField(randomString(31));
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.longFirstName
        );
        await expect(registerPage.firstNameLabel).toHaveCSS("color", redColor);
        await expect(registerPage.firstNameField).toHaveCSS(
          "border-color",
          redColor
        );
      });

      await test.step("Verify error message when first name contains only spaces", async () => {
        await fillPasswordFields(registerPage);
        await registerPage.fillFirstNameField("     ");
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.blankFirstName
        );
        await expect(registerPage.firstNameLabel).toHaveCSS("color", redColor);
        await expect(registerPage.firstNameField).toHaveCSS(
          "border-color",
          redColor
        );
      });
    });

    test("should show error message when 'Last name' field is filled with invalid data", async ({
      registerPage,
    }) => {
      await test.step("Verify error message when 'Last name' field is empty", async () => {
        await registerPage.fillLastNameField("");
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.blankLastName
        );
        await expect(registerPage.lastNameLabel).toHaveCSS("color", redColor);
        await expect(registerPage.lastNameField).toHaveCSS(
          "border-color",
          redColor
        );
      });

      await test.step("Verify error message when last name is too long", async () => {
        await fillPasswordFields(registerPage);
        await registerPage.fillLastNameField(randomString(31));
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.longLastName
        );
        await expect(registerPage.lastNameLabel).toHaveCSS("color", redColor);
        await expect(registerPage.lastNameField).toHaveCSS(
          "border-color",
          redColor
        );
      });

      await test.step("Verify error message when last name contains only spaces", async () => {
        await fillPasswordFields(registerPage);
        await registerPage.fillLastNameField("     ");
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.blankLastName
        );
        await expect(registerPage.lastNameLabel).toHaveCSS("color", redColor);
        await expect(registerPage.lastNameField).toHaveCSS(
          "border-color",
          redColor
        );
      });
    });

    test("should show error message when 'Email' field is filled with invalid data", async ({
      registerPage,
    }) => {
      await test.step("Verify error when 'Email' field is empty", async () => {
        await registerPage.fillEmailField("");
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.blankEmail
        );
      });

      await test.step("Verify error when email is too long", async () => {
        await registerPage.fillEmailField(randomString(61) + "@domain.com");
        await fillPasswordFields(registerPage);
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.longEmail
        );
      });

      for (const invalidEmail of invalidEmailFormats) {
        await test.step(`Verify error when email has invalid format: ${invalidEmail}`, async () => {
          await registerPage.fillEmailField(invalidEmail);
          await fillPasswordFields(registerPage);
          await registerPage.clickSubmitButton();
          await expect(registerPage.errorMessage).toBeVisible();
          await expect(registerPage.errorMessage).toHaveText(
            errorMessages.en.invalidEmail
          );
        });
      }

      await test.step("Verify error when email contains only spaces", async () => {
        await registerPage.fillEmailField("     ");
        await fillPasswordFields(registerPage);
        await registerPage.clickSubmitButton();
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.blankEmail
        );
      });
    });
  });
});
