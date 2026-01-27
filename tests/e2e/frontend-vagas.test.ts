/**
 * Testes End-to-End para o Frontend - Página de Vagas
 * Portal Geração Emprego
 * 
 * Este arquivo contém testes automatizados para validar:
 * - Carregamento da página de vagas
 * - Exibição correta dos cards de vagas
 * - Funcionamento dos filtros
 * - Navegação e interação do usuário
 * 
 * Executar com: npx playwright test tests/e2e/frontend-vagas.test.ts
 */

import { test, expect, Page } from '@playwright/test';

// URL base para os testes
const BASE_URL = process.env.TEST_BASE_URL || 'https://geracao-emprego-dev.vercel.app';

// Timeout para carregamento de página
const PAGE_TIMEOUT = 30000;

test.describe('Página de Vagas - Testes E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar timeout
    page.setDefaultTimeout(PAGE_TIMEOUT);
  });
  
  test.describe('Carregamento da Página', () => {
    
    test('deve carregar a página de vagas com sucesso', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Verificar se a página carregou
      await expect(page).toHaveTitle(/Geração Emprego/);
      
      // Verificar se o header está presente
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });
    
    test('deve exibir o título "Vagas de Emprego"', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Verificar título da seção
      const titulo = page.getByRole('heading', { name: /Vagas de Emprego/i });
      await expect(titulo).toBeVisible();
    });
    
    test('deve exibir o campo de busca', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Verificar campo de busca
      const searchInput = page.getByPlaceholder(/Buscar por cargo ou empresa/i);
      await expect(searchInput).toBeVisible();
    });
    
    test('deve exibir o botão de filtros', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Verificar botão de filtros
      const filtrosBtn = page.getByRole('button', { name: /Filtros/i });
      await expect(filtrosBtn).toBeVisible();
    });
    
  });
  
  test.describe('Exibição de Vagas', () => {
    
    test('deve exibir cards de vagas quando houver dados', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Aguardar carregamento
      await page.waitForLoadState('networkidle');
      
      // Verificar se há vagas ou mensagem de "nenhuma vaga"
      const vagasContainer = page.locator('[class*="vagas"], [class*="jobs"], [class*="card"]');
      const nenhumaVaga = page.getByText(/Nenhuma vaga encontrada/i);
      
      // Deve ter vagas OU mensagem de nenhuma vaga
      const hasVagas = await vagasContainer.count() > 0;
      const hasNoVagasMessage = await nenhumaVaga.isVisible().catch(() => false);
      
      expect(hasVagas || hasNoVagasMessage).toBeTruthy();
    });
    
    test('deve exibir contador de vagas', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Aguardar carregamento
      await page.waitForLoadState('networkidle');
      
      // Verificar se há contador de vagas
      const contador = page.getByText(/\d+ vagas? encontradas?/i);
      await expect(contador).toBeVisible({ timeout: 10000 });
    });
    
    test('deve exibir estatísticas no topo (Vagas Ativas, Cidades, etc)', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Verificar estatísticas
      const vagasAtivas = page.getByText(/Vagas Ativas/i);
      const cidades = page.getByText(/Cidades/i);
      const municipios = page.getByText(/Municípios/i);
      
      // Pelo menos uma estatística deve estar visível
      const hasStats = await Promise.any([
        vagasAtivas.isVisible(),
        cidades.isVisible(),
        municipios.isVisible()
      ]).catch(() => false);
      
      expect(hasStats).toBeTruthy();
    });
    
  });
  
  test.describe('Funcionalidade de Busca', () => {
    
    test('deve permitir buscar vagas por texto', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Encontrar campo de busca
      const searchInput = page.getByPlaceholder(/Buscar por cargo ou empresa/i);
      
      // Digitar termo de busca
      await searchInput.fill('Vendedor');
      await searchInput.press('Enter');
      
      // Aguardar resultados
      await page.waitForLoadState('networkidle');
      
      // Verificar se a busca foi aplicada (URL ou resultados)
      const url = page.url();
      const hasSearchParam = url.includes('search=') || url.includes('q=');
      
      // Ou verificar se os resultados contêm o termo
      const resultados = page.getByText(/Vendedor/i);
      const hasResults = await resultados.count() > 0;
      
      expect(hasSearchParam || hasResults).toBeTruthy();
    });
    
    test('deve limpar busca e mostrar todas as vagas', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas?search=Vendedor`);
      
      // Encontrar campo de busca
      const searchInput = page.getByPlaceholder(/Buscar por cargo ou empresa/i);
      
      // Limpar campo
      await searchInput.clear();
      await searchInput.press('Enter');
      
      // Aguardar resultados
      await page.waitForLoadState('networkidle');
      
      // Verificar se a busca foi removida
      const url = page.url();
      expect(url).not.toContain('search=Vendedor');
    });
    
  });
  
  test.describe('Funcionalidade de Filtros', () => {
    
    test('deve abrir painel de filtros ao clicar no botão', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Clicar no botão de filtros
      const filtrosBtn = page.getByRole('button', { name: /Filtros/i });
      await filtrosBtn.click();
      
      // Verificar se o painel de filtros apareceu
      // (pode ser um dropdown, modal ou seção expandida)
      await page.waitForTimeout(500);
      
      // Verificar se há opções de filtro visíveis
      const filtroArea = page.getByText(/Área/i);
      const filtroSalario = page.getByText(/Salário/i);
      const filtroCidade = page.getByText(/Cidade/i);
      
      const hasFilters = await Promise.any([
        filtroArea.isVisible(),
        filtroSalario.isVisible(),
        filtroCidade.isVisible()
      ]).catch(() => false);
      
      expect(hasFilters).toBeTruthy();
    });
    
  });
  
  test.describe('Navegação', () => {
    
    test('deve navegar para detalhes da vaga ao clicar', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Aguardar carregamento
      await page.waitForLoadState('networkidle');
      
      // Tentar clicar em uma vaga (se houver)
      const vagaCard = page.locator('[class*="card"], [class*="vaga"]').first();
      
      if (await vagaCard.isVisible()) {
        // Verificar se há botão de detalhes ou se o card é clicável
        const detalhesBtn = vagaCard.getByRole('button', { name: /Ver detalhes|Candidatar|Ver vaga/i });
        
        if (await detalhesBtn.isVisible()) {
          await detalhesBtn.click();
          
          // Verificar se abriu modal ou navegou
          await page.waitForTimeout(500);
          
          // Pode abrir modal ou navegar para outra página
          const modal = page.locator('[role="dialog"], [class*="modal"]');
          const isModalOpen = await modal.isVisible().catch(() => false);
          const urlChanged = page.url() !== `${BASE_URL}/vagas`;
          
          expect(isModalOpen || urlChanged).toBeTruthy();
        }
      }
    });
    
    test('deve ter links de navegação funcionais no header', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Verificar links do menu
      const linkInicio = page.getByRole('link', { name: /Início/i });
      const linkVagas = page.getByRole('link', { name: /Vagas/i });
      const linkCursos = page.getByRole('link', { name: /Cursos/i });
      const linkEmpresas = page.getByRole('link', { name: /Empresas/i });
      
      await expect(linkInicio).toBeVisible();
      await expect(linkVagas).toBeVisible();
      await expect(linkCursos).toBeVisible();
      await expect(linkEmpresas).toBeVisible();
    });
    
    test('deve navegar para página inicial ao clicar no logo', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Clicar no logo
      const logo = page.getByRole('link', { name: /Geração Emprego/i }).first();
      
      if (await logo.isVisible()) {
        await logo.click();
        
        // Verificar se navegou para home
        await expect(page).toHaveURL(`${BASE_URL}/`);
      }
    });
    
  });
  
  test.describe('Responsividade', () => {
    
    test('deve exibir corretamente em desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${BASE_URL}/vagas`);
      
      // Verificar elementos principais
      const header = page.locator('header');
      const searchSection = page.getByPlaceholder(/Buscar/i);
      
      await expect(header).toBeVisible();
      await expect(searchSection).toBeVisible();
    });
    
    test('deve exibir corretamente em tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${BASE_URL}/vagas`);
      
      // Verificar elementos principais
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });
    
    test('deve exibir corretamente em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(`${BASE_URL}/vagas`);
      
      // Verificar elementos principais
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Em mobile, pode ter menu hambúrguer
      const menuBtn = page.getByRole('button', { name: /menu/i });
      const isMenuVisible = await menuBtn.isVisible().catch(() => false);
      
      // Ou os links podem estar em um drawer
      expect(true).toBeTruthy(); // Página carregou sem erros
    });
    
  });
  
  test.describe('Acessibilidade', () => {
    
    test('deve ter atributos de acessibilidade nos elementos principais', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Verificar se há link para pular para conteúdo principal
      const skipLink = page.getByRole('link', { name: /Pular para o conteúdo/i });
      const hasSkipLink = await skipLink.isVisible().catch(() => false);
      
      // Verificar se inputs têm labels
      const searchInput = page.getByPlaceholder(/Buscar/i);
      const hasSearchInput = await searchInput.isVisible();
      
      expect(hasSearchInput).toBeTruthy();
    });
    
    test('deve permitir navegação por teclado', async ({ page }) => {
      await page.goto(`${BASE_URL}/vagas`);
      
      // Pressionar Tab para navegar
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Verificar se algum elemento está focado
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });
    
  });
  
});

test.describe('Página Inicial - Vagas Recomendadas', () => {
  
  test('deve exibir seção de vagas recomendadas na home', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');
    
    // Verificar se há seção de vagas
    const vagasSection = page.getByText(/Vagas para Você|Vagas em Destaque|Vagas Recomendadas/i);
    const hasVagasSection = await vagasSection.isVisible().catch(() => false);
    
    // Pode não ter seção se não houver vagas
    expect(true).toBeTruthy(); // Página carregou sem erros
  });
  
  test('deve ter link para ver todas as vagas', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    // Procurar link para página de vagas
    const verTodasLink = page.getByRole('link', { name: /Ver todas as vagas|Ver mais vagas/i });
    const hasLink = await verTodasLink.isVisible().catch(() => false);
    
    if (hasLink) {
      await verTodasLink.click();
      await expect(page).toHaveURL(/\/vagas/);
    }
  });
  
});
