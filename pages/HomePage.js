const { By, Key } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class HomePage extends BasePage {
  constructor(driver) {
    super(driver);

    // --- SELETORES ATUALIZADOS COM BASE NOS PRINTS ---

    // 1. Busca [Baseado na imagem image_3aa85a.png]
    // O ID 'busca-campo' é único e perfeito para automação.
    this.searchInput = By.id("busca-campo");

    // 2. Escudo do Time [Baseado na imagem image_3aa591.png]
    // Usamos 'a.mosaico__escudo' combinando com o title="Corinthians" para garantir que clicamos no certo.
    this.corinthiansShield = By.css('a.mosaico__escudo[title="Corinthians"]');

    // 3. Tabela [Baseado na imagem image_3aa535.png]
    // A classe principal da tabela é 'post-tabela-classificacao__table'.
    this.classificationTable = By.css(".post-tabela-classificacao__table");
    // Para contar os times, olhamos para as linhas (tr) dentro do corpo da tabela (tbody).
    this.tableRows = By.css(".post-tabela-classificacao__table tbody tr");

    // 4. Manchete Principal [Baseado na imagem image_3aa4f2.png]
    // A classe 'bstn-hl-link' é o link clicável da manchete.
    // O Selenium vai pegar o primeiro que encontrar (que é o principal/topo).
    this.mainHeadline = By.css(".bstn-hl-link");

    // H1 da página interna (padrão, não mudou nas imagens, mas mantemos por segurança)
    this.articleTitleH1 = By.css("h1.content-head__title");
  }

  // --- MÉTODOS DE AÇÃO ---

  // Ações do Teste #1
  async searchFor(term) {
    // Como o campo de busca pode estar escondido em resoluções menores ou precisar de clique,
    // às vezes é bom clicar na lupa antes, mas vamos tentar digitar direto no ID que é mais robusto.
    await this.type(this.searchInput, term);
    await this.driver.findElement(this.searchInput).sendKeys(Key.ENTER);
  }

  // Ações do Teste #2
  async clickTeamShield() {
    await this.click(this.corinthiansShield);
  }

  // Ações do Teste #3
  async getTableRowsCount() {
    // Scroll até a tabela para garantir que ela carregue (lazy loading)
    const tableElement = await this.find(this.classificationTable);
    await this.driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      tableElement
    );

    // Pequena pausa para garantir que o DOM atualizou após o scroll
    await this.driver.sleep(1000);

    // Conta quantos times existem na tabela
    const rows = await this.driver.findElements(this.tableRows);
    return rows.length;
  }

  // Ações do Teste #4
  async getMainHeadlineText() {
    return await this.getText(this.mainHeadline);
  }

  async clickMainHeadline() {
    await this.click(this.mainHeadline);
  }

  async getArticleTitle() {
    // Tenta pegar o H1 padrão
    return await this.getText(this.articleTitleH1);
  }
}

module.exports = HomePage;
