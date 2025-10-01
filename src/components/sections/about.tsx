'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { aboutContent } from '@/lib/data';
import { DiyaIcon } from '@/components/icons/diya-icon';

const AboutSection = () => {
  const { language } = useLanguage();

  return (
    <section id="about" className="section-padding bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-1">
          <div>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
