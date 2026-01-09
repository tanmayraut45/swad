"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menuItems, menuCategories } from "@/lib/data";
import { MenuCard } from "@/components/menu-card";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MenuSection = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleDownloadClick = () => {
    toast({
      title: language === "en" ? "Coming Soon!" : "लवकरच येत आहे!",
      description:
        language === "en"
          ? "Menu PDF will be available soon."
          : "मेनू पीडीएफ लवकरच उपलब्ध होईल.",
      duration: 3000,
    });
  };

  return (
    <section id="menu" className="section-padding bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-bold md:text-5xl">
            {language === "en" ? "Our Menu" : "आमचा मेनू"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {language === "en"
              ? "Discover a variety of traditional and contemporary Maharashtrian dishes, crafted with the freshest ingredients."
              : "ताज्या घटकांसह तयार केलेल्या पारंपारिक आणि समकालीन महाराष्ट्रीयन पदार्थांच्या विविधतेचा शोध घ्या."}
          </p>
        </div>

        <Tabs defaultValue={menuCategories[0].id} className="mt-12 w-full">
          <div className="flex flex-col items-center gap-6">
            {/* Horizontal scrollable tabs on mobile, grid on desktop */}
            <div className="w-full overflow-x-auto pb-2 sm:overflow-visible sm:pb-0">
              <TabsList className="inline-flex w-max gap-1 sm:grid sm:w-auto sm:grid-cols-5">
                {menuCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="whitespace-nowrap px-4 text-sm"
                  >
                    {category.name[language]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadClick}>
              <Download className="mr-2 h-4 w-4" />
              {language === "en" ? "Download PDF" : "पीडीएफ डाउनलोड करा"}
            </Button>
          </div>
          {menuCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {menuItems
                  .filter((item) => item.category === category.id)
                  .map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default MenuSection;
