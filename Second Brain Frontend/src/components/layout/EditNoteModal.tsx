import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Bird, TvMinimalPlay, Link2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { notesAPI } from '../../api/endpoints';
import type{ Note } from '../../types';
import { toast } from 'sonner';

interface EditNoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (note: Note) => void;
}

const TYPE_OPTIONS = [
  { value: 'document', label: 'Document', icon: FileText, color: 'text-blue-400' },
  { value: 'tweet',    label: 'Tweet',    icon: Bird,  color: 'text-sky-400' },
  { value: 'youtube',  label: 'YouTube',  icon: TvMinimalPlay,  color: 'text-red-400' },
  { value: 'link',     label: 'Web Link', icon: Link2,    color: 'text-emerald-400' },
];

export const EditNoteModal = ({ note, isOpen, onClose, onUpdated }: EditNoteModalProps) => {
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [type, setType]       = useState('document');
  const [link, setLink]       = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags]       = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setType(note.type);
      setLink(note.link || '');
      setTags(note.tags || []);
    }
  }, [note]);

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().toLowerCase().replace(/^#+/, '');
      if (!tags.includes(t)) setTags((prev) => [...prev, t]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await notesAPI.update(note._id, {
        title: title.trim(),
        content: content.trim(),
        type,
        link: link.trim() || undefined,
        tags,
      });
      onUpdated(res.data.data);
      toast.success('Memo updated successfully.');
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Update failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && note && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{   opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative w-full max-w-lg bg-bg-card border border-border-subtle rounded-card shadow-card-dark flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle flex-shrink-0">
                <div>
                  <h2 className="font-display text-lg font-bold text-text-primary">Edit Memo</h2>
                  <p className="font-mono text-[10px] text-brand/80 tracking-widest uppercase mt-0.5">PATCH NEURAL NODE</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border-subtle transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 overflow-y-auto flex-grow">
                <Input
                  label="Title_"
                  placeholder="Resource title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs uppercase tracking-widest text-text-secondary select-none">Content_</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Your knowledge payload..."
                    rows={5}
                    required
                    className="w-full bg-white text-text-dark placeholder:text-text-secondary/40 border-2 border-transparent focus:border-brand rounded-btn px-4 py-3 font-mono text-sm transition-all duration-200 resize-none focus:outline-none"
                  />
                </div>

                {/* Type Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs uppercase tracking-widest text-text-secondary select-none">Resource Type_</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TYPE_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setType(value)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-btn border text-sm font-mono transition-all duration-150 ${
                          type === value
                            ? 'border-brand bg-brand/10 text-text-primary'
                            : 'border-border-subtle bg-bg-base text-text-secondary hover:border-brand/30'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${color}`} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional link */}
                {(type === 'youtube' || type === 'link' || type === 'tweet') && (
                  <Input
                    label="External URL (Optional)_"
                    type="url"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                )}

                {/* Tags */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs uppercase tracking-widest text-text-secondary select-none">Tags_ (Press Enter to add)</label>
                  <div className="bg-white border-2 border-transparent focus-within:border-brand rounded-btn px-3 py-2 flex flex-wrap gap-1.5 transition-all duration-200 min-h-[46px]">
                    {tags.map((t) => (
                      <Badge key={t} variant="brand" className="text-[10px] flex items-center gap-1">
                        #{t}
                        <button type="button" onClick={() => removeTag(t)} className="hover:text-status-error transition-colors ml-0.5">×</button>
                      </Badge>
                    ))}
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      placeholder={tags.length === 0 ? 'productivity, coding...' : ''}
                      className="flex-grow min-w-[80px] bg-transparent font-mono text-sm text-text-dark placeholder:text-text-secondary/40 focus:outline-none"
                    />
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center gap-3 px-6 py-5 border-t border-border-subtle flex-shrink-0">
                <Button variant="ghost" onClick={onClose} className="flex-1 py-3">
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSubmit} isLoading={isLoading} className="flex-1 py-3">
                  Save Changes →
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
