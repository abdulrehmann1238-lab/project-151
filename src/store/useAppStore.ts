import { create } from 'zustand';
import { Case, Category, Resource, Step } from '../types';
import { getSeedCases, INITIAL_USER, INITIAL_NOTIFICATIONS } from '../data/seedCases';
import { SCENARIOS, PREVIEW_PLANS } from '../data/scenarios';
import { ALL_RESOURCES } from '../data/resources';
import { classifyProblem } from '../mock/classify';

interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'error' | 'undo';
  message: string;
  onUndo?: () => void;
  duration?: number;
}

interface AppState {
  // User & Auth
  user: typeof INITIAL_USER;
  setUser: (u: Partial<typeof INITIAL_USER>) => void;
  signInAsMaya: () => void;
  signOut: () => void;

  // Cases
  cases: Case[];
  activeCaseId: string | null;
  setActiveCaseId: (id: string | null) => void;
  getActiveCase: () => Case | undefined;
  recentlyDeletedCase: Case | null;

  // Draft Case intake flow
  draftProblem: string;
  draftState: string;
  draftHasDeadline: string;
  draftCategory: Category | null;
  draftAnswers: Record<string, string>;
  draftUnderstanding: ReturnType<typeof classifyProblem> | null;
  setDraftProblem: (text: string) => void;
  setDraftState: (st: string) => void;
  setDraftHasDeadline: (v: string) => void;
  setDraftCategory: (cat: Category | null) => void;
  setDraftAnswer: (qId: string, val: string) => void;
  setDraftUnderstanding: (u: ReturnType<typeof classifyProblem> | null) => void;
  resetDraft: () => void;

  // Case Mutations
  createCaseFromDraft: () => string;
  createCaseFromPrompt: (prompt: string, category?: Category) => string;
  toggleStepStatus: (caseId: string, stepId: string) => void;
  toggleDocumentChecked: (caseId: string, docName: string) => void;
  updateCaseTitle: (caseId: string, title: string) => void;
  updateCaseStatus: (caseId: string, status: Case['status']) => void;
  deleteCase: (caseId: string) => void;
  undoDeleteCase: () => void;
  refinePlan: (caseId: string, promptText: string) => { addedStepTitle: string };

  // Notifications
  notifications: typeof INITIAL_NOTIFICATIONS;
  markNotificationRead: (id: string) => void;

  // UI Overlays & Drawers
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;

  activeSourceResource: Resource | null;
  openSourceDrawer: (resource: Resource) => void;
  closeSourceDrawer: () => void;

  demoNoticeModal: { isOpen: boolean; title: string; url?: string };
  openDemoNotice: (title: string, url?: string) => void;
  closeDemoNotice: () => void;

  signinModalOpen: boolean;
  setSigninModalOpen: (open: boolean) => void;

  guidedPickerOpen: boolean;
  setGuidedPickerOpen: (open: boolean) => void;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Demo Controls
  demoSettings: {
    simulateSlowNetwork: boolean;
    simulateSourceFailure: boolean;
    sourceFailureCount: number;
    guidedTourActive: boolean;
    guidedTourStep: number;
  };
  toggleSlowNetwork: () => void;
  toggleSourceFailure: () => void;
  incrementSourceFailure: () => void;
  setGuidedTourActive: (active: boolean) => void;
  setGuidedTourStep: (step: number) => void;
  resetDemoData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: INITIAL_USER,
  setUser: (u) => set((s) => ({ user: { ...s.user, ...u } })),
  signInAsMaya: () => set((s) => ({ user: { ...s.user, isAuthenticated: true } })),
  signOut: () => set((s) => ({ user: { ...s.user, isAuthenticated: false } })),

  cases: getSeedCases(),
  activeCaseId: 'case-dmv-101',
  setActiveCaseId: (id) => set({ activeCaseId: id }),
  getActiveCase: () => {
    const { cases, activeCaseId } = get();
    return cases.find((c) => c.id === activeCaseId) || cases[0];
  },
  recentlyDeletedCase: null,

