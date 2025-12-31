"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Sparkles, ChevronDown, Star, Mail, MessageSquare } from "lucide-react"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitMessage({ type: 'success', text: 'Message sent successfully! We\'ll get back to you soon.' })
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setSubmitMessage({ type: 'error', text: 'Failed to send message. Please try again.' })
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to send message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-8 py-20 text-center md:py-28 lg:py-36 overflow-hidden relative min-h-[85vh]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-600">
                Your Voice,
              </span> <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-emerald-400 via-emerald-600 to-emerald-950 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)] pb-2">
                Supercharged by AI
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-base md:text-lg lg:text-xl">
              Experience real-time, ultra-low latency voice conversations with our advanced AI agent.
              Seamlessly integrated, infinitely scalable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
              <Link href="/auth/register">
                <Button size="lg" variant="glow" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-primary/60" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container px-4 md:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-24 text-center">
            <div className="space-y-1">
              <h4 className="text-3xl md:text-4xl font-bold text-gradient-premium">1,000+</h4>
              <p className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">Users</p>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div className="space-y-1">
              <h4 className="text-3xl md:text-4xl font-bold text-gradient-premium">5+</h4>
              <p className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">Countries</p>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div className="space-y-1">
              <h4 className="text-3xl md:text-4xl font-bold text-gradient-premium">5,000+</h4>
              <p className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">Creations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container px-4 md:px-6 py-20 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Powerful Features</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Everything you need to build exceptional voice experiences
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 transition-all">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Real-time Latency</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Conversations that feel natural with sub-500ms response times. Our optimized infrastructure ensures lightning-fast interactions that keep your users engaged.
            </p>
            <p className="text-xs text-primary/80 font-medium">
              ⚡ Average response: &lt;300ms
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 transition-all">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Human-like Voices</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Powered by advanced TTS models for expressive, lifelike speech. Choose from multiple voices and accents to match your brand's personality perfectly.
            </p>
            <p className="text-xs text-primary/80 font-medium">
              🎙️ 20+ Premium Voices
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 transition-all">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Secure & Private</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Enterprise-grade encryption and privacy controls for your data. GDPR and SOC 2 compliant with end-to-end encryption for all conversations.
            </p>
            <p className="text-xs text-primary/80 font-medium">
              🔒 Bank-level Security
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-card/20 backdrop-blur-sm py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Users Say</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their workflow with VoiceAI.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-all">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-emerald-500 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                ))}
              </div>
              <p className="text-muted-foreground italic text-sm leading-relaxed">
                "The voice quality is incredible! It's like talking to a real person. This has completely changed how we handle customer support."
              </p>
              <div className="pt-3 border-t border-border/50">
                <p className="font-semibold">Sarah Chen</p>
                <p className="text-xs text-muted-foreground">CEO, TechStart</p>
              </div>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-all">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-emerald-500 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                ))}
              </div>
              <p className="text-muted-foreground italic text-sm leading-relaxed">
                "Ultra-low latency makes conversations feel natural. Our users love it, and so do we. Best investment we've made this year."
              </p>
              <div className="pt-3 border-t border-border/50">
                <p className="font-semibold">Michael Rodriguez</p>
                <p className="text-xs text-muted-foreground">Product Manager, InnovateCo</p>
              </div>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-all">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-emerald-500 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                ))}
              </div>
              <p className="text-muted-foreground italic text-sm leading-relaxed">
                "Simple integration, powerful features. We had our voice agent up and running in less than an hour. Highly recommended!"
              </p>
              <div className="pt-3 border-t border-border/50">
                <p className="font-semibold">Emily Watson</p>
                <p className="text-xs text-muted-foreground">Developer, StartupHub</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container px-4 md:px-6 py-20">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Everything you need to know about VoiceAI.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-6 rounded-lg border-2 border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:border-primary/40 transition-all shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-foreground">How does the credit system work?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Each conversation uses credits based on duration and features. Free users get 300 credits/month, while Pro users receive 5,000 credits/month. Credits reset monthly.
            </p>
          </div>
          <div className="p-6 rounded-lg border-2 border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:border-primary/40 transition-all shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-foreground">Can I cancel my subscription anytime?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Yes! You can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period.
            </p>
          </div>
          <div className="p-6 rounded-lg border-2 border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:border-primary/40 transition-all shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-foreground">What languages are supported?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We currently support English with multiple accents. Additional languages including Spanish, French, German, and Mandarin are coming soon.
            </p>
          </div>
          <div className="p-6 rounded-lg border-2 border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:border-primary/40 transition-all shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-foreground">Is my data secure?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Absolutely. We use enterprise-grade encryption for all data in transit and at rest. We never share your data with third parties and comply with GDPR and SOC 2 standards.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-card/20 backdrop-blur-sm py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center space-y-3 mb-10">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-2">
                <MessageSquare className="h-7 w-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Get in Touch</h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="bg-background/50"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-background/50"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  className="bg-background/50"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea
                  id="message"
                  placeholder="Tell us more..."
                  rows={5}
                  className="bg-background/50 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              {submitMessage && (
                <div className={`p-3 rounded-lg text-center text-sm ${submitMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {submitMessage.text}
                </div>
              )}
              <Button type="submit" variant="glow" className="w-full" disabled={isSubmitting}>
                <Mail className="mr-2 h-4 w-4" /> {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
