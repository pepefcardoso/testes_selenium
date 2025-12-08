const { By, until } = require("selenium-webdriver");

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async visit(url) {
    await this.driver.get(url);
  }

  async find(locator) {
    await this.driver.wait(until.elementLocated(locator), 10000);
    return this.driver.findElement(locator);
  }

  async click(locator) {
    const el = await this.find(locator);
    await el.click();
  }

  async type(locator, text) {
    const el = await this.find(locator);
    await el.sendKeys(text);
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async getText(locator) {
    const el = await this.find(locator);
    return await el.getText();
  }
}

module.exports = BasePage;
