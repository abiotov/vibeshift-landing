import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  Upload,
  Paintbrush,
  Download,
  ChevronDown,
  Heart,
  Sparkles,
  TrendingUp,
  Camera,
  Smile,
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

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const DATING_APPS = [
  {
    title: 'Tinder',
    desc: 'First impressions happen in milliseconds. A polished photo gets more right swipes.',
  },
  {
    title: 'Hinge',
    desc: 'Hinge profiles thrive on authentic-looking photos with great lighting and angles.',
  },
  {
    title: 'Bumble',
    desc: 'Stand out in her feed with photos that show confidence and personality.',
  },
  {
    title: 'Coffee Meets Bagel',
    desc: 'Quality over quantity -- a refined profile photo attracts more meaningful matches.',
  },
]

const WHY_AI_WORKS = [
  {
    icon: Camera,
    title: 'Natural-looking results',
    desc: 'Our AI creates photos that look authentic, not staged. No one will know it was AI -- they will just think you have a great photographer friend.',
  },
  {
    icon: Sparkles,
    title: 'Variety of styles',
    desc: 'Get outdoor shots, indoor vibes, casual and dressy looks -- all from one selfie. Dating experts recommend 5-6 varied photos in your profile.',
  },
  {
    icon: Smile,
    title: 'No awkward photoshoot',
    desc: 'Skip the uncomfortable experience of posing for a stranger. Upload from your couch and get results in 30 seconds.',
  },
]

const STEPS = [
  {
    icon: Upload,
    title: 'Upload a selfie',
    desc: 'One clear photo is all you need. Natural lighting works best.',
  },
  {
    icon: Paintbrush,
    title: 'Pick a dating style',
    desc: 'Choose from dating-optimized styles designed to get more matches.',
  },
  {
    icon: Download,
    title: 'Download and match',
    desc: 'Your new dating photos are ready in 30 seconds. Upload to any app.',
  },
]

