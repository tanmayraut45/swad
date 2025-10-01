import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UtensilsCrossed, MapPin } from 'lucide-react';

async function HeroSection() {
  return (
    <section id="home" className="relative h-[90vh] min-h-[600px] w-full bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://picsum.photos/seed/hero/1920/1080')"}}>
      <div className="absolute inset-0 z-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="font-headline text-5xl font-bold leading-tight drop-shadow-lg md:text-7xl lg:text-8xl">
          Swad Restaurant and Udappi Center
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/90 drop-shadow-md md:text-xl">
          Experience the rich and diverse flavors of authentic Indian cuisine.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" variant="secondary">
            <Link href="#menu">
              <UtensilsCrossed className="mr-2 h-5 w-5" />
              View Our Menu
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white bg-transparent text-white hover:bg-white hover:text-primary">
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
