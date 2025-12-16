import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Terms of Service</h1>
          </div>
          <p className="text-slate-500 text-sm">Last updated: December 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-slate-600">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">1. Acceptance of Terms</h2>
            <p className="text-sm">
              By accessing or using CommitVerse (&quot;the Service&quot;), you agree to be bound by these Terms 
              of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">2. Description of Service</h2>
            <p className="text-sm">
              CommitVerse is a free, open-source tool that visualizes public GitHub repository commit 
              history in 3D. The Service is provided &quot;as is&quot; without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">3. Use of Service</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>You may use the Service to visualize public GitHub repositories.</li>
              <li>You may not use the Service for any unlawful purpose or to violate GitHub&apos;s Terms of Service.</li>
              <li>You may not attempt to circumvent GitHub API rate limits through the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">4. GitHub API</h2>
            <p className="text-sm">
              The Service uses GitHub&apos;s public REST API. Your use of the Service is also subject to{' '}
              <a href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service" 
                 target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                GitHub&apos;s Terms of Service
              </a>. We are not affiliated with GitHub, Inc.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">5. Limitation of Liability</h2>
            <p className="text-sm">
              The Service is provided without warranty. We shall not be liable for any damages arising 
              from the use or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">6. Changes to Terms</h2>
            <p className="text-sm">
              We reserve the right to modify these terms at any time. Continued use of the Service 
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">7. Contact</h2>
            <p className="text-sm">
              Questions? Email:{' '}
              <a href="mailto:contact@sreekarreddy.com" className="text-indigo-600 hover:underline">
                contact@sreekarreddy.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
