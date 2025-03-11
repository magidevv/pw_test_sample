import { test as base } from "@playwright/test";
import { HeaderPage } from "../tests/pages/HeaderPage";
import { MainPage } from "../tests/pages/MainPage";
import { LoginPage } from "../tests/pages/LoginPage";
import { UserPage } from "../tests/pages/UserPage";
import { MyAccountPage } from "../tests/pages/MyAccountPage";
import { RegisterPage } from "../tests/pages/RegisterPage";

type MyFixtures = {
  headerPage: HeaderPage;
  mainPage: MainPage;
  loginPage: LoginPage;
  userPage: UserPage;
  myAccountPage: MyAccountPage;
  registerPage: RegisterPage;
};

export const test = base.extend<MyFixtures>({
  headerPage: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },
  mainPage: async ({ page }, use) => {
    await use(new MainPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  userPage: async ({ page }, use) => {
    await use(new UserPage(page));
  },
  myAccountPage: async ({ page }, use) => {
    await use(new MyAccountPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
});
