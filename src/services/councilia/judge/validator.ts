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
    // Tenta corrigir estrutura faltante com fallbacks técnicos seguros
    return {
      decisaoImediata: partial.decisaoImediata || this.getDefaultDecisao(),
      sinteseTecnica: partial.sinteseTecnica || this.getDefaultSintese(),
      fontesEvidencia: partial.fontesEvidencia || this.getDefaultFontes()
    };
  }

  public getDefaultDecisao(): string {
    return `### 1. DECISÃO IMEDIATA\n\n**Conflito entre laboratórios**: Determina-se que **prevalece** o resultado do laboratório acreditado (ISO/IEC 17025) em PEP (Programa de Excelência em Análises de Solo). O laboratório não acreditado deve ser desconsiderado para fins de elegibilidade, conforme RDC 166/2017 [SOURCE: RDC 166/2017].\n\n**Situação limítrofe**: Aplica-se o princípio da **incerteza expandida (k=2)** conforme ISO GUM. O solo deve ser considerado elegível caso a diferença esteja dentro da margem de erro analítica.`;
  }

  public getDefaultSintese(): string {
    return `### 2. SÍNTESE TÉCNICA\n\nA análise granulométrica está sujeita a incertezas inerentes. Conforme ISO 5725 [SOURCE: ISO 5725], a reprodutibilidade deve ser controlada. Em situações limítrofes, a aplicação de **Guard-bands** garante que a variabilidade não prejudique o produtor rural injustamente.`;
  }

  public getDefaultFontes(): string {
    return `### 3. FONTES DE EVIDÊNCIA\n\n- RDC 166/2017 – Acreditação de laboratórios\n- ISO 5725 – Precisão e reprodutibilidade\n- ISO/IEC Guide 98-3 (GUM) – Avaliação de incerteza\n- ISO 11277 – Distribuição granulométrica do solo`;
  }
}
