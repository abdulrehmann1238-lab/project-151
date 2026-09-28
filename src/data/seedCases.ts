import { Case } from '../types';
import { SCENARIOS, PREVIEW_PLANS } from './scenarios';

export const INITIAL_USER = {
  name: 'Maya Okafor',
  email: 'maya.okafor@example.com',
  state: 'California',
  city: 'Sacramento',
  isAuthenticated: true,
  notificationsEnabled: true,
  emailReminders: true,
};

export const INITIAL_NOTIFICATIONS = [
  { id: 'notif-1', title: 'Hearing deadline upcoming', description: 'DMV administrative review request due in 9 days.', timestamp: '2h ago', read: false },
  { id: 'notif-2', title: 'EDD Weekly Certification', description: 'Weekly UI certification is ready to submit today.', timestamp: '5h ago', read: false },
  { id: 'notif-3', title: 'Security deposit demand sent', description: 'USPS certified mail delivery logged for landlord notice.', timestamp: '1d ago', read: true },
  { id: 'notif-4', title: 'Equifax record updated', description: 'Dispute closed successfully. Erroneous tradeline removed.', timestamp: '3w ago', read: true },
];

export function getSeedCases(): Case[] {
  // 1. DMV License Suspension (3 of 7 done)
  const dmvSteps = SCENARIOS.dmv.buildSteps({ q1: 'fine', q2: 'yes_recent', q3: 'yes_work', q4: 'no_sr22', q5: 'pending_court' });
  dmvSteps[0].status = 'done';
  dmvSteps[1].status = 'done';
  dmvSteps[2].status = 'done';
  dmvSteps[3].status = 'current'; // Step 4 is current

  // 2. Unemployment claim (5 of 6 done, waiting on agency)
  const eddSteps = SCENARIOS.unemployment.buildSteps({ q1: 'layoff', q2: 'this_week', q3: 'verified', q4: 'first_time' });
  eddSteps[0].status = 'done';
  eddSteps[1].status = 'done';
  eddSteps[2].status = 'done';
  eddSteps[3].status = 'done';
  eddSteps[4].status = 'done';
  eddSteps[5].status = 'current';

  // 3. Security deposit not returned (2 of 6 done)
  const housingSteps = SCENARIOS.housing.buildSteps({ q1: 'over_21', q2: 'yes_written', q3: 'no_statement', q4: 'thorough_photos' });
  housingSteps[0].status = 'done';
  housingSteps[1].status = 'done';
  housingSteps[2].status = 'current';

  // 4. Credit report error (Resolved, all done)
  const creditSteps = PREVIEW_PLANS.credit.steps.map(s => ({ ...s, status: 'done' as const }));

  // 5. Auto claim denied (Not started, 0 of 3 done)
  const insSteps = PREVIEW_PLANS.insurance.steps.map((s, idx) => ({ ...s, status: (idx === 0 ? 'current' : 'pending') as 'current' | 'pending' }));

  return [
    {
      id: 'case-dmv-101',
      title: 'License suspension',
      category: 'dmv',
      situation: 'California driver license suspension inquiry & court hold clearance',
      location: 'Sacramento, California',
      urgency: 'Time-sensitive',
      confidence: 'High',
      restatement: "Your California driver's license was suspended due to an outstanding court citation, and you're working through court clearance, SR-22 insurance filing, and DMV reissuance.",
      status: 'In progress',
      steps: dmvSteps,
      answers: { q1: 'fine', q2: 'yes_recent', q3: 'yes_work', q4: 'no_sr22', q5: 'pending_court' },
      deadlines: [
        { id: 'd-dmv-1', label: 'Hearing request deadline', dateStr: 'Hearing request due in 9 days', isUrgent: true },
        { id: 'd-dmv-2', label: 'Court payment schedule', dateStr: 'Within 14 days' },
      ],
      documents: [
        { name: 'California Driver’s License number or ID card', checked: true },
        { name: 'Order of Suspension notice from California DMV', checked: true },
        { name: 'Court Abstract / Clearance receipt (Form DL 106)', checked: true },
        { name: 'Proof of Financial Responsibility (SR-22 Certificate)', checked: false },
        { name: 'Payment confirmation for DMV Reissuance fee', checked: false },
      ],
      updatedAt: '2 days ago',
    },
    {
      id: 'case-edd-202',
      title: 'Unemployment claim',
      category: 'unemployment',
      situation: 'Recent tech layoff benefit filing & UI Online certification',
      location: 'California (EDD)',
      urgency: 'Time-sensitive',
      confidence: 'High',
      restatement: 'You were laid off due to company reduction in force and submitted your initial UI claim. You are now maintaining bi-weekly certifications while your formal wage determination is finalized.',
      status: 'Waiting on agency',
      steps: eddSteps,
      answers: { q1: 'layoff', q2: 'this_week', q3: 'verified', q4: 'first_time' },
      deadlines: [
        { id: 'd-edd-1', label: 'Weekly certification', dateStr: 'Weekly certification due tomorrow', isUrgent: true },
        { id: 'd-edd-2', label: 'CalJOBS profile active check', dateStr: 'Within 21 days' },
      ],
      documents: [
        { name: 'Social Security Number and official ID', checked: true },
        { name: '18 months wage history and separation letter', checked: true },
        { name: 'CalJOBS resume confirmation', checked: true },
        { name: 'UI Online login and claim number', checked: true },
      ],
      updatedAt: 'Today',
    },
    {
      id: 'case-house-303',
      title: 'Security deposit not returned',
      category: 'housing',
      situation: 'Rental security deposit withheld past statutory 21 calendar days without receipts',
      location: 'Sacramento County, California',
      urgency: 'Time-sensitive',
      confidence: 'High',
      restatement: 'Your prior landlord failed to return your $2,200 rental deposit within the required 21 calendar days after vacating, and you are preparing a formal statutory demand letter.',
      status: 'In progress',
      steps: housingSteps,
      answers: { q1: 'over_21', q2: 'yes_written', q3: 'no_statement', q4: 'thorough_photos' },
      deadlines: [
        { id: 'd-house-1', label: 'Demand letter cure period', dateStr: 'Demand letter to send within 5 days', isUrgent: true },
        { id: 'd-house-2', label: 'Small claims limitation', dateStr: 'Within 4 years' },
      ],
      documents: [
        { name: 'Original Residential Lease Agreement', checked: true },
        { name: 'Move-in and Move-out inspection checklist', checked: true },
        { name: 'Date-stamped photos of vacated unit', checked: false },
        { name: 'USPS Certified Mail delivery receipt', checked: false },
      ],
      updatedAt: '4 days ago',
    },
    {
      id: 'case-credit-404',
      title: 'Credit report error (Equifax)',
      category: 'credit',
      situation: 'Erroneous collection tradeline disputed under Fair Credit Reporting Act',
      location: 'Federal / California',
      urgency: 'Standard',
      confidence: 'High',
      restatement: 'An inaccurate medical collection account of $412 appeared on your Equifax credit file and was successfully disputed and purged from your file.',
      status: 'Resolved',
      steps: creditSteps,
      answers: {},
      deadlines: [],
      documents: [
        { name: 'Official credit disclosure showing error', checked: true },
        { name: 'FCRA § 611 formal dispute letter', checked: true },
        { name: 'Equifax investigation completion notice', checked: true },
      ],
      updatedAt: '3 weeks ago',
    },
    {
      id: 'case-ins-505',
      title: 'Auto claim denied',
      category: 'insurance',
      situation: 'Insurer refused bumper damage claim citing unauthorized driver exclusion',
      location: 'California',
      urgency: 'Standard',
      confidence: 'Moderate',
      restatement: 'Your auto insurer issued a formal denial letter for repairs from a parking collision, and you are preparing a formal Request for Reconsideration.',
      status: 'Not started',
      steps: insSteps,
      answers: {},
      deadlines: [
        { id: 'd-ins-1', label: 'Internal appeal deadline', dateStr: 'Within 45 days' },
      ],
      documents: [
        { name: 'Policy declarations page and endorsements', checked: false },
        { name: 'Written denial letter from adjuster', checked: false },
        { name: 'Independent body shop repair estimates', checked: false },
      ],
      updatedAt: '1 week ago',
    },
  ];
}
