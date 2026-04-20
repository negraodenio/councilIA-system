# Correções e Hardening (2026-04-20)

Este documento resume as **correções** e melhorias de **segurança/produção** implementadas nesta sessão para preparar o projeto para **deploy em Vercel PRO**.

## Objetivos

- Evitar **IDOR** (usuário autenticado acessando/modificando dados de outro tenant/usuário).
- Remover/mitigar **vazamento de dados** por endpoints de debug/legados.
- Reduzir o uso indevido do **Supabase service-role** (e impedir rotas “admin” abertas).
- Tornar `npm run lint` **não-interativo** (compatível com CI).
- Ajustar rotas Stripe para evitar warning/erro de “static rendering” no build do Next.

## Principais mudanças (alto nível)

### 1) Autorização forte (tenant/user) em rotas críticas

Foi criado um contexto de autenticação centralizado para:

- Identificar o **usuário logado** via sessão.
- Resolver o **tenant** e **role** (via tabela `profiles`).
- Reutilizar isso nos handlers para validar **ownership** antes de consultar/alterar dados com client admin.

Arquivos adicionados:

- `src/lib/security/auth-context.ts`
- `src/lib/security/ownership.ts`

Aplicado nas rotas (exemplos):

- Streaming e escrita de eventos do debate:
  - `src/app/api/chamber/stream/route.ts` (verifica se o `runId` pertence ao tenant/usuário antes de stream)
  - `src/app/api/session/interject/route.ts` (verifica ownership do run antes de inserir evento)
- Execução do worker:
  - `src/app/api/session/worker/route.ts` (verifica ownership de `debate_runs` e `validations`, e não aceita `tenant_id/user_id` do body)
- Repositórios/RAG/embeddings:
  - `src/app/api/repo/create/route.ts` (remove `tenant_id/user_id` do body; aplica política admin p/ tenant compartilhado)
  - `src/app/api/repo/sync/route.ts` (idem; bloqueia sync em tenant compartilhado sem role `admin`)
  - `src/app/api/repo/embed/route.ts` (verifica ownership do repo)
  - `src/app/api/rag/query/route.ts` (verifica ownership do repo)
  - `src/app/api/repo/ingest-text/route.ts` (ignora `uId` do body; usa o usuário autenticado)
- Patches:
  - `src/app/api/patch/generate/route.ts` (remove `tenant_id` do body; valida ownership de `validations` e `repositories`)
  - `src/app/api/patch/preview/route.ts` (exige auth; valida ownership do patch)
  - `src/app/api/patch/apply/route.ts` (exige auth; valida ownership do patch)

### 2) Endpoints de debug/legado: desabilitados em produção + “internal auth”

Foi adicionado um verificador de chamada interna com `x-internal` para endpoints de risco:

- `src/lib/security/internal-auth.ts` (usa comparação timing-safe)

Mudanças principais:

- `src/app/api/debug/events/route.ts`
  - Agora retorna **404** em produção (ou quando `ENABLE_DEBUG_ENDPOINTS !== 'true'`).
  - Exige `x-internal` válido quando habilitado.
- `src/app/api/repo/ingest/route.ts` (endpoint legado)
  - Agora retorna **404** em produção por padrão e exige `x-internal`.
- `src/app/api/chamber/interject/route.ts` (endpoint legado)
  - Agora retorna **404** em produção por padrão e exige `x-internal`.
- `src/app/api/github/ping/route.ts` (debug)
  - Agora retorna **404** em produção por padrão.
  - Se `INTERNAL_WORKER_SECRET` estiver configurado, exige `x-internal`.
- `src/app/api/patch/apply_to_github_pr/route.ts` (alto risco: escreve em GitHub)
  - Agora retorna **404** a menos que `ENABLE_GITHUB_PR_WRITE === 'true'`.
  - Exige `x-internal`.
  - Exige usuário autenticado e aplica política de admin para tenant compartilhado.

### 3) Middleware: proteção de rotas mais completa

O middleware foi expandido para cobrir mais superfícies de API no redirect/proteção:

- `src/middleware.ts`
  - Inclui `/api/chamber`, `/api/stripe`, `/api/admin`, `/api/audit`, `/api/debug` em `protectedPaths`.

### 4) Stripe routes marcadas como dinâmicas (Next build)

Para evitar comportamento inesperado no build do Next quando `cookies()`/auth estão presentes:

- `src/app/api/stripe/portal/route.ts` (`runtime = 'nodejs'`, `dynamic = 'force-dynamic'`)
- `src/app/api/stripe/checkout/route.ts` (`runtime = 'nodejs'`, `dynamic = 'force-dynamic'`)

### 5) Supabase clients: falha “mais segura” em produção

Em produção, operar com URLs/keys placeholder é perigoso. Foi alterado para:

- `src/lib/supabase/admin.ts` (service-role)
  - Em `NODE_ENV=production`, **lança erro** se faltar `NEXT_PUBLIC_SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY`.
- `src/lib/supabase/server.ts` (anon)
  - Em `NODE_ENV=production`, **lança erro** se faltar `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 6) ESLint não-interativo para CI

Antes, `npm run lint` disparava o “setup wizard” do Next (interativo), quebrando CI.

Foram adicionados:

- `.eslintrc.json` (config padrão Next)
- Dependências em `package.json`:
  - `eslint`
  - `eslint-config-next`

Notas:

- Algumas regras foram relaxadas para evitar bloqueio imediato por `any`, `prefer-const`, e warnings de JSX. Isso permite manter lint “rodando” e ir apertando as regras depois.

## Documentação adicionada

- `docs/PROD_ENV.md` — checklist e env vars/flags para Vercel PRO.

## Observações / Pendências para “Go Live”

- Após `npm install`, o `npm` reportou **vulnerabilidades** (incluindo high/critical). Recomenda-se rodar `npm audit` e corrigir antes de lançar.
- O projeto declara engine **Node 20.x**; ajuste o Node da Vercel para 20.x para evitar diferenças.
- Há warnings de lint por variáveis não usadas e hooks; não quebram build, mas vale limpar para manutenção.

