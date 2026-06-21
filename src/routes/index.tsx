import { createFileRoute, Link } from "@tanstack/react-router";
import dashboardHero from "@/assets/dashboard-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FounderHuntCommunity — Build Faster. Validate Smarter. Scale Together." },
      { name: "description", content: "An exclusive ecosystem for SaaS and AI founders, indie hackers, and investors. Lifetime access for ₹599." },
      { property: "og:title", content: "FounderHuntCommunity" },
      { property: "og:description", content: "An exclusive ecosystem for SaaS and AI founders. Lifetime access for ₹599." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground/80 font-sans">
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

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-gold">
            <div className="size-3 rounded-full bg-background" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">FounderHunt</span>
        </Link>
        <div className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#benefits" className="hover:text-foreground">The Network</a>
          <a href="#stories" className="hover:text-foreground">Success</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">Sign in</Link>
          <Link to="/auth" className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-background transition hover:brightness-110">
            Join for ₹599
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="px-6 pt-24 pb-16">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-soft px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-gold" />
          </span>
          Lifetime Access — Limited
        </div>
        <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-7xl">
          Build Faster. Validate <span className="italic text-gold">Smarter.</span> Scale Together.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          The exclusive community of SaaS and AI founders building the next generation of startups. No fluff, no gurus — just builders shipping products and scaling revenue together.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/auth"
            className="w-full rounded-2xl bg-gold px-8 py-4 text-base font-bold text-background transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_-10px_oklch(0.78_0.13_85_/_0.6)] sm:w-auto"
          >
            Join FounderHuntCommunity — ₹599
          </Link>
          <p className="text-sm font-medium text-muted-foreground">
            One-time payment.<br className="hidden sm:block" /> No recurring subscriptions.
          </p>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="mx-auto mb-32 max-w-6xl px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface">
        <img
          src={dashboardHero}
          alt="FounderHuntCommunity platform preview"
          width={1600}
          height={900}
          className="aspect-[16/9] w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>
    </div>
  );
}

