import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  Upload,
  Paintbrush,
  Download,
  ChevronDown,
  Menu,
  X,
  Check,
  Sparkles,
  Smartphone,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CLOUD = 'https://res.cloudinary.com/dr7ohwmo2/image/upload'
const thumb = (id: string) => `${CLOUD}/c_fill,w_300,h_400,q_auto,f_auto/${id}`
const hero = (id: string) => `${CLOUD}/c_fill,w_600,h_800,q_auto,f_auto/${id}`

const PLAY_STORE =
  'https://play.google.com/store/apps/details?id=com.vibeshift.app'

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const BEFORE_AFTER_PAIRS = [
  { name: 'CEO Portrait', before: 'feaztyz1gpfauovkhwz3', after: 'kehl0id3hmpa2pbqnmee' },
  { name: 'Vogue Editorial', before: 'jybbzluhzkebvxpkbmvw', after: 'vf3gmk5jrtrlqevpu8qb' },
  { name: 'Cinematic', before: 'rqd8ahswbzov1miftcmy', after: 'snkqe1yhf6cht5jflq6i' },
  { name: 'Dating Profile', before: 'vhgrftbvyzgmm0rkueuk', after: 'z1vgwoynkhjsxiu5ijcc' },
]

const BENTO_ITEMS: { id: string; name: string; size: 'lg' | 'sm' }[] = [
  { id: 'kehl0id3hmpa2pbqnmee', name: 'CEO', size: 'lg' },
  { id: 'vf3gmk5jrtrlqevpu8qb', name: 'Vogue', size: 'sm' },
  { id: 'krccy8jydi2ahsfz3oym', name: 'Dark Academia', size: 'sm' },
  { id: 'snkqe1yhf6cht5jflq6i', name: 'Cinematic', size: 'lg' },
  { id: 'w3dpqhvmwytkjrknkk6q', name: 'Instagram', size: 'sm' },
  { id: 'he0ptbrvxajnuyrpmva1', name: 'Clean Girl', size: 'sm' },
  { id: 'ing73hb4owbuykkrrwdb', name: 'Founder', size: 'lg' },
  { id: 'z1vgwoynkhjsxiu5ijcc', name: 'Dating', size: 'sm' },
  { id: 'fxinnh2mudsuaabt5wln', name: 'Streetwear', size: 'sm' },
  { id: 'nwjan5smalf1nm1jplbu', name: 'Luxury', size: 'lg' },
  { id: 'fadgz7bpl9ehco7tvhll', name: 'Soft', size: 'sm' },
  { id: 'pxizwflcwod6wyvxxq1b', name: 'Professional', size: 'sm' },
]

const STEPS = [
  {
    icon: Upload,
    title: 'Upload a selfie',
    desc: 'One clear photo is all you need. No studio, no prep.',
  },
  {
    icon: Paintbrush,
    title: 'Pick your style',
    desc: '94 styles across 20 categories. CEO, Vogue, Dating, and beyond.',
  },
  {
    icon: Download,
    title: 'Download instantly',
    desc: 'AI transforms your photo in under 30 seconds. Share everywhere.',
  },
]

const FAQS = [
  {
    q: 'How does VibeShift work?',
    a: 'Upload any clear photo, choose from 94 AI styles, and get your transformation in under 30 seconds. The AI analyzes your features and creates a new image that still looks like you, just in a completely different style.',
  },
  {
    q: 'Will it still look like me?',
    a: 'Yes. Our AI preserves your facial features, bone structure, and likeness while applying the chosen style. The result is unmistakably you, just with a completely different vibe.',
  },
  {
    q: 'Are my photos safe?',
    a: 'Absolutely. Your uploaded photos are processed securely and originals are deleted after generation. We never sell or share your images. Generated results are stored in your private account and you can delete them anytime.',
  },
  {
    q: 'Can I use the photos for LinkedIn, dating apps, etc.?',
    a: 'Yes. All generated images are yours to use for any personal or commercial purpose -- LinkedIn, Tinder, Instagram, portfolios, or anywhere else you want to look great.',
  },
  {
    q: 'How is this different from other AI photo apps?',
    a: 'VibeShift is a native mobile app (not a slow website) with 94 curated styles across 20 categories. While most apps focus only on headshots, we cover everything from professional to creative, dating to fashion, travel to streetwear.',
  },
  {
    q: 'What if I don\'t like a result?',
    a: 'Just regenerate. Each generation creates a unique variation, so you can keep trying until you get something you love. You can also customize the style further with edit prompts.',
  },
]

