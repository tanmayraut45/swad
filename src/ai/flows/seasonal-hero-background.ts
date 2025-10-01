'use server';

/**
 * @fileOverview Generates a hero image for the landing page based on the current season in Maharashtra.
 *
 * - generateSeasonalHeroImage - A function that generates the hero image.
 * - GenerateSeasonalHeroImageInput - The input type for the generateSeasonalHeroImage function.
 * - GenerateSeasonalHeroImageOutput - The return type for the generateSeasonalHeroImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeasonalHeroImageInputSchema = z.object({}).describe('No input needed.');

export type GenerateSeasonalHeroImageInput = z.infer<typeof GenerateSeasonalHeroImageInputSchema>;

const GenerateSeasonalHeroImageOutputSchema = z.object({
  image: z
    .string()
    .describe(
      "A data URI of the generated hero image, that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type GenerateSeasonalHeroImageOutput = z.infer<typeof GenerateSeasonalHeroImageOutputSchema>;

export async function generateSeasonalHeroImage(
  _input: GenerateSeasonalHeroImageInput
): Promise<GenerateSeasonalHeroImageOutput> {
  return generateSeasonalHeroImageFlow({});
}

const prompt = ai.definePrompt({
  name: 'generateSeasonalHeroImagePrompt',
  input: {schema: GenerateSeasonalHeroImageInputSchema},
  output: {schema: GenerateSeasonalHeroImageOutputSchema},
  prompt: `Generate a hero image for a restaurant website, make sure it is very high quality.

The restaurant is named "Maha Zaika", which specializes in authentic Maharashtrian cuisine.

It is currently {{{season}}} in Maharashtra.  The image should reflect this season. Use the colors deep maroon (#800000), ivory (#FFFAF0), and emerald green (#50C878) in the image.

Important instructions:
1.  The generated image must look photorealistic.
2.  The image must include food.`,
});

const generateSeasonalHeroImageFlow = ai.defineFlow(
  {
    name: 'generateSeasonalHeroImageFlow',
    inputSchema: GenerateSeasonalHeroImageInputSchema,
    outputSchema: GenerateSeasonalHeroImageOutputSchema,
  },
  async () => {
    const today = new Date();
    const month = today.getMonth(); // 0-indexed

    // Define summer and winter months in Maharashtra
    const isSummer = month >= 2 && month <= 5; // March to June (inclusive)
    const season = isSummer ? 'summer' : 'winter';

    const {media} = await ai.generate({
      prompt: await prompt({
        season,
      }),
      model: 'googleai/imagen-4.0-fast-generate-001',
    });

    if (!media?.url) {
      throw new Error('No image was generated.');
    }

    return {image: media.url};
  }
);
