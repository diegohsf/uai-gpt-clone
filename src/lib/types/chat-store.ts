
import { ChatSession, Message } from '@/types/chat';

export interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  
  createNewSession: () => Promise<string>;
  sendMessage: (content: string) => Promise<void>;
  setCurrentSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearSessions: () => void;
  getCurrentSession: () => ChatSession | null;
  getAllSessions: () => ChatSession[];
}
