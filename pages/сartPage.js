export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutBtn = page.locator('[data-test="checkout"]');
    this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
  }

  async checkItem(itemName) {
    // 1. Сколько элементов в корзине
    const itemsCount = await this.cartItems.count();
    console.log(`Количество товаров в корзине: ${itemsCount}`);

    // 2. Проходим по всем элементам
    const itemNames = [];
    for (let i = 0; i < itemsCount; i++) {
      const cartItem = this.cartItems.nth(i);
      // Получаем название товара
      const itemName = await cartItem.locator('.inventory_item_name').textContent();
      itemNames.push(itemName.trim());
    }
    console.log(`Название товаров в корзине: ${itemNames}`);
    return itemNames.some((item) => item === itemName);
  }

  // Кнопка перехода к оформлению заказа
  async goToCheckout() {
    await this.checkoutBtn.click();
  }

  // Кнопка продолжить выбор товаров
  async continueShopping() {
    await this.continueShoppingBtn.click();
  }
}
