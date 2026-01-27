import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E
 * Portal Geração Emprego
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  // Timeout para cada teste
  timeout: 30 * 1000,
  
  // Timeout para expect
  expect: {
    timeout: 10 * 1000,
  },
  
  // Executar testes em paralelo
  fullyParallel: true,
  
  // Falhar o build se houver test.only no CI
  forbidOnly: !!process.env.CI,
  
  // Número de retentativas em caso de falha
  retries: process.env.CI ? 2 : 0,
  
  // Número de workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  
  // Configurações globais
  use: {
    // URL base para os testes
    baseURL: process.env.TEST_BASE_URL || 'https://geracao-emprego-dev.vercel.app',
    
    // Coletar trace em caso de falha
    trace: 'on-first-retry',
    
    // Screenshot em caso de falha
    screenshot: 'only-on-failure',
    
    // Video em caso de falha
    video: 'on-first-retry',
  },
  
  // Projetos (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Testes mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
