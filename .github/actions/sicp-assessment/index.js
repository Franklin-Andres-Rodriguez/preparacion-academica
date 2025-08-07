// .github/actions/sicp-assessment/index.js
const core = require('@actions/core');

/**
 * SICP Assessment Action for Academic Preparation
 * 
 * Evaluates adherence to the systematic debugging methodology:
 * 1. Systematic Observation
 * 2. Hypothesis Formation  
 * 3. Systematic Testing
 * 4. Root Cause Analysis
 * 5. Solution Implementation
 * 
 * Educational Note: This action models how to automate quality assurance
 * and educational assessment—critical skills for professional development.
 */

class SICPAssessment {
  constructor(inputs) {
    this.filesChanged = inputs.filesChanged.split('\n').filter((f) => f.trim());
    this.prDescription = inputs.prDescription;
    this.issueContent = inputs.issueContent;
    this.assessmentLevel = inputs.assessmentLevel;

    // SICP Scoring Framework
    this.scores = {
      systematicObservation: 0,
      hypothesisFormation: 0,
      systematicTesting: 0,
      rootCauseAnalysis: 0,
      solutionImplementation: 0,
    };

    this.recommendations = [];
    this.educationalNotes = [];
  }

  /**
   * Phase 1: Systematic Observation Assessment
   * Evaluates documentation of symptoms and environmental context
   */
  assessSystematicObservation() {
    let score = 0;
    const observations = [];

    // Check for problem documentation patterns
    const problemPatterns = [
      /symptom[s]?\s*[:.]*/i,
      /error[s]?\s*[:.]*/i,
      /issue[s]?\s*[:.]*/i,
      /behavior[s]?\s*[:.]*/i,
      /reproduction\s+steps/i,
      /steps\s+to\s+reproduce/i,
    ];

    // Check for environment documentation
    const environmentPatterns = [
      /environment/i,
      /os[:\s]/i,
      /version[s]?[:\s]/i,
      /node\.?js/i,
      /docker/i,
      /browser/i,
    ];

    const content = `${this.prDescription} ${this.issueContent}`.toLowerCase();

    // Score problem documentation (40 points)
    const problemMatches = problemPatterns.filter((pattern) =>
      pattern.test(content)
    );
    score += Math.min(40, problemMatches.length * 10);

    if (problemMatches.length > 0) {
      observations.push('✅ Problem symptoms documented');
    } else {
      observations.push('⚠️ Problem symptoms could be better documented');
      this.recommendations.push(
        'Document specific symptoms and behaviors observed'
      );
    }

    // Score environment documentation (30 points)
    const envMatches = environmentPatterns.filter((pattern) =>
      pattern.test(content)
    );
    score += Math.min(30, envMatches.length * 8);

    if (envMatches.length >= 2) {
      observations.push('✅ Environment context provided');
    } else {
      observations.push('⚠️ Environment details could be more comprehensive');
      this.recommendations.push(
        'Include environment details: OS, versions, configuration'
      );
    }

    // Score reproduction steps (30 points)
    if (/steps?\s+(to\s+)?reproduce/i.test(content)) {
      score += 30;
      observations.push('✅ Reproduction steps provided');
    } else {
      observations.push('⚠️ Clear reproduction steps would help');
      this.recommendations.push(
        'Provide step-by-step reproduction instructions'
      );
    }

    this.scores.systematicObservation = Math.min(100, score);

    this.educationalNotes.push(
      '🎓 Systematic Observation: Professional debugging starts with precise symptom documentation. ' +
        'This prevents wasted time on wrong assumptions and enables others to help effectively.'
    );

    return observations;
  }

