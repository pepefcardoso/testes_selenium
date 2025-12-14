require("chromedriver");

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
const HomePage = require("../pages/HomePage");

describe("Automação de Testes - GE Globo", function () {
  this.timeout(60000);

  let driver;
  let homePage;

  beforeEach(async function () {
    let options = new chrome.Options();
    options.addArguments("--start-maximized");
    options.addArguments("--disable-notifications");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    homePage = new HomePage(driver);
    await homePage.visit("https://ge.globo.com");
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Deve buscar pelo time "Flamengo" e retornar resultados', async function () {
    const searchTerm = "Flamengo";

    await homePage.searchFor(searchTerm);

    await driver.wait(until.urlContains("busca"), 10000);

    await driver.sleep(5000);

    const url = await driver.getCurrentUrl();
    expect(url).to.include("busca");

    console.log("Busca realizada. URL: " + url);
  });

  it("Deve redirecionar para a página do Internacional ao clicar no escudo", async function () {
    await homePage.clickTeamShield();

    await driver.wait(until.urlContains("internacional"), 10000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("times/internacional");
  });

  it("Deve exibir a tabela do Brasileirão com 20 times", async function () {
    await homePage.openMenu();
    await homePage.clickBrasileiraoMenuLink();

    await driver.wait(until.urlContains("brasileirao"), 10000);
    console.log("Navegado para página do Brasileirão.");

    const teamCount = await homePage.getTableRowsCount();
    console.log(`Times encontrados na tabela: ${teamCount}`);

    expect(teamCount).to.be.at.least(20);
  });

  it("Deve abrir a notícia correta ao clicar na manchete principal", async function () {
    const expectedUrl = await homePage.getMainHeadlineUrl();
    console.log("URL esperada da manchete: " + expectedUrl);

    await homePage.clickMainHeadline();

    await driver.wait(until.urlContains(expectedUrl), 10000);

    const currentUrl = await driver.getCurrentUrl();
    console.log("URL atual aberta: " + currentUrl);

    expect(currentUrl).to.include(expectedUrl);
  });
});