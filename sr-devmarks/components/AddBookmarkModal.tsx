'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Tag, FileText, Star, Plus, Loader2, AlertCircle, FolderPlus } from 'lucide-react';
import { Bookmark, Collection, suggestTags, getTagColor, COLLECTION_COLORS } from '@/lib/storage';

interface AddBookmarkModalProps {
  isOpen: boolean;
  bookmark?: Bookmark | null;
  existingTags: string[];
  collections: Collection[];
  duplicateBookmark?: Bookmark | null;
  onSave: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'visitCount' | 'favicon' | 'isRead' | 'sortOrder' | 'linkStatus'>) => void;
  onClose: () => void;
  onCreateCollection: (collection: Omit<Collection, 'id' | 'createdAt'>) => Collection;
}

export function AddBookmarkModal({
  isOpen,
  bookmark,
  existingTags,
  collections,
  duplicateBookmark,
  onSave,
  onClose,
  onCreateCollection,
}: AddBookmarkModalProps) {
  // Use a reset key based on isOpen and bookmark id to trigger re-initialization
  const resetKey = `${isOpen}-${bookmark?.id || 'new'}`;
  
  // Initialize form state from bookmark when modal opens
  const getInitialUrl = () => bookmark?.url || '';
  const getInitialTitle = () => bookmark?.title || '';
  const getInitialDescription = () => bookmark?.description || '';
  const getInitialTags = () => bookmark?.tags || [];
  const getInitialFavorite = () => bookmark?.isFavorite || false;
  const getInitialCollectionId = () => bookmark?.collectionId || null;

  const [url, setUrl] = useState(getInitialUrl);
  const [title, setTitle] = useState(getInitialTitle);
  const [description, setDescription] = useState(getInitialDescription);
  const [tags, setTags] = useState<string[]>(getInitialTags);
  const [tagInput, setTagInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(getInitialFavorite);
  const [collectionId, setCollectionId] = useState<string | null>(getInitialCollectionId);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionColor, setNewCollectionColor] = useState(COLLECTION_COLORS[0]);
  
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens/closes or bookmark changes (using key pattern)
  useEffect(() => {
    if (isOpen) {
      // Reset to initial values when modal opens
      setUrl(getInitialUrl());
      setTitle(getInitialTitle());
      setDescription(getInitialDescription());
      setTags(getInitialTags());
      setIsFavorite(getInitialFavorite());
      setCollectionId(getInitialCollectionId());
      setTagInput('');
      setShowNewCollection(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]); // Only run when resetKey changes

  // Suggest tags when URL changes (debounced via user input, not effect)
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    // Suggest tags only for new bookmarks
    if (!bookmark && newUrl) {
      const suggested = suggestTags(newUrl);
      if (suggested.length > 0) {
        setTags(prev => [...new Set([...prev, ...suggested])]);
      }
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1]);
    }
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    const created = onCreateCollection({
      name: newCollectionName.trim(),
      color: newCollectionColor,
      icon: 'folder',
    });
    setCollectionId(created.id);
    setNewCollectionName('');
    setShowNewCollection(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) return;
    
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }
    
    onSave({
      url: finalUrl,
      title: title.trim() || new URL(finalUrl).hostname,
      description: description.trim(),
      tags,
      isFavorite,
      collectionId,
    });
    
    onClose();
  };

  const filteredSuggestions = existingTags
    .filter(t => 
      t.toLowerCase().includes(tagInput.toLowerCase()) && 
      !tags.includes(t)
    )
    .slice(0, 5);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {bookmark ? 'Edit Bookmark' : 'Add Bookmark'}
                </h2>
                <button onClick={onClose} className="btn-icon">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Duplicate Warning */}
            {duplicateBookmark && (
              <div className="mx-4 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Duplicate URL detected</p>
                  <p className="text-amber-700">
                    This URL already exists: &quot;{duplicateBookmark.title}&quot;
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  <Link2 className="w-4 h-4" />
                  URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="input"
                  required
                  autoFocus={!bookmark}
                />
              </div>

              {/* Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  <FileText className="w-4 h-4" />
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Page title"
                  className="input"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes..."
                  className="input min-h-[60px] resize-none"
                  rows={2}
                />
              </div>

              {/* Collection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  <FolderPlus className="w-4 h-4" />
                  Collection
                </label>
                <div className="flex gap-2">
                  <select
                    value={collectionId || ''}
                    onChange={(e) => setCollectionId(e.target.value || null)}
                    className="input flex-1"
                  >
                    <option value="">No collection</option>
                    {collections.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCollection(!showNewCollection)}
                    className="btn-secondary px-3"
                    title="Create new collection"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* New collection inline form */}
                {showNewCollection && (
                  <div className="mt-2 p-3 bg-[var(--bg-sidebar)] rounded-lg space-y-2">
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="Collection name"
                      className="input"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {COLLECTION_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewCollectionColor(color)}
                          className={`w-6 h-6 rounded-full ${newCollectionColor === color ? 'ring-2 ring-offset-1 ring-[var(--primary)]' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateCollection}
                      disabled={!newCollectionName.trim()}
                      className="btn-primary w-full text-sm py-1.5"
                    >
                      Create Collection
                    </button>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  <Tag className="w-4 h-4" />
                  Tags
                </label>
                
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((tag) => {
                    const colors = getTagColor(tag);
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:opacity-70">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>

                <div className="relative">
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={(e) => { setTagInput(e.target.value); setShowTagSuggestions(true); }}
                    onFocus={() => setShowTagSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Add tags..."
                    className="input pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--primary)]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {showTagSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
                    {filteredSuggestions.map((tag) => {
                      const colors = getTagColor(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2"
                        >
                          <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: colors.bg, color: colors.text }}>
                            {tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Favorite toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative ${isFavorite ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isFavorite ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                  <Star className={`w-4 h-4 ${isFavorite ? 'text-[var(--accent)] fill-current' : ''}`} />
                  Add to favorites
                </span>
              </label>
            </form>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border)] flex gap-2 justify-end">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                {bookmark ? 'Save' : duplicateBookmark ? 'Add Anyway' : 'Add Bookmark'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
