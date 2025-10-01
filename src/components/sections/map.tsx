'use client';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { Map, Navigation } from "lucide-react";
import { contactInfo } from "@/lib/data";

const MapSection = () => {
    const { language } = useLanguage();

    const location = {
        title: "Swad Restaurant",
        lat: 19.604917,
        lng: 76.68875,
        address: contactInfo.address[language]
    }

    const mapSrc = `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;

    return (
        <section id="location" className="relative h-[600px] w-full">
            <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant Location"
            ></iframe>
            <div className="absolute bottom-8 left-1/2 w-11/12 max-w-md -translate-x-1/2 transform rounded-lg bg-background p-6 shadow-2xl">
                <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                        <Map className="h-8 w-8 text-primary"/>
                    </div>
                    <div>
                        <h3 className="font-headline text-2xl font-bold">{location.title}</h3>
                        <p className="mt-1 text-muted-foreground">{location.address}</p>
                         <Button asChild className="mt-4">
                            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                                <Navigation className="mr-2 h-4 w-4" />
                                {language === 'en' ? 'Get Directions' : 'दिशा मिळवा'}
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapSection;
