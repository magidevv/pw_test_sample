import { Locator, Page } from "@playwright/test";

class BasePage {
  public page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  // Navigation Methods
  public async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { timeout: 10000 });
  }

  public async navigateBack(): Promise<void> {
    await this.page.goBack();
  }

  public async refreshPage(): Promise<void> {
    await this.page.reload();
  }

  // Element Retrieval Methods
  public getElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  public getElementByText(selector: string, text: string): Locator {
    return this.getElement(selector).filter({ hasText: text });
  }

  // Interaction Methods
  public async click(selector: string): Promise<void> {
    await this.getElement(selector).click();
  }

  public async clickByText(selector: string, text: string): Promise<void> {
    await this.getElementByText(selector, text).click();
  }

  public async clickFirstEnabledElement(
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

  public async hover(selector: string, force = false): Promise<void> {
    await this.getElement(selector).hover({ force });
  }

  public async forceClick(selector: string): Promise<void> {
    await this.getElement(selector).click({ force: true });
  }

  public async doubleClick(selector: string): Promise<void> {
    await this.getElement(selector).click({ clickCount: 2 });
  }

  public async clickAtOffset(
    selector: string,
    offsetX: number,
    offsetY: number
  ): Promise<void> {
    const boundingBox = await this.getElement(selector).boundingBox();
    if (boundingBox) {
      await this.page.mouse.click(
        boundingBox.x + boundingBox.width / offsetX,
        boundingBox.y + boundingBox.height / offsetY
      );
    }
  }

  public async enterText(selector: string, text: string): Promise<void> {
    await this.getElement(selector).fill(text);
  }

  public async getTextContent(selector: string): Promise<string> {
    return (await this.getElement(selector).textContent()) ?? "";
  }

  public async clearTextField(selector: string): Promise<void> {
    await this.getElement(selector).clear();
  }

  public async uploadFile(selector: string, filePath: string): Promise<void> {
    await this.getElement(selector).setInputFiles(filePath);
  }

  // Validation Methods
  public async isVisible(selector: string): Promise<boolean> {
    return await this.getElement(selector).isVisible();
  }

  public async isHidden(selector: string): Promise<boolean> {
    return !(await this.getElement(selector).isVisible());
  }

  public async isEnabled(selector: string): Promise<boolean> {
    return await this.getElement(selector).isEnabled();
  }

  public async isDisabled(selector: string): Promise<boolean> {
    return !(await this.getElement(selector).isEnabled());
  }

  public async isChecked(selector: string): Promise<boolean> {
    return await this.getElement(selector).isChecked();
  }

  public async hasText(selector: string, text: string): Promise<boolean> {
    return (await this.getTextContent(selector)) === text;
  }

  // Utility Methods
  public async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  public async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("load");
  }

  public async acceptAlert(): Promise<void> {
    this.page.on("dialog", (dialog) => dialog.accept());
  }
}

export default BasePage;
