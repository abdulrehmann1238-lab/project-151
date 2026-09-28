import { Category } from '../types';

export interface SituationCategoryItem {
  id: Category;
  title: string;
  shortDesc: string;
  example: string;
  iconName: string;
  count: number;
  popularCases: { title: string; prompt: string; scenarioId?: string }[];
}

export const SITUATION_CATEGORIES: SituationCategoryItem[] = [
  {
    id: 'dmv',
    title: 'DMV and Driving',
    shortDesc: 'Suspended licenses, expired registrations, ticket points, title transfers, and smog disputes.',
    example: 'My license was suspended and I don’t know why',
    iconName: 'CarFront',
    count: 14,
    popularCases: [
      { title: 'Suspended license notice', prompt: 'My license was suspended and I don’t know why or how to fix it.', scenarioId: 'dmv' },
      { title: 'Unpaid traffic fine hold', prompt: 'I have an unpaid ticket from another county that put a hold on my driver license.', scenarioId: 'dmv' },
      { title: 'Proof of Insurance (SR-22)', prompt: 'DMV says I need an SR-22 certificate before they will reinstate my driving privileges.', scenarioId: 'dmv' },
      { title: 'Lost vehicle title with lien', prompt: 'I bought a used car and the title was never released by the previous owner’s bank.' },
    ],
  },
  {
    id: 'unemployment',
    title: 'Unemployment & Benefits',
    shortDesc: 'Layoffs, missed weekly certification deadlines, identity verification, appeals, and overpayments.',
    example: 'I got laid off on Friday. Now what?',
    iconName: 'Briefcase',
    count: 11,
    popularCases: [
      { title: 'Recent layoff or job loss', prompt: 'I just lost my job due to company cuts and need to file for unemployment right away.', scenarioId: 'unemployment' },
      { title: 'Missed weekly certification', prompt: 'I missed my EDD weekly certification deadline and my claim became inactive.', scenarioId: 'unemployment' },
      { title: 'ID.me verification freeze', prompt: 'My unemployment claim is frozen because ID.me could not verify my state ID.', scenarioId: 'unemployment' },
      { title: 'Disqualified determination appeal', prompt: 'EDD sent a Notice of Determination stating I am disqualified, and I want to appeal.' },
    ],
  },
  {
    id: 'housing',
    title: 'Housing & Tenant Rights',
    shortDesc: 'Unreturned deposits, improper notices, repair disputes, lease termination, and illegal fees.',
    example: 'Landlord won’t return my deposit',
    iconName: 'Home',
    count: 16,
    popularCases: [
      { title: 'Security deposit withheld over 21 days', prompt: 'My landlord still hasn’t returned my deposit and it has been more than 21 days.', scenarioId: 'housing' },
      { title: 'Deductions without receipts', prompt: 'My landlord deducted $900 from my deposit for general cleaning without providing any receipts.', scenarioId: 'housing' },
      { title: 'Uninhabitable repairs ignored', prompt: 'Our heating has been broken for three weeks and the property manager will not fix it.' },
      { title: 'Improper notice to vacate', prompt: 'I was given a 15-day text message notice to move out without proper legal documents.' },
    ],
  },
  {
    id: 'credit',
    title: 'Credit Reports & Bureau Errors',
    shortDesc: 'Inaccurate collection trade lines, identity theft disputes, mixed files, and bureau investigations.',
    example: 'Error on my credit report that isn’t mine',
    iconName: 'CreditCard',
    count: 9,
    popularCases: [
      { title: 'Unrecognized collection account', prompt: 'There’s an account on my credit report that isn’t mine and it dropped my score 60 points.', scenarioId: 'credit' },
      { title: 'Paid debt still showing delinquent', prompt: 'I paid off a collection balance six months ago but Equifax still lists it as unpaid.' },
      { title: 'Mixed credit report file', prompt: 'Accounts belonging to a relative with a similar name are appearing on my TransUnion file.' },
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance Claim Denials',
    shortDesc: 'Unjustified auto collision denials, property damage claim delays, and lowball settlements.',
    example: 'Insurance company denied my repair claim',
    iconName: 'ShieldCheck',
    count: 8,
    popularCases: [
      { title: 'Auto collision coverage denial', prompt: 'My auto insurance denied a collision repair claim claiming an unauthorized driver exception.', scenarioId: 'insurance' },
      { title: 'Water leak damage refused', prompt: 'Homeowners insurance refused water pipe burst damage claiming it was gradual wear and tear.' },
      { title: 'Excessive settlement delay', prompt: 'The adjuster has not replied to my emails or provided an estimate for over 45 days.' },
    ],
  },
  {
    id: 'consumer',
    title: 'Consumer Complaints & Billing',
    shortDesc: 'Defective products, cancelled service fees, unauthorized subscription charges, and warranties.',
    example: 'Merchant refused refund for broken goods',
    iconName: 'Receipt',
    count: 12,
    popularCases: [
      { title: 'Defective item refund refused', prompt: 'A store refused to refund a defective major appliance that broke within one week of delivery.', scenarioId: 'consumer' },
      { title: 'Unauthorized gym subscription charges', prompt: 'A fitness center continues to charge my card 3 months after I submitted written cancellation.' },
      { title: 'Airline refused delayed baggage refund', prompt: 'An airline lost my luggage for 5 days and refused to reimburse essential replacement clothing.' },
    ],
  },
  {
    id: 'employment',
    title: 'Unpaid Wages & Final Pay',
    shortDesc: 'Withheld final paychecks, unpaid overtime hours, break violations, and wage theft.',
    example: 'Employer withheld my final paycheck',
    iconName: 'Building2',
    count: 10,
    popularCases: [
      { title: 'Final paycheck not received upon termination', prompt: 'My employer fired me two weeks ago and has still not paid my final wages or accrued PTO.', scenarioId: 'employment' },
      { title: 'Unpaid overtime and off-the-clock work', prompt: 'My manager required me to work 50 hours a week on salary despite non-exempt hourly duties.' },
      { title: 'Unreimbursed business expenses', prompt: 'Former company refuses to pay $1,400 in approved travel expenses submitted before resignation.' },
    ],
  },
  {
    id: 'business',
    title: 'Small Business Administration',
    shortDesc: 'LLC registrations, statement of information filings, local permits, and trademark checks.',
    example: 'Registering an LLC and getting permits',
    iconName: 'Store',
    count: 7,
    popularCases: [
      { title: 'California LLC formation roadmap', prompt: 'I want to register an LLC in California and need to know the required filings, fees, and timelines.', scenarioId: 'business' },
      { title: 'Fictitious Business Name (DBA) filing', prompt: 'How do I register a DBA name in my county and publish the mandatory public legal notice?' },
      { title: 'City business tax certificate', prompt: 'I run a consulting business from home and received a city notice regarding unregistered tax status.' },
    ],
  },
  {
    id: 'government',
    title: 'Government Records & Vital Docs',
    shortDesc: 'Replacement birth certificates, passport delays, apostilles, and public records requests.',
    example: 'Need replacement birth certificate urgently',
    iconName: 'Landmark',
    count: 9,
    popularCases: [
      { title: 'Urgent certified birth certificate', prompt: 'I need an official certified copy of my California birth certificate for an upcoming passport renewal.' },
      { title: 'Social Security card replacement', prompt: 'I lost my original Social Security card and need an official duplicate for a new job.' },
      { title: 'Name change paperwork on official records', prompt: 'I got married and need to update my name across DMV, Social Security, passport, and banks.' },
    ],
  },
];

export const ROTATING_EXAMPLES = [
  "My license was suspended and I don't know why.",
  "I got laid off on Friday. Now what?",
  "My landlord still hasn't returned my deposit.",
  "There's an account on my credit report that isn't mine.",
];
