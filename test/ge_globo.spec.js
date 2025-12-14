require("chromedriver");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect, assert } = require("chai");
const HomePage = require("../pages/HomePage");
const ClassificacaoF1Page = require("../pages/ClassificacaoF1Page");

describe("Automação de Testes - GE Globo", function () {
  this.timeout(60000);

  let driver;
  let homePage;
  let f1Page;

  beforeEach(async function () {
    let options = new chrome.Options();
    options.addArguments("--start-maximized");
    options.addArguments("--disable-notifications");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    homePage = new HomePage(driver);
    f1Page = new ClassificacaoF1Page(driver);

    await homePage.visit("https://ge.globo.com");
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it("Deve navegar pelo menu até a classificação da F1 e validar a tabela", async function () {
    await homePage.navegarParaClassificacaoF1();

    const tabela = await f1Page.obterTabela();

    const estaVisivel = await tabela.isDisplayed();
    await driver.sleep(3000);

    assert.isTrue(
      estaVisivel,
      "A tabela de pilotos deveria estar visível após a navegação"
    );
  });

  it("Deve redirecionar para a página do Internacional ao clicar no escudo", async function () {
    await homePage.clickTeamShield();
    await driver.wait(until.urlContains("internacional"), 5000);
    const currentUrl = await driver.getCurrentUrl();
    await driver.sleep(3000);
    expect(currentUrl).to.include("times/internacional");
  });

  it("Deve exibir a tabela do Brasileirão com 20 times", async function () {
    await homePage.openMenu();
    await homePage.clickBrasileiraoMenuLink();
    await driver.wait(until.urlContains("brasileirao"), 5000);
    console.log("Navegado para página do Brasileirão.");
    const teamCount = await homePage.getTableRowsCount();
    console.log(`Times encontrados na tabela: ${teamCount}`);
    await driver.sleep(3000);
    expect(teamCount).to.be.at.least(20);
  });

  it("Deve abrir a notícia correta ao clicar na manchete principal", async function () {
    const expectedUrl = await homePage.getMainHeadlineUrl();
    console.log("URL esperada da manchete: " + expectedUrl);
    expect(expectedUrl).to.not.be.null;
    await homePage.clickMainHeadline();
    await driver.wait(until.urlContains(expectedUrl), 5000);
    const currentUrl = await driver.getCurrentUrl();
    console.log("URL atual aberta: " + currentUrl);
    await driver.sleep(3000);
    expect(currentUrl).to.include(expectedUrl);
  });
});