function Stats() {
  const items = [
    { value: "420+", label: "Active Founders" },
    { value: "$12M+", label: "Combined ARR" },
    { value: "15+", label: "Exits & Acquisitions" },
    { value: "₹599", label: "Lock-in Price" },
  ];
  return (
    <section className="mb-32 border-y border-border py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {items.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl font-bold text-foreground">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { title: "Vetted Mastermind", body: "Weekly peer-led calls. UI teardowns, conversion fixes, real growth tactics from founders shipping.", shape: "square" as const },
    { title: "AI & SaaS Vault", body: "Curated prompts, custom GPTs, technical blueprints, and SOPs for lean teams scaling fast.", shape: "circle" as const },
    { title: "Investor Access", body: "Direct line to micro-VCs and angels who back early-stage AI-first companies in India and globally.", shape: "diamond" as const },
    { title: "Co-founder Match", body: "Find technical and non-technical co-founders, designers, and growth partners in the marketplace.", shape: "circle" as const },
    { title: "Founder Showcase", body: "Launch your product to a hyper-relevant audience. Collect feedback, upvotes, and first 100 users.", shape: "square" as const },
    { title: "Lifetime Network", body: "Pay once, stay forever. Watch your peers grow from MVP to ₹10Cr ARR with you alongside.", shape: "diamond" as const },
  ];
  return (
    <section id="benefits" className="mx-auto mb-32 max-w-6xl px-6">
      <div className="mb-12 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-foreground">Everything a founder needs.</h2>
        <p className="mt-3 text-muted-foreground">One membership. Six core pillars. Zero subscription.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((b) => (
          <div key={b.title} className="group rounded-3xl border border-border bg-surface p-8 transition-colors hover:border-gold/50">
            <div className="mb-6 grid size-12 place-items-center rounded-2xl bg-gold-soft transition-transform group-hover:scale-110">
              {b.shape === "square" && <div className="size-5 rounded-sm border-2 border-gold" />}
              {b.shape === "circle" && <div className="size-5 rounded-full border-2 border-gold" />}
              {b.shape === "diamond" && <div className="size-5 rotate-45 border-2 border-gold" />}
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">{b.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SuccessStories() {
  const stories = [
    { initials: "AM", name: "Arjun Mehta", company: "PromptFlow", quote: "Joined in April, launched my GPT-wrapper in May, hit $2k MRR by June. The community's feedback saved me 3 months." },
    { initials: "SC", name: "Sarah Chen", company: "NoCodeBase", quote: "The distribution channels shared here are a goldmine. We saw a 300% spike in traffic after the SEO teardown." },
    { initials: "RK", name: "Ravi Kapoor", company: "LedgerAI", quote: "Found my technical co-founder in week two. We closed our angel round in 6 weeks through warm intros." },
    { initials: "NP", name: "Neha Patel", company: "Snipdesk", quote: "I was stuck at $500 MRR for months. One growth audit later, we 5x'd in 60 days." },
  ];
  return (
    <section id="stories" className="mx-auto mb-32 max-w-6xl px-6">
      <div className="mb-12">
        <h2 className="font-display text-3xl font-bold text-foreground">Shipping & Winning</h2>
        <p className="mt-2 text-muted-foreground">Real results from the last 90 days in the community.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {stories.map((s) => (
          <div key={s.name} className="flex gap-5 rounded-3xl border border-border bg-surface/50 p-6">
            <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gold-soft font-display text-lg font-bold text-gold">
              {s.initials}
            </div>
            <div>
              <p className="font-medium text-foreground">"{s.quote}"</p>
              <div className="mt-3 text-sm text-muted-foreground">
                <span className="text-gold">{s.name}</span> · Founder of {s.company}
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
    { quote: "The single best ₹599 I've spent on my startup journey.", author: "Kabir, B2B SaaS founder" },
    { quote: "Replaced three paid communities and a $1k mastermind.", author: "Ananya, AI tooling" },
    { quote: "I finally have peers who actually ship.", author: "Devansh, Indie hacker" },
  ];
  return (
    <section className="mb-32 border-y border-border bg-surface/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <blockquote key={i} className="rounded-2xl border border-border bg-background p-8">
              <p className="font-display text-lg text-foreground">"{q.quote}"</p>
              <footer className="mt-4 text-sm text-muted-foreground">— {q.author}</footer>
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
      <div className="relative overflow-hidden rounded-[2rem] bg-gold p-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent)]" />
        <div className="relative z-10 text-background">
          <h2 className="font-display text-4xl font-bold">The No-Brainer Deal</h2>
          <div className="mt-4 font-display text-6xl font-extrabold tracking-tight">
            ₹599<span className="text-lg font-medium opacity-80">/lifetime</span>
          </div>
          <p className="mx-auto mt-6 max-w-md font-medium opacity-90">
            Secure your spot today. Price increases to ₹2,999 once we reach 500 founders. No monthly fees, ever.
          </p>
          <ul className="mx-auto mt-10 max-w-xs space-y-4 text-left font-medium">
            {[
              "Lifetime community access",
              "Resource Vault & SaaS playbooks",
              "Weekly founder sessions & AMAs",
              "Founder directory & DMs",
              "Investor Hub & Demo Day applications",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <div className="grid size-5 place-items-center rounded-full bg-background/20 text-[10px] text-background">✓</div>
                {f}
              </li>
            ))}
          </ul>
          <Link
            to="/auth"
            className="mt-10 inline-block w-full max-w-sm rounded-2xl bg-background px-8 py-5 font-display text-xl font-extrabold text-gold transition-transform hover:scale-105"
          >
            Claim Lifetime Access
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
      <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">Questions, answered.</h2>
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-border bg-surface p-6 open:border-gold/40">
            <summary className="cursor-pointer list-none font-bold text-foreground">
              <span className="flex items-center justify-between gap-4">
                {f.q}
                <span className="text-gold transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto mb-32 max-w-4xl px-6 text-center">
      <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
        Stop building alone. <span className="text-gold">Start shipping with peers.</span>
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
        The next 100 founders get lifetime access at ₹599. After that, it's ₹2,999 forever.
      </p>
      <Link to="/auth" className="mt-10 inline-block rounded-full bg-gold px-8 py-4 text-base font-bold text-background transition hover:brightness-110">
        Join the Community Now
      </Link>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-6 place-items-center rounded-md bg-gold">
            <div className="size-2 rounded-full bg-background" />
          </div>
          <span className="font-display text-base font-bold text-foreground">FounderHunt</span>
        </Link>
        <div className="flex gap-8 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
        <div className="text-xs text-muted-foreground">© 2026 FounderHuntCommunity</div>
      </div>
    </footer>
  );
}
