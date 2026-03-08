import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  Upload,
  Paintbrush,
  Download,
  ChevronDown,
  Briefcase,
  FileText,
  Globe,
  Mail,
  Sparkles,
  Camera,
  DollarSign,
  Smartphone,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SB = 'https://supabase.tryvibeshift.com/storage/v1/object/public/style-previews'
const styleImg = (styleId: string) => `${SB}/after/${styleId}.jpg`
const beforeImg = (modelId: string) => `${SB}/before/${modelId}.jpg`

const PLAY_STORE =
  'https://play.google.com/store/apps/details?id=com.vibeshift.app'

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

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
// Data
// ---------------------------------------------------------------------------
const USE_CASES = [
  {
    icon: Briefcase,
    title: 'LinkedIn',
    desc: 'Stand out with a polished, professional headshot that makes recruiters stop scrolling.',
  },
  {
    icon: FileText,
    title: 'Resume',
    desc: 'Add a professional photo to your CV that conveys competence and confidence.',
  },
  {
    icon: Globe,
    title: 'Company Website',
    desc: 'Consistent, high-quality team photos without scheduling a group photoshoot.',
  },
  {
    icon: Mail,
    title: 'Email Signature',
    desc: 'A clean headshot in your email footer builds trust before the first meeting.',
  },
]

const STEPS = [
  {
    icon: Upload,
    title: 'Upload a selfie',
    desc: 'One clear photo is all you need. No studio, no prep, no special lighting.',
  },
  {
    icon: Paintbrush,
    title: 'Choose a headshot style',
    desc: 'CEO, Corporate, Startup Founder, Professional -- pick the look that fits your industry.',
  },
  {
    icon: Download,
    title: 'Download instantly',
    desc: 'Your AI headshot is ready in under 30 seconds. Use it anywhere.',
  },
]

const FAQS = [
  {
    q: 'Are AI headshots appropriate for LinkedIn?',
    a: 'Yes. AI-generated headshots are widely accepted on LinkedIn and other professional platforms. Many professionals and executives already use AI headshots for their profiles. The key is choosing a natural, professional style -- which is exactly what VibeShift delivers.',
  },
  {
    q: 'How realistic are AI-generated headshots?',
    a: 'Our AI produces photorealistic results that are virtually indistinguishable from studio photos. It preserves your facial features, bone structure, and likeness while enhancing lighting, background, and composition to professional standards.',
  },
  {
    q: 'Can I use AI headshots on my resume?',
    a: 'Absolutely. All images generated with VibeShift are yours to use for any personal or commercial purpose. Many job seekers use AI headshots on resumes, cover letters, and professional portfolios.',
  },
  {
    q: 'How many headshot styles are available?',
    a: 'VibeShift offers multiple professional headshot styles including CEO Portrait, Corporate, Startup Founder, Professional Photos, and more. In total, the app includes 149 AI styles across 20 categories, so you can find the perfect look for any professional context.',
  },
]

