'use client';

import { Suspense, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Bookmark as BookmarkIcon, 
  ExternalLink, 
  Download, 
  ArrowLeft,
  FolderOpen,
  Loader2
} from 'lucide-react';
import { parseShareLink, getTagColor, getFaviconUrl } from '@/lib/storage';
import { useBookmarkStore } from '@/store/bookmarkStore';

function ShareContent() {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');
  
  // Use useMemo instead of useEffect + useState to avoid sync setState warning
  const sharedData = useMemo(() => {
    if (!data) return null;
    return parseShareLink(data);
  }, [data]);
  
  const [imported, setImported] = useState(false);
  
  const { addBookmark, addCollection } = useBookmarkStore();

  const handleImport = () => {
    if (!sharedData) return;
    
    // Create collection first
    const collection = addCollection({
      name: sharedData.collection.name,
      color: sharedData.collection.color,
      icon: 'folder',
    });
    
    // Add bookmarks to collection
    sharedData.bookmarks.forEach(b => {
      if (b.url && b.title) {
        addBookmark({
          url: b.url,
          title: b.title,
          description: b.description || '',
          tags: b.tags || [],
          isFavorite: false,
          collectionId: collection.id,
        });
      }
    });
    
    setImported(true);
  };

  if (!data || !sharedData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--primary-bg)] flex items-center justify-center mb-4">
          <BookmarkIcon className="w-8 h-8 text-[var(--primary)]" />
        </div>
        <h1 className="text-xl font-semibold mb-2">Invalid Share Link</h1>
        <p className="text-[var(--text-muted)] mb-6">This link is invalid or has expired.</p>
        <Link href="/" className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Go to DevMarks
        </Link>
      </div>
    );
  }

  if (imported) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
          <Download className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-xl font-semibold mb-2">Collection Imported!</h1>
        <p className="text-[var(--text-muted)] mb-6">
          {sharedData.bookmarks.length} bookmarks added to &quot;{sharedData.collection.name}&quot;
        </p>
        <Link href="/" className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Go to DevMarks
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: sharedData.collection.color + '20' }}
          >
            <FolderOpen className="w-8 h-8" style={{ color: sharedData.collection.color }} />
          </div>
          <h1 className="text-2xl font-bold mb-2">{sharedData.collection.name}</h1>
          <p className="text-[var(--text-muted)]">
            {sharedData.bookmarks.length} bookmarks • Shared via DevMarks
          </p>
        </div>

        {/* Bookmarks preview */}
        <div className="space-y-3 mb-8">
          {sharedData.bookmarks.map((bookmark, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={getFaviconUrl(bookmark.url || '')}
                  alt=""
                  className="w-5 h-5 rounded mt-0.5"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--text-primary)] truncate">
                    {bookmark.title}
                  </h3>
                  {bookmark.description && (
                    <p className="text-sm text-[var(--text-muted)] truncate mt-0.5">
                      {bookmark.description}
                    </p>
                  )}
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {bookmark.tags.slice(0, 3).map(tag => {
                        const colors = getTagColor(tag);
                        return (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 text-xs rounded"
                            style={{ backgroundColor: colors.bg, color: colors.text }}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Import button */}
        <div className="text-center">
          <button onClick={handleImport} className="btn-primary px-8">
            <Download className="w-4 h-4" />
            Import Collection
          </button>
          <p className="text-xs text-[var(--text-muted)] mt-3">
            This will add all bookmarks to your DevMarks
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-[var(--primary)] mx-auto mb-4 animate-spin" />
        <p className="text-[var(--text-muted)]">Loading shared collection...</p>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ShareContent />
    </Suspense>
  );
}
