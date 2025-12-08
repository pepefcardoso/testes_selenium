const { By, Key, until } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class HomePage extends BasePage {
  constructor(driver) {
    super(driver);

    this.searchInput = By.id("busca-campo");
    this.corinthiansShield = By.css('a.mosaico__escudo[title="Corinthians"]');

    this.classificationTable = By.css(".post-tabela-classificacao__table");
    this.tableRows = By.css("table tbody tr");
    this.fullTableLink = By.css('a[title="Veja a tabela completa."]');

    this.mainHeadline = By.css(".bstn-hl-link");
    this.articleTitleH1 = By.css("h1");
  }

  async searchFor(term) {
    await this.type(this.searchInput, term);
    await this.driver.findElement(this.searchInput).sendKeys(Key.ENTER);
  }

  async clickTeamShield() {
    await this.forceClick(this.corinthiansShield);
  }

  async getTableRowsCount() {
    const tableElement = await this.find(this.classificationTable);
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      tableElement
    );
    await this.driver.sleep(1000);

    try {
      const link = await this.driver.findElement(this.fullTableLink);
      await this.driver.executeScript("arguments[0].click();", link);
      await this.driver.sleep(2000);
    } catch (e) {
      console.log(
        "Link de tabela completa não encontrado ou tabela já expandida."
      );
    }

    const rows = await this.driver.findElements(this.tableRows);
    return rows.length;
  }

  async getMainHeadlineText() {
    return await this.getText(this.mainHeadline);
  }

  async clickMainHeadline() {
    await this.forceClick(this.mainHeadline);
  }

  async getArticleTitle() {
    await this.driver.wait(until.elementLocated(this.articleTitleH1), 10000);
    return await this.getText(this.articleTitleH1);
  }
}

module.exports = HomePage;
