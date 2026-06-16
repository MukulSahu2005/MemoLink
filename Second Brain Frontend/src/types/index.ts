export type ResourceType = 'document' | 'tweet' | 'youtube' | 'link';

export interface User {
  _id: string;
  username: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  type: ResourceType;
  link?: string;
  tags: string[];
  isShared: boolean;
  shareableId?: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
}
