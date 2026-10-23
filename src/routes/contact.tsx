import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";

// Assets matching Figma Group 27.png & Frame 37 (1).png
import contactHeroBannerImg from "@/assets/contact-hero-banner.png";
import contactBeetrootImg from "@/assets/contact-beetroot-wash.png";
import contactGreenSerumImg from "@/assets/contact-green-serum.png";
import contactBlueberryImg from "@/assets/contact-blueberry-cream.png";
import contactSunscreenImg from "@/assets/contact-sunscreen-spf50.png";
import radiantModelsDuoBgImg from "@/assets/radiant-models-duo-bg.png";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    title: "Contact Us — Let's Start a Conversation | Mile Infinity",
    meta: [
      {
        name: "description",
        content:
          "Questions about Mile Infinity, our skincare collection, or your order? We're here to help you find the information and support you need.",
      },
      { property: "og:title", content: "Contact Mile Infinity" },
      {
        property: "og:description",
        content:
          "Enquiries, product guidance, and quick answers. Let's start a conversation.",
      },
    ],
  }),
});

export function ContactPage() {
  return (
    <PageShell>
      {/* 1. Hero Banner matching Frame 37 (1).png */}
      <ContactHeroBanner />

      {/* 2. Subheader Bar matching Group 27.png */}
      <ContactSubheaderBar />

      {/* 3. Contact Form: Tell Us How We Can Help */}
      <ContactFormSection />

      {/* 4. Product Guidance: Your Skincare Questions Matter */}
      <ContactQuestionsMatterSection />

      {/* 5. FAQs: A Little Clarity Goes a Long Way */}
      <ContactFaqSection />

      {/* 6. Closing Luxury Banner */}
      <ContactClosingBanner />
    </PageShell>
  );
}

/**
 * 1. Contact Hero Banner — Exactly matching Frame 37 (1).png & Group 27.png top:
 * - Full-bleed background of happy models at stone table with all 4 Mile Infinity products
 * - Kicker: "WE'RE HERE TO HELP"
 * - Heading: "Let's Start a Conversation."
 * - Subtitle: "Questions about Mile Infinity, our skincare collection, or your order? We're here to help you find the information and support you need."
 * - Action buttons: "GET IN TOUCH →" & "EXPLORE OUR SKINCARE →"
 */
function ContactHeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#e5dfd5]">
      {/* Hero Background artwork */}
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] w-full flex items-center">
        <img
          src={contactHeroBannerImg}
          alt="Mile Infinity Skincare Conversation — We're Here to Help"
          className="absolute inset-0 h-full w-full object-cover object-[62%_center] lg:object-center pointer-events-none"
        />

        {/* Subtle left-side legibility wash for typography preserving natural sunlit texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5efe6]/70 via-[#f5efe6]/25 to-transparent sm:w-[55%] pointer-events-none" />

        {/* Content container */}
        <div className="relative z-10 mx-auto max-w-[1440px] w-full px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/75 font-sans">
              We're Here to Help
            </p>

            <h1 className="mt-3 font-serif text-3xl sm:text-5xl lg:text-[62px] font-normal leading-[1.08] text-[#162e21] tracking-tight">
              Let's Start a<br />
              Conversation.
            </h1>

            <p className="mt-4 sm:mt-5 text-xs sm:text-base text-[#2c3d33]/85 leading-relaxed font-sans max-w-lg">
              Questions about Mile Infinity, our skincare collection, or your order? We're here to help you find the information and support you need.
            </p>

            {/* Action buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center gap-3 bg-[#162e21] hover:bg-[#0c2217] text-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all rounded-none shadow-sm hover:shadow-md text-center"
              >
                <span>Get in Touch</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>

              <a
                href="/shop"
                className="inline-flex items-center justify-center gap-3 bg-[#f7f5ef]/85 hover:bg-white text-[#162e21] border border-[#162e21]/30 hover:border-[#162e21] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all rounded-none text-center"
              >
                <span>Explore Our Skincare</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 2. Subheader bar from Group 27.png:
 * Left: "Contact Mile Infinity"
 * Right: "ENQUIRIES / PRODUCT GUIDANCE / QUICK ANSWERS"
 */
function ContactSubheaderBar() {
  return (
    <div className="border-b border-[#e5dfd5] bg-[#faf8f4] py-4">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className="font-serif italic text-base text-[#162e21]">
          Contact Mile Infinity
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#162e21]/60 font-sans">
          Enquiries / Product Guidance / Quick Answers
        </span>
      </div>
    </div>
  );
}

/**
 * 3. Contact Form Section matching Group 27.png:
 * - Left column: "SEND US A MESSAGE", "Tell Us How We Can Help.", description & "LOOKING FOR QUICK ANSWERS? →"
 * - Right column: Full form with Name, Email, Enquiry Type dropdown, Order Number, Subject, Message, and "SEND MESSAGE →"
 */
function ContactFormSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [enquiryType, setEnquiryType] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) {
      alert("Please fill in your name, email, and message.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <section id="contact-form" className="bg-[#faf8f4] py-16 lg:py-24 border-b border-[#e5dfd5]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans">
              Send Us a Message
            </p>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[50px] font-normal text-[#162e21] leading-[1.12]">
              Tell Us How<br />
              We Can<br />
              Help.
            </h2>

            <p className="mt-6 text-sm text-[#2c3d33]/85 leading-relaxed font-sans max-w-md">
              For skincare product enquiries, order and delivery assistance, or a question about Mile Infinity, start here.
            </p>

            <p className="mt-4 text-xs text-[#2c3d33]/70 leading-relaxed font-sans max-w-md">
              Writing about a purchase? Choose Customer Support and include your order number if you have it.
            </p>

            <div className="mt-8 pt-4">
              <a
                href="#contact-faq"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#162e21] hover:underline"
              >
                <span>Looking for quick answers?</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-[#f7f5ef] p-6 sm:p-10 border border-[#e5dfd5]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[11px] font-medium text-[#162e21]/50 font-sans">
                * Required fields
              </span>
            </div>

            {submitted ? (
              <div className="py-12 text-center bg-white border border-[#162e21]/15 p-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#162e21] text-white">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#162e21]">
                  Thank you, {fullName}.
                </h3>
                <p className="mt-3 text-sm text-[#2c3d33]/80 leading-relaxed font-sans max-w-md mx-auto">
                  Your message regarding "{subject || "your enquiry"}" has been received. Our team will review your note and respond to <strong className="text-[#162e21]">{email}</strong> within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                    setSubject("");
                    setOrderNumber("");
                  }}
                  className="mt-6 text-xs uppercase tracking-[0.16em] font-semibold text-[#162e21] underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#162e21] mb-1.5 font-sans">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-white border border-[#162e21]/20 px-3.5 py-2.5 text-xs text-[#162e21] placeholder:text-[#162e21]/40 rounded-none focus:outline-none focus:border-[#162e21]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#162e21] mb-1.5 font-sans">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full bg-white border border-[#162e21]/20 px-3.5 py-2.5 text-xs text-[#162e21] placeholder:text-[#162e21]/40 rounded-none focus:outline-none focus:border-[#162e21]"
                    />
                  </div>
                </div>

                {/* Enquiry Type dropdown */}
                <div>
                  <label className="block text-xs font-medium text-[#162e21] mb-1.5 font-sans">
                    Enquiry Type *
                  </label>
                  <div className="relative">
                    <select
                      value={enquiryType}
                      onChange={(e) => setEnquiryType(e.target.value)}
                      required
                      className="w-full appearance-none bg-white border border-[#162e21]/20 px-3.5 py-2.5 pr-8 text-xs text-[#162e21] rounded-none focus:outline-none focus:border-[#162e21] cursor-pointer"
                    >
                      <option value="">Choose an enquiry type</option>
                      <option value="customer-support">Customer Support</option>
                      <option value="product-guidance">Product Guidance</option>
                      <option value="general-enquiries">General Enquiries</option>
                    </select>
                    <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#162e21]/60" />
                  </div>
                  <p className="mt-1 text-[10px] text-[#162e21]/60 font-sans">
                    Customer Support / Product Guidance / General Enquiries
                  </p>
                </div>

                {/* Order Number & Subject Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#162e21] mb-1.5 font-sans">
                      Order Number <span className="text-[#162e21]/60 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="If your enquiry relates to an order"
                      className="w-full bg-white border border-[#162e21]/20 px-3.5 py-2.5 text-xs text-[#162e21] placeholder:text-[#162e21]/40 rounded-none focus:outline-none focus:border-[#162e21]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#162e21] mb-1.5 font-sans">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What would you like to ask?"
                      className="w-full bg-white border border-[#162e21]/20 px-3.5 py-2.5 text-xs text-[#162e21] placeholder:text-[#162e21]/40 rounded-none focus:outline-none focus:border-[#162e21]"
                    />
                  </div>
                </div>

                {/* Your Message */}
                <div>
                  <label className="block text-xs font-medium text-[#162e21] mb-1.5 font-sans">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help."
                    className="w-full bg-white border border-[#162e21]/20 px-3.5 py-2.5 text-xs text-[#162e21] placeholder:text-[#162e21]/40 rounded-none focus:outline-none focus:border-[#162e21] resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 bg-[#162e21] hover:bg-[#0c2217] text-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all rounded-none shadow-sm"
                  >
                    <span>Send Message</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 4. "Your Skincare Questions Matter." Section matching screenshot:
 * - Eyebrow: "MORE HELP TO DISCOVER //"
 * - Title: "Your Skincare Questions Matter."
 * - Subtitle: "Choosing skincare should feel simple. Explore the Mile Infinity collection and discover products designed to fit your everyday routine."
 * - 4 Staggered Product Cards:
 *   1) Cleanse: Crimson Beauty Beetroot Facewash -> "EXPLORE THE FORMULA →"
 *   2) Treat: Ceremonial Green Fusion Serum -> "FOLLOW THE RITUAL →" (staggered down)
 *   3) Moisturise: Blue Berry & Lavender Bliss Moisturiser -> "DISCOVER THE DAILY DOSE →"
 *   4) Protect: Sunnykiss Radiance SPF 50 Sunscreen -> "FOLLOW TO SUNSCREEN →" (staggered down)
 * - Bottom button: "EXPLORE COLLECTION →"
 */
function ContactQuestionsMatterSection() {
  const essentials = [
    {
      step: "CLEANSE",
      name: "Crimson Beauty Beetroot Facewash",
      linkText: "EXPLORE THE FORMULA",
      href: "/product",
      image: contactBeetrootImg,
      stagger: false,
    },
    {
      step: "TREAT",
      name: "Ceremonial Green Fusion Serum",
      linkText: "FOLLOW THE RITUAL",
      href: "/shop#ceremonial-green",
      image: contactGreenSerumImg,
      stagger: true,
    },
    {
      step: "MOISTURISE",
      name: "Blue Berry & Lavender Bliss Moisturiser",
      linkText: "DISCOVER THE DAILY DOSE",
      href: "/shop#blueberry-lavender",
      image: contactBlueberryImg,
      stagger: false,
    },
    {
      step: "PROTECT",
      name: "Sunnykiss Radiance SPF 50 Sunscreen",
      linkText: "FOLLOW TO SUNSCREEN",
      href: "/shop#sunnykiss-sunscreen",
      image: contactSunscreenImg,
      stagger: true,
    },
  ];

  return (
    <section className="bg-[#ede6db] py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
        {/* Header row matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-end pb-8 sm:pb-12 lg:pb-16">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans">
              More Help to Discover //
            </p>
            <h2 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-4xl lg:text-[54px] font-normal text-[#162e21] leading-[1.08] tracking-tight">
              Your Skincare<br />
              Questions Matter.
            </h2>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end">
            <p className="text-xs sm:text-sm text-[#2c3d33]/85 leading-relaxed font-sans max-w-md">
              Choosing skincare should feel simple. Explore the Mile Infinity collection and discover products designed to fit your everyday routine.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid - Staggered layout matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 items-start lg:pb-16">
          {essentials.map((item) => (
            <div
              key={item.step}
              className={`group flex flex-col transition-all duration-300 ${
                item.stagger ? "lg:translate-y-12" : "lg:translate-y-0"
              }`}
            >
              {/* Product Image */}
              <a
                href={item.href}
                className="block aspect-[1200/1460] overflow-hidden bg-[#e0d8cc] shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </a>

              {/* Product Info */}
              <div className="mt-4 flex flex-col flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8c9489] font-sans">
                  {item.step}
                </span>

                <h3 className="mt-2 font-serif text-lg sm:text-[22px] font-normal text-[#162e21] leading-snug">
                  <a href={item.href} className="hover:text-[#2c4d36] transition-colors">
                    {item.name}
                  </a>
                </h3>

                <div className="mt-3 sm:mt-4 pt-1">
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#162e21] group-hover:gap-3 transition-all hover:underline"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore Collection button matching screenshot */}
        <div className="mt-10 sm:mt-16 text-center">
          <a
            href="/shop"
            className="inline-flex items-center justify-center gap-3 bg-[#162e21] hover:bg-[#0c2217] text-white px-8 sm:px-9 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all rounded-none shadow-sm hover:shadow-md w-full sm:w-auto"
          >
            <span>Explore Collection</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * 5. FAQs Section: "A Little Clarity Goes a Long Way." from Group 27.png:
 * - Left column: "QUICK ANSWERS", heading, description & "STILL HAVE QUESTIONS? CONTACT US →"
 * - Right column: 6 interactive accordion FAQ items
 */
function ContactFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How can I contact Mile Infinity customer support?",
      a: "Use the contact form on this page and choose Customer Support. Tell us what you need help with; for an order enquiry, add your order number if you have it.",
    },
    {
      q: "Where can I find information about my order?",
      a: "For questions about your purchase, choose Customer Support in the contact form. Include your order number, if available, and the details you would like help with.",
    },
    {
      q: "How can I learn more about a skincare product?",
      a: "Explore Shop and the individual product information pages to get to know Mile Infinity skincare products. For a specific question, select Product Guidance in the form above.",
    },
    {
      q: "Where can I find shipping and delivery information?",
      a: "For current shipping and delivery information, contact us through the form and choose Customer Support. Include your order number if your question relates to a purchase.",
    },
    {
      q: "What is Mile Infinity's return policy?",
      a: "Please choose Customer Support in the contact form to request current return policy details. If your enquiry relates to an order, include its number if available.",
    },
    {
      q: "How can I get help choosing products?",
      a: "Browse the collection and product information, then choose Product Guidance in the contact form. Share which products you are considering and what you would like to understand.",
    },
  ];

  return (
    <section id="contact-faq" className="bg-[#faf8f4] py-16 lg:py-24 border-b border-[#e5dfd5]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#162e21]/70 font-sans">
              Quick Answers
            </p>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal text-[#162e21] leading-[1.12]">
              A Little<br />
              Clarity<br />
              Goes a Long<br />
              Way.
            </h2>

            <p className="mt-6 text-sm text-[#2c3d33]/85 leading-relaxed font-sans max-w-sm">
              A few helpful starting points for your skincare and shopping questions.
            </p>

            <div className="mt-8 pt-2">
              <a
                href="#contact-form"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#162e21] hover:underline"
              >
                <span>Still have questions? Contact us</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: 6 Accordions */}
          <div className="lg:col-span-8 divide-y divide-[#162e21]/15">
            {faqs.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={item.q} className="py-6 first:pt-0">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left group"
                  >
                    <span className="font-serif text-lg sm:text-xl font-normal text-[#162e21] group-hover:text-[#2c4d36] transition-colors leading-snug">
                      {item.q}
                    </span>
                    <span className="text-lg text-[#162e21]/60 shrink-0 font-serif w-6 text-center">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3.5 pr-8">
                      <p className="text-xs sm:text-sm text-[#2c3d33]/85 leading-relaxed font-sans">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 6. Closing Luxury Banner from Group 27.png:
 * "Your skin. Your ritual. Your Mile Infinity."
 */
function ContactClosingBanner() {
  return (
    <section className="relative overflow-hidden bg-[#081810] text-[#f7f5f0]">
      <div className="relative min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center justify-center">
        {/* Background artwork of models duo */}
        <img
          src={radiantModelsDuoBgImg}
          alt="Mile Infinity Radiant Models"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-85"
        />

        {/* Center overlay wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06140d]/90 via-[#081810]/40 to-[#06140d]/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center py-16">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight tracking-tight text-white drop-shadow-sm">
            Your skin.<br />
            Your ritual.<br />
            Your Mile Infinity.
          </h2>

          <p className="mt-5 text-sm sm:text-base text-white/90 font-sans max-w-lg mx-auto leading-relaxed">
            Discover skincare designed to make everyday care feel more intentional.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/shop"
              className="inline-flex items-center gap-2.5 bg-white text-[#162e21] hover:bg-[#f7f5ef] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-all rounded-none shadow-md"
            >
              <span>Shop All Skincare</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>

            <a
              href="/#approach"
              className="inline-flex items-center gap-2.5 border border-white/40 hover:border-white text-white hover:bg-white/10 px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-all rounded-none"
            >
              <span>Explore the Brand</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
