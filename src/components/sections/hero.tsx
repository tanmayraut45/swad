import Image from 'next/image';
import { generateSeasonalHeroImage } from '@/ai/flows/seasonal-hero-background';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UtensilsCrossed, MapPin } from 'lucide-react';

async function HeroSection() {
  let heroImage;
  try {
    const generated = await generateSeasonalHeroImage({});
    heroImage = generated.image;
  } catch (error) {
    console.error("Failed to generate hero image:", error);
    // Fallback image in case AI generation fails
    heroImage = "https://picsum.photos/seed/hero/1920/1080";
  }

  return (
    <section id="home" className="relative h-[90vh] min-h-[600px] w-full text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Authentic Maharashtrian food"
          fill
          className="object-cover"
          priority
          unoptimized={heroImage.startsWith('data:image')}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h1 className="font-headline text-5xl font-bold leading-tight md:text-7xl lg:text-8xl">
          Maha Zaika
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ivory/90 md:text-xl">
          Experience the rich and diverse flavors of authentic Maharashtrian cuisine.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="#menu">
              <UtensilsCrossed className="mr-2 h-5 w-5" />
              View Our Menu
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="#location">
              <MapPin className="mr-2 h-5 w-5" />
              Find Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
