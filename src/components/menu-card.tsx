'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import type { MenuItem } from '@/lib/data';
import { validateMenuItemTranslation } from '@/app/actions';
import { CheckCircle2, AlertCircle, Loader, ShieldQuestion } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MenuCardProps {
  item: MenuItem;
}

type ValidationStatus = 'idle' | 'loading' | 'valid' | 'invalid';

export function MenuCard({ item }: MenuCardProps) {
  const { language } = useLanguage();
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (language === 'mr') {
      setValidationStatus('loading');
      validateMenuItemTranslation(item.description.en, item.description.mr)
        .then((result) => {
          setFeedback(result.feedback);
          if (result.isValid) {
            setValidationStatus('valid');
          } else {
            setValidationStatus('invalid');
          }
        })
        .catch(() => {
          setValidationStatus('invalid');
          setFeedback('Could not perform validation.');
        });
    } else {
      setValidationStatus('idle');
    }
  }, [language, item.description.en, item.description.mr]);

  const ValidationIcon = () => {
    if (language !== 'mr') return null;
  
    let icon;
    let tooltipContent;
  
    switch (validationStatus) {
      case 'loading':
        icon = <Loader className="h-4 w-4 animate-spin text-muted-foreground" />;
        tooltipContent = 'Verifying translation...';
        break;
      case 'valid':
        icon = <CheckCircle2 className="h-4 w-4 text-green-500" />;
        tooltipContent = feedback || 'Translation verified as correct.';
        break;
      case 'invalid':
        icon = <AlertCircle className="h-4 w-4 text-red-500" />;
        tooltipContent = feedback || 'Translation may be incorrect.';
        break;
      default:
        icon = <ShieldQuestion className="h-4 w-4 text-muted-foreground" />;
        tooltipContent = 'Translation not verified.';
    }

    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-2 inline-block">{icon}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={item.image}
          alt={item.name.en}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          {item.name[language]}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {item.description[language]}
          <ValidationIcon />
        </p>
      </CardContent>
      <CardFooter>
        <p className="font-sans text-lg font-bold text-primary">
          ₹{item.price.toFixed(2)}
        </p>
      </CardFooter>
    </Card>
  );
}
