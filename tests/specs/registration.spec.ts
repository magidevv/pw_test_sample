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
  // Open the main page
  test.beforeEach(async ({ mainPage }) => {
    await mainPage.navigateTo("");
  });

  test("should allow user to registrate with valid credentials", async ({
    page,
    headerPage,
    registerPage,
    loginPage,
  }) => {
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

    const userData = generateUser();

    await test.step("Fill registration form", async () => {
      test.info().attach("Generated User Data", {
        body: JSON.stringify(userData, null, 2),
        contentType: "application/json",
      });

      await registerPage.fillRegistrationForm(
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

  test("should show error message when 'Login' field is filled with invalid data", async ({
    page,
    headerPage,
    registerPage,
  }) => {
    await test.step("Click registration link", async () => {
      await headerPage.clickRegisterLink();
      await expect(page).toHaveURL(/\/account\/register/);
    });

    const userData = generateUser();

    await test.step("Fill all fields except the 'Login' field with valid data", async () => {
      await registerPage.fillRegistrationForm(
        "",
        userData.password,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.email,
        true,
        "",
        "",
        ""
      );
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.blankLogin
      );
    });

    await test.step("Verify 'Login' field and its label are highlighted in red", async () => {
      await expect(registerPage.loginLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.loginField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });

    await test.step("Fill 'Password' and 'Confirmation' fields with valid data and 'Login' field with long string", async () => {
      await registerPage.fillPasswordField(userData.password);
      await registerPage.fillPasswordConfirmationField(userData.password);
      await registerPage.fillLoginField(randomString(61));
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.longLogin
      );
    });

    await test.step("Verify 'Login' field and its label are highlighted in red", async () => {
      await expect(registerPage.loginLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.loginField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });

    await test.step("Fill 'Password' and 'Confirmation' fields with valid data and 'Login' field with symbols", async () => {
      await registerPage.fillPasswordField(userData.password);
      await registerPage.fillPasswordConfirmationField(userData.password);
      await registerPage.fillLoginField(randomSymbols(5));
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.invalidLogin
      );
    });

    await test.step("Verify 'Login' field and its label are highlighted in red", async () => {
      await expect(registerPage.loginLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.loginField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });

    await test.step("Fill 'Password' and 'Confirmation' fields with valid data and 'Login' field with spaces", async () => {
      await registerPage.fillPasswordField(userData.password);
      await registerPage.fillPasswordConfirmationField(userData.password);
      await registerPage.fillLoginField("     ");
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error messages", async () => {
      const errors = await registerPage.errorMessage.all();

      for (const error of errors) {
        await expect(error).toBeVisible();
      }

      await expect(registerPage.errorMessage).toHaveText([
        errorMessages.en.blankLogin,
        errorMessages.en.invalidLogin,
      ]);
    });

    await test.step("Verify 'Login' field and its label are highlighted in red", async () => {
      await expect(registerPage.loginLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.loginField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });

    await test.step("Fill 'Password' and 'Confirmation' fields with valid data and 'Login' field with leading/trailing spaces", async () => {
      await registerPage.fillPasswordField(userData.password);
      await registerPage.fillPasswordConfirmationField(userData.password);
      await registerPage.fillLoginField(" " + userData.login + " ");
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.invalidLogin
      );
    });

    await test.step("Verify 'Login' field and its label are highlighted in red", async () => {
      await expect(registerPage.loginLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.loginField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });
  });

  test("should show error message when 'Password' field is filled with invalid data", async ({
    page,
    headerPage,
    registerPage,
  }) => {
    await test.step("Click registration link", async () => {
      await headerPage.clickRegisterLink();
      await expect(page).toHaveURL(/\/account\/register/);
    });

    const userData = generateUser();

    await test.step("Fill all fields except the 'Password' field with valid data", async () => {
      await registerPage.fillRegistrationForm(
        userData.login,
        "",
        "",
        userData.firstName,
        userData.lastName,
        userData.email,
        true,
        "",
        "",
        ""
      );
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.shortPassword
      );
    });

    await test.step("Verify 'Password' field and its label are highlighted in red", async () => {
      await expect(registerPage.passwordLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.passwordField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });

    await test.step("Fill 'Confirmation' field with valid data and 'Password' field with short string", async () => {
      const shortPassword = randomString(7);
      await registerPage.fillPasswordConfirmationField(shortPassword);
      await registerPage.fillPasswordField(shortPassword);
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.shortPassword
      );
    });

    await test.step("Verify 'Password' field and its label are highlighted in red", async () => {
      await expect(registerPage.passwordLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.passwordField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });
  });

  test("should show error message when 'Confirmation' field does not match the password", async ({
    page,
    headerPage,
    registerPage,
  }) => {
    await test.step("Click registration link", async () => {
      await headerPage.clickRegisterLink();
      await expect(page).toHaveURL(/\/account\/register/);
    });

    const userData = generateUser();

    await test.step("Fill all fields except the 'Confirmation' field with valid data", async () => {
      await registerPage.fillRegistrationForm(
        userData.login,
        userData.password,
        "",
        userData.firstName,
        userData.lastName,
        userData.email,
        true,
        "",
        "",
        ""
      );
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.confirmationMismatch
      );
    });

    await test.step("Verify 'Password' field and its label are highlighted in red", async () => {
      await expect(registerPage.passwordLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.passwordField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });

    await test.step("Fill 'Password' and 'Confirmation' fields with different data", async () => {
      await registerPage.fillPasswordField(userData.password);
      await registerPage.fillPasswordConfirmationField(randomString(10));
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.confirmationMismatch
      );
    });

    await test.step("Verify 'Password' field and its label are highlighted in red", async () => {
      await expect(registerPage.passwordLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.passwordField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });
  });

  test("should show error message when 'First name' field is filled with invalid data", async ({
    page,
    headerPage,
    registerPage,
  }) => {
    await test.step("Click registration link", async () => {
      await headerPage.clickRegisterLink();
      await expect(page).toHaveURL(/\/account\/register/);
    });

    const userData = generateUser();

    await test.step("Fill all fields except the 'First name' field with valid data", async () => {
      await registerPage.fillRegistrationForm(
        userData.login,
        userData.password,
        userData.password,
        "",
        userData.lastName,
        userData.email,
        true,
        "",
        "",
        ""
      );
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.blankFirstName
      );
    });

    await test.step("Verify 'First name' field and its label are highlighted in red", async () => {
      await expect(registerPage.firstNameLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.firstNameField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });

    await test.step("Fill 'Password' and 'Confirmation' fields with valid data and 'First name' field with long string", async () => {
      await registerPage.fillPasswordField(userData.password);
      await registerPage.fillPasswordConfirmationField(userData.password);
      await registerPage.fillFirstNameField(randomString(31));
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.longFirstName
      );
    });

    await test.step("Verify 'First name' field and its label are highlighted in red", async () => {
      await expect(registerPage.firstNameLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.firstNameField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });

    await test.step("Fill 'Password' and 'Confirmation' fields with valid data and 'First name' field with spaces", async () => {
      await registerPage.fillPasswordField(userData.password);
      await registerPage.fillPasswordConfirmationField(userData.password);
      await registerPage.fillFirstNameField("     ");
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.blankFirstName
      );
    });

    await test.step("Verify 'First name' field and its label are highlighted in red", async () => {
      await expect(registerPage.firstNameLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.firstNameField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });
  });

  test("should show error message when 'Last name' field is filled with invalid data", async ({
    page,
    headerPage,
    registerPage,
  }) => {
    await test.step("Click registration link", async () => {
      await headerPage.clickRegisterLink();
      await expect(page).toHaveURL(/\/account\/register/);
    });

    const userData = generateUser();

    await test.step("Fill all fields except the 'Last name' field with valid data", async () => {
      await registerPage.fillRegistrationForm(
        userData.login,
        userData.password,
        userData.password,
        userData.firstName,
        "",
        userData.email,
        true,
        "",
        "",
        ""
      );
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.blankLastName
      );
    });

    await test.step("Verify 'Last name' field and its label are highlighted in red", async () => {
      await expect(registerPage.lastNameLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.lastNameField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });

    await test.step("Fill 'Password' and 'Confirmation' fields with valid data and 'Last name' field with long string", async () => {
      await registerPage.fillPasswordField(userData.password);
      await registerPage.fillPasswordConfirmationField(userData.password);
      await registerPage.fillLastNameField(randomString(31));
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.longLastName
      );
    });

    await test.step("Verify 'Last name' field and its label are highlighted in red", async () => {
      await expect(registerPage.lastNameLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.lastNameField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });

    await test.step("Fill 'Password' and 'Confirmation' fields with valid data and 'Last name' field with spaces", async () => {
      await registerPage.fillPasswordField(userData.password);
      await registerPage.fillPasswordConfirmationField(userData.password);
      await registerPage.fillLastNameField("     ");
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.blankLastName
      );
    });

    await test.step("Verify 'Last name' field and its label are highlighted in red", async () => {
      await expect(registerPage.lastNameLabel).toHaveCSS(
        "color",
        "rgb(187, 0, 0)"
      );
      await expect(registerPage.lastNameField).toHaveCSS(
        "border-color",
        "rgb(187, 0, 0)"
      );
    });
  });

  test("should show error message when 'Email' field is filled with invalid data", async ({
    page,
    headerPage,
    registerPage,
  }) => {
    await test.step("Click registration link", async () => {
      await headerPage.clickRegisterLink();
      await expect(page).toHaveURL(/\/account\/register/);
    });

    const userData = generateUser();

    await test.step("Fill all fields except the 'Email' field with valid data", async () => {
      await registerPage.fillRegistrationForm(
        userData.login,
        userData.password,
        userData.password,
        userData.firstName,
        userData.lastName,
        "",
        true,
        "",
        "",
        ""
      );
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.blankEmail
      );
    });

    await test.step("Fill 'Password' and 'Confirmation' fields with valid data and 'Email' field with long string", async () => {
      await registerPage.fillPasswordField(userData.password);
      await registerPage.fillPasswordConfirmationField(userData.password);
      await registerPage.fillEmailField(randomString(61) + "@domain.com");
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.longEmail
      );
    });

    for (const invalidEmail of invalidEmailFormats) {
      await test.step("Fill 'Password' and 'Confirmation' fields with valid data and 'Email' field with invalid email formats", async () => {
        await registerPage.fillPasswordField(userData.password);
        await registerPage.fillPasswordConfirmationField(userData.password);
        await registerPage.fillEmailField(invalidEmail);
      });

      await test.step("Submit registration form", async () => {
        await registerPage.clickSubmitButton();
      });

      await test.step("Verify error message", async () => {
        await expect(registerPage.errorMessage).toBeVisible();
        await expect(registerPage.errorMessage).toHaveText(
          errorMessages.en.invalidEmail
        );
      });
    }

    await test.step("Fill 'Password' and 'Confirmation' fields with valid data and 'Email' field with spaces", async () => {
      await registerPage.fillPasswordField(userData.password);
      await registerPage.fillPasswordConfirmationField(userData.password);
      await registerPage.fillEmailField("     ");
    });

    await test.step("Submit registration form", async () => {
      await registerPage.clickSubmitButton();
    });

    await test.step("Verify error message", async () => {
      await expect(registerPage.errorMessage).toBeVisible();
      await expect(registerPage.errorMessage).toHaveText(
        errorMessages.en.blankEmail
      );
    });
  });
});
