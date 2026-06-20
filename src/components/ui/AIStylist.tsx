"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, ChevronDown, Bot } from "lucide-react";
import { PRODUCTS } from "@/lib/data";

interface Message {
  role: "user" | "assistant";
  text: string;
  products?: typeof PRODUCTS;
}

const QUICK_PROMPTS = [
  "Jewellery for a wedding guest?",
  "Build a bridal look",
  "Earrings under ₹1,000?",
  "Match my saree look",
  "Gift for anniversary",
];

function getAIResponse(query: string): { text: string; products?: typeof PRODUCTS } {
  const q = query.toLowerCase();

  if (q.includes("bridal") || q.includes("bride") || q.includes("wedding look")) {
    return {
      text: "For a stunning bridal look, I'd recommend starting with the **Butterfly Royale Bridal Necklace Set** as your centrepiece. Pair it with the **Pearl Butterfly Choker** for a layered effect and the **Opulent Kundan Jhumkas** to frame your face beautifully. Complete the look with the **Royal Rose Gold Bangles Set**. This creates an opulent, traditional bridal ensemble worthy of your special day. ✨",
      products: PRODUCTS.filter((p) => p.categorySlug === "bridal-collection" || p.bestseller).slice(0, 3),
    };
  }

  if (q.includes("wedding guest") || q.includes("wedding")) {
    return {
      text: "As a wedding guest, you want to look stunning without overshadowing the bride. I'd suggest the **Golden Bloom Statement Earrings** with a subtle necklace for a daytime wedding, or the **Opulent Kundan Jhumkas** paired with the **Royal Rose Gold Bangles Set** for an evening reception. Opt for jewellery in gold tones — they complement every outfit colour and photograph beautifully! 💛\n\nWhat outfit are you wearing to the wedding?",
      products: PRODUCTS.filter((p) => p.categorySlug === "earrings" || p.categorySlug === "necklaces").slice(0, 3),
    };
  }

  if (q.includes("saree") || q.includes("sari") || q.includes("ethnic") || q.includes("match my saree")) {
    return {
      text: "For a saree look, the jewellery choice depends on the occasion. For a silk saree at a ceremony, the **Butterfly Royale Bridal Necklace Set** with **Opulent Kundan Jhumkas** would be magnificent. For a casual cotton saree, the **Pearl Butterfly Choker** with **Golden Bloom Statement Earrings** keeps it chic and elegant. Which type of saree are you wearing? 🌺",
      products: PRODUCTS.filter((p) => ["bridal-collection", "earrings", "necklaces"].includes(p.categorySlug)).slice(0, 3),
    };
  }

  if (q.includes("earring") && (q.includes("necklace") || q.includes("match"))) {
    return {
      text: "The perfect earring pairing depends on your necklace style. **Statement necklace** → go minimal with small drops or studs. **Choker or layered necklace** → pair with elongated jhumkas or chandbalis. **Simple chain necklace** → bold chandelier earrings steal the show. Would you like me to suggest specific pieces from our collection?",
      products: PRODUCTS.filter((p) => p.categorySlug === "earrings").slice(0, 3),
    };
  }

  if (q.includes("earring") || q.includes("jhumka") || q.includes("jhumki")) {
    return {
      text: "Our earring collection has something for everyone! The **Opulent Kundan Jhumkas** are perfect for ethnic wear and festivities, while the **Golden Bloom Statement Earrings** work equally well for casual and formal occasions. Both are lightweight and comfortable to wear all day. Want me to narrow it down by occasion or budget? 💛",
      products: PRODUCTS.filter((p) => p.categorySlug === "earrings").slice(0, 3),
    };
  }

  if (q.includes("necklace") || q.includes("choker") || q.includes("haram")) {
    return {
      text: "For necklaces, our top picks are: the **Butterfly Royale Bridal Necklace Set** for grand occasions, and the ever-elegant **Pearl Butterfly Choker** for a versatile everyday-to-event piece. Both come with matching earrings! Looking for something specific — bridal, office, or casual? 📿",
      products: PRODUCTS.filter((p) => p.categorySlug === "necklaces" || p.categorySlug === "bridal-collection").slice(0, 3),
    };
  }

  if (q.includes("bangle") || q.includes("bracelet") || q.includes("kara")) {
    return {
      text: "Bangles are the soul of Indian jewellery styling! Our **Royal Rose Gold Bangles Set** is a bestseller — it stacks beautifully and pairs with both traditional and fusion outfits. Stack multiple sets for a bold look, or wear just one set for understated elegance. What occasion are you buying for? 🪙",
      products: PRODUCTS.filter((p) => p.categorySlug === "bangles").slice(0, 3),
    };
  }

  if (q.includes("ring") || q.includes("finger")) {
    return {
      text: "Our rings are statement pieces! The **Crystal Wings Cocktail Ring** is our most-loved — bold, eye-catching, perfect for cocktail parties or festive evenings. For something more subtle, we recommend layering two thin bands from our rings collection. Would you like to see more options? 💍",
      products: PRODUCTS.filter((p) => p.categorySlug === "rings").slice(0, 3),
    };
  }

  if (q.includes("gift") || q.includes("anniversary") || q.includes("birthday")) {
    return {
      text: "A Butterfly gift is truly special! For an **anniversary**, our **Pearl Butterfly Choker** or **Crystal Wings Cocktail Ring** make timeless romantic gifts. For a **birthday**, the **Golden Bloom Statement Earrings** are universally loved. All orders come in our signature luxury gift box with a personalised card — ready to present without any extra wrapping. 🎁",
      products: PRODUCTS.filter((p) => p.featured || p.bestseller).slice(0, 3),
    };
  }

  if (q.includes("budget") || q.includes("under") || q.includes("₹") || q.includes("rs.") || q.includes("cheap") || q.includes("affordable")) {
    const budget = q.match(/[₹rs.]*\s*(\d+)/i)?.[1];
    const limit = budget ? parseInt(budget) : 1000;
    const affordable = PRODUCTS.filter((p) => p.discountPrice <= limit);
    if (affordable.length === 0) {
      return {
        text: `I couldn't find pieces under ₹${limit}, but our most affordable collection starts from ₹799! Try asking for pieces under ₹1,000 or ₹1,500 to see more options. 💛`,
        products: PRODUCTS.sort((a, b) => a.discountPrice - b.discountPrice).slice(0, 3),
      };
    }
    return {
      text: `Here are our most loved pieces within your budget of ₹${limit.toLocaleString("en-IN")}. Each one is crafted with premium materials and comes in our signature packaging. My personal recommendation? The **${affordable[0]?.name}** — absolutely stunning! 💛`,
      products: affordable.slice(0, 3),
    };
  }

  if (q.includes("occasion") || q.includes("party") || q.includes("festival") || q.includes("diwali") || q.includes("navratri")) {
    return {
      text: "For festive occasions like Diwali or Navratri, go bold with our **Opulent Kundan Jhumkas** and **Royal Rose Gold Bangles Set**. This combination is festive, vibrant, and perfectly captures the celebratory mood. The warm gold tones photograph beautifully too! ✨",
      products: PRODUCTS.filter((p) => p.tags?.includes("festive") || p.badge === "Festive Pick").slice(0, 3),
    };
  }

  if (q.includes("office") || q.includes("work") || q.includes("corporate") || q.includes("formal")) {
    return {
      text: "For office and formal settings, less is more! I recommend the **Pearl Butterfly Choker** for a polished, professional look, paired with small gold studs. Avoid oversized jhumkas or heavy necklaces for workwear — subtlety signals confidence. Our pearl and minimalist pieces work beautifully for this. 👔",
      products: PRODUCTS.filter((p) => p.categorySlug === "necklaces" || p.tags?.includes("minimalist")).slice(0, 3),
    };
  }

  if (q.includes("trending") || q.includes("popular") || q.includes("bestseller") || q.includes("best seller") || q.includes("top")) {
    return {
      text: "Our most coveted pieces right now are creating waves! The **Golden Bloom Statement Earrings** is our #1 bestseller — loved for its versatility from brunches to weddings. The **Pearl Butterfly Choker** is trending among modern brides as a minimalist alternative. And the **Crystal Wings Cocktail Ring** is our most photographed piece on Instagram! 📸",
      products: PRODUCTS.filter((p) => p.bestseller).slice(0, 3),
    };
  }

  if (q.includes("new") || q.includes("latest") || q.includes("launch") || q.includes("arrivals")) {
    return {
      text: "Fresh arrivals just landed! ✨ Our newest pieces feature bold kundan work and contemporary designs that blend traditional craftsmanship with modern aesthetics. These sell out fast — I'd recommend adding to your wishlist right away!",
      products: PRODUCTS.filter((p) => p.badge === "New Arrival" || p.new).slice(0, 3).concat(PRODUCTS.slice(0, 2)),
    };
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("namaste")) {
    return {
      text: "Namaste! 🙏 Welcome to Butterfly AI Stylist! I'm here to help you discover the perfect jewellery for any occasion.\n\nTell me what you're looking for — a bridal set, something for a party, a special gift, or just everyday elegance? I'll curate the perfect look for you! ✨",
      products: PRODUCTS.filter((p) => p.featured).slice(0, 2),
    };
  }

  return {
    text: "I'm your personal Butterfly jewellery stylist! ✨ I can help you find the perfect jewellery for any occasion — weddings, festivals, gifting, or everyday elegance. Ask me anything like:\n\n• *\"Build a bridal look\"*\n• *\"What matches a red saree?\"*\n• *\"Best gift under ₹1,500\"*\n• *\"Trending earrings\"*\n\nWhat can I help you discover today?",
    products: PRODUCTS.filter((p) => p.featured).slice(0, 2),
  };
}