  draftProblem: '',
  draftState: 'California',
  draftHasDeadline: 'No',
  draftCategory: null,
  draftAnswers: {},
  draftUnderstanding: null,
  setDraftProblem: (text) => set({ draftProblem: text }),
  setDraftState: (st) => set({ draftState: st }),
  setDraftHasDeadline: (v) => set({ draftHasDeadline: v }),
  setDraftCategory: (cat) => set({ draftCategory: cat }),
  setDraftAnswer: (qId, val) =>
    set((s) => ({ draftAnswers: { ...s.draftAnswers, [qId]: val } })),
  setDraftUnderstanding: (u) => set({ draftUnderstanding: u }),
  resetDraft: () =>
    set({
      draftProblem: '',
      draftState: 'California',
      draftHasDeadline: 'No',
      draftCategory: null,
      draftAnswers: {},
      draftUnderstanding: null,
    }),

  createCaseFromDraft: () => {
    const { draftProblem, draftState, draftCategory, draftAnswers, draftUnderstanding } = get();
    const cat = draftCategory || draftUnderstanding?.category || 'dmv';
    const scenarioKey = (cat === 'unemployment' || cat === 'housing') ? cat : 'dmv';
    const scenario = SCENARIOS[scenarioKey];

    const newId = `case-${cat}-${Date.now().toString().slice(-4)}`;
    const steps = scenario.buildSteps(draftAnswers);
    const documents = scenario.defaultDocuments.map((doc) => ({ name: doc, checked: false }));

    const newCase: Case = {
      id: newId,
      title: draftUnderstanding?.situation || scenario.title,
      category: cat,
      situation: draftProblem || scenario.situation,
      location: draftState || 'California',
      urgency: draftUnderstanding?.urgency || 'Time-sensitive',
      confidence: draftUnderstanding?.confidence || 'High',
      restatement: draftUnderstanding?.restatement || scenario.defaultRestatement,
      status: 'In progress',
      steps,
      answers: draftAnswers,
      deadlines: scenario.deadlines,
      documents,
      updatedAt: 'Just now',
    };

    set((state) => ({
      cases: [newCase, ...state.cases],
      activeCaseId: newId,
    }));

    get().addToast({
      type: 'success',
      message: 'Plan created. You can begin step 1.',
    });

    return newId;
  },

  createCaseFromPrompt: (prompt: string, category?: Category) => {
    const understanding = classifyProblem(prompt);
    const cat = category || understanding.category;
    const scenarioKey = (cat === 'unemployment' || cat === 'housing') ? cat : 'dmv';
    const scenario = SCENARIOS[scenarioKey];

    const newId = `case-${cat}-${Date.now().toString().slice(-4)}`;
    const steps = scenario.buildSteps({});
    const documents = scenario.defaultDocuments.map((doc) => ({ name: doc, checked: false }));

    const newCase: Case = {
      id: newId,
      title: understanding.situation || scenario.title,
      category: cat,
      situation: prompt,
      location: 'California',
      urgency: understanding.urgency,
      confidence: understanding.confidence,
      restatement: understanding.restatement || scenario.defaultRestatement,
      status: 'In progress',
      steps,
      answers: {},
      deadlines: scenario.deadlines,
      documents,
      updatedAt: 'Just now',
    };

    set((state) => ({
      cases: [newCase, ...state.cases],
      activeCaseId: newId,
    }));

    return newId;
  },

  toggleStepStatus: (caseId: string, stepId: string) => {
    set((state) => {
      const cases = state.cases.map((c) => {
        if (c.id !== caseId) return c;
        const targetStep = c.steps.find((s) => s.id === stepId);
        if (!targetStep) return c;

        const isCurrentlyDone = targetStep.status === 'done';
        const newStatus: Step['status'] = isCurrentlyDone ? 'pending' : 'done';

        const updatedSteps = c.steps.map((s) => {
          if (s.id === stepId) {
            return { ...s, status: newStatus };
          }
          return s;
        });

        // Set the first pending step as current
        let foundCurrent = false;
        const normalizedSteps = updatedSteps.map((s) => {
          if (s.status === 'done') return s;
          if (!foundCurrent) {
            foundCurrent = true;
            return { ...s, status: 'current' as const };
          }
          return { ...s, status: 'pending' as const };
        });

        const allDone = normalizedSteps.every((s) => s.status === 'done');
        return {
          ...c,
          status: allDone ? ('Resolved' as const) : ('In progress' as const),
          steps: normalizedSteps,
          updatedAt: 'Just now',
        };
      });

      return { cases };
    });

    get().addToast({
      type: 'success',
      message: 'Step updated.',
      duration: 2500,
    });
  },

