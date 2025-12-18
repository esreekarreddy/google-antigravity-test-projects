import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for SR DevMarks - your data stays local and private.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <article className="max-w-2xl mx-auto">
        <Link 
          href="/" 
          className="text-sm text-[var(--primary)] hover:underline mb-8 inline-block"
        >
          ← Back to DevMarks
        </Link>

        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Privacy Policy</h1>
        
        <p className="text-[var(--text-secondary)] mb-4">
          <strong>Last updated:</strong> December 2025
        </p>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-4">Your Data Stays With You</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          SR DevMarks is designed with privacy as a core principle. All your bookmarks, tags, and preferences 
          are stored locally in your browser using localStorage. <strong>No data is ever sent to any server.</strong>
        </p>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-4">What We Don&apos;t Collect</h2>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2 mb-4">
          <li>Personal information</li>
          <li>Bookmark data</li>
          <li>Usage analytics</li>
          <li>Cookies or tracking data</li>
          <li>IP addresses</li>
        </ul>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-4">Third-Party Services</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          The only external request made is to Google&apos;s favicon service to display website icons. 
          This is a simple GET request that only includes the domain name of your bookmarked sites.
        </p>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-4">Data Control</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          You have complete control over your data:
        </p>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2 mb-4">
          <li><strong>Export:</strong> Download all your bookmarks as a JSON file at any time</li>
          <li><strong>Import:</strong> Restore your bookmarks from a backup file</li>
          <li><strong>Delete:</strong> Clear all data from Settings → Clear All Data</li>
        </ul>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-8 mb-4">Contact</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          For questions about this policy, contact{' '}
          <a href="mailto:contact@sreekarreddy.com" className="text-[var(--primary)] hover:underline">
            contact@sreekarreddy.com
          </a>
        </p>
      </article>
    </main>
  );
}
