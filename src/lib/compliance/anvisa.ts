/**
 * ANVISA Compliance
 * RDC 166/2017 - Validation of analytical methods
 * RDC 677/2022 - Good practices for software as medical device (SaMD)
 */

export interface AnvisaSAMdClassification {
  class: 'I' | 'II' | 'III' | 'IV';
  rule: number;
  registrationRequired: boolean;
  bgmRequired: boolean;
}

export interface AnvisaValidationProtocol {
  protocolNumber: string;
  methodDescription: string;
  validationParameters: {
    selectivity: boolean;
    linearity: boolean;
    precision: boolean;
    accuracy: boolean;
    robustness: boolean;
  };
}

export class AnvisaComplianceManager {
  /**
   * Software as Medical Device (SaMD) Classification
   */
  classifySAMd(
    intendedUse: 'DIAGNOSIS' | 'TREATMENT' | 'MONITORING' | 'DECISION_SUPPORT',
    criticality: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  ): AnvisaSAMdClassification {
    if (intendedUse === 'DECISION_SUPPORT' && criticality === 'LOW') {
      return {
        class: 'I',
        rule: 12,
        registrationRequired: false,
        bgmRequired: false
      };
    }

    if (intendedUse === 'DIAGNOSIS') {
      return {
        class: 'III',
        rule: 4,
        registrationRequired: true,
        bgmRequired: true
      };
    }

    return {
      class: 'II',
      rule: 12,
      registrationRequired: true,
      bgmRequired: false
    };
  }

  /**
   * RDC 166/2017 - Analytical method validation
   */
  generateValidationProtocol(
    methodName: string,
    _matrix: 'FOOD' | 'DRUG' | 'COSMETIC' | 'ENVIRONMENTAL'
  ): AnvisaValidationProtocol {
    return {
      protocolNumber: `VAL-${Date.now()}`,
      methodDescription: methodName,
      validationParameters: {
        selectivity: true,
        linearity: true,
        precision: true,
        accuracy: true,
        robustness: true
      }
    };
  }
}
