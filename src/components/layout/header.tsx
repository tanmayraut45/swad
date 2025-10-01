'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, ChefHat } from 'lucide-react';
import { LanguageToggle } from '@/components/language-toggle';
import { navLinks } from '@/lib/data';
import { useLanguage } from '@/context/language-context';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-background/80 shadow-md backdrop-blur-sm' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">
            Maha Zaika
          </span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label[language]}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageToggle />
          <Button asChild size="sm">
            <Link href="#contact">
              <Phone className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Book a Table' : 'टेबल बुक करा'}
            </Link>
          </Button>
        </div>
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="p-4">
                 <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
                  <ChefHat className="h-8 w-8 text-primary" />
                  <span className="font-headline text-xl font-bold text-primary">
                    Maha Zaika
                  </span>
                </Link>
                <nav className="mt-8 flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleLinkClick}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {link.label[language]}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 flex flex-col gap-4">
                    <LanguageToggle />
                    <Button asChild>
                        <Link href="#contact" onClick={handleLinkClick}>
                            <Phone className="mr-2 h-4 w-4" />
                            {language === 'en' ? 'Book a Table' : 'टेबल बुक करा'}
                        </Link>
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
