
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store';

export const createSessionSelectors = (
  set: (fn: (state: ChatState) => Partial<ChatState>) => void,
  get: () => ChatState
) => ({
  getCurrentSession: () => {
    const { sessions, currentSessionId } = get();
    if (!currentSessionId) return null;
    return sessions.find(session => session.id === currentSessionId) || null;
  },
  
  getAllSessions: () => {
    return get().sessions;
  }
});