  toggleDocumentChecked: (caseId: string, docName: string) => {
    set((state) => ({
      cases: state.cases.map((c) => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          documents: c.documents.map((d) =>
            d.name === docName ? { ...d, checked: !d.checked } : d
          ),
          updatedAt: 'Just now',
        };
      }),
    }));
  },

  updateCaseTitle: (caseId: string, title: string) => {
    set((state) => ({
      cases: state.cases.map((c) => (c.id === caseId ? { ...c, title, updatedAt: 'Just now' } : c)),
    }));
    get().addToast({ type: 'success', message: 'Title saved.' });
  },

  updateCaseStatus: (caseId: string, status: Case['status']) => {
    set((state) => ({
      cases: state.cases.map((c) => (c.id === caseId ? { ...c, status, updatedAt: 'Just now' } : c)),
    }));
    get().addToast({ type: 'info', message: `Status updated to ${status}.` });
  },

  deleteCase: (caseId: string) => {
    const target = get().cases.find((c) => c.id === caseId);
    if (!target) return;

    set((state) => ({
      cases: state.cases.filter((c) => c.id !== caseId),
      recentlyDeletedCase: target,
      activeCaseId: state.activeCaseId === caseId ? state.cases[0]?.id || null : state.activeCaseId,
    }));

    get().addToast({
      type: 'undo',
      message: 'Case deleted.',
      onUndo: () => get().undoDeleteCase(),
      duration: 5000,
    });
  },

  undoDeleteCase: () => {
    const { recentlyDeletedCase } = get();
    if (!recentlyDeletedCase) return;

    set((state) => ({
      cases: [recentlyDeletedCase, ...state.cases],
      recentlyDeletedCase: null,
      activeCaseId: recentlyDeletedCase.id,
    }));

    get().addToast({
      type: 'success',
      message: 'Case restored.',
    });
  },

  refinePlan: (caseId: string, promptText: string) => {
    const lower = promptText.toLowerCase();
    let newStep: Step;

    if (lower.includes('notice') || lower.includes("don't have my notice") || lower.includes('lost')) {
      newStep = {
        id: `refine-step-${Date.now()}`,
        stepNumber: 1.5,
        title: 'Submit Form DL 44 Request for Duplicate Official Notice',
        who: 'You',
        minutes: 15,
        why: 'Added because you do not have the original mailed suspension notice with your case tracking docket.',
        instructions: 'Submit an online request or call the Mandatory Actions Unit to generate a duplicate Order of Suspension mailed or emailed to your verified address.',
        documents: ['Driver’s License Number', 'Recent proof of California residential address'],
        resourceIds: ['res-dmv-form14', 'res-dmv-phone'],
        fallback: 'If online verification fails, visit a local field office before 10 AM with two identity documents.',
        status: 'current',
        isHighlighted: true,
      };
    } else if (lower.includes('fee') || lower.includes("can't pay") || lower.includes('afford')) {
      newStep = {
        id: `refine-step-${Date.now()}`,
        stepNumber: 3.5,
        title: 'Request California Ability-to-Pay Determination (Form TR-320)',
        who: 'Court',
        minutes: 30,
        why: 'Added to provide relief from statutory fines based on household income or public assistance benefits.',
        instructions: 'File California Judicial Branch Form TR-320 with the county traffic court clerk to request fine reduction, community service credit, or a low-monthly installment agreement.',
        documents: ['Proof of income or enrollment in CalFresh / Medi-Cal', 'Form TR-320 draft'],
        resourceIds: ['res-housing-selfhelp'],
        fallback: 'Under California Rule of Court 4.105, court clerks cannot require payment of bail prior to setting a hearing date.',
        status: 'pending',
        isHighlighted: true,
      };
    } else {
      newStep = {
        id: `refine-step-${Date.now()}`,
        stepNumber: 2.5,
        title: `Verify customized condition: "${promptText.slice(0, 45)}"`,
        who: 'You',
        minutes: 20,
        why: 'Added to your customized resolution path in response to your update.',
        instructions: 'Follow up with the designated agency unit to document this change before proceeding with standard filings.',
        documents: ['Case notes', 'Related communication logs'],
        resourceIds: ['res-dmv-status'],
        fallback: 'Save all reference numbers provided by phone representatives.',
        status: 'pending',
        isHighlighted: true,
      };
    }

    set((state) => ({
      cases: state.cases.map((c) => {
        if (c.id !== caseId) return c;
        const newSteps = [...c.steps, newStep]
          .sort((a, b) => a.stepNumber - b.stepNumber)
          .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));

        return {
          ...c,
          steps: newSteps,
          updatedAt: 'Just now',
        };
      }),
    }));

    // Remove highlight after 2s (as specified in Section 7 & 14 wow moment #5)
    setTimeout(() => {
      set((state) => ({
        cases: state.cases.map((c) => {
          if (c.id !== caseId) return c;
          return {
            ...c,
            steps: c.steps.map((s) => (s.id === newStep.id ? { ...s, isHighlighted: false } : s)),
          };
        }),
      }));
    }, 2200);

    get().addToast({
      type: 'info',
      message: 'Plan adapted with new step.',
    });

    return { addedStepTitle: newStep.title };
  },

  notifications: INITIAL_NOTIFICATIONS,
  markNotificationRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastItem = { ...toast, id };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    const duration = toast.duration || (toast.type === 'undo' ? 5000 : 3500);
    setTimeout(() => {
      get().removeToast(id);
    }, duration);

    return id;
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  activeSourceResource: null,
  openSourceDrawer: (resource) => set({ activeSourceResource: resource }),
  closeSourceDrawer: () => set({ activeSourceResource: null }),

  demoNoticeModal: { isOpen: false, title: '' },
  openDemoNotice: (title, url) =>
    set({ demoNoticeModal: { isOpen: true, title, url } }),
  closeDemoNotice: () =>
    set({ demoNoticeModal: { isOpen: false, title: '' } }),

  signinModalOpen: false,
  setSigninModalOpen: (open) => set({ signinModalOpen: open }),

  guidedPickerOpen: false,
  setGuidedPickerOpen: (open) => set({ guidedPickerOpen: open }),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  demoSettings: {
    simulateSlowNetwork: false,
    simulateSourceFailure: false,
    sourceFailureCount: 0,
    guidedTourActive: false,
    guidedTourStep: 1,
  },
  toggleSlowNetwork: () =>
    set((state) => ({
      demoSettings: {
        ...state.demoSettings,
        simulateSlowNetwork: !state.demoSettings.simulateSlowNetwork,
      },
    })),
  toggleSourceFailure: () =>
    set((state) => ({
      demoSettings: {
        ...state.demoSettings,
        simulateSourceFailure: !state.demoSettings.simulateSourceFailure,
        sourceFailureCount: 0,
      },
    })),
  incrementSourceFailure: () =>
    set((state) => ({
      demoSettings: {
        ...state.demoSettings,
        sourceFailureCount: state.demoSettings.sourceFailureCount + 1,
      },
    })),
  setGuidedTourActive: (active) =>
    set((state) => ({
      demoSettings: {
        ...state.demoSettings,
        guidedTourActive: active,
        guidedTourStep: 1,
      },
    })),
  setGuidedTourStep: (step) =>
    set((state) => ({
      demoSettings: {
        ...state.demoSettings,
        guidedTourStep: step,
      },
    })),

  resetDemoData: () => {
    set({
      user: INITIAL_USER,
      cases: getSeedCases(),
      activeCaseId: 'case-dmv-101',
      recentlyDeletedCase: null,
      draftProblem: '',
      draftState: 'California',
      draftHasDeadline: 'No',
      draftCategory: null,
      draftAnswers: {},
      draftUnderstanding: null,
      notifications: INITIAL_NOTIFICATIONS,
      demoSettings: {
        simulateSlowNetwork: false,
        simulateSourceFailure: false,
        sourceFailureCount: 0,
        guidedTourActive: false,
        guidedTourStep: 1,
      },
    });

    get().addToast({
      type: 'info',
      message: 'Demo data restored to initial state.',
    });
  },
}));