const NAV_LINKS = [
  { href: '#styles', label: 'Styles' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: EASE },
  }),
}

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.08 } },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
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
// Before/After Slider Component
// ---------------------------------------------------------------------------
function BeforeAfterSlider({
  beforeId,
  afterId,
  styleName,
  priority = false,
}: {
  beforeId: string
  afterId: string
  styleName: string
  priority?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sliderPos, setSliderPos] = useState(50)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(pct)
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      updatePosition(e.clientX)
    },
    [updatePosition],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      updatePosition(e.clientX)
    },
    [updatePosition],
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-col-resize select-none touch-none group"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="slider"
      aria-label={`Before and after comparison for ${styleName} style`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPos)}
    >
      {/* After image (full) */}
      <img
        src={hero(afterId)}
        alt={`${styleName} style transformation result`}
        className="absolute inset-0 w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={hero(beforeId)}
          alt={`Original photo before ${styleName} transformation`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg flex items-center justify-center transition-[transform] duration-200 group-hover:scale-110">
          <div className="flex items-center gap-0.5">
            <ChevronDown className="w-3.5 h-3.5 text-gray-800 -rotate-90" />
            <ChevronDown className="w-3.5 h-3.5 text-gray-800 rotate-90" />
          </div>
        </div>
      </div>
      {/* Labels */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
        Before
      </div>
      <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-fuchsia-500/80 to-pink-500/80 backdrop-blur-md text-xs font-medium px-3 py-1.5 rounded-full">
        {styleName}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FAQ Accordion Item
// ---------------------------------------------------------------------------
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const id = `faq-${index}`

  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 md:py-6 text-left gap-4 group"
        aria-expanded={open}
        aria-controls={`${id}-content`}
        id={`${id}-trigger`}
      >
        <span className="text-base md:text-lg font-medium transition-[color] duration-200 group-hover:text-fuchsia-300">
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-fuchsia-400/60" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-content`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="text-white/50 leading-relaxed pb-5 md:pb-6 pr-8">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section wrapper with scroll reveal
// ---------------------------------------------------------------------------
function RevealSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.section>
  )
}

