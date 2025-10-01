import Link from 'next/link';
import { Facebook, Instagram, Twitter, ChefHat } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
          <div className="md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-accent" />
              <span className="font-headline text-xl font-bold">
                Maha Zaika
              </span>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Authentic Maharashtrian Cuisine.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-3 lg:grid-cols-3">
             <div>
              <h3 className="font-headline text-lg font-semibold">Navigate</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#about" className="text-sm hover:text-accent">About Us</Link></li>
                <li><Link href="#menu" className="text-sm hover:text-accent">Menu</Link></li>
                <li><Link href="#gallery" className="text-sm hover:text-accent">Gallery</Link></li>
                <li><Link href="#contact" className="text-sm hover:text-accent">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-sm hover:text-accent">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm hover:text-accent">Terms of Service</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="font-headline text-lg font-semibold">Follow Us</h3>
              <div className="mt-4 flex space-x-4">
                <Link href="#" aria-label="Facebook">
                  <Facebook className="h-6 w-6 hover:text-accent" />
                </Link>
                <Link href="#" aria-label="Instagram">
                  <Instagram className="h-6 w-6 hover:text-accent" />
                </Link>
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-6 w-6 hover:text-accent" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Maha Zaika. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
