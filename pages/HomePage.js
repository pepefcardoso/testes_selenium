const { By, Key, until } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class HomePage extends BasePage {
  constructor(driver) {
    super(driver);

    this.searchInput = By.id("busca-campo");
    this.internacionalShield = By.css(
      'a.mosaico__escudo[title="Internacional"]'
    );

    this.menuIcon = By.css(
      '.gl-header__menu-button, button[aria-label="Menu"], div.menu-button'
    );
    this.brasileiraoLink = By.css('a[href*="/brasileirao-serie-a/"]');

    this.classificationTable = By.css(
      "section.standings-widget-content, .post-tabela-classificacao__table, table"
    );
    this.tableRows = By.css("table tbody tr");
    this.fullTableLink = By.css(
      'a[title="Veja a tabela completa."], .standings-widget-footer a, .load-more'
    );

    this.mainHeadline = By.css("div.type-materia a.feed-post-link");
    this.articleTitleH1 = By.css("h1");

    this.botaoMenu = By.css(".gl-header__menu-button, div.menu-button");
    this.menuF1 = By.id("menu-1-formula-1");
    this.linkClassificacao = By.css("#menu-2-classificacao a");
  }

  async searchFor(term) {
    await this.type(this.searchInput, term);
    await this.driver.findElement(this.searchInput).sendKeys(Key.ENTER);
  }

  async clickTeamShield() {
    await this.forceClick(this.internacionalShield);
  }

  async openMenu() {
    await this.click(this.menuIcon);
    await this.driver.sleep(1000);
  }

  async clickBrasileiraoMenuLink() {
    const link = await this.find(this.brasileiraoLink);
    await this.driver.executeScript("arguments[0].click();", link);
  }

  async getTableRowsCount() {
    const tableElement = await this.find(this.classificationTable);

    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      tableElement
    );
    await this.driver.sleep(1000);

    try {
      const links = await this.driver.findElements(this.fullTableLink);
      if (links.length > 0 && (await links[0].isDisplayed())) {
        await this.driver.executeScript("arguments[0].click();", links[0]);
        await this.driver.sleep(2000);
      }
    } catch (e) {
      console.log(
        "Link de tabela completa não encontrado ou tabela já expandida. Prosseguindo..."
      );
    }

    const rows = await this.driver.findElements(this.tableRows);
    return rows.length;
  }

  async getMainHeadlineText() {
    return await this.getText(this.mainHeadline);
  }

  async getMainHeadlineUrl() {
    const element = await this.driver.wait(
      until.elementLocated(this.mainHeadline),
      10000
    );
    return await element.getAttribute("href");
  }

  async clickMainHeadline() {
    const element = await this.driver.wait(
      until.elementLocated(this.mainHeadline),
      10000
    );

    await this.driver.executeScript("arguments[0].click();", element);
  }

  async getArticleTitle() {
    await this.driver.wait(until.elementLocated(this.articleTitleH1), 10000);
    return await this.getText(this.articleTitleH1);
  }

  async navegarParaClassificacaoF1() {
    await this.click(this.botaoMenu);
    await this.driver.sleep(2000);

    const f1Element = await this.find(this.menuF1);
    await f1Element.click();
    await this.driver.sleep(2000);

    const classifElement = await this.find(this.linkClassificacao);
    await this.driver.executeScript("arguments[0].click();", classifElement);

    await this.driver.wait(until.urlContains("classificacao"), 10000);
  }
}

module.exports = HomePage;
