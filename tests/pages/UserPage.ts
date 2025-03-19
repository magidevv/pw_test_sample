import { Page } from "@playwright/test";
import BasePage from "./BasePage";

const USER_PROFILE = {
  name: "h2",
  avatar: "img.gravatar",
  username: "ul > li:nth-of-type(1)",
  email: "ul > li > a[href^='mailto:']",
  irc: "li.string_cf.cf_3",
  registrationDate: "ul > li:nth-of-type(4)",
  lastLogin: "ul > li:nth-of-type(5)",
};

export class UserPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get name() {
    return this.getElement(USER_PROFILE.name);
  }

  public get avatar() {
    return this.getElement(USER_PROFILE.avatar);
  }

  public get username() {
    return this.getElement(USER_PROFILE.username);
  }

  public get email() {
    return this.getElement(USER_PROFILE.email);
  }

  public get irc() {
    return this.getElement(USER_PROFILE.irc);
  }

  public get registrationDate() {
    return this.getElement(USER_PROFILE.registrationDate);
  }

  public get lastLogin() {
    return this.getElement(USER_PROFILE.lastLogin);
  }
}
