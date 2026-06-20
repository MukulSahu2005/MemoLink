import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// take input and convert it into array 
// then covert it into string using clsx()
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// to return the functions or note is made how many times ago 
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Just now';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${Math.floor(diffMins / 60)}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
}
