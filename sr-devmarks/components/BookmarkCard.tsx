'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  BookOpen, 
  BookCheck,
  AlertTriangle,
  FolderOpen,
  GripVertical
} from 'lucide-react';
import { Bookmark, Collection, getTagColor } from '@/lib/storage';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BookmarkCardProps {
  bookmark: Bookmark;
  collections: Collection[];
  onToggleFavorite: (id: string) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (bookmark: Bookmark) => void;
  onVisit: (id: string) => void;
  onTagClick: (tag: string) => void;
  onMoveToCollection: (bookmarkId: string, collectionId: string | null) => void;
  isDragging?: boolean;
}

export function BookmarkCard({
  bookmark,
  collections,
  onToggleFavorite,
  onToggleRead,
  onDelete,
  onEdit,
  onVisit,
  onTagClick,
  onMoveToCollection,
}: BookmarkCardProps) {
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bookmark.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    onVisit(bookmark.id);
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const getDomain = (url: string): string => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const collection = collections.find(c => c.id === bookmark.collectionId);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`card p-4 group ${bookmark.isRead ? 'opacity-75' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Favicon and domain */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {bookmark.favicon ? (
            <img
              src={bookmark.favicon}
              alt=""
              className="w-4 h-4 rounded flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-4 h-4 rounded bg-[var(--bg-sidebar)] flex-shrink-0" />
          )}
          <span className="text-xs text-[var(--text-muted)] truncate">
            {getDomain(bookmark.url)}
          </span>
          
          {/* Broken link indicator */}
          {bookmark.linkStatus === 'broken' && (
            <span title="Broken link">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleRead(bookmark.id)}
            className={`p-1.5 rounded transition-colors ${
              bookmark.isRead
                ? 'text-[var(--primary)] bg-[var(--primary-bg)]'
                : 'text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-bg)]'
            }`}
            title={bookmark.isRead ? 'Mark as unread' : 'Mark as read'}
          >
            {bookmark.isRead ? (
              <BookCheck className="w-3.5 h-3.5" />
            ) : (
              <BookOpen className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => onToggleFavorite(bookmark.id)}
            className={`p-1.5 rounded transition-colors ${
              bookmark.isFavorite
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:text-[var(--accent)]'
            }`}
            title={bookmark.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-3.5 h-3.5 ${bookmark.isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onEdit(bookmark)}
            className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-bg)] transition-colors"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="p-1.5 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3
        onClick={handleClick}
        className="font-semibold text-sm text-[var(--text-primary)] mb-1.5 cursor-pointer hover:text-[var(--primary)] transition-colors line-clamp-2"
      >
        {bookmark.title || 'Untitled'}
      </h3>

      {/* Description */}
      {bookmark.description && (
        <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
          {bookmark.description}
        </p>
      )}

      {/* Collection badge */}
      {collection && (
        <div className="mb-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full text-white"
            style={{ backgroundColor: collection.color }}
          >
            <FolderOpen className="w-3 h-3" />
            {collection.name}
          </span>
        </div>
      )}

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {bookmark.tags.slice(0, 3).map((tag) => {
            const colors = getTagColor(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="tag text-[10px] px-1.5 py-0.5"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {tag}
              </button>
            );
          })}
          {bookmark.tags.length > 3 && (
            <span className="text-[10px] text-[var(--text-muted)] self-center">
              +{bookmark.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-muted)]">
            {new Date(bookmark.createdAt).toLocaleDateString()}
          </span>
          
          {/* Collection selector */}
          <div className="relative">
            <button
              onClick={() => setShowCollectionMenu(!showCollectionMenu)}
              className="text-[10px] text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1"
            >
              <FolderOpen className="w-3 h-3" />
            </button>
            
            {showCollectionMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCollectionMenu(false)} />
                <div className="absolute left-0 bottom-full mb-1 w-36 bg-white border border-[var(--border)] rounded-lg shadow-lg z-20 py-1">
                  <button
                    onClick={() => { onMoveToCollection(bookmark.id, null); setShowCollectionMenu(false); }}
                    className="w-full px-3 py-1.5 text-xs text-left hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                  >
                    No collection
                  </button>
                  {collections.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { onMoveToCollection(bookmark.id, c.id); setShowCollectionMenu(false); }}
                      className="w-full px-3 py-1.5 text-xs text-left hover:bg-[var(--bg-hover)] flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        <button
          onClick={handleClick}
          className="flex items-center gap-1 text-[10px] text-[var(--primary)] hover:underline"
        >
          Open <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
