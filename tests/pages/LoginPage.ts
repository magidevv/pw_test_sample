import { Page } from "@playwright/test";
import BasePage from "./BasePage";

const LOGIN_FORM = {
  username: "#username",
  password: "#password",
  autologin: "#autologin",
  loginButton: "#login-submit",
  forgotPasswordLink: "a.lost_password",
};

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get username() {
    return this.getElement(LOGIN_FORM.username);
  }

  public get password() {
    return this.getElement(LOGIN_FORM.password);
  }

  public get autologin() {
    return this.getElement(LOGIN_FORM.autologin);
  }

  public get loginButton() {
    return this.getElement(LOGIN_FORM.loginButton);
  }

  public get forgotPasswordLink() {
    return this.getElement(LOGIN_FORM.forgotPasswordLink);
  }

  public async fillLoginForm(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
  }
  
  public async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }
}
