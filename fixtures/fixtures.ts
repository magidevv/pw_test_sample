import { test as base } from "@playwright/test";
import MainPage from "../tests/pages/MainPage";
import ProfilePage from "../tests/pages/ProfilePage";
import HeaderPage from "../tests/pages/HeaderPage";
import FooterPage from "../tests/pages/FooterPage";

type MyFixtures = {
  mainPage: MainPage;
  profilePage: ProfilePage;
  headerPage: HeaderPage;
  footerPage: FooterPage;
};

export const test = base.extend<MyFixtures>({
  mainPage: async ({ page }, use) => {
    await use(new MainPage(page));
  },
  headerPage: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },
  footerPage: async ({ page }, use) => {
    await use(new FooterPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  }
});
