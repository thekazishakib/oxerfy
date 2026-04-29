import React, { useState, useEffect } from "react";
import { MetaTags } from "../components/MetaTags";
import { auth, db } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, setDoc, getDocs } from "firebase/firestore";
import { Image as ImageIcon, Layers, MessageSquare, Trash2, Loader2, Settings, Edit3, X, Check, Plus, LayoutDashboard, DollarSign, HelpCircle, Zap, AlertTriangle } from "lucide-react";
import { defaultProjects } from "../components/Portfolio";
import { defaultTestimonials } from "../components/Testimonials";

// ── Image helper ──────────────────────────────────────────────────────────────
export const convertToWebPDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        const MAX = 800;
        if (w > MAX || h > MAX) { if (w > h) { h *= MAX / w; w = MAX; } else { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context failed"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/webp", 0.8));
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });

export const convertToWebP = convertToWebPDataURL;

// ── Constants ─────────────────────────────────────────────────────────────────
const ALLOWED_EMAILS = ["oxerfy@gmail.com"];

const ACCENT_OPTIONS = [
  { label: "Blue", value: "hover:border-l-blue-500" },
  { label: "Purple", value: "hover:border-l-purple-500" },
  { label: "Orange", value: "hover:border-l-orange-500" },
  { label: "Pink", value: "hover:border-l-pink-500" },
  { label: "Yellow", value: "hover:border-l-yellow-500" },
  { label: "Mint/Green", value: "hover:border-l-mint" },
  { label: "Red", value: "hover:border-l-red-500" },
];

const DEFAULT_SERVICES = [
  { title: "WordPress Web", category: "Development", description: "Lightning-fast, custom WordPress websites built for scale and performance.", accent: "hover:border-l-blue-500", order: 0 },
  { title: "AI Automation", category: "Engineering", description: "Intelligent workflows and AI agents that put your business operations on autopilot.", accent: "hover:border-l-purple-500", order: 1 },
  { title: "Meta Marketing", category: "Growth", description: "Data-driven ad campaigns that maximize ROI and scale your customer acquisition.", accent: "hover:border-l-orange-500", order: 2 },
  { title: "Social Media Management", category: "Marketing", description: "Engaging content strategies and community management to grow your brand presence.", accent: "hover:border-l-pink-500", order: 3 },
  { title: "SME Digitalize", category: "Transformation", description: "Complete digital transformation solutions tailored for small and medium enterprises.", accent: "hover:border-l-yellow-500", order: 4 },
  { title: "Post Design", category: "Design", description: "Eye-catching and professional social media post designs using Canva.", accent: "hover:border-l-mint", order: 5 },
];

const DEFAULT_PRICING = [
  { name: "Starter", priceUSD: "$499", priceBDT: "৳54,900", desc: "15 days turnaround time.", features: ["Social Media Customize (Fb, Insta, Linkedin, Pinterest) (no paid Ads)", "Creative Post make (single image 5 times, 2 times carousel)", "Base Design Customize using Canva (Custom fonts not included)", "Wordpress Website (Landing Page only)", "Basic SEO"], highlight: false, order: 0 },
  { name: "Professional", priceUSD: "$999 - $1499", priceBDT: "৳1,09,890 - ৳1,64,890", desc: "1-2 months turnaround time.", features: ["Social Media Customize (Fb, Insta, Linkedin, Pinterest) (Paid ads with client budget)", "Base Design Customize using Canva", "Creative Post make (single image 10x, 5x carousel, 2 reels)", "Advance SEO", "Wordpress Website (Landing Page only)", "Make.com or Zapier one AI Automation (Custom medium range)"], highlight: true, order: 1 },
  { name: "Customize", priceUSD: "Custom", priceBDT: "Custom", desc: "3 - 6 months max turnaround time.", features: ["Enterprise level architecture & design", "Full custom branding and assets", "Complex AI automation workflows", "Advanced SEO & performance scaling", "Dedicated account management"], highlight: false, order: 2 },
];

const DEFAULT_FAQS = [
  { question: "What services do you offer?", answer: "We offer a comprehensive suite of digital services including web development, UI/UX design, AI automation, and custom software solutions tailored to your business needs.", order: 0 },
  { question: "How long does a typical project take?", answer: "Project timelines vary depending on complexity. A standard website might take 2-4 weeks, while a complex web application could take 2-3 months. We provide detailed timelines during our initial consultation.", order: 1 },
  { question: "Do you provide ongoing support after launch?", answer: "Yes! We offer various maintenance and support packages to ensure your digital assets remain secure, up-to-date, and perform optimally long after the initial launch.", order: 2 },
  { question: "What is your pricing structure?", answer: "Our pricing is project-based, tailored to your specific requirements. We offer transparent pricing with no hidden fees. Contact us for a custom quote based on your needs.", order: 3 },
  { question: "Can you help improve my existing website?", answer: "Absolutely. We often help clients revamp their existing digital presence, improving performance, updating the design, and adding new features or AI integrations.", order: 4 },
];

