import { Category } from '../types';

export interface ClassificationResult {
  offTopic: boolean;
  offTopicMessage?: string;
  category: Category;
  scenarioId?: 'dmv' | 'unemployment' | 'housing';
  situation: string;
  location: string;
  urgency: 'Time-sensitive' | 'Standard' | 'Urgent';
  confidence: 'High' | 'Moderate' | 'Low';
  restatement: string;
  suggestedCategories?: { id: Category; label: string }[];
}

export function classifyProblem(text: string, stateLocation = 'California'): ClassificationResult {
  const lower = text.toLowerCase().trim();

  // 1. Off-topic check (Section 8.2, 9, 10, 11)
  const offTopicKeywords = [
    'poem', 'poetry', 'rhyme', 'joke', 'funny', 'essay', 'write code', 'javascript',
    'python', 'react app', 'recipe', 'bake a cake', 'weather in', 'who is the president',
    'sing a song', 'story about', 'chat with me', 'tell me a story'
  ];

  const isOffTopic = offTopicKeywords.some((kw) => lower.includes(kw));
  if (isOffTopic) {
    return {
      offTopic: true,
      offTopicMessage: 'Jerri helps with everyday problems and paperwork, not open-ended questions. Try describing something you’re trying to fix or file.',
      category: 'government',
      situation: 'General Inquiry',
      location: stateLocation,
      urgency: 'Standard',
      confidence: 'Low',
      restatement: '',
    };
  }

  // 2. Keyword routing to core categories
  // DMV
  if (
    lower.includes('license') ||
    lower.includes('dmv') ||
    lower.includes('suspend') ||
    lower.includes('driving') ||
    lower.includes('ticket') ||
    lower.includes('traffic') ||
    lower.includes('citation') ||
    lower.includes('sr-22') ||
    lower.includes('registration')
  ) {
    return {
      offTopic: false,
      category: 'dmv',
      scenarioId: 'dmv',
      situation: 'California Driver’s License Suspension & Administrative Clearance',
      location: stateLocation,
      urgency: 'Time-sensitive',
      confidence: 'High',
      restatement:
        "Your driver's license was suspended and you're not sure of the exact cause or how to clear the DMV hold, settle fines, and restore your driving privileges legally.",
    };
  }

  // Unemployment
  if (
    lower.includes('laid off') ||
    lower.includes('layoff') ||
    lower.includes('unemploy') ||
    lower.includes('fired') ||
    lower.includes('lost my job') ||
    lower.includes('edd') ||
    lower.includes('benefits') ||
    lower.includes('ui online') ||
    lower.includes('severance')
  ) {
    return {
      offTopic: false,
      category: 'unemployment',
      scenarioId: 'unemployment',
      situation: 'California Unemployment Insurance (EDD) Claim & Verification',
      location: stateLocation,
      urgency: 'Time-sensitive',
      confidence: 'High',
      restatement:
        'You recently experienced an employment separation and need to submit a California EDD unemployment claim, verify your identity with ID.me, and maintain weekly certifications.',
    };
  }

  // Housing
  if (
    lower.includes('deposit') ||
    lower.includes('landlord') ||
    lower.includes('rent') ||
    lower.includes('lease') ||
    lower.includes('tenant') ||
    lower.includes('evict') ||
    lower.includes('apartment') ||
    lower.includes('move-out')
  ) {
    return {
      offTopic: false,
      category: 'housing',
      scenarioId: 'housing',
      situation: 'California Security Deposit Return & Landlord Deduction Dispute',
      location: stateLocation,
      urgency: 'Time-sensitive',
      confidence: 'High',
      restatement:
        'Your landlord failed to return your rental security deposit within the mandatory 21 days or made unjustified deductions without itemized receipts, and you need a formal demand and recovery plan.',
    };
  }

  // Credit
  if (
    lower.includes('credit') ||
    lower.includes('score') ||
    lower.includes('equifax') ||
    lower.includes('transunion') ||
    lower.includes('experian') ||
    lower.includes('report') ||
    lower.includes('debt collection')
  ) {
    return {
      offTopic: false,
      category: 'credit',
      situation: 'Inaccurate Credit Bureau Tradeline & Debt Dispute',
      location: stateLocation,
      urgency: 'Standard',
      confidence: 'High',
      restatement:
        'An erroneous or unauthorized account appears on your credit report, and you need a structured Fair Credit Reporting Act dispute plan to investigate and remove it.',
    };
  }

  // Insurance
  if (
    lower.includes('insurance') ||
    lower.includes('denied') ||
    lower.includes('claim') ||
    lower.includes('adjuster') ||
    lower.includes('collision') ||
    lower.includes('policy')
  ) {
    return {
      offTopic: false,
      category: 'insurance',
      situation: 'Insurance Claim Denial Reconsideration & Complaint',
      location: stateLocation,
      urgency: 'Time-sensitive',
      confidence: 'Moderate',
      restatement:
        'Your insurance company denied or delayed a legitimate damage claim, and you need to review the specific exclusion language, request formal appeal, and file with the Insurance Commissioner.',
    };
  }

  // Consumer
  if (
    lower.includes('refund') ||
    lower.includes('warranty') ||
    lower.includes('merchant') ||
    lower.includes('scam') ||
    lower.includes('charged') ||
    lower.includes('store') ||
    lower.includes('bought')
  ) {
    return {
      offTopic: false,
      category: 'consumer',
      situation: 'Merchant Warranty Breach & Billing Dispute',
      location: stateLocation,
      urgency: 'Standard',
      confidence: 'Moderate',
      restatement:
        'A merchant failed to provide promised goods or refund a defective product, and you need a formal notice and chargeback procedure to recover your payment.',
    };
  }

  // Employment wages
  if (
    lower.includes('wage') ||
    lower.includes('paycheck') ||
    lower.includes('salary') ||
    lower.includes('overtime') ||
    lower.includes('boss') ||
    lower.includes('work') ||
    lower.includes('pto')
  ) {
    return {
      offTopic: false,
      category: 'employment',
      situation: 'Unpaid Wages, Final Pay, and Labor Code Penalties',
      location: stateLocation,
      urgency: 'Time-sensitive',
      confidence: 'High',
      restatement:
        'Your employer withheld wages or delayed your final paycheck past legal deadlines, and you need to compute waiting time penalties and submit a California Labor Commissioner claim.',
    };
  }

  // Small Business
  if (
    lower.includes('business') ||
    lower.includes('llc') ||
    lower.includes('incorporate') ||
    lower.includes('ein') ||
    lower.includes('permit') ||
    lower.includes('company')
  ) {
    return {
      offTopic: false,
      category: 'business',
      situation: 'Small Business Registration & State Compliance',
      location: stateLocation,
      urgency: 'Standard',
      confidence: 'Moderate',
      restatement:
        'You are organizing a new enterprise and need the exact sequence of California Secretary of State filings, IRS employer tax ID, and municipal permits.',
    };
  }

  // Default fallback if text is generic
  return {
    offTopic: false,
    category: 'government',
    situation: 'General Administrative Resolution',
    location: stateLocation,
    urgency: 'Standard',
    confidence: 'Low',
    restatement:
      `Jerri identified that you are navigating an administrative process regarding "${text.slice(0, 80)}..." and will guide you to identify the responsible agency and next steps.`,
    suggestedCategories: [
      { id: 'dmv', label: 'DMV & Driving' },
      { id: 'unemployment', label: 'Unemployment & Work' },
      { id: 'housing', label: 'Housing & Landlord' },
    ],
  };
}
