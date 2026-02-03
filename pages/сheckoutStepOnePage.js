export class CheckoutStepOnePage {
  constructor(page) {
    this.page = page;
    this.inputFirstName = page.locator('[data-test="firstName"]');
    this.inputLastName = page.locator('[data-test="lastName"]');
    this.inputIndex = page.locator('[data-test="postalCode"]');
    this.continueBtn = page.locator('[data-test="continue"]');
    this.cancelBtn = page.locator('[data-test="cancel"]');
    //this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillUserInfo(firstName, lastName, postalCode) {
    await this.inputFirstName.fill(firstName);
    await this.inputLastName.fill(lastName);
    await this.inputIndex.fill(postalCode);
  }

  async continue() {
    await this.continueBtn.click();
  }

  async cancel() {
    await this.cancelBtn.click();
  }
}
