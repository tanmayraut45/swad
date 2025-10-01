'use client';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';
import { useLanguage } from '@/context/language-context';

const GallerySection = () => {
    const { language } = useLanguage();
    const galleryImages = placeholderImages.placeholderImages.filter(p => p.id.startsWith('gallery-'));

  return (
    <section id="gallery" className="section-padding bg-secondary">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center font-headline text-4xl font-bold md:text-5xl">
            {language === 'en' ? 'Our Gallery' : 'आमची गॅलरी'}
        </h2>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>div:not(:first-child)]:mt-4">
          {galleryImages.map((image) => (
            <div key={image.id} className="relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src={image.imageUrl}
                alt={image.description}
                data-ai-hint={image.imageHint}
                width={500}
                height={700}
                className="h-auto w-full transform transition-transform duration-500 hover:scale-110"
              />
               <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                <p className="absolute bottom-4 left-4 font-headline text-lg text-white">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
