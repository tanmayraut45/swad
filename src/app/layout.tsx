import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/context/language-context";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://swadrestaurant.vercel.app"),
  title: "Swad Restaurant | Authentic Indian Cuisine",
  description:
    "Experience the rich and diverse flavors of authentic Indian cuisine at Swad Restaurant and Udappi Center.",
  openGraph: {
    title: "Swad Restaurant | Authentic Indian Cuisine",
    description:
      "Experience the rich and diverse flavors of authentic Indian cuisine at Swad Restaurant and Udappi Center.",
    url: "https://swadrestaurant.vercel.app",
    siteName: "Swad Restaurant",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Swad Restaurant - Authentic Indian Cuisine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swad Restaurant | Authentic Indian Cuisine",
    description:
      "Experience the rich and diverse flavors of authentic Indian cuisine at Swad Restaurant and Udappi Center.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "SWAD Family Restaurants",
    image: "/opengraph-image.png",
    telephone: "+91-9876543210",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Pachlegaonkar Complex, Parbhani - Jintur Rd",
      addressLocality: "Jintur",
      addressRegion: "MH",
      postalCode: "431509",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.604917,
      longitude: 76.68875,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "23:00",
      },
    ],
    servesCuisine: "Indian",
  };

  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <LanguageProvider>
          <div className="relative flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
