import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Export a factory function instead of the initialized worker.
// This prevents 'setupWorker' from executing immediately when this module is imported.
export const createWorker = () => {
  try {
    return setupWorker(...handlers);
  } catch (error) {
    console.warn('MSW setupWorker failed (likely non-browser environment):', error);
    return null;
  }
};