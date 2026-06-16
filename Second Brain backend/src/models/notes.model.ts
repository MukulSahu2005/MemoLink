import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type NoteType = 'document' | 'tweet' | 'youtube' | 'link';

export interface INote extends Document {
  title: string;
  content: string;
  type: NoteType;
  link?: string;
  tags: string[];
  username: string;

  isShared: boolean;
  shareableId?: string | undefined;
  
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'], 
      trim: true 
    },
    content: { 
      type: String, 
      required: [true, 'Content is required'] 
    },
    type: {
      type: String,
      enum: ['document', 'tweet', 'youtube', 'link'],
      required: [true, 'Resource type is required'],
      default: 'document'
    },
    link: { 
      type: String, 
      trim: true    // Stores the URL string if type is tweet/youtube/link
    },
    tags: { 
      type: [String], 
      default: [] // Array of tag strings like ['productivity', 'coding']
    },
    username: { 
      type: String, 
      required: true 
    },
    isShared: { 
      type: Boolean, 
      default: false 
    },
    shareableId: { 
      type: String, 
      unique: true, 
      sparse: true 
    },
  },
  { timestamps: true }
);

// indexing for faster seach
NoteSchema.index({ tags: 1, type: 1 });
// NoteSchema.index({ shareableId: 1 }, { unique: true, sparse: true });

export const noteModel= mongoose.model<INote>('Note',NoteSchema);

