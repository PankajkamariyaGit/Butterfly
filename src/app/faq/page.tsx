"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

const FAQS = [
  { q: "What materials are used in Butterfly jewellery?", a: "We use premium-grade base metals — primarily brass, copper, and zinc alloy — plated with gold, rose gold, rhodium, or silver. All metals are hypoallergenic and skin-safe for most people." },
  { q: "How long does the plating last?", a: "With proper care, our jewellery retains its finish for 1–2 years. Avoiding water, perfume, and chemicals significantly extends the life of the plating." },
  { q: "Do you offer free shipping?", a: "Yes! We offer free shipping on all orders above ₹999. Standard orders below ₹999 have a flat shipping fee of ₹99." },
  { q: "What is your return policy?", a: "We offer 7-day hassle-free returns on all items. Products must be unused, in original packaging, and with tags intact. Please contact us to initiate a return." },
  { q: "How do I track my order?", a: "Once your order is shipped, you'll receive a tracking ID via email/WhatsApp. You can also track your order at butterfly.com/track-order using your Order ID." },
  { q: "Do you accept custom orders?", a: "We currently don't take custom orders but we're working on it! Sign up for our newsletter to be notified when we launch our customisation service." },
  { q: "Is COD available everywhere?", a: "COD is available across most pin codes in India. During checkout, the system will automatically confirm if COD is available for your address." },
  { q: "How should I care for my jewellery?", a: "Store in a dry place, ideally in the velvet pouch provided. Avoid direct contact with perfume, lotions, or water. Wipe gently with a soft cloth after use." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <div className="bg-pearl border-b border-champagne/15 py-16 text-center px-4">
        <p className="text-xs font-body text-champagne tracking-[0.3em] uppercase mb-3">✦ Help Centre</p>
        <h1 className="font-display text-4xl sm:text-5xl text-obsidian">FAQs & Contact Us</h1>
        <div className="section-divider mt-4" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* FAQs */}
          <div>
            <h2 className="font-display text-3xl text-obsidian mb-8">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-champagne/20 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-start justify-between px-5 py-4 text-left gap-3"
                  >
                    <span className="text-sm font-body font-medium text-obsidian leading-relaxed">{faq.q}</span>
                    <ChevronDown size={16} className={`text-champagne flex-shrink-0 mt-0.5 transition-transform ${open === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {open === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm font-body text-mink-light leading-relaxed border-t border-champagne/10 pt-4">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-display text-3xl text-obsidian mb-8">Get in Touch</h2>
            <div className="space-y-4 mb-8">
              {[
                { icon: Mail, label: "Email Us", value: "pankajkkamariya@gmail.com" },
                { icon: Phone, label: "Call Us", value: "+91 98336 09027" },
                { icon: MapPin, label: "Visit Us", value: "Mumbai, Maharashtra, India" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 glass-card rounded-sm p-4">
                  <div className="w-10 h-10 rounded-sm bg-champagne/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-champagne" />
                  </div>
                  <div>
                    <p className="text-[10px] font-body text-mink-light tracking-widest uppercase">{label}</p>
                    <p className="text-sm font-body text-obsidian font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-sm p-6">
              <h3 className="font-display text-xl text-obsidian mb-5">Send a Message</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Name</label>
                  <input value={contactForm.name} onChange={e=>setContactForm(f=>({...f,name:e.target.value}))} className="luxury-input" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Email</label>
                  <input type="email" value={contactForm.email} onChange={e=>setContactForm(f=>({...f,email:e.target.value}))} className="luxury-input" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-xs font-body text-mink tracking-widest uppercase block mb-1.5">Message</label>
                  <textarea value={contactForm.message} onChange={e=>setContactForm(f=>({...f,message:e.target.value}))} rows={4} className="luxury-input resize-none" placeholder="How can we help you?" />
                </div>
                <Button fullWidth onClick={() => { toast.success("Message sent! We'll respond within 24 hours. 💌"); setContactForm({name:"",email:"",message:""}); }}>
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
