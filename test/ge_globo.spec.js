// A importação do chromedriver é obrigatória para garantir o path correto no Windows
require("chromedriver");

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
const HomePage = require("../pages/HomePage");

/**
 * Suíte de Testes Automatizados para o site ge.globo.com.
 * Abrange as funcionalidades principais: Busca, Navegação por Times,
 * Tabela de Classificação e Leitura de Notícias.
 * * @see Testes_Sistemas.pdf - Requisitos originais do projeto.
 */
describe("Automação de Testes - GE Globo", function () {
  // Aumenta o timeout padrão do Mocha (2s) para 60s,
  // pois sites de notícias carregam muitos recursos externos (ads, vídeos).
  this.timeout(60000);

  let driver;
  let homePage;

  /**
   * Setup (Configuração) executado antes de CADA teste.
   * 1. Configura o driver do Chrome.
   * 2. Maximiza a janela e desabilita notificações (pop-ups).
   * 3. Inicializa o Page Object e visita a Home.
   */
  beforeEach(async function () {
    let options = new chrome.Options();
    options.addArguments("--start-maximized"); // Garante visibilidade dos elementos
    options.addArguments("--disable-notifications"); // Evita bloqueios de interação

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    homePage = new HomePage(driver);
    await homePage.visit("https://ge.globo.com");
  });

  /**
   * Teardown (Limpeza) executado após CADA teste.
   * Encerra a instância do navegador para liberar memória.
   */
  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  /**
   * Teste #1: Busca de Conteúdo.
   * Objetivo: Verificar se a barra de busca aceita input e redireciona corretamente.
   * Resultado Esperado: A URL deve conter o parâmetro de busca.
   */
  it('Deve buscar pelo time "Flamengo" e retornar resultados', async function () {
    const searchTerm = "Flamengo";

    // Ação
    await homePage.searchFor(searchTerm);

    // Espera Explícita: Aguarda a transição de página
    await driver.wait(until.urlContains("busca"), 10000);

    // Asserção (Validação)
    const url = await driver.getCurrentUrl();
    expect(url).to.include("busca");

    console.log("Busca realizada. URL: " + url);
  });

  /**
   * Teste #2: Navegação pelo Menu de Times.
   * Objetivo: Garantir que os links rápidos (escudos) levam à página do clube.
   * Resultado Esperado: URL deve conter "times/corinthians".
   */
  it("Deve redirecionar para a página do Corinthians ao clicar no escudo", async function () {
    // Ação
    await homePage.clickTeamShield();

    // Espera Explícita
    await driver.wait(until.urlContains("corinthians"), 10000);

    // Asserção
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("times/corinthians");
  });

  /**
   * Teste #3: Visualização da Tabela do Brasileirão.
   * Objetivo: Verificar se a tabela carrega a lista completa de times.
   * Resultado Esperado: Devem ser encontrados pelo menos 20 times (Série A).
   */
  it("Deve exibir a tabela do Brasileirão com 20 times", async function () {
    // Ação (inclui lógica de scroll e clique em 'ver mais' dentro do Page Object)
    const teamCount = await homePage.getTableRowsCount();
    console.log(`Times encontrados na tabela: ${teamCount}`);

    // Asserção
    expect(teamCount).to.be.at.least(20);
  });

  /**
   * Teste #4: Integridade de Acesso à Notícia.
   * Objetivo: Assegurar que o clique na manchete abre o artigo correto.
   * Resultado Esperado: O título interno do artigo deve conter o texto da manchete da Home.
   */
  it("Deve abrir a notícia correta ao clicar na manchete principal", async function () {
    // 1. Captura estado inicial
    let homeHeadline = await homePage.getMainHeadlineText();
    // Limpeza de string (remove quebras de linha e espaços extras)
    homeHeadline = homeHeadline.replace(/\n/g, " ").trim();

    console.log("Manchete na Home: " + homeHeadline);

    // 2. Ação de Navegação
    await homePage.clickMainHeadline();

    // 3. Captura estado final
    let articleTitle = await homePage.getArticleTitle();
    articleTitle = articleTitle.replace(/\n/g, " ").trim();

    console.log("Título do Artigo: " + articleTitle);

    // Asserção: Compara strings em caixa baixa e parcial (primeiros 20 caracteres)
    // para evitar falhas por pequenas diferenças de formatação editorial.
    expect(articleTitle.toLowerCase()).to.include(
      homeHeadline.toLowerCase().substring(0, 20)
    );
  });
});
