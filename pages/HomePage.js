const { By, Key, until } = require("selenium-webdriver");
const BasePage = require("./BasePage");

/**
 * Page Object que representa a página inicial do site ge.globo.com.
 * Contém os seletores e métodos para interagir com a busca, menu de times,
 * tabela de classificação e notícias principais.
 * * @extends BasePage
 */
class HomePage extends BasePage {
  /**
   * Inicializa a HomePage e define os locators (seletores) dos elementos.
   * @param {WebDriver} driver - A instância do Selenium WebDriver.
   */
  constructor(driver) {
    super(driver);

    // Seletores mapeados (estratégia: ID > CSS > XPath)
    this.searchInput = By.id("busca-campo");
    this.corinthiansShield = By.css('a.mosaico__escudo[title="Corinthians"]');

    // Elementos do Widget da Tabela
    this.classificationTable = By.css(".post-tabela-classificacao__table");
    this.tableRows = By.css("table tbody tr");
    this.fullTableLink = By.css('a[title="Veja a tabela completa."]');

    // Elementos de Notícia (Manchete)
    this.mainHeadline = By.css(".bstn-hl-link");
    this.articleTitleH1 = By.css("h1");
  }

  /**
   * Realiza uma busca no site utilizando o campo de texto do cabeçalho.
   * Digita o termo e pressiona ENTER.
   * @param {string} term - O termo a ser pesquisado (ex: "Flamengo").
   * @returns {Promise<void>}
   */
  async searchFor(term) {
    await this.type(this.searchInput, term);
    await this.driver.findElement(this.searchInput).sendKeys(Key.ENTER);
  }

  /**
   * Clica no escudo do time "Corinthians" no menu superior.
   * Utiliza clique forçado (JS) para evitar interceptações por banners flutuantes.
   * @returns {Promise<void>}
   */
  async clickTeamShield() {
    await this.forceClick(this.corinthiansShield);
  }

  /**
   * Conta o número de linhas (times) visíveis na tabela de classificação.
   * * Lógica implementada:
   * 1. Faz scroll até a tabela.
   * 2. Tenta clicar em "Veja a tabela completa" para expandir a lista para 20 times.
   * 3. Se o link não existir (tabela já expandida), o erro é ignorado e segue a contagem.
   * * @returns {Promise<number>} O número de linhas (times) encontrados na tabela.
   */
  async getTableRowsCount() {
    const tableElement = await this.find(this.classificationTable);

    // Scroll para garantir o carregamento do componente (Lazy Loading)
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      tableElement
    );
    await this.driver.sleep(1000);

    try {
      // Tenta expandir a tabela se o botão estiver disponível
      const link = await this.driver.findElement(this.fullTableLink);
      await this.driver.executeScript("arguments[0].click();", link);
      await this.driver.sleep(2000); // Aguarda renderização dos novos itens
    } catch (e) {
      console.log(
        "Link de tabela completa não encontrado ou tabela já expandida. Prosseguindo..."
      );
    }

    const rows = await this.driver.findElements(this.tableRows);
    return rows.length;
  }

  /**
   * Captura o texto da manchete principal visível na Home.
   * @returns {Promise<string>} O texto da manchete.
   */
  async getMainHeadlineText() {
    return await this.getText(this.mainHeadline);
  }

  /**
   * Navega para o artigo da manchete principal.
   * Utiliza clique forçado para garantir a ação mesmo com sobreposições.
   * @returns {Promise<void>}
   */
  async clickMainHeadline() {
    await this.forceClick(this.mainHeadline);
  }

  /**
   * Captura o título principal (H1) da página do artigo aberto.
   * Inclui uma espera explícita para garantir que a nova página carregou.
   * @returns {Promise<string>} O texto do título H1.
   */
  async getArticleTitle() {
    await this.driver.wait(until.elementLocated(this.articleTitleH1), 10000);
    return await this.getText(this.articleTitleH1);
  }
}

module.exports = HomePage;
