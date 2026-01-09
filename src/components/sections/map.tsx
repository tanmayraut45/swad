"use client";
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
    address: contactInfo.address[language],
  };

  // Modern Google Maps Embed URL (proper format that works on all devices)
  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d286.00356413642425!2d76.68858040187355!3d19.604938555263907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd06fcc2842b455%3A0xb94e8687c3c640f7!2sSWAD%20Restaurant!5e1!3m2!1sen!2sin!4v1767978654024!5m2!1sen!2sin";
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;

  return (
    <section id="location" className="relative h-[600px] w-full">
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        referrerPolicy="no-referrer-when-downgrade"
        title="Restaurant Location"
      ></iframe>
      <div className="absolute bottom-8 left-1/2 w-11/12 max-w-md -translate-x-1/2 transform rounded-lg bg-background p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex-shrink-0">
            <Map className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold">
              {location.title}
            </h3>
            <p className="mt-1 text-muted-foreground">{location.address}</p>
            <Button asChild className="mt-4">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="mr-2 h-4 w-4" />
                {language === "en" ? "Get Directions" : "दिशा मिळवा"}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
