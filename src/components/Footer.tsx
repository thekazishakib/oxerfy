import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Send,
  Loader2,
  Check,
  ArrowRight
} from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "./ui/hover-footer";
import { Link } from "react-router-dom";

export function Footer() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', budget: '', timeline: '', message: '' });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [countryCode, setCountryCode] = useState('+1');

  useEffect(() => {
    const q = query(collection(db, 'site_assets'), where('key', '==', 'logo_image'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLogoUrl(snapshot.docs[0].data().image_url);
      } else {
        setLogoUrl(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    try {
      // Save to Firestore
      await addDoc(collection(db, 'contact_submissions'), {
        ...formData,
        scopes: selectedScopes,
        countryCode,
        createdAt: serverTimestamp(),
      });

      // Send email via Web3Forms
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          phone: `${countryCode} ${formData.phone}`,
          budget: formData.budget,
          timeline: formData.timeline,
          scopes: selectedScopes.join(', '),
          message: formData.message,
          subject: `New Project Inquiry from ${formData.name} — Oxerfy`,
        }),
      });

      setFormState('success');
      setFormData({ name: '', email: '', phone: '', budget: '', timeline: '', message: '' });
      setSelectedScopes([]);
    } catch (err) {
      console.error(err);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 3000);
    }
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const projectScopes = [
    "Meta Marketing", "Marketing Designer", "Brand Designer",
    "Social Media Management", "SME Digitalize", "Wordpress Web Dev",
    "Ai Web", "Ai Automation"
  ];

  const COUNTRY_CODES = [
    { name: "US", code: "+1" }, { name: "GB", code: "+44" }, { name: "BD", code: "+880" },
    { name: "IN", code: "+91" }, { name: "AU", code: "+61" }, { name: "DE", code: "+49" },
    { name: "FR", code: "+33" }, { name: "AE", code: "+971" }, { name: "CA", code: "+1" },
    { name: "PK", code: "+92" }, { name: "NG", code: "+234" }, { name: "JP", code: "+81" },
    { name: "CN", code: "+86" }, { name: "BR", code: "+55" }, { name: "RU", code: "+7" },
    { name: "ZA", code: "+27" }, { name: "SA", code: "+966" }, { name: "IT", code: "+39" },
    { name: "ES", code: "+34" }, { name: "NL", code: "+31" }, { name: "CH", code: "+41" },
    { name: "SE", code: "+46" }, { name: "NO", code: "+47" }, { name: "FI", code: "+358" },
    { name: "NZ", code: "+64" }, { name: "SG", code: "+65" }, { name: "MY", code: "+60" },
    { name: "TH", code: "+66" }, { name: "VN", code: "+84" }, { name: "ID", code: "+62" }
  ];

  const footerLinks = [
    {
      title: "Services",
      links: [
        { label: "WordPress Web", href: "#services" },
        { label: "AI Automation", href: "#services" },
        { label: "Meta Marketing", href: "#services" },
        { label: "Social Media Management", href: "#services" },
        { label: "SME Digitalize", href: "#services" },
        { label: "Post Design", href: "#services" },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "#" },
        { label: "Projects", href: "#" },
        { label: "About", href: "#" },
        { label: "FAQs", href: "#" },
      ],
    },
  ];

  const contactInfo = [
    { icon: <Mail size={18} className="text-mint" />, text: "oxerfy@gmail.com", href: "mailto:oxerfy@gmail.com" },
    { icon: <MapPin size={18} className="text-mint" />, text: "Dhaka, Bangladesh (Remote)" },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, label: "Facebook", href: "https://facebook.com/oxerfy" },
    { icon: <Instagram size={20} />, label: "Instagram", href: "https://instagram.com/oxerfy" },
    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "https://linkedin.com/company/oxerfy" },
  ];

  return (
    <footer className="bg-black/40 backdrop-blur-lg relative h-fit rounded-t-3xl overflow-hidden mt-8 z-10 border-t border-white/10">
      {/* Static background glow - no animation */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full bg-teal/30 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-14 z-[60] relative pointer-events-none">
        {/* Contact Section */}
        <div id="contact" className="mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start pointer-events-auto">
          <div className="lg:col-span-5 text-left lg:sticky lg:top-32 space-y-10">
            <div>
              <h2 className="text-6xl lg:text-[90px] font-display font-bold leading-[0.85] tracking-tighter text-white">
                Let's build<br />
                <span className="text-mint">something.</span>
              </h2>
              <p className="mt-8 text-cream/60 text-lg max-w-sm font-light leading-relaxed">
                Ready to take the next step? Whether you have a fully-formed idea or just a spark, we're here to help you bring it to life.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-sm">
              <a
                href="mailto:oxerfy@gmail.com"
                className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-mint/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-mint/10 flex items-center justify-center text-mint group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-cream/40 uppercase tracking-widest font-bold">Email Us</p>
                    <p className="text-cream group-hover:text-mint transition-colors">oxerfy@gmail.com</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-cream/20 group-hover:text-mint group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href="https://wa.me/8801882836717"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#25D366]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-cream/40 uppercase tracking-widest font-bold">Quick Chat</p>
                    <p className="text-cream group-hover:text-[#25D366] transition-colors">WhatsApp Chat</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-cream/20 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" />
              </a>
            </div>

            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cream/50 hover:text-mint hover:border-mint hover:-translate-y-1 transition-all duration-300"
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-8 w-full">
            <div className="glass-card p-10 xl:p-12 flex-1 w-full">
              <h3 className="text-4xl font-display font-bold mb-8">Send Message</h3>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="input-group">
                    <input type="text" id="name" placeholder="John Doe" required value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} />
                    <label htmlFor="name">Name</label>
                  </div>
                  <div className="input-group">
                    <input type="email" id="email" placeholder="john@example.com" required value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} />
                    <label htmlFor="email">Email</label>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-cream/70 font-medium">WhatsApp Number</label>
                  <div className="flex gap-4">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-mint min-w-[80px]"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={`${c.name}-${c.code}`} value={c.code} className="bg-[#0B192C]">
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      required
                      value={formData.phone}
                      onChange={e => setFormData(p => ({...p, phone: e.target.value}))}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-mint transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-cream/70 font-medium">Budget</label>
                    <select required value={formData.budget} onChange={e => setFormData(p => ({...p, budget: e.target.value}))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-mint w-full">
                      <option value="" disabled className="bg-[#0B192C]">Select Budget</option>
                      <option value="$100-$200" className="bg-[#0B192C]">$100 - $200</option>
                      <option value="$400-$500" className="bg-[#0B192C]">$400 - $500</option>
                      <option value="$800-$1000" className="bg-[#0B192C]">$800 - $1,000</option>
                      <option value=">$1000" className="bg-[#0B192C]">$1,000+</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-cream/70 font-medium">Timeline</label>
                    <select required value={formData.timeline} onChange={e => setFormData(p => ({...p, timeline: e.target.value}))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-mint w-full">
                      <option value="" disabled className="bg-[#0B192C]">Select Timeline</option>
                      <option value="<1 month" className="bg-[#0B192C]">Less than 1 month</option>
                      <option value="1-3 months" className="bg-[#0B192C]">1 - 3 months</option>
                      <option value="3-6 months" className="bg-[#0B192C]">3 - 6 months</option>
                      <option value="6+ months" className="bg-[#0B192C]">6+ months</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-cream/70 font-medium block">Project Scope</label>
                  <div className="flex flex-wrap gap-3">
                    {projectScopes.map((scope) => (
                      <button
                        key={scope}
                        type="button"
                        onClick={() => toggleScope(scope)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                          selectedScopes.includes(scope)
                            ? "bg-mint text-base border-mint"
                            : "bg-white/5 border-white/10 text-cream/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {scope}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm text-cream/70 font-medium">Project Details</label>
                  <textarea id="message" rows={4} placeholder="Tell us about your goals, timeline, and budget..." required value={formData.message} onChange={e => setFormData(p => ({...p, message: e.target.value}))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-mint transition-colors resize-none w-full"></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formState !== 'idle'}
                  className="w-full bg-teal text-white py-5 rounded-2xl font-bold text-lg hover:bg-teal/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formState === 'idle' && (<>Send Message <Send className="w-5 h-5" /></>)}
                  {formState === 'loading' && (<>Sending... <Loader2 className="w-5 h-5 animate-spin" /></>)}
                  {formState === 'success' && (<>Message Sent! <Check className="w-5 h-5" /></>)}
                  {formState === 'error' && (<>Failed! Try again.</>)}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12 pointer-events-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              {logoUrl ? (
                <>
                  <img src={logoUrl} alt="Oxerfy Logo" className="h-10 w-auto object-contain" />
                  <span className="text-white text-3xl font-display font-bold tracking-widest">O<span className="text-mint">X</span>ERFY</span>
                </>
              ) : (
                <span className="text-white text-3xl font-display font-bold tracking-widest">O<span className="text-mint">X</span>ERFY</span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-cream/70">
              Bridging the gap between complex technology and beautiful design.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-lg font-semibold mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative w-fit">
                    <a href={link.href} className="inline-block text-cream/70 hover:text-mint hover:translate-x-1.5 transition-all duration-300 ease-out cursor-none">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="flex items-center text-white text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-cream/70 group">
                  <div className="group-hover:scale-110 transition-transform duration-300 ease-out">
                    {item.icon}
                  </div>
                  {item.href ? (
                    <a href={item.href} className="inline-block hover:text-mint hover:translate-x-1.5 transition-all duration-300 ease-out">{item.text}</a>
                  ) : (
                    <span className="inline-block hover:text-mint hover:translate-x-1.5 transition-all duration-300 ease-out">{item.text}</span>
                  )}
                </li>
              ))}
              <li className="mt-4 text-xs text-cream/50 pt-2 border-t border-white/10">
                Trade Licence: <span className="text-mint">TRAD/DNCC/045292/2025</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-t border-white/10 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0 text-cream/50 pointer-events-auto">
          <div className="flex space-x-4">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/5 text-cream/70 hover:text-mint hover:bg-white/10 hover:border-mint/30 hover:-translate-y-1 transition-all duration-300 ease-out cursor-none"
              >
                {icon}
              </a>
            ))}
          </div>

          <div className="text-center md:text-left flex flex-col items-center md:items-start gap-1">
            <p>&copy; 2025-{new Date().getFullYear()} O<span className="text-mint">x</span>erfy. All rights reserved.</p>
            <p className="text-xs text-cream/40">
              Made by <a href="https://kazishakib.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-mint transition-colors hover:underline">Kazi Shakib</a>
              <Link to="/admin" className="opacity-0 select-none px-1 cursor-default" title="Admin Login">.</Link>
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-end text-xs text-cream/60">
            <Link to="/terms" className="hover:text-mint transition-colors hover:underline underline-offset-4">Terms & Conditions</Link>
            <span className="hidden md:inline text-white/20">|</span>
            <Link to="/privacy" className="hover:text-mint transition-colors hover:underline underline-offset-4">Privacy Policy</Link>
            <span className="hidden md:inline text-white/20">|</span>
            <Link to="/disclaimer" className="hover:text-mint transition-colors hover:underline underline-offset-4">Disclaimer</Link>
            <span className="hidden md:inline text-white/20">|</span>
            <Link to="/admin" className="hover:text-mint transition-colors hover:underline underline-offset-4">Admin</Link>
          </div>
        </div>
      </div>

      <div className="lg:flex hidden h-[30rem] -mt-52 -mb-36 pointer-events-none absolute bottom-0 w-full left-0">
        <TextHoverEffect text="" className="z-10 pointer-events-auto" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
