import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - SR ZapShare',
  description: 'Terms of service for SR ZapShare secure P2P file transfer',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Terms of Service</h1>
        
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By using SR ZapShare, you agree to these Terms of Service. If you don&apos;t agree, 
              please don&apos;t use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="mb-2">
              SR ZapShare is a peer-to-peer file transfer application that enables you to send 
              files directly between devices without server storage. We provide:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Signaling service to establish P2P connections</li>
              <li>Web interface for initiating transfers</li>
              <li>Code generation for secure connections</li>
              <li>File integrity verification (SHA-256 hashing)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
            <p className="mb-2">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Use SR ZapShare legally</strong>: Don&apos;t send illegal, harmful, or copyrighted content without permission</li>
              <li><strong>Respect others</strong>: Don&apos;t use SR ZapShare to harass, spam, or harm others</li>
              <li><strong>Keep codes private</strong>: Only share your Warp Code with intended recipients</li>
              <li><strong>Accept risks</strong>: While we provide SHA-256 verification, you&apos;re responsible for verifying file sources</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Uses</h2>
            <p className="mb-2">You may NOT use SR ZapShare to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Transfer illegal content (malware, pirated software, etc.)</li>
              <li>Violate intellectual property rights</li>
              <li>Distribute spam or phishing content</li>
              <li>Attempt to hack, reverse-engineer, or abuse the service</li>
              <li>Transfer files that violate export control laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Service Availability</h2>
            <p>
              SR ZapShare is provided &quot;as is&quot; without warranties. We strive for high availability, 
              but we don&apos;t guarantee uninterrupted service. We may modify or discontinue features 
              at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
            <p className="mb-2">
              SR ZapShare is not liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Loss of data during transfer</li>
              <li>Corrupted or tampered files</li>
              <li>Actions of other users</li>
              <li>Technical failures or connection issues</li>
              <li>Any damages resulting from use of the service</li>
            </ul>
            <p className="mt-4 font-bold">
              Maximum liability: $0 (since the service is free)
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Privacy</h2>
            <p>
              Your use of SR ZapShare is subject to our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. 
              Summary: We don&apos;t store your files or personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Intellectual Property</h2>
            <p>
              SR ZapShare&apos;s code, design, and branding are protected by copyright. However, the 
              source code is open-source under the MIT License. You may fork, modify, and distribute 
              the code according to the license terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to SR ZapShare for violations 
              of these terms, without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
            <p>
              These terms are governed by the laws of [Your Jurisdiction]. Any disputes will be 
              resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of SR ZapShare after changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact</h2>
            <p>
              Questions about these terms? Contact us at: <strong>contact@sreekarreddy.com</strong>
            </p>
          </section>

          <section className="border-t border-slate-700 pt-6">
            <p className="text-sm text-slate-400">
              Last updated: December 7, 2025
            </p>
          </section>

          <div className="mt-12">
            <Link href="/" className="text-primary hover:underline">← Back to SR ZapShare</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
