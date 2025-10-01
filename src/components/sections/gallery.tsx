'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useLanguage } from '@/context/language-context';
import placeholderData from '@/lib/placeholder-images.json';

const GallerySection = () => {
  const { language } = useLanguage();
  const { placeholderImages } = placeholderData;

  return (
    <section id="gallery" className="section-padding bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-bold md:text-5xl">
            {language === 'en' ? 'Our Gallery' : 'आमची गॅलरी'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {language === 'en'
              ? 'A glimpse into the heart of Swad—from our kitchen to your table.'
              : 'स्वादच्या हृदयात एक डोकावणे—आमच्या स्वयंपाकघरापासून तुमच्या टेबलपर्यंत.'}
          </p>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="mx-auto mt-12 w-full max-w-4xl"
        >
          <CarouselContent>
            {placeholderImages.map((image) => (
              <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden">
                    <CardContent className="relative aspect-square p-0">
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        data-ai-hint={image.imageHint}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default GallerySection;
