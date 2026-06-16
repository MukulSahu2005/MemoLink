import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, FileText, Bird, TvMinimalPlay, Link2, Calendar, Globe, ExternalLink } from 'lucide-react';
import { notesAPI } from '../api/endpoints';
import type { Note } from '../types';
import { toast } from 'sonner';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatDate } from '../utils/cn';

const TYPE_CONFIG = {
  document: { icon: FileText, color: 'text-blue-400', label: 'Document' },
  tweet: { icon: Bird, color: 'text-sky-400', label: 'Tweet' },
  youtube: { icon: TvMinimalPlay, color: 'text-red-400', label: 'YouTube' },
  link: { icon: Link2, color: 'text-emerald-400', label: 'Web Link' },
};

export default function Share() {
  const { shareableId } = useParams<{ shareableId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSharedNote = async () => {
      if (!shareableId) return;
      try {
        const res = await notesAPI.getPublic(shareableId);
        setNote(res.data.data);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to resolve shared link.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSharedNote();
  }, [shareableId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 text-text-primary">
        <div className="flex flex-col items-center gap-4">
          <Brain className="w-12 h-12 text-brand animate-pulse" />
          <p className="font-mono text-sm tracking-widest text-text-secondary uppercase">Accessing Memory Sector...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 text-text-primary text-center">
        <div className="max-w-md bg-bg-card border border-border-subtle p-8 rounded-card shadow-card-dark flex flex-col items-center gap-6">
          <div className="bg-status-error/10 p-4 rounded-full border border-status-error/20">
            <Globe className="w-12 h-12 text-status-error" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Link Not Found</h2>
            <p className="font-sans text-sm text-text-secondary mt-3 leading-relaxed">
              This neural memo link is invalid, expired, or has been revoked by the author.
            </p>
          </div>
          <Link to="/" className="w-full">
            <Button variant="ghost" className="w-full py-3">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const cfg = TYPE_CONFIG[note.type] || TYPE_CONFIG.document;
  const IconComp = cfg.icon;

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-6 md:p-12 relative flex flex-col items-center justify-center font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-brand/5 blur-[100px] pointer-events-none" />

      {/* Header Link */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 group">
          <Brain className="w-5 h-5 text-brand group-hover:scale-110 transition-transform" />
          <span className="font-display font-bold text-lg text-text-primary">MemoLink</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-bg-card border border-border-subtle rounded-card shadow-card-dark overflow-hidden p-6 md:p-8 flex flex-col gap-6"
      >
        {/* Top Info */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-bg-base border border-border-subtle">
              <IconComp className={`w-5 h-5 ${cfg.color}`} />
            </div>
            <div>
              <span className="font-mono text-[9px] text-brand/80 tracking-widest uppercase block">PUBLIC RESOURCE</span>
              <span className="font-mono text-xs text-text-secondary">Author: @{note.username}</span>
            </div>
          </div>
          <Badge variant="online" className="text-xs px-2.5 py-0.5 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Shared Publicly
          </Badge>
        </div>

        {/* Title & Body */}
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary leading-tight">
            {note.title}
          </h1>

          <div className="flex items-center gap-2 text-text-secondary/60 font-mono text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>Captured {formatDate(note.createdAt)}</span>
          </div>

          <p className="font-sans text-base text-text-secondary leading-relaxed whitespace-pre-wrap bg-bg-panel p-5 rounded-btn border border-border-subtle">
            {note.content}
          </p>
        </div>

        {/* Embedded Content/Link if applicable */}
        {note.link && (
          <div className="bg-bg-panel border border-border-subtle p-4 rounded-btn flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[9px] text-text-secondary uppercase block mb-1">Attached URL</span>
              <a
                href={note.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-brand hover:underline truncate block"
              >
                {note.link}
              </a>
            </div>
            <a href={note.link} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="py-2.5 px-4 text-xs font-mono flex items-center gap-1.5 flex-shrink-0">
                Visit <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          </div>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="brand" className="text-xs px-2.5 py-0.5">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-border-subtle font-mono text-xs">
          <span className="text-text-secondary/60">Want to build your own mind vault?</span>
          <Link to="/signup">
            <Button className="py-2.5 px-5 text-xs">
              Initialize Brain Free →
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
