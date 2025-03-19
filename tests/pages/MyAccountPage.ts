import { Page } from "@playwright/test";
import BasePage from "./BasePage";

const USER_INFO = {
  avatar: "img.gravatar",
  firstName: "input#user_firstname",
  lastName: "input#user_lastname",
  email: "input#user_mail",
  irc: "input#user_custom_field_values_3",
};

const SIDEBAR = {
  username: "div#sidebar a.user.active",
  registrationDate: "div#sidebar",
}

export class MyAccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get avatar() {
    return this.getElement(USER_INFO.avatar);
  }

  public get firstName() {
    return this.getElement(USER_INFO.firstName);
  }

  public get lastName() {
    return this.getElement(USER_INFO.lastName);
  }

  public get email() {
    return this.getElement(USER_INFO.email);
  }

  public get irc() {
    return this.getElement(USER_INFO.irc);
  }

  public get username() {
    return this.getElement(SIDEBAR.username);
  }

  public async clickUsername(): Promise<void> {
    await this.click(SIDEBAR.username);
  }

  public get registrationDate() {
    return this.getElement(SIDEBAR.registrationDate);
  }
}
