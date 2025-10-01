'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { contactInfo, contactFormContent, openingHours } from '@/lib/data';
import { Clock, MapPin, Phone, MessageCircle, Mail, Map } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.'),
  date: z.date({
    required_error: "A date for booking is required.",
  }),
  time: z.string().min(1, 'Please select a time.'),
  guests: z.string().min(1, "Please enter the number of guests."),
  message: z.string().optional(),
});

const ContactSection = () => {
  const { toast } = useToast();
  const { language } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      time: '19:00',
      guests: '2',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Request Sent!',
      description: "We're processing your booking. For parties of 10+, please call or WhatsApp the owner directly due to high demand.",
      duration: 9000,
    });
    form.reset();
  }

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center font-headline text-4xl font-bold md:text-5xl">
          {contactInfo.title[language]}
        </h2>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">{contactFormContent.title[language]}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{contactFormContent.name[language]}</FormLabel>
                          <FormControl>
                            <Input placeholder={contactFormContent.namePlaceholder[language]} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{contactFormContent.phone[language]}</FormLabel>
                          <FormControl>
                            <Input placeholder={contactFormContent.phonePlaceholder[language]} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{contactFormContent.date[language]}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{contactFormContent.time[language]}</FormLabel>
                          <FormControl>
                             <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="guests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{contactFormContent.guests[language]}</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" placeholder="2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{contactFormContent.message[language]}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={contactFormContent.messagePlaceholder[language]}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" size="lg">
                    {contactFormContent.button[language]}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-semibold">{contactInfo.addressTitle[language]}</h4>
                      <p className="text-muted-foreground">{contactInfo.address[language]}</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-semibold">{language === 'en' ? 'Email Address' : 'ईमेल पत्ता'}</h4>
                      <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary">{contactInfo.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-semibold">{openingHours.title[language]}</h4>
                      {openingHours.hours.map(day => (
                          <p key={day.day.en} className="text-muted-foreground">{day.day[language]}: {day.time}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
               <Button variant="outline" asChild size="lg">
                  <a href={`tel:${contactInfo.phone}`}>
                    <Phone className="mr-2 h-5 w-5"/>
                    {contactInfo.call[language]}
                  </a>
              </Button>
              <Button variant="outline" asChild size="lg">
                  <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5"/>
                    {contactInfo.whatsappLabel[language]}
                  </a>
              </Button>
              <Button variant="outline" asChild size="lg">
                  <a href={`https://www.google.com/maps/search/?api=1&query=19.604917,76.68875`} target="_blank" rel="noopener noreferrer">
                    <Map className="mr-2 h-5 w-5"/>
                    {language === 'en' ? 'View on Maps' : 'नकाशावर पहा'}
                  </a>
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
