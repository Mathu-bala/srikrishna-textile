
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MessageCircle, MapPin, Send, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { submitSupportRequest } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

import { useSearchParams } from 'react-router-dom';

const ContactUs = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        orderId: searchParams.get('orderId') || '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitSupportRequest(formData);
            setSubmitted(true);
            toast.success('Message sent successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col bg-background">
            <Header />

            <main className="w-full">
                {/* Hero Section */}
                <section className="relative py-6 overflow-hidden bg-primary/5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="container-custom relative z-10 text-center">
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 uppercase tracking-tighter italic">
                            We're here to help – <span className="text-gradient-neon">24/7</span>
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-xl mx-auto font-medium">
                            Have questions about your order or need styling advice? Our dedicated team is available around the clock.
                        </p>
                    </div>
                </section>

                <section className="container-custom pt-6 pb-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold font-display mb-6">Get in Touch</h2>
                                <div className="grid gap-6">
                                    <div className="glass-card p-6 flex items-start gap-4 hover:border-secondary/50 transition-colors">
                                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Call Us 24/7</h3>
                                            <p className="text-muted-foreground text-sm mb-2">Speak directly with our support team anytime.</p>
                                            <a href="tel:+919786632306" className="text-lg font-bold text-foreground hover:text-secondary transition-colors underline-offset-4 hover:underline">+91 97866 32306</a>
                                        </div>
                                    </div>

                                    <div className="glass-card p-6 flex items-start gap-4 hover:border-secondary/50 transition-colors">
                                        <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                                            <MessageCircle size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1 text-foreground">WhatsApp Support</h3>
                                            <p className="text-muted-foreground text-sm mb-3">Chat with us for quick responses.</p>
                                            <a 
                                              href="https://wa.me/919786632306?text=Hello%20I%20would%20like%20to%20know%20more%20about%20your%20saree%20collections" 
                                              target="_blank" rel="noopener noreferrer" className="inline-block"
                                            >
                                              <button className="bg-[#25D366] text-white px-5 py-3 rounded-lg border-none font-bold cursor-pointer shadow-[0_4px_10px_rgba(37,211,102,0.3)] hover:shadow-[0_0_15px_rgba(37,211,102,0.6)] flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95">
                                                  <MessageCircle size={18} className="fill-current" />
                                                  Chat on WhatsApp
                                              </button>
                                            </a>
                                        </div>
                                    </div>

                                    <div className="glass-card p-6 flex items-start gap-4 hover:border-secondary/50 transition-colors">
                                        <div className="p-3 bg-accent/10 rounded-lg text-accent">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Email Support</h3>
                                            <p className="text-muted-foreground text-sm mb-2">Send us a detailed message.</p>
                                            <div className="flex flex-col gap-2">
                                                <a href="mailto:madhu.matt.matti@gmail.com" className="text-md font-medium text-foreground hover:text-accent underline decoration-accent/50 underline-offset-4 break-all">
                                                    madhu.matt.matti@gmail.com
                                                </a>
                                                <a href="mailto:support@srikrishnatextiles.com" className="text-md font-medium text-foreground hover:text-accent underline decoration-accent/50 underline-offset-4 break-all">
                                                    support@srikrishnatextiles.com
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 bg-muted/30 border-none">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock size={20} className="text-muted-foreground" />
                                    <h3 className="font-semibold">Working Hours</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Monday - Sunday</span>
                                        <span className="font-medium text-neon-green">Always Open (24 Hours)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Support Response Time</span>
                                        <span className="font-medium">Within 1 Hour</span>
                                    </div>
                                </div>
                            </div>

                            {/* Google Map Integration */}
                            <div className="glass-card overflow-hidden hover:border-primary/30 transition-all duration-500">
                                <div className="p-6 border-b border-border/10 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={20} className="text-primary" />
                                        <h3 className="font-bold uppercase tracking-tight text-sm">Our Location</h3>
                                    </div>
                                    <a 
                                      href="https://www.google.com/maps/dir/?api=1&destination=Thayilpatti,+Sivakasi,+Tamil+Nadu" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors"
                                    >
                                      Get Directions
                                    </a>
                                </div>
                                <div className="h-[300px] w-full bg-muted/20 relative">
                                    <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15737.52458406!2d77.8024!3d9.4533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cf7a3b3a3b3b%3A0x3b3b3b3b3b3b3b3b!2sThayilpatti%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1710260751912!5m2!1sen!2sin" 
                                        className="absolute inset-0 w-full h-full border-0"
                                        allowFullScreen 
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Shop Location"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="glass-card p-8">
                            {submitted ? (
                                <div className="text-center py-12 animate-in fade-in zoom-in">
                                    <div className="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle size={40} className="text-neon-green" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Your support request has been received. Our team will contact you soon.
                                    </p>
                                    <Button onClick={() => setSubmitted(false)} variant="outline">
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Send us a Message</h3>
                                        <p className="text-sm text-muted-foreground mb-6">Fill out the form below and we'll get back to you.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Your Name"
                                                required
                                                className="bg-muted/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+91 00000 00000"
                                                required
                                                className="bg-muted/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="your@email.com"
                                                required
                                                className="bg-muted/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="orderId" className="text-sm font-medium">Order ID (Optional)</label>
                                            <Input
                                                id="orderId"
                                                value={formData.orderId}
                                                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                                placeholder="e.g. ORD-123456"
                                                className="bg-muted/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium">Message</label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="How can we help you?"
                                            required
                                            className="min-h-[150px] bg-muted/50"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full btn-neon" disabled={loading}>
                                        {loading ? 'Sending...' : (
                                            <>
                                                Send Message <Send size={16} className="ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ContactUs;
