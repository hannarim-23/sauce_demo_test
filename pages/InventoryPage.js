export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.productList = page.locator('.inventory_item');
    this.addItemToCart = page.locator('.btn_inventory');

    this.productSelect = page
      .locator('[data-test="product_sort_container"]')
      .or(page.locator('select.product_sort_container'))
      .or(page.locator('.product_sort_container'))
      .or(page.locator('select[data-test*="sort"]'))
      .first();
  }

  async getPageTitle() {
    return await this.pageTitle.textContent();
  }

  async getHighestPrice() {
    await this.productSelect.selectOption('hilo');
    await this.page.waitForTimeout(500);
    const firstItem = this.productList.first();

    // Получаем название товара
    const itemName = await firstItem.locator('.inventory_item_name').textContent();
    // Получаем цену товара
    const itemPrice = await firstItem.locator('.inventory_item_price').textContent();
    // Получаем описание
    const itemDescription = await firstItem.locator('.inventory_item_desc').textContent();
    // Получаем кнопку для этого товара
    const itemAddButton = firstItem.locator('button.btn_inventory');

    // Возвращаем объект с данными
    return {
      element: firstItem, // сам элемент, нужен для клика
      name: itemName.trim(),
      price: itemPrice,
      description: itemDescription.trim(),
      addButton: itemAddButton,
    };
  }

  // Кнопка добавления в корзину конкретного товара
  async addToCart(itemObject) {
    await itemObject.addButton.click();
  }
  // открытие корзины
  async openCart() {
    await this.cartIcon.click();
  }
}
