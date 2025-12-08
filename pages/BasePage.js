const { By, until, WebDriver, WebElement } = require("selenium-webdriver");

/**
 * Classe base que encapsula interações comuns do Selenium WebDriver.
 * Todos os Page Objects devem estender esta classe para herdar estes métodos utilitários.
 * Isso promove a reutilização de código e facilita a manutenção.
 */
class BasePage {
  /**
   * Inicializa a instância da BasePage.
   * @param {WebDriver} driver - A instância do Selenium WebDriver controlando o navegador.
   */
  constructor(driver) {
    this.driver = driver;
  }

  /**
   * Navega para uma URL específica.
   * @param {string} url - O endereço web completo para onde navegar (ex: 'https://ge.globo.com').
   * @returns {Promise<void>}
   */
  async visit(url) {
    await this.driver.get(url);
  }

  /**
   * Localiza um elemento na página, aguardando até que ele esteja presente no DOM.
   * Inclui uma espera explícita de até 15 segundos para garantir robustez.
   * @param {By} locator - O localizador do elemento (ex: By.id('...'), By.css('...')).
   * @returns {Promise<WebElement>} O elemento web encontrado.
   * @throws {Error} Se o elemento não for encontrado dentro do tempo limite.
   */
  async find(locator) {
    await this.driver.wait(until.elementLocated(locator), 15000);
    return this.driver.findElement(locator);
  }

  /**
   * Localiza um elemento e realiza um clique nativo do Selenium.
   * @param {By} locator - O localizador do elemento a ser clicado.
   * @returns {Promise<void>}
   */
  async click(locator) {
    const el = await this.find(locator);
    await el.click();
  }

  /**
   * Realiza um clique forçado utilizando injeção de JavaScript.
   * Útil para elementos que estão cobertos por outros (como banners) ou que o Selenium
   * considera "não interagíveis" nativamente.
   * @param {By} locator - O localizador do elemento a ser clicado.
   * @returns {Promise<void>}
   */
  async forceClick(locator) {
    const el = await this.find(locator);
    await this.driver.executeScript("arguments[0].click();", el);
  }

  /**
   * Localiza um campo de entrada e digita o texto especificado.
   * @param {By} locator - O localizador do campo de input.
   * @param {string} text - O texto a ser digitado.
   * @returns {Promise<void>}
   */
  async type(locator, text) {
    const el = await this.find(locator);
    await el.sendKeys(text);
  }

  /**
   * Obtém o título da página atual.
   * @returns {Promise<string>} O título da aba do navegador.
   */
  async getTitle() {
    return await this.driver.getTitle();
  }

  /**
   * Obtém o texto visível de um elemento específico.
   * @param {By} locator - O localizador do elemento.
   * @returns {Promise<string>} O texto contido no elemento.
   */
  async getText(locator) {
    const el = await this.find(locator);
    return await el.getText();
  }
}

module.exports = BasePage;
