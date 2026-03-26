# CouncilIA v7.1 API Consumption Guide

Este guia descreve como integrar e consumir a inteligência de decisão do CouncilIA via API.

## 1. Endpoint Principal

**POST** `/api/report`

### Parâmetros de Query
- `async=true` (Opcional): Executa a análise em segundo plano e retorna um `session_id`. Recomendado para sessões pesadas.

---

## 2. Autenticação

A API utiliza o sistema de autenticação do Supabase. Para chamadas externas, inclua o JWT no header:

```http
Authorization: Bearer <YOUR_SUPABASE_JWT>
```

---

## 3. Estrutura do Payload (JSON)

Para iniciar uma deliberação, envie um JSON seguindo este esquema:

```json
{
  "proposal": "Sua proposta técnica ou decisão complexa aqui (mín 50 chars)...",
  "context": "agro", // Opções: agro, finance, healthcare, government, corporate
  "jurisdiction": "BR", // Opções: BR, EU, GLOBAL
  "rag_documents": [
    {
      "id": "uuid-do-documento",
      "content": "Conteúdo extraído do RAG...",
      "source": "ZARC 2024 / Manual de Solos",
      "type": "technical",
      "sensitivity": "INTERNAL"
    }
  ],
  "consent": {
    "consentId": "uuid",
    "purposes": ["DECISION_ANALYSIS", "AUDIT_TRAIL"],
    "grantedAt": "ISO-TIMESTAMP"
  },
  "metadata": {
    "user_id": "uuid",
    "organization_id": "uuid",
    "department": "Pesquisa & Desenvolvimento"
  }
}
```

---

## 4. Retorno (JSON v7.1)

O CouncilIA retorna um objeto rico em métricas regulatórias e técnicas:

```json
{
  "success": true,
  "data": {
    "executive_verdict": {
      "verdict": "CONDITIONAL", // GO, STOP, CONDITIONAL
      "score": 78, // 0-100 (Consenso Neural)
      "confidence": {
        "level": "HIGH",
        "evidence_density": "High"
      },
      "var": {
        "percentage": 12.5, // Value at Risk (Probabilidade de falha)
        "drivers": ["Complexidade Logística", "Risco Regulatório ANVISA"]
      }
    },
    "evidence_audit": {
      "high_confidence": [
        { "source": "RDC 166/2017", "supports": "Robustez Metodológica" }
      ],
      "unsupported": [
        { "claim": "Ganho imediato de 40%", "issue": "Falta de dados longitudinais", "flag": "ASSUMPTION" }
      ]
    },
    "protocol": {
      "version": "7.1",
      "rounds": 3,
      "methodology": "Adversarial Thesis-Antithesis-Synthesis"
    }
  },
  "compliance": {
    "jurisdiction": "BR",
    "lawful_basis": "LGPD Art. 7, I",
    "retention_years": 5
  }
}
```

---

## 5. Webhooks (Modo Async)

Se usar `async=true`, você deve configurar um endpoint para receber o veredito final. O CouncilIA disparará um POST para sua URL configurada no Upstash QStash quando a deliberação terminar.

---

> [!IMPORTANT]
> A API impõe rate limits baseados na jurisdição (10 req/min para EU, 5 req/min para BR). Certifique-se de tratar erros `429 Too Many Requests`.