export default function AIStylist() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Welcome to Butterfly AI Stylist! ✨\n\nI'm your personal luxury jewellery concierge. Ask me about styling, occasions, gifting, or let me build your perfect look.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async (text?: string) => {
    const query = text || input.trim();
    if (!query) return;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setTyping(true);

    // Simulate AI "thinking"
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

    const response = getAIResponse(query);
    setTyping(false);
    setMessages((prev) => [...prev, { role: "assistant", ...response }]);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-[900] md:bottom-8 md:right-8 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ opacity: open ? 0 : 1, pointerEvents: open ? "none" : "auto" }}
      >
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-champagne via-champagne-dark to-rose-gold shadow-luxury-xl flex items-center justify-center">
          <Sparkles size={22} className="text-white" />
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-gold border-2 border-white flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-obsidian text-ivory text-xs font-body px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          AI Stylist
        </div>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-4 right-4 z-[901] w-[92vw] max-w-sm md:bottom-8 md:right-8"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-ivory border border-champagne/20 rounded-2xl shadow-luxury-xl overflow-hidden flex flex-col h-[520px] max-h-[80vh]">
              {/* Header */}
              <div className="bg-gradient-to-r from-obsidian to-mink px-4 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-champagne to-rose-gold flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm text-ivory leading-tight">Butterfly AI Stylist</p>
                  <p className="text-[10px] font-body text-champagne/70 tracking-wider">Your personal jewellery concierge</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-ivory/60 hover:text-ivory transition-colors"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-champagne to-rose-gold flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <Bot size={12} className="text-white" />
                      </div>
                    )}
                    <div className={`max-w-[85%] ${msg.role === "user" ? "ml-auto" : ""}`}>
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-xs font-body leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-champagne to-champagne-dark text-white rounded-tr-sm"
                            : "bg-pearl border border-champagne/15 text-mink rounded-tl-sm"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: msg.text
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\*(.*?)\*/g, "<em>$1</em>")
                            .replace(/\n/g, "<br/>"),
                        }}
                      />
                      {/* Suggested products */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {msg.products.map((p) => (
                            <a
                              key={p.id}
                              href={`/products/${p.slug}`}
                              className="flex items-center gap-2.5 bg-white border border-champagne/15 rounded-xl p-2 hover:border-champagne/40 transition-colors group"
                            >
                              <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-pearl">
                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-body font-medium text-obsidian truncate leading-tight">{p.name}</p>
                                <p className="text-[10px] font-body text-champagne">₹{p.discountPrice.toLocaleString()}</p>
                              </div>
                              <span className="text-[9px] font-body text-champagne/60 group-hover:text-champagne transition-colors">View →</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-champagne to-rose-gold flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-white" />
                    </div>
                    <div className="bg-pearl border border-champagne/15 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-champagne"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.7 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick prompts */}
              <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-none border-t border-champagne/10">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    className="text-[9px] font-body whitespace-nowrap px-2.5 py-1 rounded-full border border-champagne/30 text-mink hover:bg-champagne/10 hover:border-champagne/60 transition-colors flex-shrink-0"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-champagne/10">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your stylist..."
                    className="flex-1 bg-pearl border border-champagne/20 rounded-xl px-3 py-2 text-xs font-body text-obsidian placeholder-mink-light/60 focus:outline-none focus:border-champagne/50 transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-champagne to-champagne-dark text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
