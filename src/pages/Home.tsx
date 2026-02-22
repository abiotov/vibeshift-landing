import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ---------------------------------------------------------------------------
// Cloudinary helpers
// ---------------------------------------------------------------------------
const CLOUD = 'https://res.cloudinary.com/dr7ohwmo2/image/upload'
const thumb = (id: string) => `${CLOUD}/c_fill,w_300,h_400,q_auto,f_auto/${id}`
const hero = (id: string) => `${CLOUD}/c_fill,w_600,h_800,q_auto,f_auto/${id}`

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.vibeshift.app'

const GALLERY_STYLES = [
  { name: 'CEO', img: 'kehl0id3hmpa2pbqnmee' },
  { name: 'Vogue', img: 'vf3gmk5jrtrlqevpu8qb' },
  { name: 'Dark Academia', img: 'krccy8jydi2ahsfz3oym' },
  { name: 'Instagram', img: 'w3dpqhvmwytkjrknkk6q' },
  { name: 'Cinematic', img: 'snkqe1yhf6cht5jflq6i' },
  { name: 'Moody', img: 'zwnk0wexyoaiufe5c79o' },
  { name: 'Soft', img: 'fadgz7bpl9ehco7tvhll' },
  { name: 'Clean Girl', img: 'he0ptbrvxajnuyrpmva1' },
  { name: 'Founder', img: 'ing73hb4owbuykkrrwdb' },
  { name: 'Professional', img: 'pxizwflcwod6wyvxxq1b' },
  { name: 'Minimal', img: 'qwc5icjeykvwdpmtbqrt' },
  { name: 'ID Photo', img: 'b1vxamzvwgpekvbveurc' },
]

const BEFORE_AFTER = [
  { name: 'CEO', before: 'feaztyz1gpfauovkhwz3', after: 'kehl0id3hmpa2pbqnmee' },
  { name: 'Vogue', before: 'jybbzluhzkebvxpkbmvw', after: 'vf3gmk5jrtrlqevpu8qb' },
  { name: 'Soft Aesthetic', before: 'oxhzb0bdry4h2srrkerp', after: 'fadgz7bpl9ehco7tvhll' },
  { name: 'Cinematic', before: 'rqd8ahswbzov1miftcmy', after: 'snkqe1yhf6cht5jflq6i' },
  { name: 'Founder', before: 'yaxavynjvhjxuu85ithf', after: 'ing73hb4owbuykkrrwdb' },
  { name: 'Clean Girl', before: 'zjp36rjcdnawwioubefy', after: 'he0ptbrvxajnuyrpmva1' },
]

const CATEGORIES = [
  { name: 'Trending', icon: '🔥', count: 5 },
  { name: 'Professional', icon: '💼', count: 8 },
  { name: 'Aesthetic', icon: '✨', count: 7 },
  { name: 'Social Media', icon: '📱', count: 6 },
  { name: 'Dating', icon: '💕', count: 6 },
  { name: 'Fashion', icon: '👗', count: 8 },
  { name: 'Creative', icon: '🎨', count: 5 },
  { name: 'Celebrity', icon: '🎬', count: 6 },
  { name: 'Retro', icon: '📼', count: 5 },
  { name: 'Cultural', icon: '🌍', count: 5 },
  { name: 'Travel', icon: '✈️', count: 8 },
  { name: 'Lifestyle', icon: '☕', count: 7 },
]

const FAQS = [
  {
    q: 'How does VibeShift work?',
    a: 'Upload any photo, choose from 90+ AI styles, and get a stunning transformation in seconds. Our AI analyzes your facial features and preserves your identity while applying the chosen artistic style.',
  },
  {
    q: 'Is my photo safe?',
    a: 'Yes. Your photos are processed securely and originals are deleted after processing. We never sell or share your images. Generated results are stored in your private account.',
  },
  {
    q: 'How long does generation take?',
    a: 'Most transformations complete in 15-30 seconds. Much faster than booking a professional photographer and waiting days for edited results.',
  },
  {
    q: 'Can I use the photos commercially?',
    a: 'Absolutely. All generated images are yours to use for personal and commercial purposes - LinkedIn, dating apps, social media, portfolios, or anywhere else.',
  },
  {
    q: 'What makes VibeShift different from other AI photo apps?',
    a: 'VibeShift is a native mobile app (not a website) with 90+ curated styles across 20 categories. Most competitors focus only on headshots - we cover everything from professional to creative, dating to fashion, travel to cultural aesthetics.',
  },
  {
    q: 'Do I need multiple photos?',
    a: 'No. A single clear photo is all you need. Our AI extracts your features from one image and generates any style you choose.',
  },
]

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return scrolled
}

