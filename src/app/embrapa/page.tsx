import React from 'react';

/**
 * Embrapa Elite Landing Page (/embrapa)
 * Version: 5.0 Elite — Motor de Decisão Científica e Regulatória (PT-BR)
 * 
 * Esta página é a porta de entrada para a POC da Embrapa.
 * Foco total em rigor científico, auditoria e conformidade.
 */
export default function EmbrapaLanding() {
  return (
    <main className="bg-[#0c0d1e] text-[#d1d5db] font-sans selection:bg-[#38bdf8]/30 selection:text-white min-h-screen">
      {/* Navegação */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-[#38bdf8]/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="size-8 bg-[#38bdf8]/10 rounded flex items-center justify-center border border-[#38bdf8]/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <span className="material-symbols-outlined text-[#38bdf8] text-sm font-bold">account_tree</span>
             </div>
             <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter uppercase font-display leading-none">Council<span className="text-[#38bdf8]">IA</span></span>
                <span className="text-[8px] font-mono tracking-[0.2em] uppercase text-[#38bdf8]/60">Motor Científico</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <a href="#protocolo" className="hidden md:block text-[10px] font-bold uppercase tracking-widest hover:text-[#38bdf8] transition-colors">Protocolo</a>
             <a href="#especialistas" className="hidden md:block text-[10px] font-bold uppercase tracking-widest hover:text-[#38bdf8] transition-colors">Especialistas</a>
             <a href="/login" className="bg-[#38bdf8]/10 border border-[#38bdf8]/50 text-[#38bdf8] px-6 py-2 rounded-xl font-bold text-sm transition-all hover:bg-[#38bdf8] hover:text-black hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                Login
             </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden tech-grid">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#38bdf8]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8] text-[10px] font-bold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38bdf8]"></span>
             </span>
             Protocolo Mestre Embrapa Elite v5.0 Master
          </div>
          <h1 className="text-5xl md:text-8xl font-black leading-[1] mb-8 tracking-tighter uppercase font-display">
            Decisões Científicas.<br />
            <span className="bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              Estruturadas. Defensáveis.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#d1d5db]/80 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            O CouncilIA é um mecanismo de validação de inovação agroindustrial de alta precisão. Através de um conselho multi-agente adversarial, transformamos hipóteses em vereditos auditáveis baseados em normas ISO, MAPA e ANVISA.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a href="/login" className="px-10 py-5 bg-[#38bdf8] text-black rounded-2xl font-black text-lg hover:shadow-[0_0_50px_rgba(56,189,248,0.6)] hover:scale-105 transition-all text-center">
                Entrar na Sala de Controle
             </a>
             <a href="#protocolo" className="px-10 py-5 border border-[#38bdf8]/20 bg-[#121235]/40 text-[#38bdf8] rounded-2xl font-black text-lg hover:bg-[#121235]/60 transition-all text-center">
                Explorar Protocolo
             </a>
          </div>
        </div>
      </section>

      {/* O Problema */}
      <section className="py-24 px-6 border-y border-white/5 bg-[#13152e]/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter font-display leading-[0.9]">
              A inovação não falha por ideias ruins —<br />
              <span className="text-[#d4a853] text-3xl opacity-80 decoration-[#38bdf8] underline decoration-4 underline-offset-8 mt-4 block italic">
                mas porque os riscos são identificados tarde demais.
              </span>
            </h2>
            <p className="text-lg text-[#d1d5db]/70 font-light max-w-md">
              O abismo entre a teoria laboratorial e a adoção no campo é onde investimentos bilionários perecem sem um veredito técnico robusto.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {[
               { t: 'Validação Fragmentada', d: 'Dados isolados geram pontos cegos estratégicos na inovação.' },
               { t: 'Falhas Técnicas Ocultas', d: 'Falta de auditorias profundas de seletividade e incerteza.' },
               { t: 'Surpresas Regulatórias', d: 'Não conformidades com RDC 166 descobertas tardiamente.' },
               { t: 'Baixa Adoção no Campo', d: 'Ignora o "Custo Brasil" e a complexidade operacional agro.' }
             ].map((item, i) => (
               <div key={i} className="p-6 glass-card rounded-2xl border-l-4 border-l-red-500/50 group hover:bg-[#13152e]/80 transition-all">
                  <h4 className="font-black text-xs uppercase tracking-widest mb-2 text-white group-hover:text-red-400 transition-colors">{item.t}</h4>
                  <p className="text-[10px] text-[#d1d5db]/60 leading-relaxed">{item.d}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Nossos Especialistas (Personas) */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden" id="especialistas">
        <div className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 bg-[#38bdf8]/5 blur-[100px] -z-10"></div>
          <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter font-display italic">Nossos Especialistas</h2>
          <p className="text-[#38bdf8] font-mono text-xs tracking-[0.4em] uppercase">Sete personas críticas treinadas em frameworks regulatórios brasileiros</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { title: 'Gestor de Inovação', icon: 'flare', framework: 'Soberania Tecnológica', d: 'Audita o impacto estratégico. Foca em inovação disruptiva vs. incremental e vantagem competitiva global.' },
             { title: 'Cientista Analítico', icon: 'terminal', framework: 'ISO 17025 / RDC 166', d: 'Especialista em seletividade, linearidade, precisão, exatidão e incerteza de medição. Validação rigorosa.' },
             { title: 'Auditor de Qualidade', icon: 'gavel', framework: 'ISO 5725 / Horwitz', d: 'Realiza análise de falha (Pre-Mortem). Audita reprodutibilidade, drift de calibração e consistência estatística.' },
             { title: 'Estrategista Regulatório', icon: 'account_balance', framework: 'MAPA / ANVISA / INMETRO', d: 'Identifica traps legais e barreiras de acreditação. Direciona o caminho para certificação e biossegurança.' },
             { title: 'Transferência de Tecnologia', icon: 'hub', framework: 'Adoção Operacional', d: 'Calcula complexidade logística, treinamento e paridade tecnológica no campo brasileiro (Cerrado/Amazônia).' },
             { title: 'Analista Financeiro', icon: 'monetization_on', framework: 'ROI / CAPEX / Plano Safra', d: 'Avalia ROI, Payback e aderência a linhas de fomento como Plano Safra, BNDES e FINEP. Viabilidade real.' },
             { title: 'Agente Customizado', icon: 'psychology', framework: 'Dados Internos Embrapa', d: 'O 7º Agente treinado nos documentos proprietários da sua unidade (Embrapa Soja, Milho, Amazônia, etc).' }
           ].map((expert, i) => (
             <div key={i} className={`p-6 glass-card rounded-2xl border ${expert.title === 'Agente Customizado' ? 'border-[#38bdf8]/50 bg-[#38bdf8]/5' : 'border-white/5'} hover:border-[#38bdf8]/40 transition-all flex flex-col`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${expert.title === 'Agente Customizado' ? 'bg-[#38bdf8] text-black' : 'bg-[#38bdf8]/10 text-[#38bdf8]'}`}>
                    <span className="material-symbols-outlined text-sm">{expert.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-[11px] uppercase tracking-tighter text-white leading-tight">{expert.title}</h4>
                    <p className="text-[8px] font-mono text-[#38bdf8] uppercase tracking-widest leading-none mt-1">{expert.framework}</p>
                  </div>
                </div>
                <p className="text-xs text-[#d1d5db]/60 leading-relaxed italic flex-grow">"{expert.d}"</p>
             </div>
           ))}
        </div>
      </section>

      {/* Como Funciona (Protocolo) */}
      <section className="py-24 px-6 bg-[#0c0d1e] border-y border-white/5 relative overflow-hidden" id="protocolo">
        <div className="absolute inset-0 tech-grid opacity-30"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 text-balance">
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tight font-display text-[#38bdf8]">O Protocolo de Decisão de 6 Etapas</h2>
            <p className="text-[#d1d5db]/40 text-xs font-bold tracking-widest uppercase mb-12">Deliberação Científica de Nível Regulatório — Audit-Ready</p>
            
            <div className="flex flex-wrap justify-center gap-12">
               {[
                 { n: '01', t: 'Análise Independente', d: 'Especialistas isolam variáveis e estabelecem teses técnicas iniciais sem viés de grupo.' },
                 { n: '02', t: 'Desafio Adversarial', d: 'Contra-exame direto. O Auditor de Qualidade busca "pontos de morte" e falhas de lógica.' },
                 { n: '03', t: 'Refinamento de Evidência', d: 'Síntese baseada em regras estritas de RAG e protocolos Eurachem/RDC 166.' },
                 { n: '04', t: 'Calibração de Consenso', d: 'Identificação de convergência e incertezas residuais via Equilíbrio de Nash.' },
                 { n: '05', t: 'Estresse Cenarizado', d: 'Teste contra choques climáticos extremos, ruptura de suprimentos e delays regulatórios.' },
                 { n: '06', t: 'Mapa de Execução', d: 'Geração de roteiro técnico, regulatório e estratégia de fomento (Plano Safra / BNDES).' },
               ].map((step, i) => (
                 <div key={i} className="w-full sm:w-64 flex flex-col items-center">
                    <div className="size-14 rounded-full border-2 border-[#38bdf8]/20 bg-[#0c0d1e] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(56,189,248,0.1)] relative">
                       <span className="text-xl font-black font-display text-[#38bdf8]">{step.n}</span>
                       {i < 5 && <div className="hidden lg:block absolute left-[100%] top-1/2 w-12 h-px bg-[#38bdf8]/20"></div>}
                    </div>
                    <h4 className="font-bold text-sm uppercase tracking-tight mb-2 text-white">{step.t}</h4>
                    <p className="text-[10px] text-[#d1d5db]/50 leading-relaxed text-center">{step.d}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Entrega de Alto Impacto */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter font-display leading-[0.9]">Construído para<br /><span className="text-[#38bdf8]">Ambientes de Alto Risco</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {[
                 { t: 'Validação Alinhada à ISO', icon: 'verified' },
                 { t: 'Compliance ANVISA & MAPA', icon: 'gavel' },
                 { t: 'Raciocínio Baseado em Evidências', icon: 'database' },
                 { t: 'Foco no "Custo Brasil" e Realidade Agro', icon: 'public' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-5 glass-card rounded-2xl border border-white/5 group hover:border-[#38bdf8]/30 transition-all">
                    <span className="material-symbols-outlined text-[#38bdf8] text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.t}</span>
                 </div>
               ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-gradient-to-br from-[#38bdf8]/20 to-purple-500/20 rounded-[40px] blur-2xl opacity-50 -z-10"></div>
             <div className="glass-card p-12 rounded-[32px] border border-[#38bdf8]/30 bg-[#13152e]/80">
                <h3 className="text-2xl font-black mb-8 uppercase tracking-widest font-display text-[#d4a853]">O Que Você Recebe</h3>
                <div className="space-y-6 text-balance">
                   {[
                     { label: 'Lógica da Decisão', value: 'GO / CONDICIONAL / NO-GO' },
                     { label: 'Audit de Matriz de Risco', value: '4 Quadrantes de Transparência' },
                     { label: 'Audit de Evidência', value: 'RAG-Verified (100% Rastreável)' },
                     { label: 'Próximos Passos', value: 'Roadmap de Ação Imediata' },
                   ].map((row, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d1d5db]/50">{row.label}</span>
                        <span className="text-sm font-black text-[#38bdf8] uppercase text-right leading-none">{row.value}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso Section */}
      <section className="py-24 px-6 bg-[#0c0d1e] tech-grid">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-5xl font-black uppercase tracking-tighter font-display text-white mb-4">Casos de Uso</h2>
               <div className="h-1 w-20 bg-[#38bdf8] mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { t: 'P&D Agro', d: 'Validação de bio-insumos, genetics e novas tecnologias de sementes sob clima tropical.' },
                 { t: 'Regulatório', d: 'Auditoria de prontidão para RDC 166 (ANVISA) e conformidade com Instruções Normativas MAPA.' },
                 { t: 'Transferência', d: 'Definição de roadmaps operacionais para implantação em grande escala na Amazônia e Cerrado.' },
                 { t: 'Inovação', d: 'De-risking estratégico e financeiro para novos projetos da diretoria científica.' }
               ].map((c, i) => (
                 <div key={i} className="p-8 glass-card rounded-2xl border border-white/5 hover:border-[#38bdf8]/50 hover:-translate-y-2 transition-all cursor-default text-center">
                    <h4 className="text-[#38bdf8] font-black text-xl mb-4 font-display uppercase tracking-tight">{c.t}</h4>
                    <p className="text-xs leading-relaxed text-[#d1d5db]/60">{c.d}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final Statement Section */}
      <section className="py-40 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#38bdf8]/5 to-[#38bdf8]/10 pointer-events-none"></div>
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-6xl md:text-8xl font-black mb-12 font-display uppercase tracking-tighter leading-[0.9]">
              Nós não substituímos especialistas.<br />
              <span className="bg-gradient-to-r from-[#38bdf8] to-[#6366f1] bg-clip-text text-transparent italic">
                 Nós os orquestramos.
              </span>
            </h2>
            <div className="flex flex-col items-center gap-6">
               <a href="/login" className="inline-flex items-center gap-4 px-12 py-6 bg-[#38bdf8] text-black rounded-2xl font-black text-2xl hover:shadow-[0_0_60px_rgba(56,189,248,0.7)] hover:scale-105 transition-all text-center">
                  Acessar Control Center
                  <span className="material-symbols-outlined font-black text-2xl">arrow_forward</span>
               </a>
               <p className="text-sm font-mono tracking-widest uppercase text-[#d1d5db]/40">Embrapa Elite v5.0 Scientific Engine</p>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2 grayscale opacity-50">
             <span className="text-xl font-black tracking-tighter uppercase font-display leading-none">Council<span className="text-[#38bdf8]">IA</span></span>
           </div>
           <p className="text-[10px] uppercase tracking-[0.5em] font-mono text-[#d1d5db]/30 text-center">
              © 2026 CouncilIA — Todas as Decisões Validadas Cientificamente
           </p>
           <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-[#d1d5db]/40">
              <a href="/terms" className="hover:text-[#38bdf8] transition-colors">Termos</a>
              <a href="/privacy" className="hover:text-[#38bdf8] transition-colors">Privacidade</a>
           </div>
        </div>
      </footer>
    </main>
  );
}