// ---------------------------------------------------------------------------
// Before/After Slider
// ---------------------------------------------------------------------------
function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  styleName,
  priority = false,
}: {
  beforeSrc: string
  afterSrc: string
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
      <img
        src={afterSrc}
        alt={`${styleName} AI headshot result`}
        className="absolute inset-0 w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeSrc}
          alt={`Original photo before ${styleName} transformation`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white shadow-lg flex items-center justify-center transition-[transform] duration-200 group-hover:scale-110">
          <div className="flex items-center gap-0.5">
            <ChevronDown className="w-3.5 h-3.5 text-gray-800 -rotate-90" />
            <ChevronDown className="w-3.5 h-3.5 text-gray-800 rotate-90" />
          </div>
        </div>
      </div>
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
  const id = `faq-headshot-${index}`

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
// Page
// ---------------------------------------------------------------------------
export default function AiHeadshotGenerator() {
  useEffect(() => {
    document.title = 'AI Headshot Generator - Professional Portraits in 30 Seconds | VibeShift'
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Generate professional AI headshots from any selfie in 30 seconds. Perfect for LinkedIn, resumes, and company websites. Skip the $200+ photoshoot. Try free.',
      )
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-sans overflow-x-hidden noise">
      {/* ================================================================= */}
      {/* NAV                                                                */}
      {/* ================================================================= */}
      <nav className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-16 md:h-[72px]">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/logo.png"
              alt="VibeShift logo"
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl"
            />
            <span className="text-lg font-bold tracking-tight">VibeShift</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="text-sm text-white/50 hover:text-white px-4 py-2 rounded-lg transition-[color] duration-200"
            >
              Home
            </Link>
            <Link
              to="/ai-photo-styles"
              className="text-sm text-white/50 hover:text-white px-4 py-2 rounded-lg transition-[color] duration-200"
            >
              Styles
            </Link>
            <Link
              to="/ai-dating-photos"
              className="text-sm text-white/50 hover:text-white px-4 py-2 rounded-lg transition-[color] duration-200"
            >
              Dating Photos
            </Link>
          </div>
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] px-5 py-2 rounded-xl transition-[background-color] duration-200"
          >
            Download
          </a>
        </div>
      </nav>

      {/* ================================================================= */}
      {/* HERO                                                               */}
      {/* ================================================================= */}
      <header className="relative pt-20 pb-16 md:pt-28 lg:pt-32 md:pb-24 overflow-hidden">
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
              <motion.div variants={fadeUp} custom={0}>
                <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-white/60 mb-6 md:mb-8">
                  <Camera className="w-3.5 h-3.5 text-fuchsia-400" aria-hidden="true" />
                  Skip the $200+ photoshoot
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight mb-5 md:mb-6"
              >
                AI Headshot Generator{' '}
                <span className="gradient-text">Professional Portraits in 30 Seconds</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-lg md:text-xl text-white/45 max-w-lg mx-auto lg:mx-0 mb-8 md:mb-10 leading-relaxed"
              >
                Turn any selfie into a studio-quality professional headshot. No photographer,
                no studio booking, no waiting. Your next LinkedIn photo is 30 seconds away.
              </motion.p>

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
                  Generate Your AI Headshot Free
                </a>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex items-center gap-6 md:gap-8 mt-10 md:mt-12 justify-center lg:justify-start"
              >
                {[
                  { value: '<30s', label: 'Generation time' },
                  { value: '149', label: 'Styles' },
                  { value: '$0', label: 'To start' },
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

            {/* Right - Before/After */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="relative max-w-sm mx-auto lg:max-w-none lg:mx-0 w-full"
            >
              <div className="relative rounded-2xl overflow-hidden glow-pink">
                <BeforeAfterSlider
                  beforeSrc={beforeImg('homme_blanc')}
                  afterSrc={styleImg('ceo-headshots')}
                  styleName="CEO Portrait"
                  priority
                />
              </div>
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
      {/* SECOND BEFORE/AFTER                                                */}
      {/* ================================================================= */}
      <RevealSection className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative max-w-sm mx-auto lg:max-w-none lg:mx-0 w-full order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden glow-pink">
                <BeforeAfterSlider
                  beforeSrc={beforeImg('femme_noire')}
                  afterSrc={styleImg('professional-photos')}
                  styleName="Professional"
                />
              </div>
            </div>
            <div className="text-center lg:text-left order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Your face.{' '}
                <span className="gradient-text">Studio-quality lighting.</span>
              </h2>
              <p className="text-white/40 max-w-lg mx-auto lg:mx-0 text-base md:text-lg leading-relaxed">
                The AI analyzes your unique features and recreates them with professional
                lighting, clean backgrounds, and polished composition. The result is a headshot
                that looks like it came from a $500 photography session.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* USE CASES                                                          */}
      {/* ================================================================= */}
      <RevealSection className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Professional Headshots for Every Platform
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              One selfie, unlimited professional possibilities.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {USE_CASES.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i}
                  className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 group hover:border-fuchsia-500/15 transition-[border-color] duration-500"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500/15 to-pink-500/10 border border-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 mb-5 group-hover:scale-110 transition-[transform] duration-500">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/40 leading-relaxed text-sm md:text-base">
                    {item.desc}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* HOW IT WORKS                                                       */}
      {/* ================================================================= */}
      <RevealSection className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              AI Headshot Generation in 3 Steps
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              No photoshoot. No editing skills. No waiting.
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
      {/* PRICING COMPARISON                                                 */}
      {/* ================================================================= */}
      <RevealSection className="py-20 md:py-28 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-fuchsia-500/[0.03] rounded-full blur-[180px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Professional Headshots Without the Professional Price
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              Save hundreds compared to a traditional photography session.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {/* Traditional */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="glass rounded-2xl md:rounded-3xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30">
                  <Camera className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-white/60">Traditional Photoshoot</div>
                  <div className="text-sm text-white/30">The old way</div>
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white/40 mb-6">$200 - $500</div>
              <ul className="space-y-3 text-sm text-white/30">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                  <span>Requires scheduling and travel</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                  <span>Results in 1-2 weeks</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                  <span>5-10 final photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                  <span>One style per session</span>
                </li>
              </ul>
            </motion.div>

            {/* VibeShift */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="relative glass rounded-2xl md:rounded-3xl p-6 md:p-8 glow-border"
            >
              <div className="absolute -top-3 left-6 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                Save $200+
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/15 to-pink-500/10 border border-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold">VibeShift AI</div>
                  <div className="text-sm text-fuchsia-400/60">The smart way</div>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl md:text-4xl font-bold">Free</span>
                <span className="text-sm text-white/30">to start</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-fuchsia-500/15 text-fuchsia-400 flex items-center justify-center shrink-0 mt-0.5">
                    <DollarSign className="w-3 h-3" />
                  </div>
                  <span>No booking, no travel, no prep</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-fuchsia-500/15 text-fuchsia-400 flex items-center justify-center shrink-0 mt-0.5">
                    <DollarSign className="w-3 h-3" />
                  </div>
                  <span>Results in 30 seconds</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-fuchsia-500/15 text-fuchsia-400 flex items-center justify-center shrink-0 mt-0.5">
                    <DollarSign className="w-3 h-3" />
                  </div>
                  <span>Up to 20 generations per week</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-fuchsia-500/15 text-fuchsia-400 flex items-center justify-center shrink-0 mt-0.5">
                    <DollarSign className="w-3 h-3" />
                  </div>
                  <span>149 styles across 20 categories</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* FAQ                                                                */}
      {/* ================================================================= */}
      <RevealSection className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              AI Headshot Generator FAQ
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
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-fuchsia-500/[0.05] rounded-full blur-[160px]" />
        </div>

        <div className="relative max-w-3xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            Ready for your{' '}
            <span className="gradient-text">professional headshot</span>?
          </h2>
          <p className="text-white/40 text-base md:text-lg mb-10 max-w-md mx-auto">
            Upload a selfie and get a studio-quality headshot in under 30 seconds. Start with 3 free generations.
          </p>
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-lg px-10 py-5 rounded-2xl cta-glow transition-[opacity,transform] duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            Generate Your AI Headshot Free
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
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="VibeShift logo"
                className="w-7 h-7 rounded-lg"
              />
              <span className="font-semibold tracking-tight">VibeShift</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/35">
              <Link
                to="/"
                className="hover:text-white/70 transition-[color] duration-200"
              >
                Home
              </Link>
              <Link
                to="/ai-photo-styles"
                className="hover:text-white/70 transition-[color] duration-200"
              >
                Styles
              </Link>
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
