export class LoginPage {
  constructor(page) {
    this.page = page;
    this.userName = page.locator('#user-name');
    this.password = page.locator('[placeholder="Password"]');
    this.loginBtn = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }
  async open() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username, password) {
    await this.userName.fill(username);
    await this.password.fill(password);
    await this.loginBtn.click();
  }
}
