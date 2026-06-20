"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, MessageCircle, Check } from "lucide-react";
import toast from "react-hot-toast";

type WASettings = {
  waNumber: string;
  businessName: string;
  enabled: boolean;
  orderConfirmation: boolean;
  orderConfirmationTemplate: string;
  shippingUpdate: boolean;
  shippingUpdateTemplate: string;
  codVerification: boolean;
  codVerificationTemplate: string;
  supportButton: boolean;
  supportGreeting: string;
  reviewRequest: boolean;
};

const DEFAULT: WASettings = {
  waNumber: "919876543210",
  businessName: "Butterfly Jewellery",
  enabled: true,
  orderConfirmation: true,
  orderConfirmationTemplate: "Hi {{name}}! 🦋 Your Butterfly order #{{orderId}} has been confirmed! Total: ₹{{amount}}. We'll notify you once it ships. Questions? Reply to this message.",
  shippingUpdate: true,
  shippingUpdateTemplate: "Hi {{name}}! Your Butterfly order #{{orderId}} has been shipped via {{courier}}. Tracking: {{trackingNumber}}. Expected delivery: {{deliveryDate}}.",
  codVerification: true,
  codVerificationTemplate: "Hi {{name}}! 🦋 Your COD order #{{orderId}} of ₹{{amount}} is awaiting dispatch. Reply YES to confirm or NO to cancel.",
  supportButton: true,
  supportGreeting: "Hi Butterfly! 🦋 I need help with my order.",
  reviewRequest: false,
};

export default function AdminWhatsAppPage() {
  const [settings, setSettings] = useState(DEFAULT);
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const set = <K extends keyof WASettings>(k: K, v: WASettings[K]) => setSettings(s => ({ ...s, [k]: v }));

  const handleSave = () => {
    localStorage.setItem("butterfly-wa-settings", JSON.stringify(settings));
    toast.success("WhatsApp settings saved!");
  };

  const inputCls = "w-full bg-white/5 border border-white/10 text-ivory/70 text-sm font-body px-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne/50";
  const labelCls = "text-[10px] font-body text-ivory/30 tracking-widest uppercase block mb-1.5";

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <span onClick={() => onChange(!value)} className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 cursor-pointer flex-shrink-0 ${value ? "bg-green-500" : "bg-white/10"}`}>
      <span className={`w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-5" : ""}`} />
    </span>
  );

  const previewTemplate = (template: string) =>
    template
      .replace("{{name}}", "Priya")
      .replace("{{orderId}}", "ORD-2026-0001")
      .replace("{{amount}}", "2,499")
      .replace("{{courier}}", "Delhivery")
      .replace("{{trackingNumber}}", "DEL123456789")
      .replace("{{deliveryDate}}", "Jun 21, 2026");

  const AUTOMATIONS = [
    { id: "orderConfirmation", label: "Order Confirmation", description: "Send when order is placed", key: "orderConfirmation" as keyof WASettings, templateKey: "orderConfirmationTemplate" as keyof WASettings },
    { id: "shippingUpdate", label: "Shipping Update", description: "Send when order ships", key: "shippingUpdate" as keyof WASettings, templateKey: "shippingUpdateTemplate" as keyof WASettings },
    { id: "codVerification", label: "COD Verification", description: "Confirm COD orders before dispatch", key: "codVerification" as keyof WASettings, templateKey: "codVerificationTemplate" as keyof WASettings },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory/90">WhatsApp Integration</h1>
          <p className="text-xs font-body text-ivory/30 mt-1">Configure WhatsApp Business messages and automations</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-[#25D366] text-white text-xs font-body font-semibold rounded-sm hover:bg-[#20ba57] transition-colors">
          <Save size={13} /> Save Settings
        </button>
      </div>

      {/* Business Setup */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-body text-sm font-semibold text-ivory/80">Business Setup</h2>
          <div className="flex items-center gap-2">
            <Toggle value={settings.enabled} onChange={v => set("enabled", v)} />
            <span className={`text-xs font-body ${settings.enabled ? "text-green-400" : "text-ivory/30"}`}>{settings.enabled ? "WhatsApp Enabled" : "Disabled"}</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>WhatsApp Business Number</label>
            <div className="flex">
              <span className="bg-white/10 border border-r-0 border-white/10 text-ivory/30 text-sm font-body px-3 py-2.5 rounded-l-sm">+</span>
              <input value={settings.waNumber} onChange={e => set("waNumber", e.target.value.replace(/\D/g, ""))} className={inputCls + " rounded-l-none"} placeholder="919876543210" />
            </div>
            <p className="text-[10px] text-ivory/20 mt-1 font-body">Country code + number (no spaces or dashes)</p>
          </div>
          <div>
            <label className={labelCls}>Business Name</label>
            <input value={settings.businessName} onChange={e => set("businessName", e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Customer Support Button Greeting</label>
          <input value={settings.supportGreeting} onChange={e => set("supportGreeting", e.target.value)} className={inputCls} />
          <p className="text-[10px] text-ivory/20 mt-1 font-body">This text pre-fills when customers tap the WhatsApp support button</p>
        </div>
      </div>

      {/* Automated Messages */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="font-body text-sm font-semibold text-ivory/80 mb-4">Automated Messages</h2>
        <p className="text-xs font-body text-ivory/30 -mt-2 mb-4">Use <code className="bg-white/10 px-1 rounded">&#123;&#123;variable&#125;&#125;</code> placeholders: name, orderId, amount, courier, trackingNumber, deliveryDate</p>

        {AUTOMATIONS.map(a => {
          const enabled = settings[a.key] as boolean;
          const template = settings[a.templateKey] as string;
          const isPreview = activePreview === a.id;
          return (
            <div key={a.id} className="border border-white/10 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-white/3">
                <div>
                  <p className="text-sm font-body font-semibold text-ivory/80">{a.label}</p>
                  <p className="text-xs font-body text-ivory/30">{a.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Toggle value={enabled} onChange={v => set(a.key, v as never)} />
                </div>
              </div>
              {enabled && (
                <div className="px-4 pb-4 pt-3 space-y-2">
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => setActivePreview(isPreview ? null : a.id)} className={`text-[10px] font-body px-2.5 py-1 rounded border transition-colors ${isPreview ? "text-champagne border-champagne/30 bg-champagne/10" : "text-ivory/40 border-white/10 hover:border-champagne/30"}`}>
                      {isPreview ? "Hide Preview" : "Preview"}
                    </button>
                  </div>
                  {isPreview ? (
                    <div className="bg-[#128C7E]/10 border border-[#128C7E]/30 rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageCircle size={13} className="text-[#25D366] mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-body text-ivory/60 italic">Preview (sample data)</p>
                      </div>
                      <p className="text-sm font-body text-ivory/80 leading-relaxed whitespace-pre-wrap">{previewTemplate(template)}</p>
                    </div>
                  ) : (
                    <textarea
                      value={template}
                      onChange={e => set(a.templateKey, e.target.value as never)}
                      rows={3}
                      className={inputCls + " resize-none text-xs"}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp CTA test */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-6">
        <h2 className="font-body text-sm font-semibold text-ivory/80 mb-3">Test Support Button</h2>
        <a href={`https://wa.me/${settings.waNumber}?text=${encodeURIComponent(settings.supportGreeting)}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-sm font-body font-semibold rounded-lg hover:bg-[#20ba57] transition-colors">
          <MessageCircle size={15} /> Open WhatsApp Chat
        </a>
        <p className="text-[10px] font-body text-ivory/20 mt-2">Click to test how the chat button feels from a customer perspective</p>
      </div>
    </div>
  );
}