// ---------------------------------------------------------------------------
// Mobile Menu
// ---------------------------------------------------------------------------
function MobileMenu({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#0A0A0F]/95 backdrop-blur-xl border-l border-white/[0.06] z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <span className="font-semibold text-lg">Menu</span>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-[background-color] duration-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="py-3 px-4 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-[color,background-color] duration-200 text-base font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto p-6">
              <a
                href={PLAY_STORE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 font-semibold py-3.5 rounded-xl cta-glow transition-[opacity,transform] duration-200 hover:scale-[1.02]"
              >
                Download Free
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Pricing Check Icon
// ---------------------------------------------------------------------------
function PricingCheck({ muted = false }: { muted?: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
        muted
          ? 'bg-white/5 text-white/30'
          : 'bg-fuchsia-500/15 text-fuchsia-400'
      }`}
    >
      <Check className="w-3 h-3" />
    </div>
  )
}

function PricingX() {
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-white/5 text-white/20">
      <X className="w-3 h-3" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Home() {
  const scrolled = useScrolled()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.title = 'VibeShift - AI Photo Transformation'
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-sans overflow-x-hidden noise">
      {/* ================================================================= */}
      {/* NAV                                                                */}
      {/* ================================================================= */}
      <nav
        className={`fixed top-0 inset-x-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? 'bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/[0.06]'
            : 'border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-16 md:h-[72px]">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/logo.png"
              alt="VibeShift logo"
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl"
            />
            <span className="text-lg font-bold tracking-tight">VibeShift</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/50 hover:text-white px-4 py-2 rounded-lg transition-[color] duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] px-5 py-2 rounded-xl transition-[background-color] duration-200"
          >
            Download
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-[background-color] duration-200"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* ================================================================= */}
      {/* HERO                                                               */}
      {/* ================================================================= */}
      <header className="relative pt-28 pb-16 md:pt-36 lg:pt-40 md:pb-24 lg:pb-28 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-fuchsia-500/[0.07] rounded-full blur-[180px]" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-pink-500/[0.04] rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Copy */}
            <motion.div
              className="text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {/* Badge */}
              <motion.div variants={fadeUp} custom={0}>
                <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-white/60 mb-6 md:mb-8">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" aria-hidden="true" />
                  94 AI styles available now
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black leading-[1.05] tracking-tight mb-5 md:mb-6"
              >
                Any selfie.{' '}
                <span className="gradient-text">Any style.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-lg md:text-xl text-white/45 max-w-lg mx-auto lg:mx-0 mb-8 md:mb-10 leading-relaxed"
              >
                Upload one photo and transform it into studio-quality portraits
                across 94 styles. In seconds, not days.
              </motion.p>

              {/* CTA */}
              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <a
                  href={PLAY_STORE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-2xl cta-glow transition-[opacity,transform] duration-200 hover:scale-[1.03] active:scale-[0.98]"
                >
                  Try Free - 3 Days
                </a>
                <a
                  href="#styles"
                  className="text-white/40 hover:text-white/70 text-sm font-medium transition-[color] duration-200 flex items-center gap-1.5"
                >
                  See all styles
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </a>
              </motion.div>

              {/* Trust stats */}
              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex items-center gap-6 md:gap-8 mt-10 md:mt-12 justify-center lg:justify-start"
              >
                {[
                  { value: '94', label: 'Styles' },
                  { value: '20', label: 'Categories' },
                  { value: '<30s', label: 'Per photo' },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-6 md:gap-8">
                    {i > 0 && (
                      <div className="w-px h-8 bg-white/[0.08] -ml-6 md:-ml-8" />
                    )}
                    <div>
                      <div className="text-xl md:text-2xl font-bold tracking-tight">
                        {stat.value}
                      </div>
                      <div className="text-xs text-white/35 mt-0.5">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Before/After Slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="relative max-w-sm mx-auto lg:max-w-none lg:mx-0 w-full"
            >
              <div className="relative rounded-2xl overflow-hidden glow-pink">
                <BeforeAfterSlider
                  beforeId="feaztyz1gpfauovkhwz3"
                  afterId="kehl0id3hmpa2pbqnmee"
                  styleName="CEO Portrait"
                  priority
                />
              </div>
              {/* Floating hint */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/30 flex items-center gap-1.5"
              >
                <div className="flex items-center gap-0.5">
                  <ChevronDown className="w-3 h-3 -rotate-90" aria-hidden="true" />
                  <ChevronDown className="w-3 h-3 rotate-90" aria-hidden="true" />
                </div>
                Drag to compare
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* BENTO GRID GALLERY                                                 */}
      {/* ================================================================= */}
      <RevealSection id="styles" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Every vibe. One app.
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              From boardroom headshots to festival looks. Choose your aesthetic.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {BENTO_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                variants={scaleIn}
                className={`relative group rounded-2xl overflow-hidden ${
                  item.size === 'lg' ? 'row-span-2' : ''
                }`}
              >
                <img
                  src={item.size === 'lg' ? hero(item.id) : thumb(item.id)}
                  alt={`${item.name} style AI portrait example`}
                  className="w-full h-full object-cover transition-[transform] duration-700 group-hover:scale-105"
                  loading="lazy"
                  style={{ aspectRatio: '3/4' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-[opacity] duration-500" />
                <div className="absolute bottom-0 inset-x-0 p-3 md:p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-[opacity,transform] duration-500">
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/[0.06] group-hover:ring-fuchsia-500/20 transition-[box-shadow] duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* HOW IT WORKS                                                       */}
      {/* ================================================================= */}
      <RevealSection id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Three steps. That's it.
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              No photoshoot. No editing skills. No waiting days for results.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  custom={i}
                  className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 group hover:border-fuchsia-500/15 transition-[border-color] duration-500"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500/15 to-pink-500/10 border border-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-[transform] duration-500">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-fuchsia-400/40 text-sm font-mono font-medium">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-white/40 leading-relaxed text-sm md:text-base">
                    {step.desc}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* BEFORE / AFTER SHOWCASE                                            */}
      {/* ================================================================= */}
      <RevealSection className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              See the transformation
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              Same person, completely different vibe. Still looks like you -- only the style changes.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {BEFORE_AFTER_PAIRS.map((pair) => (
              <motion.div
                key={pair.name}
                variants={scaleIn}
                className="glass rounded-2xl p-2 md:p-3"
              >
                <BeforeAfterSlider
                  beforeId={pair.before}
                  afterId={pair.after}
                  styleName={pair.name}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* PRICING                                                            */}
      {/* ================================================================= */}
      <RevealSection
        id="pricing"
        className="py-20 md:py-28 relative"
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-fuchsia-500/[0.03] rounded-full blur-[180px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Skip the photographer
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              A professional photoshoot costs $200+. VibeShift starts free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
            {/* FREE */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col"
            >
              <div className="text-white/40 text-sm font-medium uppercase tracking-wider mb-4">
                Free
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">$0</div>
              <div className="text-sm text-white/30 mb-6">Forever</div>
              <ul className="space-y-3 text-sm text-white/50 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <PricingCheck muted />
                  <span>3 generations</span>
                </li>
                <li className="flex items-start gap-3">
                  <PricingCheck muted />
                  <span>Basic styles</span>
                </li>
                <li className="flex items-start gap-3">
                  <PricingX />
                  <span className="text-white/30">All 94 styles</span>
                </li>
                <li className="flex items-start gap-3">
                  <PricingX />
                  <span className="text-white/30">2K quality</span>
                </li>
              </ul>
              <a
                href={PLAY_STORE}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] font-medium text-sm transition-[background-color] duration-200"
              >
                Get Started
              </a>
            </motion.div>

            {/* ANNUAL - BEST VALUE */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="relative glass rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col glow-border md:scale-[1.02]"
            >
              <div className="absolute -top-3 left-6 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                Best Value -- Save 86%
              </div>
              <div className="gradient-text text-sm font-medium uppercase tracking-wider mb-4">
                Annual
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl md:text-4xl font-bold">$59.99</span>
                <span className="text-sm text-white/30">/year</span>
              </div>
              <div className="text-sm text-fuchsia-400/70 mb-6">
                Just $1.15/week
              </div>
              <ul className="space-y-3 text-sm mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <PricingCheck />
                  <span>50 generations/week</span>
                </li>
                <li className="flex items-start gap-3">
                  <PricingCheck />
                  <span><strong className="text-white">All 94 styles</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <PricingCheck />
                  <span>2K quality output</span>
                </li>
                <li className="flex items-start gap-3">
                  <PricingCheck />
                  <span>3-day free trial</span>
                </li>
              </ul>
              <a
                href={PLAY_STORE}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 font-semibold text-sm cta-glow transition-[opacity,transform] duration-200 hover:scale-[1.02]"
              >
                Start Free Trial
              </a>
            </motion.div>

            {/* WEEKLY */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col"
            >
              <div className="text-white/40 text-sm font-medium uppercase tracking-wider mb-4">
                Weekly
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">$7.99</div>
              <div className="text-sm text-white/30 mb-6">/week</div>
              <ul className="space-y-3 text-sm text-white/50 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <PricingCheck />
                  <span>50 generations/week</span>
                </li>
                <li className="flex items-start gap-3">
                  <PricingCheck />
                  <span><strong className="text-white/70">All 94 styles</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <PricingCheck />
                  <span>2K quality output</span>
                </li>
                <li className="flex items-start gap-3">
                  <PricingCheck />
                  <span>3-day free trial</span>
                </li>
              </ul>
              <a
                href={PLAY_STORE}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] font-medium text-sm transition-[background-color] duration-200"
              >
                Start Free Trial
              </a>
            </motion.div>
          </div>

          <p className="text-center text-xs text-white/25 mt-6 max-w-xl mx-auto">
            Payment charged after 3-day free trial ends. Subscription auto-renews
            unless cancelled at least 24 hours before the end of the current period.
          </p>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* FAQ                                                                */}
      {/* ================================================================= */}
      <RevealSection id="faq" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Questions? Answers.
            </h2>
          </div>
          <div className="glass rounded-2xl md:rounded-3xl px-5 md:px-8 py-2">
            {FAQS.map((f, i) => (
              <FAQItem key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* FINAL CTA                                                          */}
      {/* ================================================================= */}
      <RevealSection className="py-24 md:py-32 relative">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-fuchsia-500/[0.05] rounded-full blur-[160px]" />
        </div>

        <div className="relative max-w-3xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            Ready to{' '}
            <span className="gradient-text">shift your vibe</span>?
          </h2>
          <p className="text-white/40 text-base md:text-lg mb-10 max-w-md mx-auto">
            Your next profile picture is one tap away. Start with 3 free generations.
          </p>
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-lg px-10 py-5 rounded-2xl cta-glow transition-[opacity,transform] duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            Download Free
          </a>
          <p className="text-sm text-white/25 mt-6">
            Available on Android. iOS coming soon.
          </p>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* FOOTER                                                             */}
      {/* ================================================================= */}
      <footer className="border-t border-white/[0.05] py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="VibeShift logo"
                className="w-7 h-7 rounded-lg"
              />
              <span className="font-semibold tracking-tight">VibeShift</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-white/35">
              <Link
                to="/privacy"
                className="hover:text-white/70 transition-[color] duration-200"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-white/70 transition-[color] duration-200"
              >
                Terms
              </Link>
              <a
                href="mailto:support@tryvibeshift.com"
                className="hover:text-white/70 transition-[color] duration-200"
              >
                Contact
              </a>
            </div>

            {/* Right */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex items-center gap-2 text-xs text-white/25">
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                Android &middot; iOS coming soon
              </div>
              <div className="text-xs text-white/20">
                &copy; {new Date().getFullYear()} VibeShift. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
