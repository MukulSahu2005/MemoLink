import api from './axiosInstance';
import type { Note, User } from '../types';


// Standard wrapper matching Express ApiResponse helper
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}


export const authAPI = {
  signup: (data: { username: string; password: string; email?: string }) =>
    api.post<ApiResponse<User>>('/api/v1/users/signup', data),
  
  signin: (data: { identifier: string; password: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/api/v1/users/signin', data),
  
  logout: () => 
    api.post<ApiResponse<{}>>('/api/v1/users/logout'),
};


export const notesAPI = {
  getAll: () => 
    api.get<ApiResponse<Note[]>>('/api/v1/notes'),
  
  create: (data: { title: string; content: string; type: string; link?: string; tags: string[] }) =>
    api.post<ApiResponse<Note>>('/api/v1/notes', data),
  
  update: (id: string, data: { title?: string; content?: string; type?: string; link?: string; tags?: string[] }) =>
    api.patch<ApiResponse<Note>>(`/api/v1/notes/${id}`, data),
  
  delete: (id: string) => 
    api.delete<ApiResponse<null>>(`/api/v1/notes/${id}`),
  
  toggleShare: (id: string) => 
    api.patch<ApiResponse<{ shareableId: string }>>(`/api/v1/notes/${id}/share`),
  
  getPublic: (shareableId: string) => 
    api.get<ApiResponse<Note>>(`/api/v1/notes/public/share/${shareableId}`),
};
