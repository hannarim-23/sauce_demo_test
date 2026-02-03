export class CheckoutCompletePage {
  constructor(page) {
    this.page = page;
    this.completionMessage = page.locator('.complete-header');
    this.completionText = page.locator('.complete-text');
    this.backHomeBtn = page.locator('[data-test="back-to-products"]');
  }
  async getCompletionMessage() {
    return await this.completionMessage.textContent();
  }
  async getCompletionText() {
    return await this.completionText.textContent();
  }
  async backToHome() {
    await this.backHomeBtn.click();
    await this.page.goto('https://www.saucedemo.com/');
  }
}
