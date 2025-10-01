'use server';

import { validateTranslation } from '@/ai/flows/multilingual-content-validation';
import type { ValidateTranslationOutput } from '@/ai/flows/multilingual-content-validation';

export async function validateMenuItemTranslation(
  englishContent: string,
  marathiContent: string
): Promise<ValidateTranslationOutput> {
  try {
    const result = await validateTranslation({
      englishContent,
      marathiContent,
      context: 'This is an item on a restaurant menu.',
    });
    return result;
  } catch (error) {
    console.error('Error validating translation:', error);
    return {
      isValid: false,
      feedback: 'Could not validate translation due to a server error.',
    };
  }
}
