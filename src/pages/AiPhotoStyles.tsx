import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ChevronDown,
  Sparkles,
  Briefcase,
  Camera,
  Palette,
  ShoppingBag,
  Heart,
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
const BENTO_ITEMS: { id: string; name: string; size: 'lg' | 'sm'; image: string }[] = [
  { id: 'ceo-headshots', name: 'CEO', size: 'lg', image: styleImg('ceo-headshots') },
  { id: 'vogue', name: 'Vogue', size: 'sm', image: styleImg('vogue') },
  { id: 'dark-academia', name: 'Dark Academia', size: 'sm', image: styleImg('dark-academia') },
  { id: 'cinematic-portrait', name: 'Cinematic', size: 'lg', image: styleImg('cinematic-portrait') },
  { id: 'instagram-worthy', name: 'Instagram', size: 'sm', image: styleImg('instagram-worthy') },
  { id: 'clean-girl', name: 'Clean Girl', size: 'sm', image: styleImg('clean-girl') },
  { id: 'startup-founder', name: 'Founder', size: 'lg', image: styleImg('startup-founder') },
  { id: 'dating', name: 'Dating', size: 'sm', image: styleImg('dating') },
  { id: 'streetwear-cool', name: 'Streetwear', size: 'sm', image: styleImg('streetwear-cool') },
  { id: 'luxury-lifestyle', name: 'Luxury', size: 'lg', image: styleImg('luxury-lifestyle') },
  { id: 'soft-aesthetic', name: 'Soft', size: 'sm', image: styleImg('soft-aesthetic') },
  { id: 'film-noir', name: 'Film Noir', size: 'sm', image: styleImg('film-noir') },
]

const CATEGORIES = [
  {
    icon: Briefcase,
    title: 'Professional',
    styles: ['CEO Headshots', 'Corporate', 'Startup Founder', 'Professional Photos'],
  },
  {
    icon: Camera,
    title: 'Social Media',
    styles: ['Instagram-Worthy', 'Clean Girl', 'Soft Aesthetic', 'Influencer'],
  },
  {
    icon: Palette,
    title: 'Creative',
    styles: ['Dark Academia', 'Film Noir', 'Cinematic Portrait', 'Vintage Film'],
  },
  {
    icon: ShoppingBag,
    title: 'Fashion',
    styles: ['Vogue Editorial', 'Streetwear Cool', 'Luxury Lifestyle', 'High Fashion'],
  },
  {
    icon: Heart,
    title: 'Lifestyle',
    styles: ['Dating Profile', 'Travel Portrait', 'Golden Hour', 'Beach Vibes'],
  },
]

const FAQS = [
  {
    q: 'How many AI photo styles does VibeShift have?',
    a: 'VibeShift currently offers 149 AI photo styles organized across 20 categories. From professional headshots to creative art styles, dating profile photos to fashion editorial looks -- there is a style for every mood and purpose.',
  },
  {
    q: 'Can I preview styles before generating?',
    a: 'Yes. Each style includes preview examples so you can see the aesthetic before using one of your generations. Browse all 149 styles in the app and find the perfect look.',
  },
  {
    q: 'Are new styles added regularly?',
    a: 'We continuously add new AI photo styles based on trends and user requests. The style library grows regularly, and all new styles are immediately available to subscribers.',
  },
  {
    q: 'Can I customize a style?',
    a: 'Yes. Beyond choosing from 149 preset styles, you can add custom edit prompts to further refine the look. Adjust the mood, setting, or details to get exactly the result you want.',
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
        alt={`${styleName} AI photo style result`}
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
  const id = `faq-styles-${index}`

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
export default function AiPhotoStyles() {
  useEffect(() => {
    document.title = '149 AI Photo Styles - Transform Any Selfie into Art | VibeShift'
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Explore 149 AI photo styles across 20 categories. From professional headshots to creative art, dating photos to fashion editorial. Transform any selfie in 30 seconds.',
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

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 text-sm text-white/60 mb-6 md:mb-8">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" aria-hidden="true" />
                149 styles across 20 categories
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-5 md:mb-6 max-w-4xl mx-auto"
            >
              149 AI Photo Styles{' '}
              <span className="gradient-text">Transform Any Selfie into Art</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-white/45 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed"
            >
              From professional headshots to creative portraits, fashion editorial to dating
              profile photos. One selfie, 149 possibilities. Results in 30 seconds.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center"
            >
              <a
                href={PLAY_STORE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-2xl cta-glow transition-[opacity,transform] duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                Explore All 149 Styles Free
              </a>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* BENTO GRID GALLERY                                                 */}
      {/* ================================================================= */}
      <RevealSection className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              AI Photo Style Gallery
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              Preview a selection of our most popular styles. Every style is available in the app.
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
                  src={item.image}
                  alt={`${item.name} AI photo style example`}
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
      {/* STYLE CATEGORIES                                                   */}
      {/* ================================================================= */}
      <RevealSection className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Style Categories for Every Occasion
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              20 curated categories to match any mood, platform, or purpose.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon
              return (
                <motion.div
                  key={cat.title}
                  variants={fadeUp}
                  custom={i}
                  className="glass rounded-2xl md:rounded-3xl p-6 group hover:border-fuchsia-500/15 transition-[border-color] duration-500"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/15 to-pink-500/10 border border-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 mb-4 group-hover:scale-110 transition-[transform] duration-500">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold mb-3">{cat.title}</h3>
                  <ul className="space-y-1.5">
                    {cat.styles.map((style) => (
                      <li
                        key={style}
                        className="text-sm text-white/40 flex items-center gap-2"
                      >
                        <div className="w-1 h-1 rounded-full bg-fuchsia-500/40 shrink-0" />
                        {style}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </RevealSection>

      {/* ================================================================= */}
      {/* BEFORE/AFTER                                                       */}
      {/* ================================================================= */}
      <RevealSection className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Same Person, Different Style
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg">
              See how different AI photo styles transform the same selfie.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={scaleIn} className="glass rounded-2xl p-2 md:p-3">
              <BeforeAfterSlider
                beforeSrc={beforeImg('homme_asiatique')}
                afterSrc={styleImg('dark-academia')}
                styleName="Dark Academia"
              />
            </motion.div>
            <motion.div variants={scaleIn} className="glass rounded-2xl p-2 md:p-3">
              <BeforeAfterSlider
                beforeSrc={beforeImg('femme_noire')}
                afterSrc={styleImg('vogue')}
                styleName="Vogue Editorial"
              />
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
              AI Photo Styles FAQ
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
            149 styles.{' '}
            <span className="gradient-text">Which one is you?</span>
          </h2>
          <p className="text-white/40 text-base md:text-lg mb-10 max-w-md mx-auto">
            Explore every style and find your next look. Start with 3 free generations.
          </p>
          <a
            href={PLAY_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold text-lg px-10 py-5 rounded-2xl cta-glow transition-[opacity,transform] duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            Explore All 149 Styles Free
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
                to="/ai-dating-photos"
                className="hover:text-white/70 transition-[color] duration-200"
              >
                Dating
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