// ── Shared UI ─────────────────────────────────────────────────────────────────
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs uppercase tracking-wider text-cream/70 font-medium mb-2 block">{label}</label>
    {children}
  </div>
);
const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-mint focus:outline-none text-white transition-colors";
const Err = ({ msg }: { msg: string | null }) =>
  msg ? (
    <div className={`p-4 rounded-xl mb-6 border flex items-start gap-3 ${msg.includes("!") || msg.toLowerCase().includes("success") || msg.toLowerCase().includes("imported") || msg.toLowerCase().includes("seeded") || msg.toLowerCase().includes("removed") ? "bg-mint/10 border-mint/30 text-mint" : "bg-red-500/20 border-red-500/50 text-red-200"}`}>
      {!(msg.includes("!") || msg.toLowerCase().includes("success") || msg.toLowerCase().includes("imported") || msg.toLowerCase().includes("seeded") || msg.toLowerCase().includes("removed")) && <AlertTriangle size={16} className="shrink-0 mt-0.5" />}
      <span>{msg}</span>
    </div>
  ) : null;

// ── Admin Shell ───────────────────────────────────────────────────────────────
export default function Admin() {
  const [session, setSession] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (u) => {
    if (u && !ALLOWED_EMAILS.includes(u.email || "")) {
      signOut(auth);
      setAccessDenied(true);
      setSession(null);
    } else {
      setSession(u);
      setAccessDenied(false);
    }
    setLoading(false);
  }), []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setAccessDenied(false);
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      if (!ALLOWED_EMAILS.includes(result.user.email || "")) {
        await signOut(auth);
        setAccessDenied(true);
        setSession(null);
      }
    } catch (err: any) {
      alert("Login Failed: " + err.message);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#06101c] flex justify-center items-center">
      <Loader2 className="w-8 h-8 animate-spin text-mint" />
    </div>
  );

  if (!session) return (
    <div className="min-h-screen bg-[#0B192C] flex items-center justify-center p-6">
      <div className="bg-[#06101c] p-10 max-w-md w-full border border-white/10 text-center relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute top-0 right-0 p-16 bg-mint/20 blur-[100px] pointer-events-none rounded-full" />
        <h1 className="text-4xl font-display font-bold mb-3 text-white tracking-tight">Access Panel</h1>
        <p className="text-sm text-cream/50 mb-4">Secure workspace — authorized accounts only.</p>
        {accessDenied && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            This Google account is not authorized to access the admin panel.
          </div>
        )}
        <button onClick={handleLogin} className="w-full bg-mint text-[#0B192C] font-bold py-4 rounded-xl hover:bg-white transition-all mt-4">
          Sign in with Google
        </button>
      </div>
    </div>
  );

  const TABS = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "submissions", icon: MessageSquare, label: "Submissions" },
    { id: "projects", icon: Layers, label: "Projects" },
    { id: "testimonials", icon: MessageSquare, label: "Testimonials" },
    { id: "services", icon: Zap, label: "Services" },
    { id: "pricing", icon: DollarSign, label: "Pricing" },
    { id: "faq", icon: HelpCircle, label: "FAQ" },
    { id: "assets", icon: ImageIcon, label: "Site Images" },
    { id: "gallery", icon: ImageIcon, label: "Gallery" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#06101c] text-cream flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-72 border-r border-white/10 flex flex-col pt-6 md:pt-10 pb-6 px-4 md:px-6 bg-[#0B192C] shrink-0">
        <h2 className="text-2xl font-display font-bold tracking-widest text-white mb-1">O<span className="text-mint">X</span>ERFY</h2>
        <span className="text-[10px] uppercase tracking-widest text-mint px-1 mb-8 block font-bold">Admin Workspace</span>
        <nav className="flex flex-row md:flex-col gap-1 md:gap-1.5 overflow-x-auto pb-2 md:pb-0 flex-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-semibold transition-all shrink-0 ${activeTab === t.id ? "bg-mint text-[#0B192C] shadow-lg shadow-mint/20" : "hover:bg-white/5 text-cream/70 hover:text-white"}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="hidden md:block mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-cream/40 truncate mb-4 px-2">{session.email}</p>
          <button onClick={() => signOut(auth)} className="w-full py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors border border-red-500/20">Sign Out</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full">
        {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === "submissions" && <SubmissionsManager />}
        {activeTab === "projects" && <ProjectManager />}
        {activeTab === "testimonials" && <TestimonialManager />}
        {activeTab === "services" && <ServicesManager />}
        {activeTab === "pricing" && <PricingManager />}
        {activeTab === "faq" && <FAQManager />}
        {activeTab === "assets" && <SiteAssetsManager />}
        {activeTab === "gallery" && <GalleryManager />}
        {activeTab === "settings" && <SettingsManager />}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = ({ setActiveTab }: { setActiveTab: (t: string) => void }) => {
  const [msg, setMsg] = useState<string | null>(null);

  const seedDB = async () => {
    if (!confirm("Import default projects & testimonials into database?")) return;
    try {
      for (const p of defaultProjects) await addDoc(collection(db, "projects"), { ...p, image_url: p.image });
      for (const t of defaultTestimonials) await addDoc(collection(db, "testimonials"), { ...t, image_url: t.image });
      setMsg("Seeded successfully!");
    } catch (e: any) { setMsg("Error: " + e.message); }
  };

  const cleanupDuplicates = async () => {
    if (!confirm("Remove duplicate projects and testimonials?")) return;
    try {
      const pSnap = await getDocs(collection(db, "projects"));
      const seen = new Set<string>();
      for (const d of pSnap.docs) { if (seen.has(d.data().title)) await deleteDoc(doc(db, "projects", d.id)); else seen.add(d.data().title); }
      const tSnap = await getDocs(collection(db, "testimonials"));
      const seenT = new Set<string>();
      for (const d of tSnap.docs) { if (seenT.has(d.data().text)) await deleteDoc(doc(db, "testimonials", d.id)); else seenT.add(d.data().text); }
      setMsg("Duplicates removed!");
    } catch (e: any) { setMsg("Error: " + e.message); }
  };

  const CARDS = [
    { id: "projects", Icon: Layers, label: "Projects", desc: "Create, edit, or remove portfolio projects." },
    { id: "testimonials", Icon: MessageSquare, label: "Testimonials", desc: "Manage client reviews shown on the homepage." },
    { id: "services", Icon: Zap, label: "Services", desc: "Edit the services section instantly." },
    { id: "pricing", Icon: DollarSign, label: "Pricing", desc: "Update pricing packages in real-time." },
    { id: "faq", Icon: HelpCircle, label: "FAQ", desc: "Add, edit or remove FAQ items." },
    { id: "assets", Icon: ImageIcon, label: "Site Images", desc: "Change founder photo & global assets." },
    { id: "gallery", Icon: ImageIcon, label: "Gallery", desc: "Manage the infinite scrolling gallery." },
    { id: "settings", Icon: Settings, label: "Settings", desc: "Update founder links & global variables." },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-cream/60 mt-2 text-lg">Manage your entire website — changes reflect instantly on the live site.</p>
      </div>
      <Err msg={msg} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map(({ id, Icon, label, desc }) => (
          <div key={id} onClick={() => setActiveTab(id)} className="bg-[#0B192C] border border-white/5 p-8 rounded-3xl hover:border-mint/30 cursor-pointer transition-all group">
            <Icon className="text-mint mb-4 w-8 h-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
            <p className="text-sm text-cream/60">{desc}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-mint/10 border border-mint/20 p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-3">Migrate Old Data</h2>
          <p className="text-sm text-cream/70 mb-6">Import hardcoded projects & testimonials into the editable database.</p>
          <button onClick={seedDB} className="bg-mint text-[#0B192C] font-bold px-6 py-3 rounded-xl hover:bg-white transition-colors">Import Defaults</button>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-3">Clean Duplicates</h2>
          <p className="text-sm text-cream/70 mb-6">Remove duplicate entries caused by pressing Import multiple times.</p>
          <button onClick={cleanupDuplicates} className="bg-white text-red-500 font-bold px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-red-500">Remove Duplicates</button>
        </div>
      </div>
    </div>
  );
};

// ── Projects ──────────────────────────────────────────────────────────────────
const ProjectManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", type: "", link: "", description: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onSnapshot(collection(db, "projects"), s =>
    setItems(s.docs.map(d => ({ id: d.id, ...d.data() })))
  ), []);

  const save = async (e: any) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      let url = items.find(i => i.id === editingId)?.image_url;
      if (file) url = await convertToWebPDataURL(file);
      if (editingId && editingId !== "new") {
        await updateDoc(doc(db, "projects", editingId), { ...form, image_url: url });
      } else {
        if (!url) throw new Error("Image is required for a new project");
        await addDoc(collection(db, "projects"), { ...form, image_url: url, created_at: new Date().toISOString() });
      }
      setEditingId(null); setFile(null); setForm({ title: "", type: "", link: "", description: "" });
      setError("Project saved successfully!");
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const openEdit = (p: any) => { setEditingId(p.id); setForm({ title: p.title || "", type: p.type || "", link: p.link || "", description: p.description || "" }); setFile(null); setError(null); };
  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try { await deleteDoc(doc(db, "projects", id)); setError("Project deleted!"); }
    catch (e: any) { setError(e.message); }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-display font-bold text-white">Manage Projects</h1>
        {!editingId && <button onClick={() => { setEditingId("new"); setForm({ title: "", type: "", link: "", description: "" }); setFile(null); setError(null); }} className="bg-mint text-[#0B192C] font-bold px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white"><Plus size={18} /> Add Project</button>}
      </div>
      <Err msg={error} />
      {editingId && (
        <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-mint/30 mb-10 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{editingId === "new" ? "New Project" : "Edit Project"}</h2>
            <button type="button" onClick={() => setEditingId(null)}><X size={24} className="text-cream/50 hover:text-white" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Title"><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} /></Field>
            <Field label="Category (e.g. Meta Ads)"><input required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputCls} /></Field>
            <div className="md:col-span-2"><Field label="Project Link"><input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className={inputCls} /></Field></div>
            <div className="md:col-span-2"><Field label="Description"><textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} /></Field></div>
            <div className="md:col-span-2 p-5 border border-dashed border-white/20 rounded-xl bg-white/5 flex flex-col items-center justify-center gap-2">
              <p className="text-xs text-cream/40">{editingId !== "new" ? "Upload new image to replace current one (optional)" : "Upload project image (required)"}</p>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm cursor-pointer" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3 font-bold rounded-xl text-cream/70 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={loading} className="bg-mint text-[#0B192C] font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-white disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Save
            </button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => (
          <div key={p.id} className="bg-[#0B192C] border border-white/5 rounded-3xl overflow-hidden group">
            <div className="h-48 relative">
              <img src={p.image_url} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => openEdit(p)} className="p-2 bg-black/60 rounded-lg text-white hover:bg-mint hover:text-[#0B192C] backdrop-blur-md transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => remove(p.id)} className="p-2 bg-black/60 rounded-lg text-red-400 hover:bg-red-500 hover:text-white backdrop-blur-md transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white">{p.title}</h3>
              <p className="text-sm text-mint mt-1 mb-3">{p.type}</p>
              <p className="text-sm text-cream/60 line-clamp-2">{p.description}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-20 text-center text-cream/40 border border-dashed border-white/10 rounded-3xl">No projects yet. Add one or import defaults from Dashboard.</div>}
      </div>
    </div>
  );
};

// ── Testimonials ──────────────────────────────────────────────────────────────
const TestimonialManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", text: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onSnapshot(collection(db, "testimonials"), s =>
    setItems(s.docs.map(d => ({ id: d.id, ...d.data() })))
  ), []);

  const save = async (e: any) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      let url = items.find(i => i.id === editingId)?.image_url;
      if (file) url = await convertToWebPDataURL(file);
      if (editingId && editingId !== "new") {
        await updateDoc(doc(db, "testimonials", editingId), { ...form, image_url: url });
      } else {
        if (!url) throw new Error("Client photo is required");
        await addDoc(collection(db, "testimonials"), { ...form, image_url: url, created_at: new Date().toISOString() });
      }
      setEditingId(null); setFile(null); setForm({ name: "", role: "", text: "" });
      setError("Testimonial saved successfully!");
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const openEdit = (t: any) => { setEditingId(t.id); setForm({ name: t.name || "", role: t.role || "", text: t.text || "" }); setFile(null); setError(null); };
  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try { await deleteDoc(doc(db, "testimonials", id)); setError("Testimonial deleted!"); }
    catch (e: any) { setError(e.message); }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-display font-bold text-white">Manage Testimonials</h1>
        {!editingId && <button onClick={() => { setEditingId("new"); setForm({ name: "", role: "", text: "" }); setFile(null); setError(null); }} className="bg-mint text-[#0B192C] font-bold px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white"><Plus size={18} /> Add Client</button>}
      </div>
      <Err msg={error} />
      {editingId && (
        <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-mint/30 mb-10 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{editingId === "new" ? "New Testimonial" : "Edit Testimonial"}</h2>
            <button type="button" onClick={() => setEditingId(null)}><X size={24} className="text-cream/50 hover:text-white" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Client Name"><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
            <Field label="Role / Company"><input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inputCls} /></Field>
            <div className="md:col-span-2"><Field label="Review Text"><textarea required rows={4} value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} className={`${inputCls} resize-none`} /></Field></div>
            <div className="md:col-span-2 p-5 border border-dashed border-white/20 rounded-xl bg-white/5 flex flex-col items-center gap-2">
              <p className="text-xs text-cream/40">{editingId !== "new" ? "Upload new photo to replace (optional)" : "Upload client photo (required)"}</p>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm cursor-pointer" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3 font-bold rounded-xl text-cream/70 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={loading} className="bg-mint text-[#0B192C] font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-white disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Save
            </button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(t => (
          <div key={t.id} className="bg-[#0B192C] border border-white/5 rounded-3xl p-6 flex gap-5">
            <img src={t.image_url || t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover shrink-0 bg-white/10" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white">{t.name}</h3>
              <p className="text-xs text-mint mb-2">{t.role}</p>
              <p className="text-sm text-cream/60 line-clamp-3 mb-3">{t.text}</p>
              <div className="flex gap-3">
                <button onClick={() => openEdit(t)} className="text-xs font-bold text-cream/50 hover:text-mint transition-colors">Edit</button>
                <span className="text-cream/20">•</span>
                <button onClick={() => remove(t.id)} className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-16 text-center text-cream/40 border border-dashed border-white/10 rounded-3xl">No testimonials yet. Add one or import defaults from Dashboard.</div>}
      </div>
    </div>
  );
};

// ── Services ──────────────────────────────────────────────────────────────────
const ServicesManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: "", description: "", accent: "hover:border-l-mint", order: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onSnapshot(collection(db, "services"), s =>
    setItems(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)))
  ), []);

  const seedServices = async () => {
    if (!confirm("Import default services? This adds 6 default services.")) return;
    try { for (const s of DEFAULT_SERVICES) await addDoc(collection(db, "services"), s); setError("Default services imported! Website updated instantly."); }
    catch (e: any) { setError("Error: " + e.message); }
  };

  const save = async (e: any) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      if (editingId && editingId !== "new") await updateDoc(doc(db, "services", editingId), { ...form });
      else await addDoc(collection(db, "services"), { ...form, order: items.length });
      setEditingId(null); setForm({ title: "", category: "", description: "", accent: "hover:border-l-mint", order: 0 });
      setError("Service saved! Website updated instantly.");
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const openEdit = (s: any) => { setEditingId(s.id); setForm({ title: s.title || "", category: s.category || "", description: s.description || "", accent: s.accent || "hover:border-l-mint", order: s.order ?? 0 }); setError(null); };
  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try { await deleteDoc(doc(db, "services", id)); setError("Service deleted!"); }
    catch (e: any) { setError(e.message); }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-display font-bold text-white">Manage Services</h1>
        <div className="flex gap-3">
          {items.length === 0 && <button onClick={seedServices} className="bg-white/10 text-cream font-bold px-4 py-3 rounded-xl text-sm hover:bg-white/20">Import Defaults</button>}
          {!editingId && <button onClick={() => { setEditingId("new"); setForm({ title: "", category: "", description: "", accent: "hover:border-l-mint", order: items.length }); setError(null); }} className="bg-mint text-[#0B192C] font-bold px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white"><Plus size={18} /> Add Service</button>}
        </div>
      </div>
      <Err msg={error} />
      {editingId && (
        <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-mint/30 mb-10 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{editingId === "new" ? "Add Service" : "Edit Service"}</h2>
            <button type="button" onClick={() => setEditingId(null)}><X size={24} className="text-cream/50 hover:text-white" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Service Title"><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} /></Field>
            <Field label="Category"><input required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls} /></Field>
            <div className="md:col-span-2"><Field label="Description"><textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} /></Field></div>
            <Field label="Accent Color (hover border)">
              <select value={form.accent} onChange={e => setForm({ ...form, accent: e.target.value })} className={inputCls}>
                {ACCENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Display Order (0 = first)"><input type="number" min={0} value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className={inputCls} /></Field>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3 font-bold rounded-xl text-cream/70 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={loading} className="bg-mint text-[#0B192C] font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-white disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Save
            </button>
          </div>
        </form>
      )}
      <div className="flex flex-col rounded-2xl overflow-hidden border border-white/5">
        {items.map(s => (
          <div key={s.id} className="bg-[#0B192C] border-b border-white/5 px-6 py-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-mint uppercase tracking-widest font-bold">{s.category}</span>
                <span className="text-xs text-cream/30">order: {s.order ?? "—"}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{s.title}</h3>
              <p className="text-sm text-cream/50 mt-0.5 line-clamp-1">{s.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(s)} className="p-2 bg-white/5 rounded-lg text-cream/70 hover:bg-mint hover:text-[#0B192C] transition-colors"><Edit3 size={16} /></button>
              <button onClick={() => remove(s.id)} className="p-2 bg-white/5 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="py-16 text-center text-cream/40 border border-dashed border-white/10 rounded-3xl m-4">No services yet. Import defaults or add manually.</div>}
      </div>
    </div>
  );
};

// ── Pricing ───────────────────────────────────────────────────────────────────
const PricingManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", priceUSD: "", priceBDT: "", desc: "", highlight: false, order: 0 });
  const [features, setFeatures] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onSnapshot(collection(db, "pricing"), s =>
    setItems(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)))
  ), []);

  const seedPricing = async () => {
    if (!confirm("Import 3 default pricing packages?")) return;
    try { for (const p of DEFAULT_PRICING) await addDoc(collection(db, "pricing"), p); setError("Default packages imported! Website updated instantly."); }
    catch (e: any) { setError("Error: " + e.message); }
  };

  const save = async (e: any) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const f = features.filter(x => x.trim());
      if (editingId && editingId !== "new") await updateDoc(doc(db, "pricing", editingId), { ...form, features: f });
      else await addDoc(collection(db, "pricing"), { ...form, features: f, order: items.length });
      setEditingId(null); setForm({ name: "", priceUSD: "", priceBDT: "", desc: "", highlight: false, order: 0 }); setFeatures([""]);
      setError("Package saved! Website updated instantly.");
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const openEdit = (p: any) => { setEditingId(p.id); setForm({ name: p.name || "", priceUSD: p.priceUSD || "", priceBDT: p.priceBDT || "", desc: p.desc || "", highlight: !!p.highlight, order: p.order ?? 0 }); setFeatures(p.features?.length ? p.features : [""]); setError(null); };
  const remove = async (id: string) => {
    if (!confirm("Delete this pricing package?")) return;
    try { await deleteDoc(doc(db, "pricing", id)); setError("Package deleted!"); }
    catch (e: any) { setError(e.message); }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-display font-bold text-white">Manage Pricing</h1>
        <div className="flex gap-3">
          {items.length === 0 && <button onClick={seedPricing} className="bg-white/10 text-cream font-bold px-4 py-3 rounded-xl text-sm hover:bg-white/20">Import Defaults</button>}
          {!editingId && <button onClick={() => { setEditingId("new"); setForm({ name: "", priceUSD: "", priceBDT: "", desc: "", highlight: false, order: items.length }); setFeatures([""]); setError(null); }} className="bg-mint text-[#0B192C] font-bold px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white"><Plus size={18} /> Add Package</button>}
        </div>
      </div>
      <Err msg={error} />
      {editingId && (
        <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-mint/30 mb-10 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{editingId === "new" ? "Add Package" : "Edit Package"}</h2>
            <button type="button" onClick={() => setEditingId(null)}><X size={24} className="text-cream/50 hover:text-white" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Package Name"><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
            <Field label="Display Order"><input type="number" min={0} value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className={inputCls} /></Field>
            <Field label="Price (USD)"><input required value={form.priceUSD} onChange={e => setForm({ ...form, priceUSD: e.target.value })} placeholder="e.g. $499 or Custom" className={inputCls} /></Field>
            <Field label="Price (BDT)"><input required value={form.priceBDT} onChange={e => setForm({ ...form, priceBDT: e.target.value })} placeholder="e.g. ৳54,900 or Custom" className={inputCls} /></Field>
            <div className="md:col-span-2"><Field label="Description / Turnaround Time"><input required value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} className={inputCls} /></Field></div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="hl" checked={form.highlight} onChange={e => setForm({ ...form, highlight: e.target.checked })} className="w-5 h-5 accent-[#00ffb4] rounded" />
              <label htmlFor="hl" className="text-sm text-cream/80 cursor-pointer">Mark as "Most Popular" (highlighted card)</label>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-wider text-cream/70 font-medium">Features</span>
              <button type="button" onClick={() => setFeatures([...features, ""])} className="text-xs text-mint hover:text-white flex items-center gap-1"><Plus size={14} /> Add Feature</button>
            </div>
            <div className="space-y-3">
              {features.map((f, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input value={f} onChange={e => { const x = [...features]; x[i] = e.target.value; setFeatures(x); }} placeholder={`Feature ${i + 1}`} className={inputCls} />
                  {features.length > 1 && <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:text-red-300 shrink-0"><X size={16} /></button>}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3 font-bold rounded-xl text-cream/70 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={loading} className="bg-mint text-[#0B192C] font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-white disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Save
            </button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(p => (
          <div key={p.id} className={`rounded-3xl p-6 border relative ${p.highlight ? "bg-mint/10 border-mint/30" : "bg-[#0B192C] border-white/5"}`}>
            {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mint text-[#0B192C] text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">Most Popular</span>}
            <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
            <p className="text-xs text-cream/50 mb-3">{p.desc}</p>
            <p className="text-2xl font-bold text-mint mb-4">{p.priceUSD}</p>
            <ul className="space-y-2 mb-6">
              {(p.features || []).map((f: string, i: number) => (
                <li key={i} className="text-xs text-cream/60 flex gap-2 items-start"><Check size={12} className="text-mint shrink-0 mt-0.5" />{f}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button onClick={() => openEdit(p)} className="flex-1 py-2 text-sm font-bold bg-white/5 rounded-xl hover:bg-mint hover:text-[#0B192C] transition-colors flex items-center justify-center gap-2"><Edit3 size={14} /> Edit</button>
              <button onClick={() => remove(p.id)} className="py-2 px-3 text-red-400 bg-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-3 py-16 text-center text-cream/40 border border-dashed border-white/10 rounded-3xl">No packages yet. Import defaults or add manually.</div>}
      </div>
    </div>
  );
};

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", order: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onSnapshot(collection(db, "faqs"), s =>
    setItems(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)))
  ), []);

  const seedFAQs = async () => {
    if (!confirm("Import 5 default FAQs?")) return;
    try { for (const f of DEFAULT_FAQS) await addDoc(collection(db, "faqs"), f); setError("Default FAQs imported! Website updated instantly."); }
    catch (e: any) { setError("Error: " + e.message); }
  };

  const save = async (e: any) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      if (editingId && editingId !== "new") await updateDoc(doc(db, "faqs", editingId), { ...form });
      else await addDoc(collection(db, "faqs"), { ...form, order: items.length });
      setEditingId(null); setForm({ question: "", answer: "", order: 0 });
      setError("FAQ saved! Website updated instantly.");
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const openEdit = (f: any) => { setEditingId(f.id); setForm({ question: f.question || "", answer: f.answer || "", order: f.order ?? 0 }); setError(null); };
  const remove = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try { await deleteDoc(doc(db, "faqs", id)); setError("FAQ deleted!"); }
    catch (e: any) { setError(e.message); }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-display font-bold text-white">Manage FAQ</h1>
        <div className="flex gap-3">
          {items.length === 0 && <button onClick={seedFAQs} className="bg-white/10 text-cream font-bold px-4 py-3 rounded-xl text-sm hover:bg-white/20">Import Defaults</button>}
          {!editingId && <button onClick={() => { setEditingId("new"); setForm({ question: "", answer: "", order: items.length }); setError(null); }} className="bg-mint text-[#0B192C] font-bold px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white"><Plus size={18} /> Add FAQ</button>}
        </div>
      </div>
      <Err msg={error} />
      {editingId && (
        <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-mint/30 mb-10 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{editingId === "new" ? "Add FAQ" : "Edit FAQ"}</h2>
            <button type="button" onClick={() => setEditingId(null)}><X size={24} className="text-cream/50 hover:text-white" /></button>
          </div>
          <Field label="Question"><input required value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} className={inputCls} /></Field>
          <Field label="Answer"><textarea required rows={4} value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} className={`${inputCls} resize-none`} /></Field>
          <div className="w-40"><Field label="Display Order"><input type="number" min={0} value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className={inputCls} /></Field></div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEditingId(null)} className="px-6 py-3 font-bold rounded-xl text-cream/70 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={loading} className="bg-mint text-[#0B192C] font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-white disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Save
            </button>
          </div>
        </form>
      )}
      <div className="space-y-4">
        {items.map((f, i) => (
          <div key={f.id} className="bg-[#0B192C] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-mint font-bold">Q{i + 1}</span>
                  <span className="text-xs text-cream/30">order: {f.order ?? i}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.question}</h3>
                <p className="text-sm text-cream/60">{f.answer}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(f)} className="p-2 bg-white/5 rounded-lg text-cream/70 hover:bg-mint hover:text-[#0B192C] transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => remove(f.id)} className="p-2 bg-white/5 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="py-16 text-center text-cream/40 border border-dashed border-white/10 rounded-3xl">No FAQs yet. Import defaults or add manually.</div>}
      </div>
    </div>
  );
};

// ── Gallery ───────────────────────────────────────────────────────────────────
const GalleryManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onSnapshot(collection(db, "gallery"), s =>
    setItems(s.docs.map(d => ({ id: d.id, ...d.data() })))
  ), []);

  const save = async (e: any) => {
    e.preventDefault(); if (!file) return; setLoading(true); setError(null);
    try {
      const url = await convertToWebPDataURL(file);
      await addDoc(collection(db, "gallery"), { image_url: url, created_at: new Date().toISOString() });
      setFile(null); setError("Image uploaded!");
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this gallery image?")) return;
    try { await deleteDoc(doc(db, "gallery", id)); setError("Image deleted!"); }
    catch (e: any) { setError(e.message); }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-display font-bold text-white mb-6">Image Gallery</h1>
      <Err msg={error} />
      <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-6 items-center mb-10">
        <input required type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer" />
        <button type="submit" disabled={loading || !file} className="w-full md:w-auto px-8 py-4 bg-mint text-[#0B192C] font-bold rounded-xl whitespace-nowrap flex items-center justify-center gap-2 hover:bg-white disabled:opacity-60">
          {loading ? <Loader2 className="animate-spin" size={18} /> : null} Upload Image
        </button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map(g => (
          <div key={g.id} className="relative group rounded-2xl overflow-hidden aspect-square border border-white/10">
            <img src={g.image_url} alt="Gallery" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => remove(g.id)} className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-10 text-center text-cream/40">No gallery images yet.</div>}
      </div>
    </div>
  );
};

// ── Site Assets ───────────────────────────────────────────────────────────────
const SiteAssetsManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [assetKey, setAssetKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onSnapshot(collection(db, "site_assets"), s =>
    setItems(s.docs.map(d => ({ id: d.id, ...d.data() })))
  ), []);

  const save = async (e: any) => {
    e.preventDefault(); if (!file || !assetKey) return; setLoading(true); setError(null);
    try {
      const url = await convertToWebPDataURL(file);
      const existing = items.find(i => i.key === assetKey);
      if (existing) await deleteDoc(doc(db, "site_assets", existing.id));
      await addDoc(collection(db, "site_assets"), { key: assetKey, image_url: url });
      setFile(null); setAssetKey(""); setError("Image updated! Website reflects instantly.");
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const KEYS = ["favicon", "founder_image", "why_choose_us_1", "trust_avatar_1", "trust_avatar_2", "trust_avatar_3", "logo_image", "hero_image"];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-display font-bold text-white mb-4">Site Images</h1>
      <p className="text-cream/60 text-lg mb-10">Manage specific images shown throughout the website.</p>
      <Err msg={error} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-white/5 space-y-6">
          <h2 className="text-2xl font-bold text-white">Upload / Replace Image</h2>
          <Field label="Select Placement">
            <select required value={assetKey} onChange={e => setAssetKey(e.target.value)} className={inputCls}>
              <option value="" disabled>Select where this image appears</option>
              {KEYS.map(k => <option key={k} value={k}>{k.replace(/_/g, " ").toUpperCase()}</option>)}
            </select>
          </Field>
          <div className="p-6 border border-dashed border-white/20 rounded-xl bg-white/5 flex justify-center">
            <input required type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
          </div>
          <button type="submit" disabled={loading || !file || !assetKey} className="w-full bg-mint text-[#0B192C] font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-white disabled:opacity-60">
            {loading ? <Loader2 className="animate-spin" size={18} /> : null} Set Image
          </button>
        </form>
        <div>
          <h2 className="text-2xl font-bold text-white px-2 mb-6">Current Placements ({items.length})</h2>
          <div className="grid grid-cols-2 gap-4">
            {items.map(a => (
              <div key={a.id} className="bg-[#0B192C] rounded-2xl overflow-hidden border border-white/5 relative group">
                <img src={a.image_url} className="w-full h-48 object-cover" alt={a.key} />
                <div className="absolute inset-0 bg-black/70 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="font-mono text-xs text-mint font-bold mb-2">{a.key}</p>
                  <button onClick={async () => { if (confirm("Delete this asset?")) { try { await deleteDoc(doc(db, "site_assets", a.id)); setError("Asset deleted!"); } catch (e: any) { setError(e.message); } } }} className="text-xs text-white bg-red-500 py-2 rounded-lg font-bold hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="col-span-2 py-10 text-center text-cream/40">No assets uploaded yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Settings ──────────────────────────────────────────────────────────────────
const SettingsManager = () => {
  const [settings, setSettings] = useState({ linkedin: "", website: "", phone: "", email: "", whatsapp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onSnapshot(doc(db, "settings", "global"), snap => {
    if (snap.exists()) {
      const d = snap.data();
      setSettings({
        linkedin: d.founder_linkedin || "",
        website: d.founder_website || "",
        phone: d.phone || "",
        email: d.contact_email || "",
        whatsapp: d.whatsapp || "",
      });
    }
  }), []);

  const save = async (e: any) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      await setDoc(doc(db, "settings", "global"), {
        founder_linkedin: settings.linkedin,
        founder_website: settings.website,
        phone: settings.phone,
        contact_email: settings.email,
        whatsapp: settings.whatsapp,
      }, { merge: true });
      setError("Settings saved successfully!");
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-display font-bold text-white mb-2">Global Settings</h1>
      <p className="text-cream/60 mb-8">These values power contact links and social buttons across the site.</p>
      <Err msg={error} />
      <form onSubmit={save} className="bg-[#0B192C] p-8 rounded-3xl border border-white/5 space-y-6">
        <Field label="Founder LinkedIn URL"><input type="url" value={settings.linkedin} onChange={e => setSettings({ ...settings, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className={inputCls} /></Field>
        <Field label="Founder Website URL"><input type="url" value={settings.website} onChange={e => setSettings({ ...settings, website: e.target.value })} placeholder="https://..." className={inputCls} /></Field>
        <Field label="Contact Email"><input type="email" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} placeholder="oxerfy@gmail.com" className={inputCls} /></Field>
        <Field label="Phone Number"><input type="tel" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} placeholder="+880..." className={inputCls} /></Field>
        <Field label="WhatsApp Number"><input type="tel" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="+880..." className={inputCls} /></Field>
        <button type="submit" disabled={loading} className="w-full bg-mint text-[#0B192C] font-bold py-4 rounded-xl hover:bg-white disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />} Save Settings
        </button>
      </form>
    </div>
  );
};

// ── Submissions Manager ───────────────────────────────────────────────────────
const SubmissionsManager = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, "contact_submissions"), (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a: any, b: any) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });
      setSubmissions(docs);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    try {
      await deleteDoc(doc(db, "contact_submissions", id));
      setError("Deleted!");
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-display font-bold text-white mb-2">Contact Submissions</h1>
      <p className="text-cream/60 mb-8">{submissions.length} message{submissions.length !== 1 ? "s" : ""} received</p>
      <Err msg={error} />
      {submissions.length === 0 ? (
        <div className="bg-[#0B192C] border border-white/5 rounded-3xl p-12 text-center text-cream/40">No submissions yet.</div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s: any) => (
            <div key={s.id} className="bg-[#0B192C] border border-white/5 rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-white font-semibold">{s.name || "Unknown"}</span>
                  <span className="text-cream/50 text-sm">{s.email} · {s.budget}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cream/30 text-xs">
                    {s.createdAt ? new Date(s.createdAt.seconds * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                  </span>
                  <button onClick={e => { e.stopPropagation(); handleDelete(s.id); }} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {expanded === s.id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div><span className="text-cream/40 block text-xs uppercase tracking-wider mb-1">Phone</span><span className="text-white">{s.countryCode} {s.phone}</span></div>
                    <div><span className="text-cream/40 block text-xs uppercase tracking-wider mb-1">Budget</span><span className="text-white">{s.budget}</span></div>
                    <div><span className="text-cream/40 block text-xs uppercase tracking-wider mb-1">Timeline</span><span className="text-white">{s.timeline}</span></div>
                    <div><span className="text-cream/40 block text-xs uppercase tracking-wider mb-1">Scopes</span><span className="text-white">{s.scopes?.join(", ") || "—"}</span></div>
                  </div>
                  <div><span className="text-cream/40 block text-xs uppercase tracking-wider mb-1">Message</span><p className="text-white/80 leading-relaxed">{s.message}</p></div>
                  <a href={`mailto:${s.email}`} className="inline-block mt-2 bg-mint text-[#0B192C] font-bold px-4 py-2 rounded-lg text-sm hover:bg-white transition-colors">Reply via Email</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
