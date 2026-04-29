import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Search, TrendingUp, Star, ExternalLink, ChevronDown } from "lucide-react";

// ── Oxerfy brand SERP result ──────────────────────────────────────────────────
const oxerfyResult = {
  favicon: "🔷",
  domain: "oxerfy.com",
  breadcrumb: "oxerfy.com › services › digital-marketing",
  title: "Oxerfy — Digital Agency | Web, AI & Marketing Solutions",
  description:
    "Grow your business with expert WordPress development, AI automation, Meta marketing & social media management. Based in Dhaka — serving clients worldwide.",
  sitelinks: ["Our Services", "Portfolio", "Pricing", "Contact Us"],
  rating: 4.9,
  reviews: 38,
};

// ── Client showcase results ───────────────────────────────────────────────────
const clientResults = [
  {
    favicon: "🛒",
    domain: "fashionstore-bd.com",
    breadcrumb: "fashionstore-bd.com › collections",
    title: "FashionStore BD — Premium Clothing | Buy Online Bangladesh",
    description:
      "Shop the latest trends in men & women's fashion. Fast delivery across Bangladesh. 1000+ satisfied customers.",
    badge: "E-Commerce",
    rank: "#1",
  },
  {
    favicon: "🏥",
    domain: "healthcareclinic.com.bd",
    breadcrumb: "healthcareclinic.com.bd › appointments",
    title: "HealthCare Clinic BD — Book Appointment Online",
    description:
      "Trusted healthcare services in Dhaka. Book your appointment online in minutes. Experienced doctors & modern facilities.",
    badge: "Healthcare",
    rank: "#2",
  },
  {
    favicon: "🏠",
    domain: "dreamhomes-bd.com",
    breadcrumb: "dreamhomes-bd.com › listings",
    title: "DreamHomes BD — Property for Sale & Rent in Dhaka",
    description:
      "Find your perfect home in Dhaka. Verified listings, expert agents & easy financing options.",
    badge: "Real Estate",
    rank: "#3",
  },
];

const searchQueries = [
  "digital agency Bangladesh",
  "best web dev dhaka",
  "AI automation service BD",
  "meta marketing agency",
];

// ── Star rating helper ────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`}
        />
      ))}
    </span>
  );
}

