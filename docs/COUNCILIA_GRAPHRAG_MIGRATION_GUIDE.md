# Guia de Migração e Arquitetura: CouncilIA + GraphRAG

Este documento detalha o "como", o "quanto custa" e o "porquê" de migrar para uma arquitetura baseada em grafos, mantendo a robustez atual.

---

## 1. A Nova Arquitetura Híbrida
Você **NÃO** deve abandonar o Supabase nem o QStash. Eles são os pilares da sua infraestrutura operacional. O GraphRAG entra como uma **Camada de Inteligência**.

| Componente | Ferramenta | Função |
| :--- | :--- | :--- |
| **Relacional / Auth** | **Supabase** | Fonte da verdade para usuários, sessões, relatórios finais e histórico. |
| **Fila Assíncrona** | **QStash** | Garante que o debate (que leva tempo) não caia e seja processado em background. |
| **Conhecimento Profundo**| **Neo4j** | Onde o GraphRAG vive. Armazena as relações entre leis, riscos e evidências. |

---

## 2. Qual a opção mais barata?
Existem dois caminhos principais de custo:

### Opção A: Self-Hosted (Mais Barata no longo prazo)
- **Ferramenta:** Neo4j Community Edition ou **FalkorDB** (Docker).
- **Custo:** R$ 0 (licença open source). Você paga apenas a máquina (ex: uma instância de $10/mês na DigitalOcean ou AWS).
- **Complexidade:** Alta. Você precisa gerenciar o servidor, backup e segurança.

### Opção B: Managed Services (Melhor Custo-Benefício para Startups)
- **Ferramenta:** **Neo4j AuraDB (Free Tier)**.
- **Custo:** $0 (até um limite razoável). O plano Professional começa em ~$50/mês.
- **Vantagem:** Zero manutenção. Eles cuidam de tudo.

---

## 3. Qual a mais confiável?
Sem dúvida, o **Neo4j**.
- É usado por 75% das empresas da Fortune 500.
- Tem a melhor integração com bibliotecas de IA (LangChain/LlamaIndex).
- Possui uma linguagem de query (Cypher) madura e fácil de depurar.

---

## 4. Passo a Passo da Migração (Roadmap)

### Passo 1: A Ingestão Híbrida
Quando você sobe um PDF hoje, ele vai para o Supabase Storage e é vetorizado. No Passo 1, você adiciona um processo que usa o LLM para extrair **Tríplices** do PDF: `(Entidade A) -- [Relacionamento] -- (Entidade B)`.
- *Exemplo:* `(Agregado Siderúrgico) -- [REGULADO_POR] -- (Norma Técnica 123)`.

### Passo 2: O Debate Aprimorado
No `JudgeService.ts`, antes de pedir para a persona falar, você faz uma busca no Neo4j:
- *"Me dê tudo o que está relacionado à Entidade X e como isso afeta a Variável Y."*

### Passo 3: O Veredito de Grafo
O score final agora passa a ter um "Índice de Conectividade", mostrando que a decisão não é baseada apenas em texto, mas em uma rede sólida de provas.

---

## 5. Veredito Final do Arquiteto
- **Continue com Supabase:** Para tudo o que for operacional/clássico.
- **Continue com QStash:** Para gerenciar o fluxo assíncrono do CouncilIA.
- **Adicione Neo4j AuraDB (Free):** Comece pequeno, conectando-o via API ao seu backend atual. É o caminho mais confiável e com risco financeiro zero inicialmente.
