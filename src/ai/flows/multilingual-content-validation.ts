'use server';

/**
 * @fileOverview A multilingual content validation AI agent.
 *
 * - validateTranslation - A function that validates the accuracy and contextual appropriateness of translations.
 * - ValidateTranslationInput - The input type for the validateTranslation function.
 * - ValidateTranslationOutput - The return type for the validateTranslation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateTranslationInputSchema = z.object({
  englishContent: z
    .string()
    .describe('The content in English to be validated for translation.'),
  marathiContent: z
    .string()
    .describe('The translated content in Marathi to be validated.'),
  context: z
    .string()
    .optional()
    .describe(
      'Additional context about the content, such as its purpose or target audience.'
    ),
});
export type ValidateTranslationInput = z.infer<typeof ValidateTranslationInputSchema>;

const ValidateTranslationOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the translation is accurate and contextually appropriate.'),
  feedback: z.string().describe('Feedback on the translation, including any errors or suggestions for improvement.'),
});
export type ValidateTranslationOutput = z.infer<typeof ValidateTranslationOutputSchema>;

export async function validateTranslation(input: ValidateTranslationInput): Promise<ValidateTranslationOutput> {
  return validateTranslationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateTranslationPrompt',
  input: {schema: ValidateTranslationInputSchema},
  output: {schema: ValidateTranslationOutputSchema},
  prompt: `You are a multilingual validation expert specializing in ensuring accurate and contextually appropriate translations between English and Marathi for Maha Zaika.

  You will be given content in both English and Marathi. Your task is to determine if the Marathi translation accurately reflects the meaning and intent of the English content, and that it is appropriate for the context of a restaurant serving Maharashtrian cuisine.

  English Content: {{{englishContent}}}
  Marathi Content: {{{marathiContent}}}

  Context: {{{context}}}

  Consider aspects such as grammar, vocabulary, cultural nuances, and overall readability in Marathi. Provide feedback on the translation, including any errors or suggestions for improvement.  If the translation is accurate and appropriate, the isValid field should be set to true, and feedback should confirm that the translation is correct.
`,
});

const validateTranslationFlow = ai.defineFlow(
  {
    name: 'validateTranslationFlow',
    inputSchema: ValidateTranslationInputSchema,
    outputSchema: ValidateTranslationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
