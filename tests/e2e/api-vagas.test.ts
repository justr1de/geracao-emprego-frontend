/**
 * Testes End-to-End para as APIs de Vagas
 * Portal Geração Emprego
 * 
 * Este arquivo contém testes automatizados para validar:
 * - API de listagem de vagas (/api/vagas)
 * - API de vagas recomendadas (/api/vagas/recomendadas)
 * - API de detalhes da vaga (/api/vagas/[id])
 * - Filtros e paginação
 */

import { describe, it, expect, beforeAll } from 'vitest';

// URL base para os testes (ambiente de desenvolvimento)
const BASE_URL = process.env.TEST_BASE_URL || 'https://geracao-emprego-dev.vercel.app';

// Timeout para requisições
const REQUEST_TIMEOUT = 30000;

// Helper para fazer requisições com timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = REQUEST_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

describe('API de Vagas - Testes E2E', () => {
  
  describe('GET /api/vagas - Listagem de Vagas', () => {
    
    it('deve retornar lista de vagas com status 200', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas`);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('vagas');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.vagas)).toBe(true);
    });
    
    it('deve retornar estrutura de paginação correta', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?page=1&limit=10`);
      const data = await response.json();
      
      expect(data.pagination).toHaveProperty('page');
      expect(data.pagination).toHaveProperty('limit');
      expect(data.pagination).toHaveProperty('total');
      expect(data.pagination).toHaveProperty('totalPages');
      
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(10);
      expect(typeof data.pagination.total).toBe('number');
    });
    
    it('deve retornar vagas com campos obrigatórios', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?limit=5`);
      const data = await response.json();
      
      if (data.vagas.length > 0) {
        const vaga = data.vagas[0];
        
        // Campos obrigatórios da vaga
        expect(vaga).toHaveProperty('id');
        expect(vaga).toHaveProperty('cargo');
        expect(vaga).toHaveProperty('descricao');
        expect(vaga).toHaveProperty('empresa_id');
        
        // Relacionamentos
        expect(vaga).toHaveProperty('empresas');
        if (vaga.empresas) {
          expect(vaga.empresas).toHaveProperty('nome_fantasia');
        }
      }
    });
    
    it('deve filtrar vagas por busca de texto (cargo)', async () => {
      const searchTerm = 'Vendedor';
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      // Se houver resultados, verificar se contém o termo buscado
      if (data.vagas.length > 0) {
        const hasMatch = data.vagas.some((vaga: any) => 
          vaga.cargo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vaga.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(hasMatch).toBe(true);
      }
    });
    
    it('deve filtrar vagas por área de atuação', async () => {
      const areaId = 1; // Comércio/Vendas
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?area_id=${areaId}`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      if (data.vagas.length > 0) {
        data.vagas.forEach((vaga: any) => {
          expect(vaga.area_id).toBe(areaId);
        });
      }
    });
    
    it('deve filtrar vagas por faixa salarial mínima', async () => {
      const salarioMin = 2000;
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?salario_min=${salarioMin}`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      if (data.vagas.length > 0) {
        data.vagas.forEach((vaga: any) => {
          if (vaga.salario_min) {
            expect(vaga.salario_min).toBeGreaterThanOrEqual(salarioMin);
          }
        });
      }
    });
    
    it('deve respeitar limite de paginação', async () => {
      const limit = 5;
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?limit=${limit}`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.vagas.length).toBeLessThanOrEqual(limit);
    });
    
    it('deve ordenar vagas por data de criação (mais recentes primeiro)', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?sort_by=created_at&sort_order=desc&limit=10`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      if (data.vagas.length > 1) {
        for (let i = 0; i < data.vagas.length - 1; i++) {
          const currentDate = new Date(data.vagas[i].created_at).getTime();
          const nextDate = new Date(data.vagas[i + 1].created_at).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      }
    });
    
  });
  
  describe('GET /api/vagas/recomendadas - Vagas Recomendadas', () => {
    
    it('deve retornar lista de vagas recomendadas com status 200', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas/recomendadas`);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('vagas');
      expect(data).toHaveProperty('hasProfile');
      expect(data).toHaveProperty('totalAnalyzed');
      expect(Array.isArray(data.vagas)).toBe(true);
    });
    
    it('deve respeitar limite de vagas recomendadas', async () => {
      const limit = 3;
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas/recomendadas?limit=${limit}`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.vagas.length).toBeLessThanOrEqual(limit);
    });
    
    it('deve retornar vagas com estrutura de match (para usuários não logados)', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas/recomendadas`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      // Para usuários não logados, hasProfile deve ser false
      expect(data.hasProfile).toBe(false);
      
      if (data.vagas.length > 0) {
        const vaga = data.vagas[0];
        expect(vaga).toHaveProperty('matchScore');
        expect(vaga).toHaveProperty('matchDetails');
      }
    });
    
    it('deve incluir dados da empresa nas vagas recomendadas', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas/recomendadas`);
      const data = await response.json();
      
      if (data.vagas.length > 0) {
        const vaga = data.vagas[0];
        expect(vaga).toHaveProperty('empresas');
        if (vaga.empresas) {
          expect(vaga.empresas).toHaveProperty('nome_fantasia');
        }
      }
    });
    
  });
  
  describe('GET /api/vagas/[id] - Detalhes da Vaga', () => {
    let vagaId: string;
    
    beforeAll(async () => {
      // Buscar uma vaga existente para usar nos testes
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?limit=1`);
      const data = await response.json();
      
      if (data.vagas.length > 0) {
        vagaId = data.vagas[0].id;
      }
    });
    
    it('deve retornar detalhes de uma vaga específica', async () => {
      if (!vagaId) {
        console.warn('Nenhuma vaga disponível para teste');
        return;
      }
      
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas/${vagaId}`);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('vaga');
      expect(data.vaga.id).toBe(vagaId);
    });
    
    it('deve retornar 404 para vaga inexistente', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas/${fakeId}`);
      
      // Pode retornar 404 ou 200 com vaga null, dependendo da implementação
      const data = await response.json();
      
      if (response.status === 200) {
        expect(data.vaga).toBeNull();
      } else {
        expect(response.status).toBe(404);
      }
    });
    
    it('deve incluir todos os relacionamentos nos detalhes', async () => {
      if (!vagaId) {
        console.warn('Nenhuma vaga disponível para teste');
        return;
      }
      
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas/${vagaId}`);
      const data = await response.json();
      
      if (data.vaga) {
        // Verificar relacionamentos opcionais
        if (data.vaga.empresas) {
          expect(data.vaga.empresas).toHaveProperty('nome_fantasia');
        }
        if (data.vaga.areas_vaga) {
          expect(data.vaga.areas_vaga).toHaveProperty('nome');
        }
      }
    });
    
  });
  
  describe('Validação de Dados - Integridade', () => {
    
    it('deve retornar apenas vagas ativas (status_id = 1)', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?limit=50`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      // Todas as vagas retornadas devem ter status_id = 1
      data.vagas.forEach((vaga: any) => {
        expect(vaga.status_id).toBe(1);
      });
    });
    
    it('deve ter salário mínimo menor ou igual ao máximo', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?limit=50`);
      const data = await response.json();
      
      data.vagas.forEach((vaga: any) => {
        if (vaga.salario_min && vaga.salario_max) {
          expect(vaga.salario_min).toBeLessThanOrEqual(vaga.salario_max);
        }
      });
    });
    
    it('deve ter empresa associada a cada vaga', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?limit=20`);
      const data = await response.json();
      
      data.vagas.forEach((vaga: any) => {
        expect(vaga.empresa_id).toBeTruthy();
      });
    });
    
    it('deve ter quantidade de vagas maior que zero', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?limit=20`);
      const data = await response.json();
      
      data.vagas.forEach((vaga: any) => {
        if (vaga.quantidade_vagas !== null && vaga.quantidade_vagas !== undefined) {
          expect(vaga.quantidade_vagas).toBeGreaterThan(0);
        }
      });
    });
    
  });
  
  describe('Performance e Resiliência', () => {
    
    it('deve responder em menos de 5 segundos', async () => {
      const startTime = Date.now();
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?limit=10`);
      const endTime = Date.now();
      
      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(5000);
    });
    
    it('deve lidar com parâmetros inválidos sem quebrar', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?page=-1&limit=abc`);
      
      // Deve retornar 200 com valores padrão ou 400 com erro
      expect([200, 400]).toContain(response.status);
    });
    
    it('deve retornar array vazio para filtros sem resultados', async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?search=xyznonexistent123456`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.vagas).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });
    
  });
  
});

describe('Estatísticas e Contadores', () => {
  
  it('deve ter vagas ativas no sistema', async () => {
    const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?limit=1`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.pagination.total).toBeGreaterThan(0);
    
    console.log(`Total de vagas ativas: ${data.pagination.total}`);
  });
  
  it('deve ter vagas em múltiplas áreas', async () => {
    const areas = [1, 2, 3, 4, 5, 6, 7, 8];
    const areasComVagas: number[] = [];
    
    for (const areaId of areas) {
      const response = await fetchWithTimeout(`${BASE_URL}/api/vagas?area_id=${areaId}&limit=1`);
      const data = await response.json();
      
      if (data.vagas.length > 0) {
        areasComVagas.push(areaId);
      }
    }
    
    console.log(`Áreas com vagas: ${areasComVagas.join(', ')}`);
    expect(areasComVagas.length).toBeGreaterThan(0);
  });
  
});
