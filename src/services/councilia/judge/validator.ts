// src/services/councilia/judge/validator.ts

export interface JudgeOutput {
  decisaoImediata: string;
  sinteseTecnica: string;
  fontesEvidencia: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  corrected?: JudgeOutput;
}

export class JudgeOutputValidator {
  
  private readonly REQUIRED_SECTIONS = [
    'decisaoImediata',
    'sinteseTecnica', 
    'fontesEvidencia'
  ];

  private readonly REQUIRED_KEYWORDS = {
    decisaoImediata: [
      'prevalece',
      'determina-se',
      'deve ser considerado',
      'acreditado',
      'incerteza'
    ],
    sinteseTecnica: [
      'ISO',
      'RDC',
      'incerteza',
      'guard-band'
    ]
  };

  validate(rawOutput: any): ValidationResult {
    const errors: string[] = [];
    let parsedOutput: any;

    // 1. Verifica se é JSON válido
    try {
      parsedOutput = typeof rawOutput === 'string' ? JSON.parse(rawOutput) : rawOutput;
    } catch {
      errors.push('Resposta não é um JSON válido');
      return { isValid: false, errors };
    }

    // 2. Verifica se todas as seções obrigatórias existem
    for (const section of this.REQUIRED_SECTIONS) {
      if (!parsedOutput[section] || typeof parsedOutput[section] !== 'string') {
        errors.push(`Seção "${section}" ausente ou inválida`);
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // --- NEW v11.1: Heading Duplication Check ---
    const headingRegex = /^\d+\.\s*(DECISÃO\s*IMEDIATA|SÍNTESE\s*TÉCNICA|FONTES\s*DE\s*EVIDÊNCIA)/i;
    if (headingRegex.test(parsedOutput.decisaoImediata)) errors.push('Título duplicado detectado em decisaoImediata');
    if (headingRegex.test(parsedOutput.sinteseTecnica)) errors.push('Título duplicado detectado em sinteseTecnica');
    if (headingRegex.test(parsedOutput.fontesEvidencia)) errors.push('Título duplicado detectado em fontesEvidencia');

    // 3. Valida conteúdo da DECISÃO IMEDIATA
    const decisao = parsedOutput.decisaoImediata.toLowerCase();
    const hasHierarchy = decisao.includes('acreditado') || decisao.includes('pep') || decisao.includes('17025');
    const hasDecision = this.REQUIRED_KEYWORDS.decisaoImediata.some(k => decisao.includes(k));
    
    if (!hasHierarchy && !decisao.includes('lab')) {
      errors.push('DECISÃO IMEDIATA não estabelece claramente a hierarquia de laboratórios');
    }
    if (!hasDecision) {
      errors.push('DECISÃO IMEDIATA não contém linguagem decisiva obrigatória (determina-se/prevalece)');
    }

    // 4. Valida conteúdo da SÍNTESE TÉCNICA
    const sintese = parsedOutput.sinteseTecnica.toLowerCase();
    const hasNormas = this.REQUIRED_KEYWORDS.sinteseTecnica.some(k => sintese.includes(k));
    
    if (!hasNormas) {
      errors.push('SÍNTESE TÉCNICA não contém referência a normas técnicas obrigatórias');
    }

    // 5. Valida FONTES DE EVIDÊNCIA
    if (!parsedOutput.fontesEvidencia.toLowerCase().includes('iso') &&
        !parsedOutput.fontesEvidencia.toLowerCase().includes('rdc')) {
      errors.push('FONTES DE EVIDÊNCIA não lista normas técnicas');
    }

    return {
      isValid: errors.length === 0,
      errors,
      corrected: errors.length > 0 ? this.attemptCorrection(parsedOutput) : undefined
    };
  }

  private attemptCorrection(partial: any): JudgeOutput {
    // Tenta corrigir estrutura faltante com fallbacks técnicos seguros e remove cabeçalhos redundantes
    return {
      decisaoImediata: this.removeHeadings(partial.decisaoImediata) || this.getDefaultDecisao(),
      sinteseTecnica: this.removeHeadings(partial.sinteseTecnica) || this.getDefaultSintese(),
      fontesEvidencia: this.removeHeadings(partial.fontesEvidencia) || this.getDefaultFontes()
    };
  }

  private removeHeadings(text: string): string {
    if (!text) return '';
    return text
      .replace(/^\d+\.\s*(DECISÃO\s*IMEDIATA|SÍNTESE\s*TÉCNICA|FONTES\s*DE\s*EVIDÊNCIA|Decisão\s*Imediata|Síntese\s*Técnica|Fontes\s*de\s*Evidência)[:\-\s]*/gi, '')
      .trim();
  }

  public getDefaultDecisao(): string {
    return `**Conflito entre laboratórios**: Determina-se que **prevalece** o resultado do laboratório acreditado conforme ISO/IEC 17025 e com desempenho satisfatório em PEP (Programa de Excelência). O laboratório não acreditado deve ser desconsiderado para fins oficiais. **Situação limítrofe**: Aplica-se o princípio da **incerteza expandida (k=2)** e Guard-bands. O solo deve ser considerado elegível caso o intervalo de confiança toque a zona de transição favorável ao produtor.`;
  }

  public getDefaultSintese(): string {
    return `A análise granulométrica está sujeita a incertezas inerentes de amostragem e medição. Conforme ISO 5725 [SOURCE: ISO 5725], a reprodutibilidade deve ser monitorada. Em situações de borda, a aplicação de critérios metrológicos rigorosos mitiga o risco de descrédito indevido e garante a segurança jurídica do processo de seguro rural ZARC.`;
  }

  public getDefaultFontes(): string {
    return `- ISO/IEC 17025:2017 – Competência de Laboratórios\n- ISO 5725 – Exatidão de Métodos\n- ISO/IEC Guide 98-3 (GUM) – Incerteza de Medição\n- ISO 11277 – Distribuição granulométrica do solo`;
  }
}
