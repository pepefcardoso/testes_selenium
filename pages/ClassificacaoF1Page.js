const BasePage = require("./BasePage");
const { By, until } = require("selenium-webdriver");

class ClassificacaoF1Page extends BasePage {
  constructor(driver) {
    super(driver);
    this.url =
      "https://ge.globo.com/motor/formula-1/noticia/2025/03/16/f1-2025-tabela-de-classificacao-do-campeonato.ghtml";

    this.tabelaClassificacao = By.css(".flourish-embed");
  }

  async abrir() {
    await this.visit(this.url);
  }

  async obterTabela() {
    const elemento = await this.find(this.tabelaClassificacao);

    await this.driver.wait(until.elementIsVisible(elemento), 10000);

    return elemento;
  }
}

module.exports = ClassificacaoF1Page;
