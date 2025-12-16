import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for SR TypeRace - Terminal Typing Speed Game',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <article className="terminal-panel p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-green-400 terminal-glow mb-6">Privacy Policy</h1>
          
          <p className="text-gray-400 mb-6">
            <strong>Last updated:</strong> December 2025
          </p>

          <section className="space-y-6 text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">1. Overview</h2>
              <p>
                SR TypeRace (&quot;we&quot;, &quot;our&quot;, or &quot;the application&quot;) is a typing speed game 
                that operates entirely in your web browser. We are committed to protecting your privacy 
                and being transparent about our data practices.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">2. Data We Collect</h2>
              <p className="mb-2"><strong>We do not collect any personal data.</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>No account registration required</li>
                <li>No cookies or tracking</li>
                <li>No analytics or telemetry</li>
                <li>No server-side data storage</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">3. Local Storage</h2>
              <p>
                Your typing statistics (WPM history, personal bests, streaks) are stored locally 
                in your browser using localStorage. This data:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 mt-2">
                <li>Never leaves your device</li>
                <li>Is not accessible to us or any third party</li>
                <li>Can be cleared by you at any time via browser settings</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">4. Multiplayer Mode</h2>
              <p>
                When using peer-to-peer multiplayer mode, connections are established directly 
                between browsers using WebRTC. The signaling server (PeerJS) is used only to 
                establish the initial connection and does not store any race data.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">5. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 mt-2">
                <li><strong>Google Fonts:</strong> To load the JetBrains Mono font</li>
                <li><strong>PeerJS:</strong> For WebRTC signaling in multiplayer mode (optional)</li>
                <li><strong>Vercel:</strong> For hosting the application</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">6. Children&apos;s Privacy</h2>
              <p>
                This application is suitable for users of all ages. We do not knowingly collect 
                any information from children or any other users.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">7. Contact</h2>
              <p>
                If you have questions about this privacy policy, contact us at:{' '}
                <a href="mailto:contact@sreekarreddy.com" className="text-green-400 hover:underline">
                  contact@sreekarreddy.com
                </a>
              </p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
