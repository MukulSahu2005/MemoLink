import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { NoteCard } from '../components/cards/NoteCard';
import { CreateNoteDrawer } from '../components/layout/CreateNoteDrawer';
import { EditNoteModal } from '../components/layout/EditNoteModal';
import { notesAPI } from '../api/endpoints';
import type { Note } from '../types';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { logout, user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const fetchNotes = async () => {
    try {
      const res = await notesAPI.getAll();
      setNotes(res.data.data);
    } 
    catch (err: any) {
      if (err?.status !== 401) {
        toast.error(err?.message || 'Failed to load notes');
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) return notes;
    const term = searchTerm.toLowerCase();
    return notes.filter((n) => n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term));
  }, [searchTerm, notes]);

  const handleCreate = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
    setDrawerOpen(false);
  };

  const handleUpdate = (updated: Note) => {
    setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
    setEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  const handleShareToggle = (id: string, shareableId?: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n._id === id
          ? { ...n, isShared: !!shareableId, shareableId: shareableId || undefined }
          : n,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-6 md:p-12">

      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        
        {/* Heading */}
        <div>
          <h1 className="font-display text-3xl font-bold">Memo Link</h1>
          {user && <p className="font-mono text-[10px] text-brand/80 mt-1 uppercase tracking-widest">SECURED USER: @{user.username}</p>}
        </div>

        {/* Search Bar  */}
        <div className="flex flex-grow w-full md:w-auto items-center gap-2 bg-bg-card border border-border-subtle rounded-[30px]  px-3 py-1.5">
          
          <Search className="w-7 h-7 text-text-secondary" />
          
          <Input
            placeholder="Search memos…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1  bg-transparent border-none focus:ring-0 text-sm rounded-[30px]"
          />

          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="p-1 text-text-secondary hover:text-text-primary">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Button variant="primary" onClick={() => setDrawerOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Memo
          </Button>
          <Button variant="ghost" onClick={logout} className="text-xs px-4 py-2 border border-border-subtle flex items-center gap-1.5 font-mono">
            Sign Out
          </Button>
        </div>
      
      </header>

      {/* Notes Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={(n) => {
                setSelectedNote(n);
                setEditModalOpen(true);
              }}
              onDelete={handleDelete}
              onShareToggle={handleShareToggle}
            />
          ))}
        </AnimatePresence>
        {filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12 text-text-secondary"
          >
            No memos match your query.
          </motion.div>
        )}
      </section>

      {/* Drawer & Modal */}
      <CreateNoteDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onCreated={handleCreate} />
      <EditNoteModal note={selectedNote} isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} onUpdated={handleUpdate} />
    </div>
  );
};
