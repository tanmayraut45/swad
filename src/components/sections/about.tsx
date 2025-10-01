'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { aboutContent } from '@/lib/data';
import { DiyaIcon } from '@/components/icons/diya-icon';
import placeholderImages from '@/lib/placeholder-images.json';

const AboutSection = () => {
  const { language } = useLanguage();
  const aboutImage = placeholderImages.placeholderImages.find(p => p.id === 'about-us-family');

  return (
    <section id="about" className="section-padding bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <DiyaIcon className="h-10 w-10 text-primary" />
                  <CardTitle className="font-headline text-4xl">
                    {aboutContent.title[language]}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  {aboutContent.paragraph1[language]}
                </p>
                <p className="text-muted-foreground">
                  {aboutContent.paragraph2[language]}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="order-1 h-80 w-full lg:order-2 lg:h-[500px]">
            {aboutImage && (
              <div className="relative h-full w-full overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src={aboutImage.imageUrl}
                  alt={aboutImage.description}
                  data-ai-hint={aboutImage.imageHint}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
