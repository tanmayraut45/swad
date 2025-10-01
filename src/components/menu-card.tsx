'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import type { MenuItem } from '@/lib/data';
import { Utensils } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { language } = useLanguage();

  return (
    <Card className="flex h-full flex-col overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="flex-row items-start gap-4">
        <div className="flex-shrink-0">
            <Utensils className="h-8 w-8 text-primary/80" />
        </div>
        <div className="flex-grow">
            <CardTitle className="font-headline text-xl">
            {item.name[language]}
            </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {item.description[language]}
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
