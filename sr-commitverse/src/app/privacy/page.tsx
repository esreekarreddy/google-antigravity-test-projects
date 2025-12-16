import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
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
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Privacy Policy</h1>
          </div>
          <p className="text-slate-500 text-sm">Last updated: December 2025</p>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 mb-8">
          <p className="text-emerald-800 font-medium mb-2">Summary</p>
          <p className="text-emerald-700 text-sm">
            CommitVerse is a privacy-first application. We <strong>do not collect, store, or transmit any 
            personal data</strong>. All repository data is fetched directly from GitHub&apos;s public API and cached 
            only in your browser&apos;s session storage.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-slate-600">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Data We Access</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Public GitHub Repository Data:</strong> We fetch commit history, branches, and contributor 
              information from public repositories using GitHub&apos;s REST API.</li>
              <li><strong>No Private Repositories:</strong> We cannot access private repositories.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Data Storage</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Session Storage Only:</strong> Repository data is temporarily cached in your browser&apos;s 
              sessionStorage to improve performance. This data is automatically deleted when you close the browser tab.</li>
              <li><strong>No Server Storage:</strong> We do not have a backend server that stores your data.</li>
              <li><strong>No Cookies:</strong> We do not use cookies or tracking technologies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Third-Party Services</h2>
            <p className="text-sm">
              This application uses GitHub&apos;s public API. Your use is subject to{' '}
              <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" 
                 target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                GitHub&apos;s Privacy Statement
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Contact</h2>
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
