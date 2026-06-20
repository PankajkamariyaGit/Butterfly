"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent! We'll respond within 24 hours.", {
      style: { background: "#FDFBF7", color: "#1A1409", border: "1px solid #C9A84C", fontFamily: "Jost, sans-serif" },
    });
  };

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-[10px] font-body text-champagne tracking-[0.4em] uppercase mb-3">Get in Touch</p>
          <h1 className="font-display text-5xl sm:text-6xl text-obsidian">Contact Us</h1>
          <p className="font-body text-sm text-mink-light mt-4 max-w-md mx-auto">We&apos;re here to help. Reach out for styling advice, order support, or anything else.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
            {[
              { icon: Mail, label: "Email", value: "hello@butterfly.in", sub: "Replies within 24 hours" },
              { icon: Phone, label: "Phone / WhatsApp", value: "+91 98336 09027", sub: "Mon–Sat, 10am–7pm" },
              { icon: MapPin, label: "Studio Address", value: "Butterfly, Kalakhet Road No. 1", sub: "Mandsaur, MP 458001" },
              { icon: Clock, label: "Working Hours", value: "Mon–Sat: 10am–7pm", sub: "Sun: 11am–4pm" },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex gap-4 p-5 bg-white border border-champagne/10 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-champagne" />
                </div>
                <div>
                  <p className="font-body text-[10px] text-champagne tracking-[0.2em] uppercase">{label}</p>
                  <p className="font-body text-sm font-semibold text-obsidian mt-0.5">{value}</p>
                  <p className="font-body text-xs text-mink-light">{sub}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
            {sent ? (
              <div className="h-full flex items-center justify-center text-center p-12 bg-white border border-champagne/10 rounded-2xl">
                <div>
                  <div className="w-16 h-16 rounded-full bg-champagne/10 flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-champagne" />
                  </div>
                  <h3 className="font-display text-2xl text-obsidian mb-2">Message Received</h3>
                  <p className="font-body text-sm text-mink-light">Thank you, {form.name}! Our team will get back to you within 24 hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-champagne/10 rounded-2xl p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-xs text-mink-light tracking-wider uppercase mb-2">Your Name</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-champagne/20 rounded-xl font-body text-sm text-obsidian bg-pearl focus:outline-none focus:border-champagne transition-colors" placeholder="Ananya Sharma" />
                  </div>
                  <div>
                    <label className="block font-body text-xs text-mink-light tracking-wider uppercase mb-2">Email Address</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-champagne/20 rounded-xl font-body text-sm text-obsidian bg-pearl focus:outline-none focus:border-champagne transition-colors" placeholder="ananya@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block font-body text-xs text-mink-light tracking-wider uppercase mb-2">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 border border-champagne/20 rounded-xl font-body text-sm text-obsidian bg-pearl focus:outline-none focus:border-champagne transition-colors">
                    <option value="">Select a topic...</option>
                    <option value="order">Order / Tracking</option>
                    <option value="return">Return / Exchange</option>
                    <option value="styling">Styling Advice</option>
                    <option value="bridal">Bridal Enquiry</option>
                    <option value="bulk">Bulk / Corporate Orders</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs text-mink-light tracking-wider uppercase mb-2">Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-champagne/20 rounded-xl font-body text-sm text-obsidian bg-pearl focus:outline-none focus:border-champagne transition-colors resize-none" placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-champagne to-champagne-dark text-white font-body text-sm tracking-[0.15em] uppercase rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Send size={15} /> Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