  /**
   * Phase 2: Hypothesis Formation Assessment
   * Evaluates systematic cause analysis and testable predictions
   */
  assessHypothesisFormation() {
    let score = 0;
    const observations = [];

    const content = `${this.prDescription} ${this.issueContent}`.toLowerCase();

    // Check for causal reasoning patterns
    const causePatterns = [
      /because/i,
      /cause[d]?\s+by/i,
      /due\s+to/i,
      /reason[s]?\s+[:.]*/i,
      /hypothesis/i,
      /suspect[s]?/i,
      /likely/i,
      /probably/i,
    ];

    // Check for alternative consideration
    const alternativePatterns = [
      /alternative[s]?/i,
      /other\s+possibility/i,
      /could\s+also\s+be/i,
      /might\s+be/i,
      /or\s+maybe/i,
    ];

    // Score causal reasoning (50 points)
    const causeMatches = causePatterns.filter((pattern) =>
      pattern.test(content)
    );
    score += Math.min(50, causeMatches.length * 15);

    if (causeMatches.length >= 2) {
      observations.push('✅ Causal reasoning demonstrated');
    } else {
      observations.push('⚠️ Causal analysis could be more explicit');
      this.recommendations.push(
        'Explain WHY you think this solution addresses the root cause'
      );
    }

    // Score alternative consideration (30 points)
    const altMatches = alternativePatterns.filter((pattern) =>
      pattern.test(content)
    );
    score += Math.min(30, altMatches.length * 10);

    if (altMatches.length > 0) {
      observations.push('✅ Alternative approaches considered');
    } else {
      observations.push(
        '⚠️ Consider mentioning alternative approaches explored'
      );
      this.recommendations.push(
        'Discuss other solutions considered and why this approach was chosen'
      );
    }

    // Score prediction/testing (20 points)
    if (/test[s]?\s+this|verify|validate|confirm/i.test(content)) {
      score += 20;
      observations.push('✅ Solution testing approach mentioned');
    } else {
      observations.push('⚠️ Solution validation approach could be clearer');
      this.recommendations.push(
        "Describe how you'll verify this solution works"
      );
    }

    this.scores.hypothesisFormation = Math.min(100, score);

    this.educationalNotes.push(
      '🎓 Hypothesis Formation: Professional developers form testable hypotheses about causes ' +
        'rather than trying random solutions. This systematic approach saves time and builds understanding.'
    );

    return observations;
  }

  /**
   * Phase 3: Systematic Testing Assessment
   * Evaluates isolation techniques and controlled experiments
   */
  assessSystematicTesting() {
    let score = 0;
    const observations = [];

    // Check for test files
    const testFiles = this.filesChanged.filter(
      (file) =>
        file.includes('test') ||
        file.includes('spec') ||
        file.endsWith('.test.js') ||
        file.endsWith('.spec.js')
    );

    // Score test coverage (40 points)
    if (testFiles.length > 0) {
      score += 40;
      observations.push(`✅ Test files included: ${testFiles.join(', ')}`);
    } else {
      observations.push('⚠️ No test files detected in changes');
      this.recommendations.push(
        'Add tests to verify the fix and prevent regression'
      );
    }

    const content = `${this.prDescription} ${this.issueContent}`.toLowerCase();

    // Check for testing methodology (35 points)
    const testingPatterns = [
      /unit\s+test[s]?/i,
      /integration\s+test[s]?/i,
      /manual[ly]?\s+test/i,
      /verify/i,
      /validate/i,
      /confirm/i,
    ];

    const testMatches = testingPatterns.filter((pattern) =>
      pattern.test(content)
    );
    score += Math.min(35, testMatches.length * 10);

    if (testMatches.length >= 2) {
      observations.push('✅ Testing approach documented');
    } else {
      observations.push('⚠️ Testing methodology could be more detailed');
      this.recommendations.push(
        'Describe your testing approach: unit, integration, manual verification'
      );
    }

    // Check for edge case consideration (25 points)
    const edgeCasePatterns = [
      /edge\s+case[s]?/i,
      /boundary/i,
      /error\s+handling/i,
      /exception[s]?/i,
      /failure\s+case[s]?/i,
    ];

    const edgeMatches = edgeCasePatterns.filter((pattern) =>
      pattern.test(content)
    );
    score += Math.min(25, edgeMatches.length * 8);

    if (edgeMatches.length > 0) {
      observations.push('✅ Edge case consideration evident');
    } else {
      observations.push('⚠️ Edge case testing could be mentioned');
      this.recommendations.push(
        'Consider and test edge cases and error conditions'
      );
    }

    this.scores.systematicTesting = Math.min(100, score);

    this.educationalNotes.push(
      '🎓 Systematic Testing: Effective testing isolates variables and covers edge cases. ' +
        'This prevents bugs from reaching production and builds confidence in solutions.'
    );

    return observations;
  }

