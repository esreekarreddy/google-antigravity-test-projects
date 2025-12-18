import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for SR DevMarks bookmark manager.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <article className="max-w-2xl mx-auto">
        <Link 
          href="/" 
          className="text-sm text-[var(--primary)] hover:underline mb-8 inline-block"
        >
          ← Back to DevMarks
        </Link>

        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Terms of Service</h1>
        
        <p className="text-[var(--text-secondary)] mb-4">
          <strong>Last updated:</strong> December 2025
        </p>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-4">Acceptance of Terms</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          By using SR DevMarks, you agree to these terms. If you don&apos;t agree, please don&apos;t use the service.
        </p>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-4">Service Description</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          SR DevMarks is a free, client-side bookmark management tool. It stores all data locally 
          in your browser. No account or registration is required.
        </p>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-4">Data Responsibility</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          Since all data is stored locally:
        </p>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2 mb-4">
          <li>You are responsible for backing up your bookmarks (use the Export feature)</li>
          <li>Clearing browser data will delete your bookmarks</li>
          <li>We cannot recover lost data</li>
        </ul>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-4">Disclaimer</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          This service is provided &quot;as is&quot; without warranties. We are not responsible for:
        </p>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2 mb-4">
          <li>Data loss due to browser issues or user actions</li>
          <li>Accuracy or availability of bookmarked content</li>
          <li>Third-party website content</li>
        </ul>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-4">Open Source</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          This project is open source. Feel free to review, fork, or contribute on{' '}
          <a 
            href="https://github.com/esreekarreddy/google-antigravity-test-projects/tree/main/sr-devmarks" 
            className="text-[var(--primary)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>.
        </p>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-4">Contact</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          For questions, contact{' '}
          <a href="mailto:contact@sreekarreddy.com" className="text-[var(--primary)] hover:underline">
            contact@sreekarreddy.com
          </a>
        </p>
      </article>
    </main>
  );
}
