import { Page } from "@playwright/test";
import BasePage from "./BasePage";

export class MyAccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}