// ── Single SERP result card ───────────────────────────────────────────────────
function SERPResult({
  result,
  index,
  highlight = false,
}: {
  result: typeof clientResults[0] & Partial<typeof oxerfyResult>;
  index: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative p-4 rounded-xl transition-all duration-300 group ${
        highlight
          ? "bg-mint/5 border border-mint/20 hover:border-mint/40"
          : "hover:bg-white/3 border border-transparent hover:border-white/10"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-4 bg-mint text-base text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
          Your Website
        </span>
      )}

      {/* Domain row */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">
          {result.favicon}
        </div>
        <div>
          <p className="text-xs text-cream/70 leading-none">{result.domain}</p>
          <p className="text-[10px] text-cream/40 leading-none mt-0.5">{result.breadcrumb}</p>
        </div>
        {(result as any).rank && (
          <span className="ml-auto text-[10px] font-bold text-mint bg-mint/10 px-2 py-0.5 rounded-full">
            {(result as any).rank} Result
          </span>
        )}
      </div>

      {/* Title */}
      <h4
        className={`text-base font-medium leading-snug mb-1 group-hover:underline underline-offset-2 ${
          highlight ? "text-[#8ab4f8]" : "text-[#8ab4f8]"
        }`}
      >
        {result.title}
      </h4>

      {/* Description */}
      <p className="text-xs text-cream/50 leading-relaxed line-clamp-2">{result.description}</p>

      {/* Sitelinks (Oxerfy only) */}
      {result.sitelinks && (
        <div className="flex flex-wrap gap-2 mt-2">
          {result.sitelinks.map((link) => (
            <span
              key={link}
              className="text-[11px] text-[#8ab4f8] border border-white/10 px-2 py-0.5 rounded hover:bg-white/5 cursor-default"
            >
              {link}
            </span>
          ))}
        </div>
      )}

      {/* Rating (Oxerfy only) */}
      {result.rating && (
        <div className="flex items-center gap-2 mt-2">
          <Stars rating={result.rating} />
          <span className="text-xs text-yellow-400 font-semibold">{result.rating}</span>
          <span className="text-xs text-cream/40">({result.reviews} reviews)</span>
        </div>
      )}

      {/* Badge (client results) */}
      {(result as any).badge && (
        <span className="inline-block mt-2 text-[10px] bg-teal/20 text-mint border border-teal/20 px-2 py-0.5 rounded-full">
          {(result as any).badge}
        </span>
      )}
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export function SERPSection() {
  const [activeTab, setActiveTab] = useState<"brand" | "clients">("brand");
  const [queryIndex, setQueryIndex] = useState(0);
  const [displayedQuery, setDisplayedQuery] = useState("");
  const [typing, setTyping] = useState(true);

  // Typewriter effect for search bar
  useEffect(() => {
    const target = searchQueries[queryIndex];
    let i = 0;
    setDisplayedQuery("");
    setTyping(true);

    const typeInterval = setInterval(() => {
      i++;
      setDisplayedQuery(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(typeInterval);
        setTyping(false);
        setTimeout(() => {
          setQueryIndex((prev) => (prev + 1) % searchQueries.length);
        }, 2000);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [queryIndex]);

  return (
    <section className="py-32 px-6 bg-base text-cream border-t border-white/10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-mint font-bold mb-4 bg-mint/10 px-4 py-1.5 rounded-full border border-mint/20">
            Search Visibility
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-bold leading-none tracking-tighter">
            Own the <span className="text-mint">first page.</span>
          </h2>
          <p className="mt-6 text-cream/50 text-lg max-w-xl mx-auto font-light">
            We build websites and run campaigns that rank. See how Oxerfy and our clients dominate Google search results.
          </p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
            {[
              { key: "brand", label: "Oxerfy on Google" },
              { key: "clients", label: "Client Results" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "brand" | "clients")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-mint text-base shadow-lg"
                    : "text-cream/50 hover:text-cream"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SERP mockup */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          {/* Browser chrome */}
          <div className="glass-card overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-cream/40 font-mono">
                google.com/search?q={encodeURIComponent(searchQueries[queryIndex]).replace(/%20/g, "+")}
              </div>
            </div>

            {/* Google header */}
            <div className="px-4 pt-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </span>
                <div className="flex-1 flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-4 py-2">
                  <Search className="w-4 h-4 text-cream/40 flex-shrink-0" />
                  <span className="text-sm text-cream/80 font-light">
                    {displayedQuery}
                    {typing && <span className="animate-pulse">|</span>}
                  </span>
                </div>
              </div>

              {/* Result stats */}
              <p className="mt-3 text-[11px] text-cream/30 ml-1">
                About 4,820,000 results (0.43 seconds)
              </p>

              {/* Nav tabs */}
              <div className="flex gap-5 mt-2 text-xs text-cream/40 border-b border-white/10 pb-2">
                {["All", "Images", "News", "Videos", "Maps"].map((t, i) => (
                  <span
                    key={t}
                    className={`pb-1 cursor-default ${
                      i === 0
                        ? "text-[#8ab4f8] border-b-2 border-[#8ab4f8] -mb-2"
                        : "hover:text-cream/60"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="px-4 py-4 space-y-1">
              {activeTab === "brand" ? (
                <>
                  {/* Ad label */}
                  <p className="text-[10px] text-cream/30 uppercase tracking-widest mb-3 ml-1">
                    — Organic Results —
                  </p>
                  <SERPResult
                    result={{ ...oxerfyResult, rank: undefined, badge: undefined }}
                    index={0}
                    highlight
                  />
                  {/* Filler ghost results */}
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 space-y-2 opacity-30">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/10" />
                        <div className="h-3 w-32 bg-white/10 rounded" />
                      </div>
                      <div className="h-4 w-3/4 bg-white/10 rounded" />
                      <div className="h-3 w-full bg-white/5 rounded" />
                      <div className="h-3 w-4/5 bg-white/5 rounded" />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p className="text-[10px] text-cream/30 uppercase tracking-widest mb-3 ml-1">
                    — Client Websites We've Ranked —
                  </p>
                  {clientResults.map((r, i) => (
                    <SERPResult key={i} result={r as any} index={i} />
                  ))}
                </>
              )}
            </div>

            {/* Bottom bar */}
            <div className="px-4 py-3 border-t border-white/10 bg-white/2 flex items-center justify-between">
              <span className="text-[10px] text-cream/25">
                Powered by Oxerfy SEO & Web Services
              </span>
              <ExternalLink className="w-3 h-3 text-cream/20" />
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
        >
          {[
            { value: "93%", label: "Clients rank page 1" },
            { value: "3.2x", label: "Average traffic growth" },
            { value: "30+", label: "Websites ranked" },
            { value: "< 60d", label: "Avg. time to rank" },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card p-6 text-center rounded-2xl"
            >
              <p className="text-3xl font-display font-bold text-mint">{stat.value}</p>
              <p className="text-xs text-cream/50 mt-1 leading-snug">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
