import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy - VibeShift'
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-sans">
      {/* Nav */}
      <nav className="border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="VibeShift logo" className="w-8 h-8 rounded-lg" />
            <span className="font-bold">VibeShift</span>
          </Link>
          <Link to="/" className="text-sm text-white/50 hover:text-white transition-[color] duration-200">&larr; Back to home</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: February 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>When you use VibeShift, we collect:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Your email address and name (via Google Sign-In)</li>
              <li>Photos you upload for AI processing</li>
              <li>Usage data (styles used, generation count) to improve our service</li>
              <li>Device information (OS version, app version) for bug fixes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Data</h2>
            <p>Your data is used to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Generate AI-styled photos based on your uploads</li>
              <li>Manage your account, credits, and subscription</li>
              <li>Improve our AI models and service quality</li>
              <li>Send important service notifications</li>
            </ul>
            <p className="mt-3">We do <strong className="text-white">not</strong> sell or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Photo Processing & Storage</h2>
            <p>When you upload a photo:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Your photo is sent securely to our AI processing servers</li>
              <li>Original uploads are deleted after processing is complete</li>
              <li>Generated (transformed) images are stored in your private account</li>
              <li>You can delete any generated image at any time</li>
              <li>Photos are hosted on Cloudinary with industry-standard encryption</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p>We use the following trusted services:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong className="text-white">Google Sign-In</strong> - Authentication</li>
              <li><strong className="text-white">Google Play Billing</strong> - Payment processing (we never store your card details)</li>
              <li><strong className="text-white">Google AI (Gemini)</strong> - Photo generation</li>
              <li><strong className="text-white">Supabase</strong> - Secure database storage</li>
              <li><strong className="text-white">Cloudinary</strong> - Image hosting</li>
            </ul>
            <p className="mt-3">Each service has its own privacy policy. We encourage you to review them.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Security</h2>
            <p>We protect your data with:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>HTTPS encryption for all data transfers</li>
              <li>Row-Level Security (RLS) on our database</li>
              <li>JWT-based authentication for API access</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Access your personal data</li>
              <li>Delete your account and all associated data</li>
              <li>Export your generated images</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:support@tryvibeshift.com" className="text-fuchsia-400 hover:underline">support@tryvibeshift.com</a>. We process deletion requests within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Children's Privacy</h2>
            <p>VibeShift is not intended for users under 13 years of age. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify users of significant changes through the app or via email.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact Us</h2>
            <p>For privacy-related questions or concerns:</p>
            <p className="mt-2">Email: <a href="mailto:support@tryvibeshift.com" className="text-fuchsia-400 hover:underline">support@tryvibeshift.com</a></p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/[0.05] py-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-sm text-white/30">
          <span>&copy; {new Date().getFullYear()} VibeShift</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-white/50">Privacy</Link>
            <Link to="/terms" className="hover:text-white/50 transition-[color] duration-200">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
