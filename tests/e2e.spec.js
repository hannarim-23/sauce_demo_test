import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/сartPage';
import { CheckoutStepOnePage } from '../pages/сheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/checkoutCompletePage';

test.describe('входа в систему и завершение покупки @ui', () => {
  test('', async ({ page }) => {
    // 1. Открыть страницу логина
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await page.waitForLoadState('networkidle'); // Даем странице полностью загрузиться

    // 2. Залогиниться с валидными данными
    await loginPage.login('standard_user', 'secret_sauce');

    // Явно ждем перехода
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    /*  
  // Проверяем, что мы авторизованы
  await expect(page.locator('.inventory_list')).toBeVisible();
*/
    // 3. Проверить, что после логина открылась страница с товарами
    const inventoryPage = new InventoryPage(page);
    const pageTitle = await inventoryPage.getPageTitle();
    expect(pageTitle).toBe('Products');

    // 4. Добавить в корзину самый дорогой товар
    const mostExpensiveItem = await inventoryPage.getHighestPrice();
    await inventoryPage.addToCart(mostExpensiveItem);

    // 5. Перейти в корзину
    await inventoryPage.openCart();

    // 6. проверка корзины на искомый элемент
    const cartPage = new CartPage(page);
    const isItemInCart = await cartPage.checkItem(mostExpensiveItem.name);
    expect(isItemInCart).toBeTruthy();

    // 7 оформление заказа
    await cartPage.goToCheckout();

    // 8. Заполнить информацию о пользователе
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    await checkoutStepOnePage.fillUserInfo('Test', 'User', '12345');

    // 9. Продолжить оформление заказа
    await checkoutStepOnePage.continue();

    // 10. передумать и вернуться на шаг назад
    //await checkoutStepOnePage.cancel();

    // 11. Проверить информацию о заказе и завершить покупку
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);

    // 12. Проверяем, что товар в заказе совпадает с добавленным
    const orderItems = await checkoutStepTwoPage.getOrderItems();
    expect(orderItems).toHaveLength(1);
    expect(orderItems[0].name).toBe(mostExpensiveItem.name);

    // 13. Проверяем итоговую сумму
    const isSumCorrect = await checkoutStepTwoPage.getOrderSum();
    expect(isSumCorrect).toBeTruthy();

    // 14. Завершаем покупку
    await checkoutStepTwoPage.finishCheckout();

    // 15. передумать и вернуться на шаг назад
    //    await checkoutStepTwoPage.cancel();

    // 16. заказ успешно оформлен
    const checkoutCompletePage = new CheckoutCompletePage(page);
    const completionMessage = await checkoutCompletePage.getCompletionMessage();
    expect(completionMessage).toBe('Thank you for your order!');

    const completionText = await checkoutCompletePage.getCompletionText();
    expect(completionText).toContain('Your order has been dispatched');

    await checkoutCompletePage.backToHome();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});





