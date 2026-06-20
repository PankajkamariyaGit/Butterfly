import Link from "next/link";

function PolicyPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-pearl border-b border-champagne/15 py-16 text-center px-4">
        <p className="text-xs font-body text-champagne tracking-[0.3em] uppercase mb-3">✦ Butterfly</p>
        <h1 className="font-display text-4xl text-obsidian">{title}</h1>
        <div className="section-divider mt-4" />
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 prose prose-sm prose-headings:font-display prose-headings:text-obsidian prose-p:text-mink-light prose-p:font-body prose-li:text-mink-light prose-li:font-body">
        {children}
      </div>
    </div>
  );
}

export function ShippingPolicy() {
  return (
    <PolicyPage title="Shipping Policy">
      <h2>Delivery Timelines</h2>
      <ul>
        <li><strong>Standard Delivery:</strong> 3–5 business days across India</li>
        <li><strong>Express Delivery:</strong> 1–2 business days (₹149 extra)</li>
        <li>Orders placed before 2 PM IST are dispatched the same day.</li>
      </ul>
      <h2>Shipping Charges</h2>
      <ul>
        <li>Free shipping on all orders above ₹999</li>
        <li>Flat ₹99 for orders below ₹999</li>
        <li>Express delivery: ₹149 (available on checkout)</li>
      </ul>
      <h2>Tracking</h2>
      <p>Once your order is shipped, you will receive a tracking ID via email and WhatsApp. Use our <Link href="/track-order" className="text-champagne">Order Tracking</Link> page to check status.</p>
      <h2>Packaging</h2>
      <p>All orders arrive in our signature Butterfly gift box with tissue paper, ribbon, and a personalised card — ready to gift or treasure.</p>
    </PolicyPage>
  );
}

export function ReturnPolicy() {
  return (
    <PolicyPage title="Return & Refund Policy">
      <h2>Return Window</h2>
      <p>We offer a 7-day return policy from the date of delivery. Items must be unused, in original condition, with all tags and packaging intact.</p>
      <h2>Non-Returnable Items</h2>
      <ul>
        <li>Customised or personalised jewellery</li>
        <li>Items marked as "Final Sale"</li>
        <li>Items with visible signs of use or damage</li>
      </ul>
      <h2>Refund Process</h2>
      <p>Once your return is received and inspected, we will send a confirmation email. Refunds are processed within 5–7 business days to your original payment method.</p>
      <h2>How to Initiate a Return</h2>
      <p>Contact us at <strong>support@butterfly.com</strong> or WhatsApp us at +91 98765 43210 with your order ID and reason for return.</p>
    </PolicyPage>
  );
}

export function PrivacyPolicy() {
  return (
    <PolicyPage title="Privacy Policy">
      <p>At Butterfly Fine Jewellery, we respect your privacy and are committed to protecting your personal data.</p>
      <h2>Data We Collect</h2>
      <ul>
        <li>Name, email, phone, and address (for orders)</li>
        <li>Payment information (processed securely via Razorpay — we never store card details)</li>
        <li>Browsing behaviour (for personalisation)</li>
      </ul>
      <h2>How We Use Your Data</h2>
      <ul>
        <li>To process and deliver your orders</li>
        <li>To send order updates and promotional emails (you can unsubscribe anytime)</li>
        <li>To improve our products and services</li>
      </ul>
      <h2>Data Security</h2>
      <p>All data is encrypted in transit (SSL) and at rest. We never sell your personal data to third parties.</p>
      <h2>Contact</h2>
      <p>For privacy concerns, email us at <strong>privacy@butterfly.com</strong></p>
    </PolicyPage>
  );
}

export function TermsAndConditions() {
  return (
    <PolicyPage title="Terms & Conditions">
      <p>By accessing and using Butterfly Fine Jewellery, you agree to the following terms and conditions.</p>
      <h2>Product Information</h2>
      <p>We make every effort to display accurate colours and descriptions. Slight variations in appearance due to photography and screen settings are normal.</p>
      <h2>Pricing</h2>
      <p>All prices are in Indian Rupees (INR) and inclusive of applicable taxes. Prices may change without notice.</p>
      <h2>Orders</h2>
      <p>An order confirmation email does not guarantee product availability. In rare cases of stock discrepancy, we will notify you and offer a full refund.</p>
      <h2>Intellectual Property</h2>
      <p>All content, images, and designs on this website are the property of Butterfly Fine Jewellery and may not be reproduced without permission.</p>
    </PolicyPage>
  );
}
