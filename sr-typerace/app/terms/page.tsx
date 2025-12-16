import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for SR TypeRace - Terminal Typing Speed Game',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <article className="terminal-panel p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-green-400 terminal-glow mb-6">Terms of Service</h1>
          
          <p className="text-gray-400 mb-6">
            <strong>Last updated:</strong> December 2025
          </p>

          <section className="space-y-6 text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using SR TypeRace, you accept and agree to be bound by these 
                Terms of Service. If you do not agree to these terms, please do not use the application.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">2. Description of Service</h2>
              <p>
                SR TypeRace is a free, browser-based typing speed game that allows users to 
                practice typing, race against computer opponents, and compete with friends 
                in real-time using peer-to-peer connections.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">3. User Conduct</h2>
              <p>You agree to:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 mt-2">
                <li>Use the application for its intended purpose</li>
                <li>Not attempt to exploit, hack, or compromise the service</li>
                <li>Not use automated tools or bots to achieve artificial scores</li>
                <li>Behave respectfully in multiplayer sessions</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">4. Intellectual Property</h2>
              <p>
                The SR TypeRace application, including its design, code, and content, is owned 
                by Sreekar Reddy. The application is provided under the MIT License for 
                educational and personal use.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">5. Disclaimer of Warranties</h2>
              <p>
                This application is provided &quot;as is&quot; without warranty of any kind, express or implied. 
                We do not guarantee that the service will be uninterrupted, secure, or error-free.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">6. Limitation of Liability</h2>
              <p>
                In no event shall Sreekar Reddy be liable for any indirect, incidental, special, 
                consequential, or punitive damages arising out of your use of the application.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">7. Governing Law</h2>
              <p>
                These terms shall be governed by the laws of New South Wales, Australia. 
                Any disputes shall be resolved in the courts of New South Wales.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the 
                application after changes constitutes acceptance of the new terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-3">9. Contact</h2>
              <p>
                For questions about these terms, contact us at:{' '}
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
