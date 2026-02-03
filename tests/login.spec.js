import { test, expect } from '@playwright/test';

test.describe('Авторизация на Sauce Demo  @ui', () => {
  test('Пользователь должен успешно войти в систему', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('standard_user');

    await page.locator('[placeholder="Password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});

test.describe('НЕ УСПЕШНАЯ Авторизация на Sauce Demo @ui', () => {
  test('Пользователь должен НЕ успешно войти в систему', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('#user-name').fill('locked_out_user');

    await page.locator('[placeholder="Password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await expect(page).not.toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });
});
