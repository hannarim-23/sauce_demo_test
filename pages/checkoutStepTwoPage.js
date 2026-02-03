export class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;
    this.itemName = page.locator('.inventory_item_name');
    this.itemPrice = page.locator('.inventory_item_price');

    this.sumPrice = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.totalPrice = page.locator('.summary_total_label');

    this.finishBtn = page.locator('[data-test="finish"]');
    this.cancelBtn = page.locator('[data-test="cancel"]');
  }

  async getOrderItems() {
    const items = [];
    const count = await this.itemName.count();
    for (let i = 0; i < count; i++) {
      items.push({
        name: await this.itemName.nth(i).textContent(),
        price: await this.itemPrice.nth(i).textContent(),
      });
    }
    console.log('Order items:', items);
    return items;
  }

  async getOrderSum() {
    const items = await this.getOrderItems();
    const sumItems = items.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
      return sum + price;
    }, 0);
    const pageSum = parseFloat((await this.sumPrice.textContent()).replace('Item total: $', ''));
    return sumItems === pageSum;
  }

  async finishCheckout() {
    await this.finishBtn.click();
  }

  async cancel() {
    await this.cancelBtn.click();
  }
}
