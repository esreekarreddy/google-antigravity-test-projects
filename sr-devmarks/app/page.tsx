'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  HelpCircle, 
  Download, 
  Upload, 
  Trash2, 
  Bookmark as BookmarkIcon,
  Settings,
  X,
  Link2,
  Share2,
  Loader2
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  rectSortingStrategy 
} from '@dnd-kit/sortable';
import { useBookmarkStore, getFilteredBookmarks, getStats, getAllTags } from '@/store/bookmarkStore';
import { exportToJson, importFromJson, Bookmark, COLLECTION_COLORS } from '@/lib/storage';
import { StatsCards } from '@/components/StatsCards';
import { BookmarkCard } from '@/components/BookmarkCard';
import { AddBookmarkModal } from '@/components/AddBookmarkModal';
import { HelpModal } from '@/components/HelpModal';
import { ConfirmModal, AlertModal } from '@/components/ConfirmModal';
import { generateShareLink } from '@/lib/storage';

export default function HomePage() {
  // Get state and actions from store
  const store = useBookmarkStore();
  const {
    bookmarks,
    collections,
    searchQuery,
    selectedTag,
    selectedCollection,
    isLoading,
    init,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
    toggleRead,
    incrementVisit,
    setSearchQuery,
    setSelectedTag,
    setSelectedCollection,
    importBookmarks,
    clearAll,
    checkDuplicate,
    reorderBookmarks,
    updateLinkStatus,
    addCollection,
    moveToCollection,
  } = store;
  
  // Compute derived values using selector functions
  const filteredBookmarks = useMemo(() => getFilteredBookmarks(store), [store]);
  const stats = useMemo(() => getStats(store), [store]);
  const allTags = useMemo(() => getAllTags(store), [store]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [duplicateBookmark, setDuplicateBookmark] = useState<Bookmark | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isCheckingLinks, setIsCheckingLinks] = useState(false);
  const [checkProgress, setCheckProgress] = useState({ current: 0, total: 0 });
  const [shareLink, setShareLink] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    init();
  }, [init]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = filteredBookmarks.findIndex(b => b.id === active.id);
      const newIndex = filteredBookmarks.findIndex(b => b.id === over.id);
      reorderBookmarks(oldIndex, newIndex);
    }
  };

  const handleUrlChange = useCallback((url: string) => {
    if (url && !editingBookmark) {
      const dup = checkDuplicate(url);
      setDuplicateBookmark(dup);
    } else {
      setDuplicateBookmark(null);
    }
  }, [checkDuplicate, editingBookmark]);

  const handleSaveBookmark = (data: Omit<Bookmark, 'id' | 'createdAt' | 'visitCount' | 'favicon' | 'isRead' | 'sortOrder' | 'linkStatus'>) => {
    if (editingBookmark) {
      updateBookmark(editingBookmark.id, data);
      setEditingBookmark(null);
    } else {
      addBookmark(data);
    }
    setShowAddModal(false);
    setDuplicateBookmark(null);
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteBookmark(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { bookmarks: importedBookmarks, collections: importedCollections } = await importFromJson(file);
      importBookmarks(importedBookmarks, importedCollections, true);
    } catch (error) {
      console.error('Import failed:', error);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCheckAllLinks = async () => {
    if (bookmarks.length === 0) return;
    
    setIsCheckingLinks(true);
    setCheckProgress({ current: 0, total: bookmarks.length });
    
    for (let i = 0; i < bookmarks.length; i++) {
      const bookmark = bookmarks[i];
      setCheckProgress({ current: i + 1, total: bookmarks.length });
      
      try {
        const response = await fetch('/api/check-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: bookmark.url }),
        });
        const data = await response.json();
        updateLinkStatus(bookmark.id, data.status as 'ok' | 'broken');
      } catch {
        updateLinkStatus(bookmark.id, 'broken');
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsCheckingLinks(false);
  };

  const handleShareCollection = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      const link = generateShareLink(collection, bookmarks);
      setShareLink(link);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookmarkIcon className="w-12 h-12 text-[var(--primary)] mx-auto mb-4 animate-pulse" />
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--bg-page)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <BookmarkIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold hidden sm:block">DevMarks</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookmarks..."
                className="input pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
            
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className="btn-icon">
                <Settings className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {showSettings && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowSettings(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg z-30 py-1"
                    >
                      <button
                        onClick={() => { setShowHelpModal(true); setShowSettings(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-[var(--text-muted)]" />
                        Help
                      </button>
                      <button
                        onClick={() => { handleCheckAllLinks(); setShowSettings(false); }}
                        disabled={isCheckingLinks || bookmarks.length === 0}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50"
                      >
                        {isCheckingLinks ? (
                          <Loader2 className="w-4 h-4 text-[var(--text-muted)] animate-spin" />
                        ) : (
                          <Link2 className="w-4 h-4 text-[var(--text-muted)]" />
                        )}
                        {isCheckingLinks ? `Checking (${checkProgress.current}/${checkProgress.total})` : 'Check Links'}
                      </button>
                      <button
                        onClick={() => { exportToJson(bookmarks, collections); setShowSettings(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <Download className="w-4 h-4 text-[var(--text-muted)]" />
                        Export
                      </button>
                      <button
                        onClick={() => { fileInputRef.current?.click(); setShowSettings(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <Upload className="w-4 h-4 text-[var(--text-muted)]" />
                        Import
                      </button>
                      <div className="my-1 border-t border-[var(--border)]" />
                      <button
                        onClick={() => { setShowClearConfirm(true); setShowSettings(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear All Data
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {/* Stats */}
          <div className="mb-6">
            <StatsCards stats={stats} onSelectFilter={setSelectedTag} selectedFilter={selectedTag} />
          </div>

          {/* Collections row */}
          {collections.length > 0 && (
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Collections:</span>
              {collections.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCollection(selectedCollection === c.id ? null : c.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full transition-all ${
                    selectedCollection === c.id 
                      ? 'text-white' 
                      : 'bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                  style={selectedCollection === c.id ? { backgroundColor: c.color } : undefined}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedCollection === c.id ? 'white' : c.color }} />
                  {c.name}
                </button>
              ))}
              {selectedCollection && (
                <button
                  onClick={() => handleShareCollection(selectedCollection)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[var(--primary)] hover:bg-[var(--primary-bg)] rounded"
                >
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
              )}
            </div>
          )}

          {/* Tags row */}
          {allTags.length > 0 && (
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Tags:</span>
              {allTags.map(tag => {
                const isActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isActive ? null : tag)}
                    className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full transition-all ${
                      isActive
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}

          {/* Filter indicator */}
          {(selectedTag || searchQuery || selectedCollection) && (
            <div className="mb-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span>
                {filteredBookmarks.length} of {bookmarks.length} bookmarks
              </span>
              <button 
                onClick={() => { setSelectedTag(null); setSelectedCollection(null); }} 
                className="text-[var(--primary)] hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Bookmarks grid with DnD */}
          {filteredBookmarks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <BookmarkIcon className="w-10 h-10 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {bookmarks.length === 0 ? 'No bookmarks yet' : 'No matches found'}
              </h3>
              <p className="text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
                {bookmarks.length === 0
                  ? 'Start organizing your resources. Add your first bookmark!'
                  : 'Try adjusting your search or filter.'}
              </p>
              {bookmarks.length === 0 && (
                <button onClick={() => setShowAddModal(true)} className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Add First Bookmark
                </button>
              )}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredBookmarks.map(b => b.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredBookmarks.map((bookmark) => (
                      <BookmarkCard
                        key={bookmark.id}
                        bookmark={bookmark}
                        collections={collections}
                        onToggleFavorite={toggleFavorite}
                        onToggleRead={toggleRead}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onVisit={incrementVisit}
                        onTagClick={setSelectedTag}
                        onMoveToCollection={moveToCollection}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="border-t border-[var(--border)] py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-3 text-sm text-[var(--text-muted)]">
          <span>
            Built by <a href="https://sreekarreddy.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)]">Sreekar Reddy</a>
          </span>
          <span>•</span>
          <a href="/privacy" className="hover:text-[var(--primary)]">Privacy</a>
          <span>•</span>
          <a href="/terms" className="hover:text-[var(--primary)]">Terms</a>
        </div>
      </footer>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

      {/* Modals */}
      <AddBookmarkModal
        isOpen={showAddModal}
        bookmark={editingBookmark}
        existingTags={allTags}
        collections={collections}
        duplicateBookmark={duplicateBookmark}
        onSave={handleSaveBookmark}
        onClose={() => { setShowAddModal(false); setEditingBookmark(null); setDuplicateBookmark(null); }}
        onCreateCollection={addCollection}
      />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear All Data?"
        message="This will permanently delete all your bookmarks and collections."
        confirmText="Clear All"
        variant="danger"
        onConfirm={() => { clearAll(); setShowClearConfirm(false); }}
        onCancel={() => setShowClearConfirm(false)}
      />
      <ConfirmModal
        isOpen={!!showDeleteConfirm}
        title="Delete Bookmark?"
        message="This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(null)}
      />
      <AlertModal
        isOpen={!!shareLink}
        title="Share Link Created"
        message={shareLink || ''}
        onClose={() => {
          if (shareLink) {
            navigator.clipboard.writeText(shareLink);
          }
          setShareLink(null);
        }}
      />
    </div>
  );
}