  /**
   * Phase 4: Root Cause Analysis Assessment
   * Evaluates evidence synthesis and causal reasoning
   */
  assessRootCauseAnalysis() {
    let score = 0;
    const observations = [];

    const content = `${this.prDescription} ${this.issueContent}`.toLowerCase();

    // Check for evidence-based reasoning (40 points)
    const evidencePatterns = [
      /evidence/i,
      /based\s+on/i,
      /analysis\s+shows/i,
      /investigation\s+reveals/i,
      /found\s+that/i,
      /discovered/i,
    ];

    const evidenceMatches = evidencePatterns.filter((pattern) =>
      pattern.test(content)
    );
    score += Math.min(40, evidenceMatches.length * 12);

    if (evidenceMatches.length >= 2) {
      observations.push('✅ Evidence-based analysis demonstrated');
    } else {
      observations.push('⚠️ Evidence-based reasoning could be stronger');
      this.recommendations.push(
        'Support conclusions with specific evidence and investigation results'
      );
    }

    // Check for root cause identification (35 points)
    const rootCausePatterns = [
      /root\s+cause/i,
      /fundamental\s+issue/i,
      /underlying\s+problem/i,
      /real\s+cause/i,
      /actual\s+cause/i,
    ];

    const rootMatches = rootCausePatterns.filter((pattern) =>
      pattern.test(content)
    );
    score += Math.min(35, rootMatches.length * 12);

    if (rootMatches.length > 0) {
      observations.push('✅ Root cause analysis attempted');
    } else {
      observations.push('⚠️ Root cause identification could be more explicit');
      this.recommendations.push(
        'Clearly identify the root cause vs. surface symptoms'
      );
    }

    // Check for systematic elimination (25 points)
    const eliminationPatterns = [
      /ruled\s+out/i,
      /eliminated/i,
      /not\s+caused\s+by/i,
      /investigated.*but/i,
      /tried.*didn't/i,
    ];

    const elimMatches = eliminationPatterns.filter((pattern) =>
      pattern.test(content)
    );
    score += Math.min(25, elimMatches.length * 8);

    if (elimMatches.length > 0) {
      observations.push('✅ Systematic elimination process evident');
    } else {
      observations.push(
        '⚠️ Systematic elimination process could be documented'
      );
      this.recommendations.push(
        'Document what you ruled out during investigation'
      );
    }

    this.scores.rootCauseAnalysis = Math.min(100, score);

    this.educationalNotes.push(
      '🎓 Root Cause Analysis: Professional debugging identifies true causes, not just symptoms. ' +
        'This prevents the same issue from recurring and builds systematic problem-solving skills.'
    );

    return observations;
  }

  /**
   * Phase 5: Solution Implementation Assessment
   * Evaluates minimal fix approach and verification testing
   */
  assessSolutionImplementation() {
    let score = 0;
    const observations = [];

    const content = `${this.prDescription} ${this.issueContent}`.toLowerCase();

    // Check for minimal change approach (30 points)
    const minimalPatterns = [
      /minimal/i,
      /small\s+change/i,
      /focused\s+fix/i,
      /targeted/i,
      /surgical/i,
      /precise/i,
    ];

    const minimalMatches = minimalPatterns.filter((pattern) =>
      pattern.test(content)
    );
    if (minimalMatches.length > 0 || this.filesChanged.length <= 3) {
      score += 30;
      observations.push('✅ Minimal change approach evident');
    } else {
      observations.push('⚠️ Consider if change scope could be more focused');
      this.recommendations.push(
        'Aim for minimal, focused changes that address the specific issue'
      );
    }

    // Check for verification approach (35 points)
    const verificationPatterns = [
      /verif/i,
      /confirm/i,
      /test[s]?\s+pass/i,
      /works\s+as\s+expected/i,
      /manual[ly]?\s+tested/i,
    ];

    const verifyMatches = verificationPatterns.filter((pattern) =>
      pattern.test(content)
    );
    score += Math.min(35, verifyMatches.length * 12);

    if (verifyMatches.length >= 2) {
      observations.push('✅ Solution verification documented');
    } else {
      observations.push('⚠️ Solution verification could be more thorough');
      this.recommendations.push(
        "Document how you verified the fix works and doesn't break other functionality"
      );
    }

    // Check for side effect consideration (35 points)
    const sideEffectPatterns = [
      /side\s+effect[s]?/i,
      /impact[s]?\s+on/i,
      /affect[s]?\s+other/i,
      /regression/i,
      /break[s]?\s+existing/i,
      /backward[s]?\s+compatible/i,
    ];

    const sideMatches = sideEffectPatterns.filter((pattern) =>
      pattern.test(content)
    );
    score += Math.min(35, sideMatches.length * 12);

    if (sideMatches.length > 0) {
      observations.push('✅ Side effect consideration evident');
    } else {
      observations.push('⚠️ Side effect analysis could be mentioned');
      this.recommendations.push(
        'Consider and document potential side effects of the change'
      );
    }

    this.scores.solutionImplementation = Math.min(100, score);

    this.educationalNotes.push(
      '🎓 Solution Implementation: Professional fixes are minimal, verified, and consider side effects. ' +
        'This reduces risk of introducing new bugs while solving the original problem.'
    );

    return observations;
  }

