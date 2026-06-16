import  { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Bird, TvMinimalPlay, Link2,
  MoreVertical, Pencil, Trash2, Globe, Lock, Copy, CheckCheck,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import type{ Note } from '../../types';
import { formatDate } from '../../utils/cn';
import { notesAPI } from '../../api/endpoints';
import { toast } from 'sonner';


const TYPE_CONFIG = {
  document: { icon: FileText, color: 'text-blue-400',    label: 'Document'  },
  tweet:    { icon: Bird,  color: 'text-sky-400',     label: 'Tweet'     },
  youtube:  { icon: TvMinimalPlay,  color: 'text-red-400',     label: 'YouTube'   },
  link:     { icon: Link2,    color: 'text-emerald-400', label: 'Web Link'  },
};



interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onShareToggle: (id: string, shareableId?: string) => void;
}

export const NoteCard = ({ note, onEdit, onDelete, onShareToggle }: NoteCardProps) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const cfg = TYPE_CONFIG[note.type] || TYPE_CONFIG.document;
  const IconComp = cfg.icon;

  
  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    
    return () => document.removeEventListener('mousedown', handler);
  }, []);


  const handleDelete = async () => {
    setMenuOpen(false);
    setIsDeleting(true);

    // set time out just for the delay effect 
    setTimeout(async () => {
      try {
        await notesAPI.delete(note._id);
        onDelete(note._id);
        
        toast.success('Memo terminated from neural vault.');
      } 
      catch (err: any) {
        toast.error(err?.message || 'Deletion failed.');
        
        setIsDeleting(false);
      }
    }, 400); // allow wobble to play
  };

  const handleShare = async () => {
    setMenuOpen(false);
    setIsSharing(true);
    
    try {
      const res = await notesAPI.toggleShare(note._id);
      const { shareableId } = res.data.data;
      
      onShareToggle(note._id, shareableId);

      if (shareableId) {
        toast.success('Public link generated successfully.');
      } 
      else {
        toast.success('Public access revoked.');
      }
    } 
    catch (err: any) {
      toast.error(err?.message || 'Share toggle failed.');
    } 
    finally {
      setIsSharing(false);
    }
  };

  const handleCopy = () => {
    if (!note.shareableId) return;
    
    const url = `${window.location.origin}/share/${note.shareableId}`;
    navigator.clipboard.writeText(url);
    
    setCopied(true);
    
    setTimeout(() => setCopied(false), 2000);
    
    toast.success('Link Copied to Clipboard!');
  };

  const shakeAnimation = {
    x: [0, -8, 8, -6, 6, -4, 4, 0],
    transition: { duration: 0.4 },
  };

  
  return (
    <motion.div
      layout
      animate={isDeleting ? shakeAnimation : {}}
      exit={{ opacity: 0, scale: 0.85, y: -10 }}
      className="relative bg-bg-card border border-border-subtle rounded-card p-5 flex flex-col gap-3 shadow-card-dark group hover:border-brand/20 transition-all duration-200"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg bg-bg-base border border-border-subtle flex-shrink-0`}>
            <IconComp className={`w-4 h-4 ${cfg.color}`} />
          </div>
          <h3 className="font-display text-sm font-bold text-text-primary truncate leading-tight">
            {note.title}
          </h3>
        </div>

        {/* 3-dot Menu */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg text-text-secondary/50 hover:text-text-primary hover:bg-border-subtle transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {menuOpen && (

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1.5 z-50 min-w-[160px] bg-bg-panel border border-border-subtle rounded-xl shadow-card-dark overflow-hidden"
              >

                <button
                  onClick={() => { setMenuOpen(false); onEdit(note); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-mono text-text-primary hover:bg-border-subtle transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 text-brand" /> Edit Memo
                </button>

                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-mono text-text-primary hover:bg-border-subtle transition-colors disabled:opacity-50"
                >
                  <Globe className="w-3.5 h-3.5 text-status-online" />
                  {note.isShared ? 'Revoke Share' : 'Share Publicly'}
                </button>
                
                <div className="border-t border-border-subtle" />
                
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-mono text-status-error hover:bg-status-error/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border-subtle" />

      {/* Content Preview */}
      <p className="font-sans text-sm text-text-secondary leading-relaxed line-clamp-3 flex-grow">
        {note.content}
      </p>

      {/* Tags + Share Badge */}
      <div className="flex flex-wrap items-center gap-1.5 mt-auto">
        
        {note.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="brand" className="text-[10px] px-2 py-0.5">
            #{tag}
          </Badge>
        ))}

        {note.tags.length > 3 && (
          <Badge variant="subtle" className="text-[10px]">+{note.tags.length - 3}</Badge>
        )}
      </div>

      {/* Footer: date + share state */}
      <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
        <span className="font-mono text-[10px] text-text-secondary/60">
          {formatDate(note.createdAt)}
        </span>

        <div className="flex items-center gap-2">
          {note.isShared ? (
            <>
              <Badge variant="online" className="text-[10px] px-2">
                <Globe className="w-2.5 h-2.5" /> Live
              </Badge>
              <button
                onClick={handleCopy}
                title="Copy share link"
                className="p-1 rounded text-status-online hover:bg-status-online/10 transition-colors"
              >
                {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </>
          ) : (
            <Badge variant="subtle" className="text-[10px] px-2">
              <Lock className="w-2.5 h-2.5" /> Private
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};
