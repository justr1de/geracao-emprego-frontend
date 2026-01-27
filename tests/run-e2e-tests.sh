#!/bin/bash

# =============================================================================
# Script de Execução de Testes E2E
# Portal Geração Emprego
# =============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URL base para testes
export TEST_BASE_URL="${TEST_BASE_URL:-https://geracao-emprego-dev.vercel.app}"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}  Testes E2E - Portal Geração Emprego${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""
echo -e "${YELLOW}URL Base: ${TEST_BASE_URL}${NC}"
echo ""

# Função para executar testes de API
run_api_tests() {
    echo -e "${BLUE}[1/2] Executando testes de API...${NC}"
    echo ""
    
    # Verificar se vitest está disponível
    if command -v npx &> /dev/null; then
        npx vitest run tests/e2e/api-vagas.test.ts --reporter=verbose
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Testes de API concluídos com sucesso!${NC}"
        else
            echo -e "${RED}✗ Alguns testes de API falharam${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠ vitest não encontrado, pulando testes de API${NC}"
    fi
    
    echo ""
}

# Função para executar testes de Frontend
run_frontend_tests() {
    echo -e "${BLUE}[2/2] Executando testes de Frontend...${NC}"
    echo ""
    
    # Verificar se playwright está disponível
    if command -v npx &> /dev/null; then
        # Instalar browsers se necessário
        npx playwright install chromium --with-deps 2>/dev/null || true
        
        npx playwright test tests/e2e/frontend-vagas.test.ts --project=chromium
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Testes de Frontend concluídos com sucesso!${NC}"
        else
            echo -e "${RED}✗ Alguns testes de Frontend falharam${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠ playwright não encontrado, pulando testes de Frontend${NC}"
    fi
    
    echo ""
}

# Função para executar testes rápidos de API (sem vitest)
run_quick_api_tests() {
    echo -e "${BLUE}Executando verificação rápida das APIs...${NC}"
    echo ""
    
    # Teste 1: API de Vagas
    echo -n "  Testando /api/vagas... "
    response=$(curl -s -o /dev/null -w "%{http_code}" "${TEST_BASE_URL}/api/vagas?limit=5")
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}OK (HTTP $response)${NC}"
    else
        echo -e "${RED}FALHOU (HTTP $response)${NC}"
    fi
    
    # Teste 2: API de Vagas Recomendadas
    echo -n "  Testando /api/vagas/recomendadas... "
    response=$(curl -s -o /dev/null -w "%{http_code}" "${TEST_BASE_URL}/api/vagas/recomendadas?limit=3")
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}OK (HTTP $response)${NC}"
    else
        echo -e "${RED}FALHOU (HTTP $response)${NC}"
    fi
    
    # Teste 3: Verificar se retorna vagas
    echo -n "  Verificando se há vagas no sistema... "
    vagas_count=$(curl -s "${TEST_BASE_URL}/api/vagas?limit=1" | python3 -c "import sys, json; print(json.load(sys.stdin).get('pagination', {}).get('total', 0))" 2>/dev/null || echo "0")
    if [ "$vagas_count" -gt "0" ]; then
        echo -e "${GREEN}OK ($vagas_count vagas encontradas)${NC}"
    else
        echo -e "${YELLOW}AVISO (0 vagas encontradas)${NC}"
    fi
    
    # Teste 4: Página de Vagas
    echo -n "  Testando página /vagas... "
    response=$(curl -s -o /dev/null -w "%{http_code}" "${TEST_BASE_URL}/vagas")
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}OK (HTTP $response)${NC}"
    else
        echo -e "${RED}FALHOU (HTTP $response)${NC}"
    fi
    
    # Teste 5: Página Inicial
    echo -n "  Testando página inicial... "
    response=$(curl -s -o /dev/null -w "%{http_code}" "${TEST_BASE_URL}/")
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}OK (HTTP $response)${NC}"
    else
        echo -e "${RED}FALHOU (HTTP $response)${NC}"
    fi
    
    echo ""
}

# Menu principal
case "${1:-quick}" in
    "api")
        run_api_tests
        ;;
    "frontend")
        run_frontend_tests
        ;;
    "all")
        run_api_tests
        run_frontend_tests
        ;;
    "quick")
        run_quick_api_tests
        ;;
    *)
        echo "Uso: $0 [quick|api|frontend|all]"
        echo ""
        echo "  quick    - Verificação rápida das APIs (padrão)"
        echo "  api      - Testes completos de API com vitest"
        echo "  frontend - Testes de frontend com Playwright"
        echo "  all      - Todos os testes"
        exit 1
        ;;
esac

echo -e "${BLUE}============================================================${NC}"
echo -e "${GREEN}  Testes concluídos!${NC}"
echo -e "${BLUE}============================================================${NC}"
