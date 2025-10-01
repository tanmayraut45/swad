import HeroSection from '@/components/sections/hero';
import AboutSection from '@/components/sections/about';
import MenuSection from '@/components/sections/menu';
import GallerySection from '@/components/sections/gallery';
import MapSection from '@/components/sections/map';
import ContactSection from '@/components/sections/contact';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <GallerySection />
      <MapSection />
      <ContactSection />
    </div>
  );
}