const FAQS = [
  {
    q: 'Will my matches know the photos are AI-generated?',
    a: 'Our AI creates photorealistic results that look natural and authentic. The photos preserve your real facial features and likeness -- they just present you with better lighting, angles, and styling. Think of it as having access to a professional photographer, not creating a fake version of yourself.',
  },
  {
    q: 'Which dating apps work best with AI photos?',
    a: 'AI-enhanced photos work great on all major dating apps including Tinder, Hinge, Bumble, Coffee Meets Bagel, and others. The key is variety -- upload 5-6 different styles to show different sides of your personality.',
  },
  {
    q: 'Are AI dating photos considered catfishing?',
    a: 'No. AI dating photos enhance your existing appearance with better lighting and styling -- similar to wearing nice clothes or getting a good haircut for a photoshoot. Your facial features remain the same. It is no different from using a professional photographer, just faster and more affordable.',
  },
  {
    q: 'How many dating photos should I generate?',
    a: 'Dating experts recommend 5-6 photos for your profile. With VibeShift, you can generate multiple variations in different styles -- casual, outdoor, dressed up, and activity-based -- to create a well-rounded profile that shows your personality.',
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
        alt={`${styleName} AI dating photo result`}
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
  const id = `faq-dating-${index}`

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
export default function AiDatingPhotos() {
  useEffect(() => {
    document.title = 'AI Dating Photos - Get More Matches with Better Profile Pictures | VibeShift'
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Create stunning AI dating photos for Tinder, Hinge, Bumble. Profiles with great photos get 3x more matches. Transform any selfie in 30 seconds. Try free.',
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
              to="/ai-headshot-generator"
              className="text-sm text-white/50 hover:text-white px-4 py-2 rounded-lg transition-[color] duration-200"
            >
              Headshots
            </Link>
            <Link
              to="/ai-photo-styles"
              className="text-sm text-white/50 hover:text-white px-4 py-2 rounded-lg transition-[color] duration-200"
            >
              Styles
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
                  <Heart className="w-3.5 h-3.5 text-fuchsia-400" aria-hidden="true" />
                  More matches, guaranteed
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight mb-5 md:mb-6"
              >
                AI Dating Photos{' '}
                <span className="gradient-text">Get More Matches with Better Profile Pictures</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-lg md:text-xl text-white/45 max-w-lg mx-auto lg:mx-0 mb-8 md:mb-10 leading-relaxed"
              >
                Your profile photo is the #1 factor in getting matches on dating apps.
                Profiles with professional-quality photos get 3x more matches on average.
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
                  Create Your Dating Photos Free
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex items-center gap-6 md:gap-8 mt-10 md:mt-12 justify-center lg:justify-start"
              >
                {[
                  { value: '3x', label: 'More matches' },
                  { value: '<30s', label: 'Per photo' },
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
                  beforeSrc={beforeImg('femme_arabe')}
                  afterSrc={styleImg('dating')}
                  styleName="Dating Profile"
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
      {/* STATS SECTION                                                      */}
      {/* ================================================================= */}
      <RevealSection className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <motion.div
            className="glass rounded-2xl md:rounded-3xl p-8 md:p-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            custom={0}
          >
            <TrendingUp className="w-8 h-8 text-fuchsia-400 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Profiles with professional photos get{' '}
              <span className="gradient-text">3x more matches</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              Studies consistently show that photo quality is the single most important factor
              in online dating success. Better photos lead to more right swipes, more messages,
              and more meaningful connections.
            </p>
          </motion.div>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* SECOND BEFORE/AFTER                                                */}
      {/* ================================================================= */}
      <RevealSection className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Look your best.{' '}
                <span className="gradient-text">Without trying too hard.</span>
              </h2>
              <p className="text-white/40 max-w-lg mx-auto lg:mx-0 text-base md:text-lg leading-relaxed">
                The best dating photos look effortless. Our AI creates natural, authentic-looking
                shots with great lighting and flattering angles -- the kind of photos that
                get right swipes because you look like yourself on your best day.
              </p>
            </div>
            <div className="relative max-w-sm mx-auto lg:max-w-none lg:mx-0 w-full">
              <div className="rounded-2xl overflow-hidden glow-pink">
                <BeforeAfterSlider
                  beforeSrc={beforeImg('homme_blanc')}
                  afterSrc={styleImg('dating')}
                  styleName="Dating Profile"
                />
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* PERFECT FOR                                                        */}
      {/* ================================================================= */}
      <RevealSection className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Perfect for Every Dating App
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              Create photos optimized for the platform you use most.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {DATING_APPS.map((app, i) => (
              <motion.div
                key={app.title}
                variants={fadeUp}
                custom={i}
                className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 group hover:border-fuchsia-500/15 transition-[border-color] duration-500"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500/15 to-pink-500/10 border border-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 mb-5 group-hover:scale-110 transition-[transform] duration-500">
                  <Heart className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{app.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm md:text-base">
                  {app.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* WHY AI DATING PHOTOS WORK                                          */}
      {/* ================================================================= */}
      <RevealSection className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Why AI Dating Photos Work
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              Better photos without the awkward photoshoot.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {WHY_AI_WORKS.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i}
                  className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 group hover:border-fuchsia-500/15 transition-[border-color] duration-500"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500/15 to-pink-500/10 border border-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-[transform] duration-500">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
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
              Dating Photos in 3 Steps
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              From selfie to swipe-worthy in under a minute.
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
      {/* FAQ                                                                */}
      {/* ================================================================= */}
      <RevealSection className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              AI Dating Photos FAQ
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
            Ready to{' '}
            <span className="gradient-text">get more matches</span>?
          </h2>
          <p className="text-white/40 text-base md:text-lg mb-10 max-w-md mx-auto">
            Upload a selfie and create dating photos that actually work. Start with 3 free generations.
          </p>
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-lg px-10 py-5 rounded-2xl cta-glow transition-[opacity,transform] duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            Create Your Dating Photos Free
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
                to="/ai-headshot-generator"
                className="hover:text-white/70 transition-[color] duration-200"
              >
                Headshots
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
