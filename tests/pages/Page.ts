import { expect, Locator, Page } from "@playwright/test";

class BasePage {
  public page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  // Navigation Methods
  public async goTo(url: string): Promise<void> {
    await this.page.goto(url, { timeout: 10000 });
  }

  public async goBack(): Promise<void> {
    await this.page.goBack();
  }

  public async reloadPage(): Promise<void> {
    await this.page.reload();
  }

  public getCurrentURL(): string {
    return this.page.url();
  }

  // Element Retrieval Methods
  public getElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  public getElementByText(selector: string, text: string): Locator {
    return this.getElement(selector).filter({ hasText: text });
  }

  // Interaction Methods
  public async clickElement(selector: string): Promise<void> {
    await this.getElement(selector).click();
  }

  public async clickElementByText(
    selector: string,
    text: string
  ): Promise<void> {
    await this.getElementByText(selector, text).click();
  }

  public async clickFirstAvailableElement(
    selector: string,
    text: string
  ): Promise<void> {
    const elements = await this.getElementByText(selector, text).all();
    for (const element of elements) {
      if ((await element.getAttribute("aria-disabled")) === "false") {
        await element.click();
        return;
      }
    }
  }

  public async hoverOverElement(
    selector: string,
    force = false
  ): Promise<void> {
    await this.getElement(selector).hover({ force });
  }

  public async forceClickElement(selector: string): Promise<void> {
    await this.getElement(selector).click({ force: true });
  }

  public async doubleClickElement(selector: string): Promise<void> {
    await this.getElement(selector).click({ clickCount: 2 });
  }

  public async clickAtCoordinates(
    selector: string,
    divX: number,
    divY: number
  ): Promise<void> {
    const boundingBox = await this.getElement(selector).boundingBox();
    if (boundingBox) {
      await this.page.mouse.click(
        boundingBox.x + boundingBox.width / divX,
        boundingBox.y + boundingBox.height / divY
      );
    }
  }

  public async typeIntoElement(selector: string, text: string): Promise<void> {
    await this.getElement(selector).fill(text);
  }

  public async clearInputField(selector: string): Promise<void> {
    await this.getElement(selector).clear();
  }

  public async uploadFile(selector: string, filePath: string): Promise<void> {
    await this.getElement(selector).setInputFiles(filePath);
  }

  // Validation Methods
  public async verifyPageURL(expectedURL: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedURL);
  }

  public async verifyElementVisibility(
    selector: string,
    isVisible = true,
    timeout = 5000
  ): Promise<void> {
    const assertion = expect(this.getElement(selector));
    isVisible
      ? await assertion.toBeVisible({ timeout })
      : await assertion.not.toBeVisible({ timeout });
  }

  public async verifyElementText(
    selector: string,
    expectedText: string | RegExp,
    shouldContain = true
  ): Promise<void> {
    const assertion = expect(this.getElement(selector));
    shouldContain
      ? await assertion.toHaveText(expectedText)
      : await assertion.not.toHaveText(expectedText);
  }

  public async verifyElementAttribute(
    selector: string,
    attribute: string,
    value: string | RegExp
  ): Promise<void> {
    await expect(this.getElement(selector)).toHaveAttribute(attribute, value);
  }

  public async assertElementsContainText(
    selector: string,
    text: string
  ): Promise<void> {
    const elements = await this.getElement(selector)
      .filter({ hasText: text })
      .all();
    for (const element of elements) {
      await expect(element).toBeVisible();
      await expect(element).toContainText(text);
    }
  }

  // Utility Methods
  public async pause(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  public async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("load");
  }

  public async acceptModalDialog(): Promise<void> {
    this.page.on("dialog", (dialog) => dialog.accept());
  }
}

export default BasePage;