import { Page } from "@playwright/test";
import BasePage from "./BasePage";

const signInLink = "a.login";
const registerLink = "a.register";
const loggedAsUserLink = "div#loggedas a.user.active";
const myAccountLink = "div#loggedas a.my-account";
const logoutLink = "a.logout";

export class HeaderPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get signInLink() {
    return this.getElement(signInLink);
  }

  public async clickSignInLink(): Promise<void> {
    await this.click(signInLink);
  }

  public get loggedAsUserLink() {
    return this.getElement(loggedAsUserLink);
  }

  public async clickLoggedAsUserLink(): Promise<void> {
    await this.click(loggedAsUserLink);
  }

  public get myAccountLink() {
    return this.getElement(myAccountLink);
  }

  public async clickMyAccountLink(): Promise<void> {
    await this.click(myAccountLink);
  }

  public get logoutLink() {
    return this.getElement(logoutLink);
  }

  public async clickLogoutLink(): Promise<void> {
    await this.click(logoutLink);
  }

  public get registerLink() {
    return this.getElement(registerLink);
  }

  public async clickRegisterLink(): Promise<void> {
    await this.click(registerLink);
  }
}
