import { createFileRoute, Link } from "@tanstack/react-router";
import dashboardHero from "@/assets/dashboard-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FounderHuntCommunity // ship_faster.exe" },
      { name: "description", content: "Where SaaS + AI founders actually ship. Lifetime access. ₹599. No subs. No gurus." },
      { property: "og:title", content: "FounderHuntCommunity" },
      { property: "og:description", content: "Where SaaS + AI founders actually ship. Lifetime access. ₹599." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <Ticker />
      <Nav />
      <Hero />
      <HeroVisual />
      <Stats />
      <Benefits />
      <SuccessStories />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Ticker() {
  const items = [
    "SHIPPING > TALKING",
    "★ 420+ FOUNDERS ONLINE",
    "₹599 LIFETIME · NO SUBS",
    "BUILD IN PUBLIC",
    "AI + SAAS + INDIE",
    "NO GURUS ALLOWED",
    "PEER-REVIEWED GROWTH",
    "★ MADE FOR BUILDERS",
  ];
  const row = [...items, ...items];
  return (
    <div className="border-b-2 border-foreground bg-acid text-background overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee py-2 font-mono text-xs font-bold uppercase tracking-widest">
        {row.map((t, i) => (
          <span key={i} className="mx-6 shrink-0">{t}</span>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b-2 border-foreground bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-sm bg-acid border-2 border-foreground shadow-brutal-sm transition-transform group-hover:-translate-y-0.5">
            <span className="font-mono text-sm font-bold text-background">FH</span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            founder<span className="text-acid">/</span>hunt
          </span>
        </Link>
        <div className="hidden gap-6 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground md:flex">
          <a href="#benefits" className="hover:text-acid">01_network</a>
          <a href="#stories" className="hover:text-acid">02_wins</a>
          <a href="#pricing" className="hover:text-acid">03_price</a>
          <a href="#faq" className="hover:text-acid">04_faq</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="hidden font-mono text-xs font-bold uppercase text-muted-foreground hover:text-foreground sm:block">
            sign_in
          </Link>
          <Link
            to="/auth"
            className="rounded-sm border-2 border-foreground bg-acid px-4 py-2 font-mono text-xs font-bold uppercase text-background shadow-brutal-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal"
          >
            join ₹599 →
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative px-6 pt-20 pb-16">
      <div className="mx-auto max-w-6xl">
        {/* meta strip */}
        <div className="mb-8 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-widest">
          <span className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-2 py-1">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-acid opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-acid" />
            </span>
            live · v2.0
          </span>
          <span className="border-2 border-foreground bg-hot px-2 py-1 text-background">lifetime_deal</span>
          <span className="border-2 border-foreground bg-gold px-2 py-1 text-background">₹599_forever</span>
          <span className="border-2 border-foreground bg-electric px-2 py-1 text-background">est.2026</span>
        </div>

        <h1 className="font-display text-[14vw] font-bold leading-[0.85] tracking-tight text-foreground md:text-[9rem]">
          BUILD.
          <br />
          <span className="relative inline-block">
            <span className="bg-acid px-2 -skew-x-6 inline-block text-background">SHIP.</span>
          </span>{" "}
          <span className="italic font-normal text-muted-foreground">scale?</span>
          <br />
          <span className="text-hot">TOGETHER.</span>
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <p className="text-lg leading-snug text-foreground/85 md:text-xl">
            The community for SaaS + AI founders who <span className="bg-foreground text-background px-1">actually ship</span>.
            No fluff. No gurus. Just builders trading feedback, code, and hard-won growth tactics — 24/7.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/auth"
              className="group flex items-center justify-between border-2 border-foreground bg-foreground px-5 py-4 font-mono text-sm font-bold uppercase text-background shadow-brutal-acid transition-all hover:-translate-x-1 hover:-translate-y-1"
            >
              <span>./join_founderhunt</span>
              <span className="text-acid group-hover:translate-x-1 transition">→</span>
            </Link>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="size-2 bg-acid" /> one-time · no recurring
              <span className="size-2 bg-hot" /> instant access
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="mx-auto mb-32 max-w-6xl px-6">
      <div className="relative">
        {/* offset background block */}
        <div className="absolute -inset-2 translate-x-3 translate-y-3 bg-acid" aria-hidden />
        <div className="relative overflow-hidden border-2 border-foreground bg-surface">
          <img
            src={dashboardHero}
            alt="FounderHuntCommunity dashboard preview"
            width={1600}
            height={900}
            className="aspect-[16/9] w-full object-cover"
          />
          {/* sticker overlay */}
          <div className="pointer-events-none absolute left-4 top-4 rotate-[-6deg] border-2 border-foreground bg-hot px-3 py-1 font-mono text-[10px] font-bold uppercase text-background shadow-brutal-sm">
            live_preview.png
          </div>
          <div className="pointer-events-none absolute right-4 bottom-4 rotate-[3deg] border-2 border-foreground bg-gold px-3 py-1 font-mono text-[10px] font-bold uppercase text-background shadow-brutal-sm">
            v.2026 · beta
          </div>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const items = [
    { value: "420+", label: "founders_active", color: "bg-acid" },
    { value: "$12M+", label: "combined_arr", color: "bg-hot" },
    { value: "15+", label: "exits_shipped", color: "bg-gold" },
    { value: "₹599", label: "lock-in_price", color: "bg-electric" },
  ];
  return (
    <section className="mb-32 border-y-2 border-foreground bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x-2 divide-y-2 divide-foreground md:grid-cols-4 md:divide-y-0">
        {items.map((s, i) => (
          <div key={s.label} className={`relative p-6 md:p-8 ${i === 0 ? "border-l-0" : ""}`}>
            <div className={`absolute right-3 top-3 size-3 ${s.color}`} />
            <div className="font-display text-4xl font-bold text-foreground md:text-5xl">{s.value}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { title: "Vetted mastermind", body: "Weekly peer calls. UI teardowns, conversion fixes, real growth tactics from founders shipping.", tag: "01", color: "bg-acid", shadow: "shadow-brutal-acid" },
    { title: "AI + SaaS vault", body: "Curated prompts, custom GPTs, technical blueprints, and SOPs for lean teams scaling fast.", tag: "02", color: "bg-hot", shadow: "shadow-brutal-hot" },
    { title: "Investor access", body: "Direct line to micro-VCs and angels who back early-stage AI-first companies in India and globally.", tag: "03", color: "bg-gold", shadow: "shadow-brutal-gold" },
    { title: "Co-founder match", body: "Find technical and non-technical co-founders, designers, and growth partners in the marketplace.", tag: "04", color: "bg-electric", shadow: "shadow-brutal" },
    { title: "Founder showcase", body: "Launch your product to a hyper-relevant audience. Collect feedback, upvotes, and first 100 users.", tag: "05", color: "bg-acid", shadow: "shadow-brutal-acid" },
    { title: "Lifetime network", body: "Pay once, stay forever. Watch your peers grow from MVP to ₹10Cr ARR with you alongside.", tag: "06", color: "bg-hot", shadow: "shadow-brutal-hot" },
  ];
  return (
    <section id="benefits" className="mx-auto mb-32 max-w-6xl px-6">
      <div className="mb-14 flex flex-col items-start justify-between gap-4 border-b-2 border-foreground pb-6 md:flex-row md:items-end">
        <div>
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-acid">// what_you_get</div>
          <h2 className="mt-2 font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl">
            everything a founder <span className="italic text-muted-foreground">actually</span> needs.
          </h2>
        </div>
        <div className="font-mono text-xs uppercase text-muted-foreground">six_pillars.txt</div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((b, i) => (
          <div
            key={b.title}
            className={`group relative border-2 border-foreground bg-surface p-6 transition-all hover:-translate-x-1 hover:-translate-y-1 ${b.shadow}`}
            style={{ transform: i % 2 ? "rotate(0.4deg)" : "rotate(-0.3deg)" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className={`inline-flex size-10 items-center justify-center border-2 border-foreground ${b.color} font-mono text-sm font-bold text-background`}>
                {b.tag}
              </div>
              <div className="font-mono text-[10px] uppercase text-muted-foreground">pillar_{b.tag}</div>
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">{b.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SuccessStories() {
  const stories = [
    { initials: "AM", name: "Arjun Mehta", company: "PromptFlow", quote: "Joined in April, launched my GPT-wrapper in May, hit $2k MRR by June. The community's feedback saved me 3 months.", color: "bg-acid" },
    { initials: "SC", name: "Sarah Chen", company: "NoCodeBase", quote: "The distribution channels shared here are a goldmine. We saw a 300% spike in traffic after the SEO teardown.", color: "bg-hot" },
    { initials: "RK", name: "Ravi Kapoor", company: "LedgerAI", quote: "Found my technical co-founder in week two. We closed our angel round in 6 weeks through warm intros.", color: "bg-gold" },
    { initials: "NP", name: "Neha Patel", company: "Snipdesk", quote: "I was stuck at $500 MRR for months. One growth audit later, we 5x'd in 60 days.", color: "bg-electric" },
  ];
  return (
    <section id="stories" className="mx-auto mb-32 max-w-6xl px-6">
      <div className="mb-10 flex items-end justify-between border-b-2 border-foreground pb-4">
        <div>
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-hot">// recent_wins</div>
          <h2 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">shipping & winning</h2>
        </div>
        <div className="hidden font-mono text-xs uppercase text-muted-foreground md:block">last_90d</div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {stories.map((s, i) => (
          <div
            key={s.name}
            className="relative border-2 border-foreground bg-surface p-6 shadow-brutal-sm"
            style={{ transform: i % 2 ? "rotate(0.3deg)" : "rotate(-0.4deg)" }}
          >
            <div className="flex gap-5">
              <div className={`grid size-16 shrink-0 place-items-center border-2 border-foreground ${s.color} font-display text-lg font-bold text-background`}>
                {s.initials}
              </div>
              <div>
                <p className="font-medium text-foreground">"{s.quote}"</p>
                <div className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  <span className="text-acid">▸</span>
                  {s.name} · {s.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    { quote: "The single best ₹599 I've spent on my startup journey.", author: "Kabir · B2B SaaS" },
    { quote: "Replaced three paid communities and a $1k mastermind.", author: "Ananya · AI tooling" },
    { quote: "I finally have peers who actually ship.", author: "Devansh · Indie hacker" },
  ];
  return (
    <section className="mb-32 border-y-2 border-foreground bg-surface/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 font-mono text-xs font-bold uppercase tracking-widest text-acid">// receipts.log</div>
        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <blockquote
              key={i}
              className="border-2 border-foreground bg-background p-8 shadow-brutal-sm"
              style={{ transform: `rotate(${i % 2 ? "0.5deg" : "-0.5deg"})` }}
            >
              <div className="mb-3 font-mono text-2xl text-acid">"</div>
              <p className="font-display text-lg text-foreground leading-snug">{q.quote}</p>
              <footer className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">— {q.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto mb-32 max-w-4xl px-6">
      <div className="relative">
        {/* stacked offset blocks */}
        <div className="absolute -inset-1 translate-x-3 translate-y-3 bg-hot" aria-hidden />
        <div className="absolute -inset-1 translate-x-6 translate-y-6 bg-acid" aria-hidden />
        <div className="relative border-2 border-foreground bg-gold p-10 text-background md:p-14">
          <div className="absolute right-4 top-4 rotate-6 border-2 border-foreground bg-background px-2 py-1 font-mono text-[10px] font-bold uppercase text-foreground shadow-brutal-sm">
            no_bs.deal
          </div>
          <div className="font-mono text-xs font-bold uppercase tracking-widest">// pricing_v1</div>
          <h2 className="mt-2 font-display text-5xl font-bold leading-none md:text-6xl">the no-brainer deal.</h2>
          <div className="mt-8 flex flex-wrap items-end gap-4">
            <div className="font-display text-7xl font-bold leading-none md:text-8xl">₹599</div>
            <div className="font-mono text-sm uppercase tracking-widest">
              /lifetime<br />
              <span className="opacity-70">↑ ₹2,999 @ 500 members</span>
            </div>
          </div>

          <ul className="mt-10 grid gap-2 font-medium md:grid-cols-2">
            {[
              "Lifetime community access",
              "Resource vault + playbooks",
              "Weekly founder sessions & AMAs",
              "Founder directory + DMs",
              "Investor hub + Demo Day apps",
              "Startup showcase & upvotes",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 border-b-2 border-background/30 py-2">
                <div className="grid size-5 place-items-center border-2 border-background text-[10px] font-bold">✓</div>
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/pricing"
            className="group mt-10 flex items-center justify-between border-2 border-foreground bg-background px-6 py-5 font-mono text-base font-bold uppercase text-foreground shadow-brutal transition-all hover:-translate-x-1 hover:-translate-y-1"
          >
            <span>claim_lifetime_access</span>
            <span className="text-acid group-hover:translate-x-1 transition">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "What do I get for ₹599?", a: "Permanent access to the community, resource library, founder directory, events, and all future features. No recurring charges, ever." },
    { q: "Who is this for?", a: "SaaS founders, AI startup builders, indie hackers, technical and non-technical founders, and investors. Whether you're at $0 or $10k MRR." },
    { q: "Why is it so cheap?", a: "We're building the foundation. Early founders get the best price and help shape the community. Price doubles at 500 members." },
    { q: "What happens after I pay?", a: "Your account is instantly activated. You get immediate access to the community feed, resources, and member directory." },
    { q: "Is there a refund policy?", a: "Given the digital nature of the assets and instant access, all sales are final. We're confident you'll find value in 24 hours." },
    { q: "Can I connect with investors?", a: "Yes. The Investor Hub lists active angels and micro-VCs, and you can apply to monthly Demo Days for direct intros." },
  ];
  return (
    <section id="faq" className="mx-auto mb-32 max-w-3xl px-6">
      <div className="mb-8 border-b-2 border-foreground pb-4">
        <div className="font-mono text-xs font-bold uppercase tracking-widest text-electric">// faq.md</div>
        <h2 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">questions, answered.</h2>
      </div>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <details
            key={f.q}
            className="group border-2 border-foreground bg-surface p-5 open:bg-background"
          >
            <summary className="cursor-pointer list-none font-bold text-foreground">
              <span className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs text-acid">0{i + 1}</span>
                  {f.q}
                </span>
                <span className="grid size-6 place-items-center border-2 border-foreground bg-acid font-mono text-xs text-background transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 pl-8 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto mb-32 max-w-6xl px-6">
      <div className="relative border-2 border-foreground bg-foreground p-10 text-background md:p-16">
        <div className="absolute inset-0 opacity-10 bg-stripes" aria-hidden />
        <div className="relative">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-acid">// final_call</div>
          <h2 className="mt-3 font-display text-5xl font-bold leading-[0.95] md:text-7xl">
            stop building alone.
            <br />
            <span className="bg-acid text-background px-2 -skew-x-6 inline-block">start shipping.</span>
          </h2>
          <p className="mt-6 max-w-2xl font-medium opacity-80">
            Next 100 founders lock in ₹599 lifetime. After that: ₹2,999 forever.
          </p>
          <Link
            to="/auth"
            className="mt-10 inline-flex items-center gap-3 border-2 border-background bg-acid px-6 py-4 font-mono text-sm font-bold uppercase text-background shadow-[6px_6px_0_0_var(--background)] transition hover:-translate-x-1 hover:-translate-y-1"
          >
            join_now →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-foreground bg-background px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-7 place-items-center border-2 border-foreground bg-acid">
            <span className="font-mono text-[10px] font-bold text-background">FH</span>
          </div>
          <span className="font-display text-base font-bold text-foreground">founder/hunt</span>
        </Link>
        <div className="flex gap-6 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <a href="#" className="hover:text-acid">terms</a>
          <a href="#" className="hover:text-acid">privacy</a>
          <a href="#" className="hover:text-acid">contact</a>
        </div>
        <div className="font-mono text-[10px] uppercase text-muted-foreground">© 2026 · built_in_public</div>
      </div>
    </footer>
  );
}
