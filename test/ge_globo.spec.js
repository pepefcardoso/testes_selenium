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

    const url = await driver.getCurrentUrl();
    expect(url).to.include("busca");

    console.log("Busca realizada. URL: " + url);
  });

  it("Deve redirecionar para a página do Corinthians ao clicar no escudo", async function () {
    await homePage.clickTeamShield();

    await driver.wait(until.urlContains("corinthians"), 10000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("times/corinthians");
  });

  it("Deve exibir a tabela do Brasileirão com 20 times", async function () {
    const teamCount = await homePage.getTableRowsCount();
    console.log(`Times encontrados na tabela: ${teamCount}`);

    expect(teamCount).to.be.at.least(20);
  });

  it("Deve abrir a notícia correta ao clicar na manchete principal", async function () {
    let homeHeadline = await homePage.getMainHeadlineText();
    homeHeadline = homeHeadline.replace(/\n/g, " ").trim();

    console.log("Manchete na Home: " + homeHeadline);

    await homePage.clickMainHeadline();

    let articleTitle = await homePage.getArticleTitle();
    articleTitle = articleTitle.replace(/\n/g, " ").trim();

    console.log("Título do Artigo: " + articleTitle);

    expect(articleTitle.toLowerCase()).to.include(
      homeHeadline.toLowerCase().substring(0, 20)
    );
  });
});
