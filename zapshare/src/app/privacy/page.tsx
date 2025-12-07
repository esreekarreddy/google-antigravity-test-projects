import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - SR ZapShare',
  description: 'Privacy policy for SR ZapShare secure P2P file transfer',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Privacy Policy</h1>
        
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Our Commitment to Privacy</h2>
            <p>
              At SR ZapShare, privacy isn&apos;t just a feature—it&apos;s our foundation. We built this application 
              with a simple principle: <strong>your files are yours, and only yours</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What We DON&apos;T Collect</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Your Files</strong>: Files never touch our servers. They stream directly between devices using WebRTC.</li>
              <li><strong>Personal Information</strong>: No name, email, or account required.</li>
              <li><strong>Transfer History</strong>: We don&apos;t log what files you send or receive.</li>
              <li><strong>IP Addresses</strong>: The PeerJS signaling server sees IPs temporarily to establish connections, but we don&apos;t store them.</li>
              <li><strong>Tracking Cookies</strong>: No advertising or analytics cookies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What We DO Collect</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Anonymous Usage Statistics</strong>: Basic metrics like page views (via privacy-friendly analytics) to improve the service.</li>
              <li><strong>Temporary Connection Data</strong>: The PeerJS signaling server temporarily holds connection metadata to help devices find each other. This data is deleted immediately after connection is established.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How SR ZapShare Works</h2>
            <p className="mb-4">
              To understand our privacy guarantees, it&apos;s important to understand how SR ZapShare works:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>You drop a file → A random code is generated (&quot;Pulsar-Moon&quot;)</li>
              <li>Your friend enters that code</li>
              <li>A signaling server (PeerJS) helps you find each other on the internet</li>
              <li>You connect <strong>directly</strong> via WebRTC (peer-to-peer)</li>
              <li>The file streams <strong>encrypted</strong> from you → them</li>
              <li>No server ever sees the file content</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
            <p className="mb-2"><strong>PeerJS Cloud Signaling</strong>:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Used to establish peer-to-peer connections</li>
              <li>Temporarily sees connection metadata (not file content)</li>
              <li>Open-source and publicly auditable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
            <p>
              <strong>Zero retention</strong>. Files are never stored. Connection metadata is deleted 
              immediately after your transfer completes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
            <p className="mb-2">Since we don&apos;t collect personal data, there&apos;s nothing to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Request access to</li>
              <li>Request deletion of</li>
              <li>Request correction of</li>
            </ul>
            <p className="mt-4">
              However, if you have any privacy concerns, contact us at: <strong>contact@sreekarreddy.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We&apos;ll notify users of significant 
              changes via the application.
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
