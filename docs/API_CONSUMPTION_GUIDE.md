# CouncilIA v7.2 - Senior Regulatory Audit API Guide

Este guia descreve como integrar e consumir a inteligência de decisão do CouncilIA v7.2 (v6.1 PRO). As saídas descritas abaixo são padronizadas tanto para o ambiente **Embrapa** quanto para uso **Geral**.

## 1. Endpoint Principal

**POST** `/api/report`

### Parâmetros de Query
- `async=true` (Opcional): Executa a análise em segundo plano.

---

## 2. Autenticação

A API utiliza o sistema de autenticação do Supabase. Inclua o JWT no header:

```http
Authorization: Bearer <YOUR_SUPABASE_JWT>
```

---

## 3. Estrutura do Payload (JSON)

```json
{
  "proposal": "Sua proposta técnica (mín 50 chars)...",
  "context": "agro", // agro, finance, healthcare, government, corporate
  "jurisdiction": "BR", // BR, EU, GLOBAL
  "rag_documents": [...],
  "metadata": { "session_id": "uuid" }
}
```

---

## 4. Retorno (JSON v7.2 - Senior Audit)

O CouncilIA v7.2 retorna um objeto com rigor metrológico e validação anti-inconsistência:

```json
{
  "success": true,
  "data": {
    "is_valid": true, // Flag de Consistência Metrológica (v6.1 PRO)
    "audit_warnings": [], // Alertas de contradição lógica (ex: Score alto com Consenso baixo)
    
    "executive_verdict": {
      "verdict": "GO", 
      "score": 85, // Média técnica das personas (0-100)
      "consensus": 92, // Grau de convergência (ISO 5725 - Baseado em StdDev)
      "dissent": 8, // Range de divergência entre especialistas
      "confidence": {
        "level": "HIGH",
        "evidence_density": "High (98.4%)"
      },
      "var": {
        "percentage": 4.2, // Value at Risk (Eurachem Uncertainty U)
        "interpretation": "Risco residual controlado por protocolos de mitigação."
      }
    },
    
    "evidence_audit": {
      "high_confidence": [
        { "source": "ZARC / ISO 17025", "supports": "Dados de solo validados" }
      ],
      "unsupported": []
    },
    
    "protocol": {
      "version": "7.2",
      "rounds": 3,
      "methodology": "Adversarial v6.1 PRO (ISO 5725 Statistical Engine)"
    }
  }
}
```

### Explicação dos Novos Campos (v6.1 PRO):
- **is_valid**: Se `false`, indica que a IA gerou uma resposta contraditória que falhou no validador matemático.
- **consensus**: Calculado via desvio padrão. Quanto mais vozes concordam, maior o consenso. Não é uma simples média.
- **var.percentage**: Probabilidade estatística de erro baseada na incerteza metrológica (Threshold ± U).

---

## 5. Ambientes Suportados
As configurações de v7.2 são aplicadas integralmente em:
1. **Ambiente Embrapa**: Focado em conformidade regulatória (ZARC, MAPA).
2. **Ambiente Geral**: Focado em auditoria corporativa e financeira.

---

> [!IMPORTANT]
> A API v7.2 impõe rate limits por jurisdição. Em caso de `is_valid: false`, recomenda-se rodar uma nova rodada com contexto RAG expandido.
