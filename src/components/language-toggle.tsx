'use client';

import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage} aria-label="Toggle language">
      <Languages className="mr-2 h-4 w-4" />
      {language === 'en' ? 'मराठी' : 'English'}
    </Button>
  );
}
