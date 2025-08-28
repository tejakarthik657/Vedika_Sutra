"use client";

import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Note: Label is not used directly, FormLabel is
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, {
    message: "Please enter a valid phone number.",
  }),
  eventType: z.string().min(1, { message: "Please select an event type." }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventType: "",
      message: "",
    },
  });

  // --- MODIFIED SECTION START ---
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // 1. Construct the full API URL using the environment variable
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/contact`;

      // 2. Use the full URL in the POST request
      await axios.post(apiUrl, data);

      toast.success("Message sent successfully! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      // 3. Add more detailed error logging for easier debugging
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send message. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- MODIFIED SECTION END ---

  return (
    <section id="contact" className="py-20 bg-card">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Let's Create Something Beautiful Together.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="order-1 lg:order-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your full name"
                          className="bg-background border-border focus:ring-primary focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive animate-shake" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Email *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          className="bg-background border-border focus:ring-primary focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive animate-shake" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Phone Number *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className="bg-background border-border focus:ring-primary focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive animate-shake" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Event Type *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-border focus:ring-primary focus:border-primary">
                            <SelectValue placeholder="Select your event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="corporate">Corporate Event</SelectItem>
                          <SelectItem value="birthday">Birthday Party</SelectItem>
                          <SelectItem value="anniversary">Anniversary</SelectItem>
                          <SelectItem value="baby-shower">Baby Shower</SelectItem>
                          <SelectItem value="graduation">Graduation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive animate-shake" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Message *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your event vision, date, and any specific requirements..."
                          className="bg-background border-border focus:ring-primary focus:border-primary min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive animate-shake" />
                      <p className="text-sm text-muted-foreground">
                        Include your preferred date, venue, and guest count if known.
                      </p>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-medium py-3 h-auto transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Sending Message...
                    </div>
                  ) : (
                    "Send Message"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your information is secure and will only be used to respond to your inquiry.
                </p>
              </form>
            </Form>
          </div>

          {/* Contact Details (Unchanged) */}
          <div className="order-2 lg:order-2 space-y-8">
            {/* ... Rest of the component is identical ... */}
            <div>
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
                Get In Touch
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-foreground mb-1">Email</p>
                  <a
                    href="mailto:hello@vedikasutra.com"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    vedikasutra@gmail.com
                  </a>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-1">Phone</p>
                  <a
                    href="tel:8520974962"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    +91 85209 74962
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h4 className="font-medium text-foreground mb-3">Response Time</h4>
              <p className="text-muted-foreground leading-relaxed">
                We typically respond to all inquiries within 24 hours. For urgent requests, 
                please call us directly. We're excited to learn about your event and discuss 
                how we can bring your vision to life.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h4 className="font-medium text-foreground mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/vedika_sutra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.23 16.78c-1.524 0-2.757-1.233-2.757-2.757s1.233-2.757 2.757-2.757 2.757 1.233 2.757 2.757-1.233 2.757-2.757 2.757zm7.554 0c-1.524 0-2.757-1.233-2.757-2.757s1.233-2.757 2.757-2.757 2.757 1.233 2.757 2.757-1.233 2.757-2.757 2.757z"/>
                  </svg>
                </a>

                <a
                  href="https://www.facebook.com/share/1ZCiFxX9LE/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/Vedika_Sutra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                  aria-label="Follow us on X"
                  >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.723 0-4.928 2.206-4.928 4.928 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.708.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.928-.086.627 1.956 2.444 3.379 4.6 3.419-1.68 1.318-3.809 2.105-6.102 2.105-.396 0-.787-.023-1.17-.067C2.179 19.29 4.768 20 7.548 20c9.142 0 14.307-7.721 14.307-14.416 0-.22-.004-.439-.014-.656C22.505 6.411 23.34 5.543 24 4.557z"/>     
                  </svg>
                  </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}