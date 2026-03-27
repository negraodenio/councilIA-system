# Estratégia GraphRAG: O Próximo Nível da Inteligência Deliberativa do CouncilIA

**Status:** Proposta Estratégica v1.0  
**Objetivo:** Evoluir o suporte à decisão de "Busca de Documentos" para "Raciocínio de Relacionamentos".

---

## 1. O Problema do RAG Tradicional (Vetorial)
O RAG atual (Vector-only) busca fragmentos de texto por similaridade semântica. 
- **Limitação:** Ele não entende a hierarquia ou a contradição entre normas. 
- **Exemplo:** Se um documento diz "Pode usar X" e outro diz "Exceto se Y ocorrer", o RAG vetorial pode retornar apenas o primeiro, levando a um erro de decisão.

---

## 2. A Solução: GraphRAG no CouncilIA
O GraphRAG constrói um **Grafo de Conhecimento (Knowledge Graph)** onde os documentos são transformados em Entidades (Nós) e Relacionamentos (Arestas).

### Arquitetura Proposta:
1. **Extração de Entidades:** Identificar "Regulamentações", "Riscos", "Personas", "Penalidades" e "Contextos".
2. **Mapeamento de Arestas:** Definir como elas se conectam (ex: `REGULAÇÃO_A` -> `ANULA` -> `NORMA_B`).
3. **Closterização Semântica:** O sistema entende comunidades de tópicos relacionados, permitindo que as personas debatam conceitos globais, não apenas palavras isoladas.

---

## 3. Ferramentas Recomendadas (Stack Técnica)

| Ferramenta | Papel no CouncilIA | Por que usar? |
| :--- | :--- | :--- |
| **Neo4j** | Banco de Dados de Grafo | O padrão ouro da indústria para escalabilidade e consultas complexas (Cypher). |
| **Microsoft GraphRAG** | Framework de Indexação | Automatiza a criação de comunidades e resumos de grafos de forma nativa. |
| **LlamaIndex** | Orquestração | Melhor suporte para "Property Graphs" e integração com nossa engine de scoring. |
| **LangChain (GraphQA)** | Interface de Consulta | Facilita a tradução de linguagem natural em queries de grafo para as personas. |
| **FalkorDB** | Database Ultrarrápido | Alternativa ao Neo4j se a latência de debate for a prioridade absoluta. |

---

## 4. Benefícios Práticos para o CouncilIA v8.0

### 4.1 Cruzamento Trans-Regulatório
O sistema poderá dizer: *"O Visionário apoia a proposta, mas o Auditor detectou no Grafo que a Norma Euro 7 (EU) impõe uma restrição que invalida a viabilidade técnica no longo prazo."*

### 4.2 Rastreabilidade de Causalidade
Ao contrário do RAG vetorial que apenas dá o link, o GraphRAG fornece a **corrente de raciocínio**:
- `PROPOSTA` -> `AFETA` -> `MEIO AMBIENTE` -> `REGULADO POR` -> `CONAMA 450`.

---

## 5. Roadmap de Implementação

1. **Fase 1 (Extração):** Ingestão dos documentos atuais e extração automática de entidades via LLM (Entity Extraction).
2. **Fase 2 (Estruturação):** Criação do esquema de grafo (Ontologia) no Neo4j.
3. **Fase 3 (Integração):** Atualização do `JudgeService` para consultar o grafo antes de disparar o debate das personas.
4. **Fase 4 (Visualização):** Adição de um mapa de relacionamentos interativo no Dashboard.

---

**Autor:** Senior AI Architect  
**Data:** 27/03/2026  
**Tecnologia Sugerida:** Neo4j + Microsoft GraphRAG Pipeline
