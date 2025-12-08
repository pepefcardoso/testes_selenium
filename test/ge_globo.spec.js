// Importação explícita do chromedriver é CRÍTICA no Windows
require("chromedriver");

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome"); // Importar opções do Chrome
const { expect } = require("chai");
const HomePage = require("../pages/HomePage");

describe("Automação de Testes - GE Globo", function () {
  // Aumentamos o timeout global para 60 segundos para garantir (sites de notícias são pesados)
  this.timeout(60000);

  let driver;
  let homePage;

  // Antes de cada teste
  beforeEach(async function () {
    // Configurar opções do Chrome para rodar mais estável
    let options = new chrome.Options();
    options.addArguments("--start-maximized"); // Inicia maximizado
    options.addArguments("--disable-notifications"); // Bloqueia popups de notificação

    // Se continuar a falhar, descomenta a linha abaixo para ver se funciona sem interface gráfica (Headless)
    // options.addArguments('--headless');

    // Cria o driver com as opções configuradas
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    homePage = new HomePage(driver);

    // Navegação
    await homePage.visit("https://ge.globo.com");
  });

  // Depois de cada teste
  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  // --- TESTES ---

  it('Deve buscar pelo time "Flamengo" e retornar resultados', async function () {
    const searchTerm = "Flamengo";
    await homePage.searchFor(searchTerm);

    const url = await driver.getCurrentUrl();
    expect(url).to.include("busca");

    const bodyText = await driver.findElement(By.tagName("body")).getText();
    expect(bodyText).to.include(searchTerm);
  });

  it("Deve redirecionar para a página do Corinthians ao clicar no escudo", async function () {
    await homePage.clickTeamShield();

    // Aguarda a URL mudar para conter "corinthians"
    await driver.wait(until.urlContains("corinthians"), 10000);

    const currentUrl = await driver.getCurrentUrl();
    const pageH1 = await driver.findElement(By.tagName("h1")).getText();

    expect(currentUrl).to.include("times/corinthians");
    expect(pageH1).to.include("Corinthians");
  });

  it("Deve exibir a tabela do Brasileirão com 20 times", async function () {
    const teamCount = await homePage.getTableRowsCount();
    console.log(`Times encontrados na tabela: ${teamCount}`);
    expect(teamCount).to.be.at.least(20);
  });

  it("Deve abrir a notícia correta ao clicar na manchete principal", async function () {
    const homeHeadline = await homePage.getMainHeadlineText();
    console.log("Manchete na Home: " + homeHeadline);

    await homePage.clickMainHeadline();

    // Aguarda o título da nova página aparecer
    await driver.wait(until.elementLocated(By.tagName("h1")), 10000);

    const articleTitle = await homePage.getArticleTitle();
    console.log("Título do Artigo: " + articleTitle);

    expect(articleTitle).to.contain(homeHeadline);
  });
});
