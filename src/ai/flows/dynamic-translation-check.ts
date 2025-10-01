'use server';

/**
 * @fileOverview Validates the accuracy of dynamic translations between English and Marathi.
 *
 * - checkDynamicTranslation - A function to check the accuracy of dynamic translations.
 * - CheckDynamicTranslationInput - The input type for the checkDynamicTranslation function.
 * - CheckDynamicTranslationOutput - The return type for the checkDynamicTranslation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckDynamicTranslationInputSchema = z.object({
  englishText: z.string().describe('The original text in English.'),
  marathiText: z.string().describe('The dynamically translated text in Marathi.'),
  pageSection: z
    .string()
    .optional()
    .describe('The specific section of the page where the translation is used (e.g., menu, about us).'),
});

export type CheckDynamicTranslationInput = z.infer<typeof CheckDynamicTranslationInputSchema>;

const CheckDynamicTranslationOutputSchema = z.object({
  isAccurate: z.boolean().describe('Indicates whether the Marathi translation accurately reflects the English text.'),
  feedback: z
    .string()
    .describe('Provides feedback on the translation, highlighting any inaccuracies or areas for improvement.'),
});

export type CheckDynamicTranslationOutput = z.infer<typeof CheckDynamicTranslationOutputSchema>;

export async function checkDynamicTranslation(
  input: CheckDynamicTranslationInput
): Promise<CheckDynamicTranslationOutput> {
  return checkDynamicTranslationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkDynamicTranslationPrompt',
  input: {schema: CheckDynamicTranslationInputSchema},
  output: {schema: CheckDynamicTranslationOutputSchema},
  prompt: `You are a translation expert, specializing in validating dynamic translations from English to Marathi for the Maha Zaika restaurant website.

You will receive a piece of English text and its dynamic Marathi translation. Your task is to assess the accuracy of the translation, considering the context of its use on the website (e.g., menu item, description, contact information).

Provide a boolean value indicating whether the translation is accurate, and give feedback explaining any inaccuracies or suggesting improvements.

English Text: {{{englishText}}}
Marathi Text: {{{marathiText}}}
Page Section: {{{pageSection}}}
`,
});

const checkDynamicTranslationFlow = ai.defineFlow(
  {
    name: 'checkDynamicTranslationFlow',
    inputSchema: CheckDynamicTranslationInputSchema,
    outputSchema: CheckDynamicTranslationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
