import { ScenarioDefinition, Step, Category, KeyDate } from '../types';

export const SCENARIOS: Record<string, ScenarioDefinition> = {
  dmv: {
    id: 'dmv',
    category: 'dmv',
    title: 'California Driver’s License Suspension Resolution',
    situation: 'Suspended driver’s license with unclear status or missing clearance',
    location: 'California (CA DMV)',
    urgency: 'Time-sensitive',
    defaultRestatement: 'Your California driver’s license is currently suspended, and you need a clear, sequential path to verify the suspension cause, settle required fees or citations, and restore your driving privileges legally.',
    questions: [
      {
        id: 'q1',
        question: 'Do you know why your license was suspended?',
        helperText: 'Select the primary cause or what was listed on your last notice.',
        options: [
          { id: 'points', label: 'Point accumulation / moving violations', detail: 'Negligent operator points on your DMV driving record' },
          { id: 'fine', label: 'Unpaid traffic ticket or missed court date', detail: 'Failure to appear (FTA) or failure to pay (FTP)' },
          { id: 'insurance', label: 'Lapse in vehicle insurance coverage', detail: 'Mandatory financial responsibility violation' },
          { id: 'dui', label: 'DUI or administrative per se hold', detail: 'Requires formal administrative clearance and proof of completion' },
          { id: 'not_sure', label: 'I’m not sure / No notice received', detail: 'Jerri will guide you to uncover the exact reason first' },
        ],
        allowNotSure: true,
      },
      {
        id: 'q2',
        question: 'Have you received an official suspension notice by mail?',
        helperText: 'The DMV sends an Order of Suspension or Revocation outlining your rights.',
        options: [
          { id: 'yes_recent', label: 'Yes, within the last 30 days', detail: 'The notice includes your deadline to contest or request a review' },
          { id: 'yes_old', label: 'Yes, but it was months ago', detail: 'The standard 14-day hearing window may have lapsed' },
          { id: 'no_notice', label: 'No notice ever arrived', detail: 'Your address on file may be outdated' },
        ],
        allowNotSure: true,
      },
      {
        id: 'q3',
        question: 'Do you need a restricted license to drive to work or medical care?',
        helperText: 'California permits restricted hardship driving for certain suspension types.',
        options: [
          { id: 'yes_work', label: 'Yes, I need to commute to employment / school', detail: 'Jerri will include the Form DL 691 work-restriction process' },
          { id: 'no_wait', label: 'No, I can wait for full reinstatement', detail: 'Standard direct reinstatement route' },
        ],
      },
      {
        id: 'q4',
        question: 'Do you currently have an active SR-22 (Proof of Financial Responsibility)?',
        helperText: 'A certificate provided by your insurer directly to the California DMV.',
        options: [
          { id: 'yes_sr22', label: 'Yes, insurance company already filed it', detail: 'Active on DMV electronic database' },
          { id: 'no_sr22', label: 'No or I haven’t requested one yet', detail: 'Must be requested from your insurer before reinstatement' },
          { id: 'not_applicable', label: 'Not applicable to my suspension type', detail: 'Skip insurance certificate filing' },
        ],
        allowNotSure: true,
      },
      {
        id: 'q5',
        question: 'Are there any outstanding court fines or unresolved citations?',
        helperText: 'Court holds (FTA/FTP) must be cleared with the county clerk first.',
        options: [
          { id: 'cleared', label: 'All court fines are paid or settled', detail: 'Have court abstract (DL 106) ready' },
          { id: 'pending_court', label: 'Yes, I still owe court citations', detail: 'Must obtain court clearance before DMV will release hold' },
          { id: 'no_court', label: 'No court cases involved (purely DMV action)', detail: 'Direct administrative process only' },
        ],
      },
    ],
    deadlines: [
      { id: 'd1', label: 'Administrative Hearing Request Window', dateStr: 'Hearing request due in 9 days', isUrgent: true },
      { id: 'd2', label: 'Court Abstract Clearance Filing', dateStr: 'Recommended within 14 days' },
    ],
    defaultDocuments: [
      'California Driver’s License number or ID card',
      'Order of Suspension notice from California DMV',
      'Court Abstract / Clearance receipt (Form DL 106)',
      'Proof of Financial Responsibility (SR-22 Certificate)',
      'Payment confirmation for DMV Reissuance fee',
    ],
    buildSteps: (answers) => {
      const isUnsure = answers.q1 === 'not_sure' || answers.q2 === 'no_notice';
      const needsCourt = answers.q5 === 'pending_court';
      const needsSR22 = answers.q4 === 'no_sr22';

      const steps: Step[] = [
        {
          id: 'dmv-step-1',
          stepNumber: 1,
          title: isUnsure
            ? 'Pull official driver record & identify specific suspension hold'
            : 'Confirm suspension reason & effective duration on DMV portal',
          who: 'You',
          minutes: 10,
          why: 'The DMV cannot restore privileges until every underlying administrative and judicial hold is verified on your official record.',
          instructions:
            'Access the California DMV Driver Record Inquiry service. Look for Section 4 (Actions/Holds). Note whether you have an Administrative Per Se (APS) hold, Negligent Operator status, or a court Failure to Appear (FTA code 40508).',
          documents: ['California Driver’s License Number', 'Social Security Number (last 4 digits)'],
          resourceIds: ['res-dmv-status', 'res-dmv-phone'],
          fallback: 'If the website displays an error code, call the Mandatory Actions Unit directly at (916) 657-6525 with your license number ready.',
          status: 'current',
        },
        {
          id: 'dmv-step-2',
          stepNumber: 2,
          title: 'Gather mandatory identity documents & clearance records',
          who: 'You',
          minutes: 20,
          why: 'Field office staff require original verified paperwork to clear holds manually.',
          instructions:
            'Prepare your state ID/passport, any court release documentation, and print out Form DL 44 (Driver License Application). If you changed residence, prepare two proof-of-address documents.',
          documents: [
            'California Driver’s License or Real ID card',
            'Court Clearance Receipt (DL 106) if applicable',
            'Form DL 44 / Reinstatement Notice',
          ],
          resourceIds: ['res-dmv-form14'],
          fallback: 'If you have lost your paper court clearance, you can request a duplicate abstract from the county clerk where the citation occurred.',
          status: 'pending',
        },
        {
          id: 'dmv-step-3',
          stepNumber: 3,
          title: needsCourt
            ? 'Pay outstanding county court fine & obtain Court Abstract (DL 106)'
            : needsSR22
            ? 'Contact auto insurer to electronically transmit SR-22 certificate'
            : 'Resolve underlying compliance requirement with issuing body',
          who: needsCourt ? 'Court' : 'You',
          minutes: 45,
          why: 'The DMV will not accept payment or restore driving privileges until the underlying entity marks your case resolved.',
          instructions: needsCourt
            ? 'Contact the traffic division of the county superior court. Pay the citation or request a payment plan. Ensure the clerk enters a digital release and gives you a stamped Form DL 106.'
            : 'Request your vehicle insurance broker to electronically submit form SR-22 directly to the Sacramento DMV Mandatory Actions Unit. Electronic verification takes 24 to 48 hours.',
          documents: ['Citation number or docket number', 'Payment method'],
          resourceIds: ['res-dmv-phone'],
          fallback: 'If unable to pay the fine in full, ask the court clerk for a California Ability-to-Pay determination (Form TR-320).',
          status: 'pending',
        },
        {
          id: 'dmv-step-4',
          stepNumber: 4,
          title: 'Pay statutory DMV reissuance fee',
          who: 'You',
          minutes: 15,
          why: 'California law requires payment of a statutory reinstatement fee before your license status changes from suspended to valid.',
          instructions:
            'Pay the required reissuance fee through the DMV website fee payment service or in-person at a field office. Obtain and save your official digital receipt and confirmation code.',
          documents: ['Driver’s License Number', 'Credit card or electronic check confirmation'],
          resourceIds: ['res-dmv-fees'],
          fallback: 'Fee payment is non-refundable. Verify that step 3 is fully posted in the DMV system before submitting payment.',
          status: 'pending',
        },
        {
          id: 'dmv-step-5',
          stepNumber: 5,
          title: 'Request administrative hearing or restricted license if eligible',
          who: 'You',
          minutes: 30,
          why: 'If you contest the suspension grounds or require a critical-need driving permit for work/medical care, this preserves your legal rights.',
          instructions:
            'Contact the regional Driver Safety Branch Office in writing or by telephone within the required window. Request an administrative review or apply for an employment-only restricted license.',
          documents: ['Order of Suspension letter', 'Proof of employment or medical appointment necessity'],
          resourceIds: ['res-dmv-safety'],
          fallback: 'If past the 14-day hearing request deadline, submit a formal request for late review explaining good cause (e.g. hospitalization, military deployment).',
          status: 'pending',
          deadline: 'Due within 9 days',
        },
        {
          id: 'dmv-step-6',
          stepNumber: 6,
          title: 'Book verified DMV field office appointment',
          who: 'DMV',
          minutes: 15,
          why: 'Reinstating suspensions often requires physical verification, vision testing, or a new photo credential.',
          instructions:
            'Use the DMV Field Office scheduler to reserve a slot at your nearest office. Bring your complete document binder and fee confirmation receipt.',
          documents: ['Confirmation appointment code', 'Document binder gathered in Step 2'],
          resourceIds: ['res-dmv-office', 'res-dmv-form14'],
          fallback: 'Many DMV offices accept walk-ins before 10 AM on Tuesday and Thursday if appointment calendars are booked out.',
          status: 'pending',
        },
        {
          id: 'dmv-step-7',
          stepNumber: 7,
          title: 'Verify valid status on California record & receive interim license',
          who: 'You',
          minutes: 10,
          why: 'Never drive until the electronic record explicitly reflects "VALID" status in the law enforcement CLETS database.',
          instructions:
            'At the field office counter, the examiner will issue a 90-day temporary paper license while your hard card is mailed. Verify your address is exact.',
          documents: ['Interim paper license receipt'],
          resourceIds: ['res-dmv-status'],
          fallback: 'If your permanent card does not arrive within 4 weeks, check the status online or call 1-800-777-0133.',
          status: 'pending',
        },
      ];

      return steps;
    },
  },

  unemployment: {
    id: 'unemployment',
    category: 'unemployment',
    title: 'California Unemployment Insurance (EDD) Claim & Certification Plan',
    situation: 'Recent job separation / layoff needing swift benefit filing and compliance',
    location: 'California (EDD)',
    urgency: 'Time-sensitive',
    defaultRestatement: 'You experienced a recent employment separation and need to file an accurate California EDD unemployment claim, fulfill mandatory identity verification, and maintain weekly certifications without payment interruption.',
    questions: [
      {
        id: 'q1',
        question: 'What was your primary employer and type of separation?',
        helperText: 'The reason for separation determines initial claim eligibility.',
        options: [
          { id: 'layoff', label: 'Laid off / Lack of work / Position eliminated', detail: 'Standard no-fault separation with fastest approval track' },
          { id: 'fired', label: 'Terminated / Discharged by employer', detail: 'May require an eligibility phone interview regarding misconduct' },
          { id: 'quit', label: 'Voluntary quit / Resigned', detail: 'Requires showing good cause (health, safety, relocation)' },
          { id: 'reduced', label: 'Hours significantly reduced', detail: 'Partial unemployment benefits eligible' },
        ],
      },
      {
        id: 'q2',
        question: 'When was your last physical day of work and received pay?',
        helperText: 'Claims are backdated to the Sunday of the week you file.',
        options: [
          { id: 'this_week', label: 'Within the last 7 days', detail: 'Ideal time to file initial application' },
          { id: 'last_month', label: '2 to 4 weeks ago', detail: 'May request retroactive backdating' },
          { id: 'severance', label: 'Received severance package extending several weeks', detail: 'Severance must be accurately declared to avoid overpayment' },
        ],
      },
      {
        id: 'q3',
        question: 'Do you have an existing California myEDD or ID.me verified account?',
        helperText: 'State law requires digital identity verification before processing claims.',
        options: [
          { id: 'verified', label: 'Yes, already verified with ID.me', detail: 'Application can proceed instantly online' },
          { id: 'no_idme', label: 'No, haven’t set up ID.me yet', detail: 'Will require photo ID and biometric selfie verification' },
          { id: 'not_sure', label: 'Not sure if I have an account', detail: 'Jerri will guide you to check status first' },
        ],
        allowNotSure: true,
      },
      {
        id: 'q4',
        question: 'Have you filed a California unemployment claim in the past 12 months?',
        helperText: 'If you had an active claim, it must be reopened rather than creating a new file.',
        options: [
          { id: 'first_time', label: 'No, this is a brand new claim', detail: 'New 52-week benefit year will be established' },
          { id: 'prior_claim', label: 'Yes, I filed within the past year', detail: 'Requires "Reopen Existing Claim" workflow' },
        ],
      },
    ],
    deadlines: [
      { id: 'd1', label: 'Initial Claim Submission', dateStr: 'File before Saturday 11:59 PM PST', isUrgent: true },
      { id: 'd2', label: 'CalJOBS Resume Posting', dateStr: 'Mandatory within 21 days' },
      { id: 'd3', label: 'First Bi-Weekly Certification', dateStr: 'Weekly certification due tomorrow', isUrgent: true },
    ],
    defaultDocuments: [
      'Social Security Number and official ID (Driver’s License or Passport)',
      'Last 18 months employment history with company names and addresses',
      'Gross wages earned in last pay period and severance breakdown',
      'Employer California State Payroll Tax Number (from W-2 or paystub)',
    ],
    buildSteps: (answers) => {
      const needsIdme = answers.q3 === 'no_idme';
      const isReopen = answers.q4 === 'prior_claim';

      const steps: Step[] = [
        {
          id: 'edd-step-1',
          stepNumber: 1,
          title: needsIdme
            ? 'Set up myEDD account & complete ID.me digital identity verification'
            : 'Log into California myEDD and access UI Online',
          who: 'You',
          minutes: 20,
          why: 'EDD blocks fraudulent claims by requiring biometric ID verification via ID.me prior to application submission.',
          instructions:
            'Create your account at myEDD. When prompted, complete the ID.me scan with your driver’s license and facial verification. Ensure your legal name matches your Social Security card exactly.',
          documents: ['State Driver’s License or US Passport', 'Smartphone with camera for selfie verification'],
          resourceIds: ['res-edd-online'],
          fallback: 'If ID.me fails to match your documents, schedule a video chat referee through the ID.me portal or prepare paper form DE 1101I.',
          status: 'current',
        },
        {
          id: 'edd-step-2',
          stepNumber: 2,
          title: 'Gather 18-month wage history and gross earnings records',
          who: 'You',
          minutes: 25,
          why: 'EDD calculates your Weekly Benefit Amount (WBA) based on your highest quarter of earnings in your 4-quarter base period.',
          instructions:
            'Collect all W-2s, paystubs, and final separation documentation for the past 18 months. Note the exact gross earnings of your last week worked and any accrued vacation or severance pay.',
          documents: ['Paystubs from all employers in past 18 months', 'W-2 statements', 'Written notice of layoff'],
          resourceIds: ['res-edd-form-de1101'],
          fallback: 'If you cannot locate your W-2s, log into your IRS account to obtain your Wage and Income Transcript.',
          status: 'pending',
        },
        {
          id: 'edd-step-3',
          stepNumber: 3,
          title: isReopen
            ? 'Submit "Reopen Existing Claim" on UI Online'
            : 'File initial California Unemployment Insurance application',
          who: 'You',
          minutes: 30,
          why: 'Filing within the week of separation ensures your claim is dated to the earliest possible Sunday, avoiding forfeited benefits.',
          instructions:
            'Complete all sections of the application. Accurately report "Layoff / Lack of Work" as your reason if your position was eliminated. Double check your mailing address.',
          documents: ['Completed UI Online application summary'],
          resourceIds: ['res-edd-online', 'res-edd-form-de1101'],
          fallback: 'If UI Online gives an error stating a claim already exists, use the "Reopen Claim" link or call customer assistance.',
          status: 'pending',
        },
        {
          id: 'edd-step-4',
          stepNumber: 4,
          title: 'Register and build an active resume profile on CalJOBS',
          who: 'You',
          minutes: 25,
          why: 'California law requires UI recipients to register with CalJOBS within 21 days of filing to satisfy work search conditions.',
          instructions:
            'Visit CalJOBS.ca.gov and create an account. Fill out your work history, skills, and set your resume to "active" so California employers can find you.',
          documents: ['Updated resume', 'CalJOBS login credentials'],
          resourceIds: ['res-edd-caljobs'],
          fallback: 'Take a screenshot of your active CalJOBS confirmation page for your records in case of an EDD audit.',
          status: 'pending',
          deadline: 'Within 21 days of filing',
        },
        {
          id: 'edd-step-5',
          stepNumber: 5,
          title: 'Submit mandatory bi-weekly benefit certification',
          who: 'You',
          minutes: 10,
          why: 'Benefits are only disbursed after certifying you were physically able to work, available for work, and looking for work during each week.',
          instructions:
            'Every two weeks, log into UI Online or use the automated Tele-Cert phone system (1-866-333-4606). Answer the 6 standard eligibility questions and report any gross earnings.',
          documents: ['Work search log (employer names, dates applied, contact methods)'],
          resourceIds: ['res-edd-certify'],
          fallback: 'If you miss your certification window by more than 14 days, your claim will become inactive and require reopening.',
          status: 'pending',
          deadline: 'Due tomorrow',
        },
        {
          id: 'edd-step-6',
          stepNumber: 6,
          title: 'Review Notice of Determination & prepare appeal if contested',
          who: 'Agency',
          minutes: 15,
          why: 'You will receive a Notice of Unemployment Insurance Award detailing your maximum benefit amount and weekly rate.',
          instructions:
            'Verify that all base period employers and quarterly wages are listed correctly. If benefits are denied or reduced, file an appeal using Form DE 1000M within 30 days.',
          documents: ['EDD Notice of Award / Determination', 'Form DE 1000M Appeal Form'],
          resourceIds: ['res-edd-phone'],
          fallback: 'If an employer contests your claim, an EDD claims examiner will schedule a 15-minute phone interview. Contact legal aid for guidance.',
          status: 'pending',
        },
      ];

      return steps;
    },
  },

  housing: {
    id: 'housing',
    category: 'housing',
    title: 'California Security Deposit Recovery & Tenant Dispute Plan',
    situation: 'Landlord withholding security deposit beyond statutory 21-day deadline or making unlawful deductions',
    location: 'California (Civil Code § 1950.5)',
    urgency: 'Time-sensitive',
    defaultRestatement: 'Your California landlord has failed to return your rental security deposit within the mandatory 21 calendar days or made unjustified deductions without required receipts, and you need a legally grounded procedure to recover your funds.',
    questions: [
      {
        id: 'q1',
        question: 'How many days has it been since you vacated and surrendered keys?',
        helperText: 'California Civil Code § 1950.5 mandates return or itemization within 21 calendar days.',
        options: [
          { id: 'over_21', label: 'More than 21 calendar days ago', detail: 'Landlord has breached statutory deadline; right to full refund is triggered' },
          { id: 'under_21', label: '1 to 20 days ago (within 21-day window)', detail: 'Landlord is still within the statutory grace period' },
          { id: 'months', label: 'Over 2 months ago', detail: 'Immediate formal demand and small claims preparation required' },
        ],
      },
      {
        id: 'q2',
        question: 'Did you provide written notice of your forwarding address in writing?',
        helperText: 'A landlord must send the deposit check to your last known address.',
        options: [
          { id: 'yes_written', label: 'Yes, in writing (email, text, or letter)', detail: 'Documented proof of delivery available' },
          { id: 'verbal', label: 'Only told them verbally', detail: 'Must confirm mailing address formally in writing' },
          { id: 'no_address', label: 'Have not sent them a forwarding address yet', detail: 'Must provide new address immediately' },
        ],
      },
      {
        id: 'q3',
        question: 'Did the landlord provide an itemized statement with receipts?',
        helperText: 'California law requires copies of receipts or invoices for any deduction over $125.',
        options: [
          { id: 'no_statement', label: 'No itemized list or receipts received at all', detail: 'Complete failure of statutory itemization obligation' },
          { id: 'vague_list', label: 'Sent an itemized list but no receipts or contractor bills', detail: 'Violation of Civil Code § 1950.5(g)(2)' },
          { id: 'unfair_charges', label: 'Deducted for normal wear and tear (painting, carpet age)', detail: 'Unlawful under California tenant protections' },
        ],
      },
      {
        id: 'q4',
        question: 'Do you have move-in and move-out photos, video, or inspection reports?',
        helperText: 'Visual evidence is decisive in resolving security deposit disputes in small claims court.',
        options: [
          { id: 'thorough_photos', label: 'Yes, extensive move-in and move-out photos/videos', detail: 'Strong evidentiary foundation' },
          { id: 'moveout_only', label: 'Only move-out photos', detail: 'Sufficient to prove current clean condition' },
          { id: 'no_photos', label: 'Few or no photos taken', detail: 'Will rely on witness statements and move-in checklist' },
        ],
        allowNotSure: true,
      },
    ],
    deadlines: [
      { id: 'd1', label: 'Formal Demand Letter Response Deadline', dateStr: 'Demand letter to send within 5 days', isUrgent: true },
      { id: 'd2', label: 'Statute of Limitations (Written Contract)', dateStr: '4 years from date of breach' },
    ],
    defaultDocuments: [
      'Original Residential Lease Agreement',
      'Move-in and Move-out inspection checklist',
      'Date-stamped photos or video walkthrough of rental unit',
      'Proof of rent payments and original security deposit payment receipt',
      'Written communication log (emails, text messages with landlord)',
    ],
    buildSteps: (answers) => {
      const isPast21 = answers.q1 === 'over_21' || answers.q1 === 'months';

      const steps: Step[] = [
        {
          id: 'housing-step-1',
          stepNumber: 1,
          title: 'Document statutory timeline & compile evidence binder',
          who: 'You',
          minutes: 30,
          why: 'Under California Civil Code § 1950.5, landlords who miss the 21-day statutory deadline forfeit the right to keep any portion of your deposit for repairs.',
          instructions:
            'Calculate exact calendar days since keys were returned. Assemble lease agreement, move-out photos, copy of written forwarding address, and note every deduction claimed without proper contractor invoices.',
          documents: ['Lease agreement', 'Surrender date proof (email/text confirmation)', 'Inspection photos'],
          resourceIds: ['res-housing-selfhelp'],
          fallback: 'If you lack move-in photos, check if the landlord conducted an initial pre-moveout inspection walk-through as required by law.',
          status: 'current',
        },
        {
          id: 'housing-step-2',
          stepNumber: 2,
          title: 'Draft & send Formal Security Deposit Demand Letter',
          who: 'You',
          minutes: 25,
          why: 'A formal written demand establishes that you gave the landlord reasonable opportunity to cure the violation before filing a court action.',
          instructions:
            'Use the California Department of Consumer Affairs demand letter format. State the exact deposit amount paid, the date keys were surrendered, cite Civil Code § 1950.5, and demand full return within 10 business days.',
          documents: ['Formal Demand Letter draft', 'Post office Certified Mail receipt with tracking'],
          resourceIds: ['res-housing-demand-letter', 'res-housing-selfhelp'],
          fallback: 'Send the letter via both USPS Certified Mail with Return Receipt and email so delivery can be indisputably proven in court.',
          status: 'pending',
          deadline: 'Send within 5 days',
        },
        {
          id: 'housing-step-3',
          stepNumber: 3,
          title: 'Observe mandatory 10-day cure period & log responses',
          who: 'Landlord',
          minutes: 10,
          why: 'Gives the opposing party legal notice. If they refuse or ignore in bad faith, you can claim up to 2x statutory damages.',
          instructions:
            'Allow 10 business days from the delivery date of the demand letter. Save all incoming messages, voicemails, or counter-offers in your case file without agreeing to unfair discounts.',
          documents: ['Tracking confirmation showing delivery of demand letter'],
          resourceIds: ['res-housing-selfhelp', 'res-housing-legal-aid'],
          fallback: 'If the landlord calls with an aggressive response, calmly state: "Please respond to my written demand letter in writing."',
          status: 'pending',
        },
        {
          id: 'housing-step-4',
          stepNumber: 4,
          title: 'File Small Claims Court Claim (Form SC-100)',
          who: 'You',
          minutes: 40,
          why: 'In California Small Claims Court (claims up to $12,500), attorneys are not permitted, leveling the playing field for tenants.',
          instructions:
            'Complete Form SC-100 (Plaintiff’s Claim and ORDER to Go to Small Claims Court). Include the full principal deposit amount plus statutory bad-faith penalty damages under CC § 1950.5(l) if applicable.',
          documents: ['Completed Form SC-100', 'Filing fee ($30-$75 depending on claim size) or fee waiver'],
          resourceIds: ['res-housing-small-claims', 'res-housing-advisor'],
          fallback: 'If low income, ask court clerk for Form FW-001 (Request to Waive Court Fees) so filing is completely free.',
          status: 'pending',
        },
        {
          id: 'housing-step-5',
          stepNumber: 5,
          title: 'Serve landlord with court order & prepare 3-ring evidence binder',
          who: 'Court',
          minutes: 45,
          why: 'The defendant landlord must be formally served by an adult non-party (or county sheriff/certified mail via clerk) at least 15 days before the hearing.',
          instructions:
            'Arrange formal service of Form SC-100. Then organize your evidence binder into 3 identical copies (Judge, Landlord, You): Tab 1: Lease; Tab 2: Photos; Tab 3: Demand letter; Tab 4: Civil Code § 1950.5 printout.',
          documents: ['Proof of Service (Form SC-104)', 'Organized evidence binder with numbered tabs'],
          resourceIds: ['res-housing-advisor'],
          fallback: 'Visit the county free Small Claims Advisor clinic to have an attorney review your evidence binder before hearing day.',
          status: 'pending',
        },
        {
          id: 'housing-step-6',
          stepNumber: 6,
          title: 'Attend Small Claims hearing & present chronological facts',
          who: 'Court',
          minutes: 60,
          why: 'Judges rule on documentation. California judges strictly enforce the 21-day timeline against landlords.',
          instructions:
            'Arrive 30 minutes early. Present your opening statement calmly in 3 minutes: "Your Honor, I vacated on [Date], returned keys, and provided my forwarding address. The defendant failed to return my deposit or provide receipts within the statutory 21 days."',
          documents: ['3 sets of evidence binders', 'Hearing confirmation notice'],
          resourceIds: ['res-housing-selfhelp', 'res-housing-legal-aid'],
          fallback: 'Most landlords offer to settle outside the courtroom before the judge takes the bench. Do not settle for less than your rightful funds.',
          status: 'pending',
        },
      ];

      return steps;
    },
  },
};