// ---------------------------------------------------------------------------
// Small components
// ---------------------------------------------------------------------------
function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const { ref, visible } = useInView()
  return (
    <section id={id} ref={ref} className={`${className} transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </section>
  )
}

function CTAButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={PLAY_STORE}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(217,70,239,0.3)] ${className}`}
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z"/></svg>
      Get it on Google Play
    </a>
  )
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left gap-4">
        <span className="text-lg font-medium">{q}</span>
        <svg className={`w-5 h-5 shrink-0 text-fuchsia-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-60 pb-5' : 'max-h-0'}`}>
        <p className="text-white/60 leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Home() {
  const scrolled = useScrolled()

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      {/* ----------------------------------------------------------------- */}
      {/* NAV */}
      {/* ----------------------------------------------------------------- */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center font-black text-lg">V</div>
            <span className="text-xl font-bold">VibeShift</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#styles" className="hover:text-white transition-colors">Styles</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-sm font-medium px-5 py-2.5 rounded-xl transition-all">
            Download App
          </a>
        </div>
      </nav>

      {/* ----------------------------------------------------------------- */}
      {/* HERO */}
      {/* ----------------------------------------------------------------- */}
      <header className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        {/* bg glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[160px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/70 mb-6 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              90+ AI Styles Available
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 animate-fade-up delay-100">
              Your best photo,{' '}
              <span className="gradient-text">in seconds</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-up delay-200 leading-relaxed">
              Upload one selfie and transform it into stunning professional headshots, dating photos, social media content, and more. AI-powered, identity-preserving, instant.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-up delay-300">
              <CTAButton />
              <a href="#styles" className="text-white/50 hover:text-white text-sm font-medium transition-colors flex items-center gap-1">
                See all styles
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </a>
            </div>
            {/* trust stats */}
            <div className="flex items-center gap-8 mt-10 justify-center lg:justify-start animate-fade-up delay-400">
              <div>
                <div className="text-2xl font-bold">90+</div>
                <div className="text-xs text-white/40">AI Styles</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-2xl font-bold">20</div>
                <div className="text-xs text-white/40">Categories</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-2xl font-bold">&lt;30s</div>
                <div className="text-xs text-white/40">Generation</div>
              </div>
            </div>
          </div>

          {/* Right - hero images */}
          <div className="relative flex justify-center animate-fade-up delay-200">
            <div className="relative">
              {/* Before card */}
              <div className="absolute -left-8 md:-left-16 top-8 z-10 animate-float">
                <div className="glass rounded-2xl p-1.5 shadow-2xl">
                  <img src={hero('feaztyz1gpfauovkhwz3')} alt="Before" className="w-36 md:w-44 h-48 md:h-56 rounded-xl object-cover" loading="eager" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-xs font-medium px-3 py-1 rounded-full border border-white/10">
                    Before
                  </div>
                </div>
              </div>
              {/* After card (main) */}
              <div className="glow-pink rounded-3xl p-1.5 glass">
                <img src={hero('kehl0id3hmpa2pbqnmee')} alt="AI Generated CEO Portrait" className="w-60 md:w-72 h-80 md:h-96 rounded-2xl object-cover" loading="eager" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-sm font-semibold px-5 py-1.5 rounded-full shadow-lg">
                  CEO Style
                </div>
              </div>
              {/* Floating style card */}
              <div className="absolute -right-6 md:-right-14 bottom-16 z-10 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="glass rounded-2xl p-1.5 shadow-2xl">
                  <img src={hero('vf3gmk5jrtrlqevpu8qb')} alt="Vogue Style" className="w-32 md:w-40 h-44 md:h-52 rounded-xl object-cover" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-fuchsia-500/80 to-pink-500/80 backdrop-blur-md text-xs font-medium px-3 py-1 rounded-full">
                    Vogue
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------------------- */}
      {/* SCROLLING GALLERY */}
      {/* ----------------------------------------------------------------- */}
      <Section id="styles" className="py-20">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Every vibe, one app</h2>
          <p className="text-white/50 max-w-2xl mx-auto">From professional headshots to creative aesthetics. Choose your style and let AI do the magic.</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-4 animate-scroll-gallery" style={{ width: 'max-content' }}>
            {[...GALLERY_STYLES, ...GALLERY_STYLES].map((s, i) => (
              <div key={i} className="relative group shrink-0">
                <img src={thumb(s.img)} alt={s.name} className="w-48 h-64 rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl" />
                <span className="absolute bottom-3 left-3 text-sm font-semibold">{s.name}</span>
              </div>
            ))}
          </div>
          {/* fade edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
        </div>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* HOW IT WORKS */}
      {/* ----------------------------------------------------------------- */}
      <Section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Three steps. That's it.</h2>
            <p className="text-white/50 max-w-xl mx-auto">No photoshoot. No editing skills. No waiting.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload a photo', desc: 'Take a selfie or choose any clear photo of yourself. One photo is all you need.', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg> },
              { step: '02', title: 'Pick a style', desc: 'Browse 90+ styles across 20 categories. Professional, creative, social, dating - pick your vibe.', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg> },
              { step: '03', title: 'Get your photo', desc: 'AI generates your transformation in seconds. Download, share, or try another style.', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg> },
            ].map((item) => (
              <div key={item.step} className="glass rounded-3xl p-8 hover:border-fuchsia-500/20 transition-all duration-500 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center text-fuchsia-400 mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="text-fuchsia-400/50 text-sm font-mono mb-2">{item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* BEFORE / AFTER */}
      {/* ----------------------------------------------------------------- */}
      <Section className="py-24 bg-gradient-to-b from-transparent via-fuchsia-500/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See the transformation</h2>
            <p className="text-white/50 max-w-xl mx-auto">Same person, completely different vibe. Your identity stays - only the style changes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BEFORE_AFTER.map((s) => (
              <div key={s.name} className="glass rounded-2xl p-3 hover:border-white/10 transition-all duration-500">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <img src={thumb(s.before)} alt={`${s.name} Before`} className="w-full h-56 rounded-xl object-cover" loading="lazy" />
                    <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-xs px-2 py-0.5 rounded-md">Before</span>
                  </div>
                  <div className="relative flex-1">
                    <img src={thumb(s.after)} alt={`${s.name} After`} className="w-full h-56 rounded-xl object-cover" loading="lazy" />
                    <span className="absolute bottom-2 left-2 bg-gradient-to-r from-fuchsia-500/80 to-pink-500/80 text-xs px-2 py-0.5 rounded-md">{s.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* CATEGORIES */}
      {/* ----------------------------------------------------------------- */}
      <Section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A style for every occasion</h2>
            <p className="text-white/50 max-w-xl mx-auto">LinkedIn headshot? Dating profile? Festival look? We have it all.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((c) => (
              <div key={c.name} className="glass rounded-2xl p-5 hover:border-fuchsia-500/20 hover:bg-white/[0.03] transition-all duration-300 cursor-default group">
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{c.icon}</div>
                <div className="font-semibold mb-1">{c.name}</div>
                <div className="text-xs text-white/40">{c.count} styles</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* PRICING / VALUE COMPARISON */}
      {/* ----------------------------------------------------------------- */}
      <Section id="pricing" className="py-24 bg-gradient-to-b from-transparent via-fuchsia-500/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional photos without the professional price</h2>
            <p className="text-white/50 max-w-xl mx-auto">A single professional photoshoot costs $150-500+. VibeShift gives you unlimited styles for a fraction of the cost.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Photographer comparison */}
            <div className="glass rounded-3xl p-8 opacity-60">
              <div className="text-white/40 text-sm font-medium uppercase tracking-wider mb-4">Traditional Photographer</div>
              <div className="text-4xl font-bold mb-6">$200<span className="text-lg text-white/40 font-normal">+</span></div>
              <ul className="space-y-3 text-white/40 text-sm">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  1 style per session
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Days to receive edited photos
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Book appointment, travel, wait
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Limited retakes
                </li>
              </ul>
            </div>

            {/* VibeShift */}
            <div className="relative glass rounded-3xl p-8 border-fuchsia-500/30 glow-pink">
              <div className="absolute -top-3 left-8 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-xs font-semibold px-4 py-1 rounded-full">BEST VALUE</div>
              <div className="gradient-text text-sm font-medium uppercase tracking-wider mb-4">VibeShift App</div>
              <div className="text-4xl font-bold mb-1">$7.99<span className="text-lg text-white/40 font-normal">/week</span></div>
              <div className="text-sm text-white/40 mb-6">or $59.99/year (save 85%)</div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span><strong>90+ styles</strong> across 20 categories</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Results in <strong>seconds</strong>, not days</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Generate <strong>from your couch</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Unlimited regeneration</strong> until you love it</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Identity preserved</strong> - still looks like you</span>
                </li>
              </ul>
              <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 font-semibold py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02]">
                Start transforming
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* UNIQUE SELLING POINTS */}
      {/* ----------------------------------------------------------------- */}
      <Section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Identity Preservation', desc: 'Our AI precisely extracts your facial features and preserves them through every transformation. The result always looks like you.', icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> },
              { title: 'Native App Experience', desc: 'Not a slow website - a real native mobile app. Fast, smooth, works offline for browsing your gallery. Built for your phone.', icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg> },
              { title: 'Privacy First', desc: 'Your photos are processed securely and originals deleted after generation. We never sell your data. Your face, your business.', icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg> },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mx-auto mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* FAQ */}
      {/* ----------------------------------------------------------------- */}
      <Section id="faq" className="py-24 bg-gradient-to-b from-transparent via-fuchsia-500/[0.02] to-transparent">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions? We've got answers.</h2>
          </div>
          <div className="glass rounded-3xl p-6 md:p-8">
            {FAQS.map((f) => <FAQ key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* FINAL CTA */}
      {/* ----------------------------------------------------------------- */}
      <Section className="py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Ready to <span className="gradient-text">shift your vibe</span>?
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of people transforming their photos with AI. Your next profile picture is one tap away.
          </p>
          <CTAButton className="text-lg px-10 py-5" />
        </div>
      </Section>

      {/* ----------------------------------------------------------------- */}
      {/* FOOTER */}
      {/* ----------------------------------------------------------------- */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center font-black text-sm">V</div>
              <span className="font-bold">VibeShift</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <a href="mailto:support@tryvibeshift.com" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-sm text-white/30">
              &copy; {new Date().getFullYear()} VibeShift. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
