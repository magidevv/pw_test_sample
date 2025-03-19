import { Page } from "@playwright/test";
import BasePage from "./BasePage";

const LOGIN_FORM = {
  usernameField: "#username",
  passwordField: "#password",
  autologinCheckbox: "#autologin",
  loginButton: "#login-submit",
  forgotPasswordLink: "a.lost_password",
};

const LOGIN_MESSAGES = {
  errorMessage: "div#flash_error",
  successMessage: "div#flash_notice",
}

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get usernameField() {
    return this.getElement(LOGIN_FORM.usernameField);
  }

  public get passwordField() {
    return this.getElement(LOGIN_FORM.passwordField);
  }

  public get autologinCheckbox() {
    return this.getElement(LOGIN_FORM.autologinCheckbox);
  }

  public get loginButton() {
    return this.getElement(LOGIN_FORM.loginButton);
  }

  public get forgotPasswordLink() {
    return this.getElement(LOGIN_FORM.forgotPasswordLink);
  }

  public async fillLoginForm(
    username: string,
    password: string
  ): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
  }

  public async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  public get errorMessage() {
    return this.getElement(LOGIN_MESSAGES.errorMessage);
  }

  public get successMessage() {
    return this.getElement(LOGIN_MESSAGES.successMessage);
  }
}
