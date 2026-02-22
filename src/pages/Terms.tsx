import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Nav */}
      <nav className="border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center font-black text-sm">V</div>
            <span className="font-bold">VibeShift</span>
          </Link>
          <Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">&larr; Back to home</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: February 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By downloading, installing, or using the VibeShift application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Service Description</h2>
            <p>VibeShift is an AI-powered photo transformation service. The App uses artificial intelligence to generate styled versions of your photos across multiple aesthetic categories. Results are generated automatically and may vary.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
            <p>To use VibeShift, you must create an account using Google Sign-In or email authentication. You are responsible for maintaining the security of your account and for all activities that occur under it.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. User Content</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You retain full ownership of photos you upload to VibeShift</li>
              <li>By uploading photos, you grant us a limited, non-exclusive license to process them for the sole purpose of generating styled images</li>
              <li>You represent that you have the right to upload any photos you submit</li>
              <li>You must not upload photos of others without their consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Generated Content</h2>
            <p>AI-generated images created through VibeShift are yours to use for personal and commercial purposes, subject to the following:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>You are responsible for ensuring your use complies with applicable laws</li>
              <li>Generated images should not be used to deceive, defraud, or impersonate others</li>
              <li>You acknowledge that AI-generated content may contain imperfections</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Subscriptions & Payments</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>VibeShift offers free and paid tiers</li>
              <li>Subscriptions are billed through Google Play's billing system</li>
              <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
              <li>You can manage and cancel your subscription through Google Play settings</li>
              <li>Refunds are subject to Google Play's refund policy</li>
              <li>We reserve the right to change pricing with reasonable notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Credits System</h2>
            <p>VibeShift uses a credits system for photo generation:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Free users receive a limited number of credits</li>
              <li>Subscribers receive credits according to their plan</li>
              <li>Credits are non-transferable and non-refundable</li>
              <li>Unused credits may expire according to your plan terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Prohibited Use</h2>
            <p>You may not use VibeShift to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Create illegal, harmful, threatening, or discriminatory content</li>
              <li>Generate explicit or pornographic material</li>
              <li>Impersonate other people or create deepfakes for malicious purposes</li>
              <li>Attempt to reverse-engineer or interfere with the service</li>
              <li>Circumvent usage limits or credits system</li>
              <li>Use automated tools to access the service</li>
            </ul>
            <p className="mt-3">We reserve the right to terminate accounts that violate these terms without prior notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Intellectual Property</h2>
            <p>The VibeShift App, including its design, features, AI models, and brand elements, is the intellectual property of VibeShift. You may not copy, modify, distribute, or create derivative works from the App.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Limitation of Liability</h2>
            <p>VibeShift is provided "as is" without warranties of any kind. We are not liable for:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Any damages arising from use or inability to use the service</li>
              <li>Quality or accuracy of AI-generated images</li>
              <li>Loss of data or unauthorized access to your account</li>
              <li>Temporary service interruptions or outages</li>
            </ul>
            <p className="mt-3">Our total liability shall not exceed the amount you paid for the service in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Modifications</h2>
            <p>We may modify these Terms at any time. Continued use of the App after changes constitutes acceptance of the revised Terms. We will notify users of significant changes through the App.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Governing Law</h2>
            <p>These Terms are governed by applicable law. Any disputes shall be resolved through binding arbitration or in the courts of the jurisdiction where VibeShift operates.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:support@tryvibeshift.com" className="text-fuchsia-400 hover:underline">support@tryvibeshift.com</a></p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-sm text-white/30">
          <span>&copy; {new Date().getFullYear()} VibeShift</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-white/50">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
