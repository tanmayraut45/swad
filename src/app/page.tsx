import HeroSection from '@/components/sections/hero';
import AboutSection from '@/components/sections/about';
import MenuSection from '@/components/sections/menu';
import MapSection from '@/components/sections/map';
import ContactSection from '@/components/sections/contact';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <MapSection />
      <ContactSection />
    </div>
  );
}