  /**
   * Calculate overall SICP score and generate report
   */
  calculateOverallScore() {
    const scores = Object.values(this.scores);
    const overallScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
    );

    // Add overall assessment insights
    if (overallScore >= 85) {
      this.educationalNotes.push(
        '🌟 Excellent SICP methodology adherence! This demonstrates professional-level systematic debugging approach.'
      );
    } else if (overallScore >= 70) {
      this.educationalNotes.push(
        '✅ Good SICP methodology application. Consider the recommendations to reach professional excellence.'
      );
    } else if (overallScore >= 50) {
      this.educationalNotes.push(
        '📚 Moderate SICP methodology usage. Focus on the missing phases to develop systematic debugging skills.'
      );
    } else {
      this.educationalNotes.push(
        '⚠️ Limited SICP methodology application. This is a great opportunity to practice systematic debugging approaches.'
      );
      this.recommendations.unshift(
        'Consider applying the SICP methodology: Observation → Hypothesis → Testing → Analysis → Implementation'
      );
    }

    return overallScore;
  }

  /**
   * Generate comprehensive assessment report
   */
  generateReport() {
    const systematicObsResults = this.assessSystematicObservation();
    const hypothesisResults = this.assessHypothesisFormation();
    const testingResults = this.assessSystematicTesting();
    const analysisResults = this.assessRootCauseAnalysis();
    const implementationResults = this.assessSolutionImplementation();

    const overallScore = this.calculateOverallScore();

    return {
      overallScore,
      scores: this.scores,
      recommendations: this.recommendations,
      educationalNotes: this.educationalNotes,
      detailedResults: {
        systematicObservation: systematicObsResults,
        hypothesisFormation: hypothesisResults,
        systematicTesting: testingResults,
        rootCauseAnalysis: analysisResults,
        solutionImplementation: implementationResults,
      },
    };
  }
}

/**
 * Main action execution
 */
async function run() {
  try {
    core.info('🎓 Starting SICP Methodology Assessment...');

    // Get inputs
    const inputs = {
      filesChanged: core.getInput('files-changed') || '',
      prDescription: core.getInput('pr-description') || '',
      issueContent: core.getInput('issue-content') || '',
      assessmentLevel: core.getInput('assessment-level') || 'standard',
    };

    core.info(
      `Assessing ${inputs.filesChanged.split('\n').filter((f) => f.trim()).length} changed files`
    );

    // Run assessment
    const assessment = new SICPAssessment(inputs);
    const report = assessment.generateReport();

    // Set outputs
    core.setOutput('sicp-score', report.overallScore.toString());
    core.setOutput(
      'systematic-observation',
      report.scores.systematicObservation.toString()
    );
    core.setOutput(
      'hypothesis-formation',
      report.scores.hypothesisFormation.toString()
    );
    core.setOutput(
      'systematic-testing',
      report.scores.systematicTesting.toString()
    );
    core.setOutput(
      'root-cause-analysis',
      report.scores.rootCauseAnalysis.toString()
    );
    core.setOutput(
      'solution-implementation',
      report.scores.solutionImplementation.toString()
    );
    core.setOutput('recommendations', JSON.stringify(report.recommendations));
    core.setOutput(
      'educational-notes',
      JSON.stringify(report.educationalNotes)
    );

    // Log summary
    core.info(`📊 SICP Assessment Complete:`);
    core.info(`   Overall Score: ${report.overallScore}/100`);
    core.info(
      `   Systematic Observation: ${report.scores.systematicObservation}/100`
    );
    core.info(
      `   Hypothesis Formation: ${report.scores.hypothesisFormation}/100`
    );
    core.info(`   Systematic Testing: ${report.scores.systematicTesting}/100`);
    core.info(`   Root Cause Analysis: ${report.scores.rootCauseAnalysis}/100`);
    core.info(
      `   Solution Implementation: ${report.scores.solutionImplementation}/100`
    );

    core.info(
      `💡 Recommendations: ${report.recommendations.length} suggestions generated`
    );
    core.info(
      `🎓 Educational Notes: ${report.educationalNotes.length} learning insights provided`
    );
  } catch (error) {
    core.setFailed(`SICP Assessment failed: ${error.message}`);
  }
}

// Run the action
run();