// 5 Preview Plans (read-only previews for Credit, Insurance, Consumer, Small Business, Employment)
export const PREVIEW_PLANS: Record<string, { title: string; category: Category; summary: string; steps: Step[]; deadlines: KeyDate[]; documents: string[] }> = {
  credit: {
    title: 'Disputing Inaccurate Record on Credit Report',
    category: 'credit',
    summary: 'A structured Fair Credit Reporting Act (FCRA) protocol to dispute inaccurate derogatory items directly with nationwide consumer reporting bureaus.',
    deadlines: [
      { id: 'c1', label: 'Bureau 30-Day Mandatory Investigation Window', dateStr: 'Must respond within 30 days of receipt' },
    ],
    documents: [
      'Official AnnualCreditReport.com disclosure file showing error',
      'Government-issued Photo ID (California Driver’s License)',
      'Utility bill proving current address',
      'Bank statement or account closure letter refuting inaccurate trade line',
    ],
    steps: [
      {
        id: 'credit-p-1',
        stepNumber: 1,
        title: 'Pull official weekly disclosure from all three major bureaus',
        who: 'You',
        minutes: 15,
        why: 'Inaccurate items may appear on Equifax, Experian, or TransUnion individually.',
        instructions: 'Use AnnualCreditReport.com to generate your official file disclosures. Highlight account numbers, dates opened, and erroneous balance amounts.',
        documents: ['Full credit disclosures from Equifax, Experian, TransUnion'],
        resourceIds: ['res-credit-annual'],
        fallback: 'If online identity questions fail, submit written disclosure request by mail with copy of driver license.',
        status: 'current',
      },
      {
        id: 'credit-p-2',
        stepNumber: 2,
        title: 'Draft statutory dispute letter citing Fair Credit Reporting Act § 611',
        who: 'You',
        minutes: 25,
        why: 'Written dispute triggers federal 30-day investigation requirement on the credit bureau and data furnisher.',
        instructions: 'Detail the exact account number and why the item is erroneous. Attach copies of supporting proof, never originals.',
        documents: ['Dispute letter', 'Photocopies of proof'],
        resourceIds: ['res-cfpb-dispute'],
        fallback: 'Send via USPS Certified Mail with Return Receipt to retain proof of delivery for CFPB complaint.',
        status: 'pending',
      },
      {
        id: 'credit-p-3',
        stepNumber: 3,
        title: 'File concurrent direct dispute with reporting data furnisher',
        who: 'You',
        minutes: 20,
        why: 'Under FCRA § 623, creditors have an independent legal duty to investigate disputes forwarded to their dispute department.',
        instructions: 'Send a dispute notice directly to the creditor’s specialized dispute address listed on your report.',
        documents: ['Direct dispute notice'],
        resourceIds: ['res-cfpb-dispute'],
        fallback: 'If the furnisher verifies inaccurate data without investigating, you may submit a formal complaint with the CFPB.',
        status: 'pending',
      },
      {
        id: 'credit-p-4',
        stepNumber: 4,
        title: 'Review Investigation Results Notice & verify trade line deletion',
        who: 'Agency',
        minutes: 10,
        why: 'The bureau must provide written results and an updated credit disclosure showing deleted or modified tradelines.',
        instructions: 'Check that the derogatory mark is purged. If unresolved, submit a formal dispute with the CFPB online consumer portal.',
        documents: ['Bureau dispute results notice'],
        resourceIds: ['res-cfpb-dispute'],
        fallback: 'File a complaint with the Consumer Financial Protection Bureau (CFPB) attaching all mail tracking receipts.',
        status: 'pending',
      },
    ],
  },

  insurance: {
    title: 'Challenging an Unjustified Auto or Property Insurance Claim Denial',
    category: 'insurance',
    summary: 'A step-by-step administrative route to review insurance policy exclusions, request formal reconsideration, and engage the California Department of Insurance.',
    deadlines: [
      { id: 'i1', label: 'Internal Appeal Request Window', dateStr: 'Typically 30 to 60 days from denial notice' },
    ],
    documents: [
      'Original Insurance Policy Declarations Page and endorsement forms',
      'Written Claim Denial Letter citing specific exclusion clauses',
      'Repair estimates, photos, or police collision report',
    ],
    steps: [
      {
        id: 'ins-p-1',
        stepNumber: 1,
        title: 'Request complete claim file and specific policy exclusion citations',
        who: 'You',
        minutes: 20,
        why: 'Under California Insurance Fair Claims Settlement Practices, insurers must provide specific factual and legal bases for claim denials.',
        instructions: 'Write to the claims adjuster requesting a full copy of the claim file, adjuster notes, and exact policy language used to deny coverage.',
        documents: ['Formal request letter for claim file'],
        resourceIds: ['res-insurance-cdi'],
        fallback: 'Cite California Insurance Code § 790.03 if the insurer delays providing the requested documentation.',
        status: 'current',
      },
      {
        id: 'ins-p-2',
        stepNumber: 2,
        title: 'Submit formal Request for Reconsideration with independent rebuttal',
        who: 'You',
        minutes: 35,
        why: 'Allows an internal appeals supervisor to overturn an adjuster’s initial refusal before external escalation.',
        instructions: 'Present contradictory evidence, independent repair estimates, or mechanic statements refuting the denial grounds.',
        documents: ['Written Appeal memorandum', 'Independent third-party estimates'],
        resourceIds: ['res-insurance-cdi'],
        fallback: 'Set a firm 14-day reply deadline for the insurer to respond.',
        status: 'pending',
      },
      {
        id: 'ins-p-3',
        stepNumber: 3,
        title: 'Lodge Request for Assistance with California Department of Insurance',
        who: 'Agency',
        minutes: 20,
        why: 'The state insurance commissioner investigates unfair claims settlement practices and facilitates mediation.',
        instructions: 'File an online consumer complaint via insurance.ca.gov. Attach the denial letter and your written rebuttal.',
        documents: ['Online CDI complaint form and attachments'],
        resourceIds: ['res-insurance-cdi'],
        fallback: 'For substantial claims, consult a bad-faith insurance attorney for a free initial case evaluation.',
        status: 'pending',
      },
    ],
  },

  consumer: {
    title: 'Consumer Deceptive Practice & Warranty Refund Resolution',
    category: 'consumer',
    summary: 'Resolution plan for defective products, fraudulent merchant charges, or refused warranty obligations under consumer protection statutes.',
    deadlines: [
      { id: 'co1', label: 'Credit Card Fair Credit Billing Act Dispute Window', dateStr: '60 days from billing statement date' },
    ],
    documents: [
      'Original purchase invoice or receipt',
      'Written warranty terms or merchant return policy',
      'Photos or logs demonstrating product failure / service breach',
    ],
    steps: [
      {
        id: 'con-p-1',
        stepNumber: 1,
        title: 'Initiate formal billing dispute under Fair Credit Billing Act',
        who: 'You',
        minutes: 15,
        why: 'If purchased with a credit card, federal law allows chargeback for goods not delivered as agreed or defective upon arrival.',
        instructions: 'Submit a billing error dispute through your credit card online portal within 60 days of the statement date.',
        documents: ['Credit card charge statement', 'Merchant communication log'],
        resourceIds: ['res-cfpb-dispute'],
        fallback: 'If paid by debit or cash, proceed directly to state consumer protection complaint.',
        status: 'current',
      },
      {
        id: 'con-p-2',
        stepNumber: 2,
        title: 'File complaint with California Attorney General Consumer Protection Unit',
        who: 'You',
        minutes: 20,
        why: 'State attorney general records consumer fraud patterns and warns deceptive merchants of regulatory enforcement.',
        instructions: 'Complete the California Department of Justice public complaint form outlining misleading claims.',
        documents: ['DOJ online complaint documentation'],
        resourceIds: ['res-housing-legal-aid'],
        fallback: 'Submit a copy of your complaint to the Better Business Bureau (BBB) to encourage private resolution.',
        status: 'pending',
      },
      {
        id: 'con-p-3',
        stepNumber: 3,
        title: 'Prepare Small Claims Demand for refund of purchase price',
        who: 'You',
        minutes: 25,
        why: 'California Song-Beverly Consumer Warranty Act provides remedies for unmerchantable goods.',
        instructions: 'Issue a 14-day notice before filing for breach of implied warranty in small claims court.',
        documents: ['Written demand letter'],
        resourceIds: ['res-housing-selfhelp'],
        fallback: 'Court filing fees can be recovered as court costs if judgment is in your favor.',
        status: 'pending',
      },
    ],
  },

  business: {
    title: 'California Small Business Entity Registration & Compliance Setup',
    category: 'business',
    summary: 'A compliant, ordered roadmap for organizing an LLC or Sole Proprietorship with California Secretary of State, CDTFA, and local city tax offices.',
    deadlines: [
      { id: 'b1', label: 'Initial Statement of Information (Form LLC-12)', dateStr: 'Due within 90 days of filing Articles' },
    ],
    documents: [
      'Proposed Business Name and Alternate variations',
      'Designated California Registered Agent for Service of Process',
      'Employer Identification Number (EIN) from IRS',
    ],
    steps: [
      {
        id: 'biz-p-1',
        stepNumber: 1,
        title: 'File Articles of Organization (Form LLC-1) on bizfile California',
        who: 'You',
        minutes: 20,
        why: 'Legally creates the limited liability company under the California Revised Uniform Limited Liability Company Act.',
        instructions: 'Access bizfileonline.sos.ca.gov. Check business name availability, enter principal office address, and designate registered agent.',
        documents: ['Form LLC-1 data and filing fee'],
        resourceIds: ['res-sos-biz'],
        fallback: 'Check for identical trademark or fictitious business names in your county before submitting.',
        status: 'current',
      },
      {
        id: 'biz-p-2',
        stepNumber: 2,
        title: 'Obtain Federal Employer Identification Number (EIN) from IRS',
        who: 'You',
        minutes: 15,
        why: 'Required by financial institutions to open dedicated business banking accounts and pay taxes.',
        instructions: 'Apply online at IRS.gov between 7:00 AM and 10:00 PM EST for instantaneous assignment of your 9-digit EIN.',
        documents: ['Responsible party SSN/ITIN', 'Form LLC-1 filed copy'],
        resourceIds: ['res-sos-biz'],
        fallback: 'Always use the free official .gov site; never pay private filing services for EIN issuance.',
        status: 'pending',
      },
      {
        id: 'biz-p-3',
        stepNumber: 3,
        title: 'File initial Statement of Information (Form LLC-12) & local business license',
        who: 'Agency',
        minutes: 25,
        why: 'Mandatory California compliance filing due within 90 calendar days to avoid a $250 late penalty.',
        instructions: 'Submit Form LLC-12 via bizfile. Then apply for city business tax certificate in your municipal jurisdiction.',
        documents: ['Manager/member names and addresses', 'City business tax application'],
        resourceIds: ['res-sos-biz'],
        fallback: 'Check California Department of Tax and Fee Administration (CDTFA) for seller’s permit requirements if retailing goods.',
        status: 'pending',
      },
    ],
  },

  employment: {
    title: 'California Unpaid Wage & Final Paycheck Recovery Plan',
    category: 'employment',
    summary: 'A structured claim process under California Labor Code for recovering unpaid overtime, unpaid final paycheck wages, and statutory waiting time penalties.',
    deadlines: [
      { id: 'e1', label: 'Labor Commissioner Claim Filing Window', dateStr: '3 years for statutory wage claims' },
      { id: 'e2', label: 'Waiting Time Penalties Cap', dateStr: 'Accrues up to 30 full days of daily wages' },
    ],
    documents: [
      'Time cards, punch logs, or personal tracking notes',
      'Pay stubs demonstrating unpaid hours or improper deductions',
      'Written separation notice showing date of termination',
    ],
    steps: [
      {
        id: 'emp-p-1',
        stepNumber: 1,
        title: 'Calculate exact unpaid wages & statutory waiting time penalties',
        who: 'You',
        minutes: 30,
        why: 'Under California Labor Code § 203, employees who are discharged without immediate final pay are entitled to a full day of wages for each day delayed (up to 30 days).',
        instructions: 'Compute total unpaid regular hours, overtime (over 8h/day or 40h/week), missed meal/rest break premiums, and daily waiting time penalties.',
        documents: ['Wage calculation spreadsheet', 'Paystubs and time logs'],
        resourceIds: ['res-dir-wages'],
        fallback: 'The California Labor Commissioner provides free calculation worksheets for employees on their website.',
        status: 'current',
      },
      {
        id: 'emp-p-2',
        stepNumber: 2,
        title: 'Send formal wage demand letter to former employer',
        who: 'You',
        minutes: 20,
        why: 'Informs the employer of statutory penalty accruals and provides 5 days to wire or issue payment before state filings.',
        instructions: 'Issue a detailed demand citing Labor Code §§ 201-203. Request payment by certified funds to avoid filing fees.',
        documents: ['Written wage demand letter', 'Proof of delivery'],
        resourceIds: ['res-dir-wages'],
        fallback: 'If the employer does not respond within 5 business days, proceed directly to state agency filing.',
        status: 'pending',
      },
      {
        id: 'emp-p-3',
        stepNumber: 3,
        title: 'File Initial Wage Claim (DLSE Form 1) with California Labor Commissioner',
        who: 'Agency',
        minutes: 30,
        why: 'The Division of Labor Standards Enforcement (DLSE) holds informal settlement conferences and formal Berman hearings.',
        instructions: 'Submit DLSE Form 1 online or to your regional district office. You will be assigned a Deputy Labor Commissioner.',
        documents: ['Form DLSE 1', 'Itemized wage calculation attachments'],
        resourceIds: ['res-dir-wages'],
        fallback: 'Attorneys are not required at DLSE hearings, and fees are completely free for employees.',
        status: 'pending',
      },
    ],
  },
};
