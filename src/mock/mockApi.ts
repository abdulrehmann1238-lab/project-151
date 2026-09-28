import { sleep, randomDelay } from './sleep';
import { classifyProblem, ClassificationResult } from './classify';
import { ALL_RESOURCES } from '../data/resources';
import { Resource } from '../types';

export const mockApi = {
  classify: async (text: string, isSlow = false): Promise<ClassificationResult> => {
    if (isSlow) {
      await sleep(3000);
    } else {
      await randomDelay(400, 750);
    }
    return classifyProblem(text);
  },

  signIn: async (email: string, isSlow = false): Promise<{ success: boolean; user?: any; error?: string }> => {
    if (isSlow) {
      await sleep(3000);
    } else {
      await randomDelay(500, 800);
    }

    if (email.toLowerCase().includes('fail@example.com')) {
      throw new Error("We couldn't reach that address. Try again.");
    }

    return {
      success: true,
      user: {
        name: email.split('@')[0],
        email,
        state: 'California',
      },
    };
  },

  fetchResource: async (id: string, simulateFailure = false): Promise<Resource> => {
    await randomDelay(300, 600);
    if (simulateFailure) {
      throw new Error("Couldn't load this source. Check your connection and try again.");
    }
    const found = ALL_RESOURCES.find((r) => r.id === id);
    if (!found) {
      throw new Error("Resource not found");
    }
    return found;
  },
};
