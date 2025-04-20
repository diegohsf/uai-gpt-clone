
import { StateCreator } from 'zustand';
import { ChatSession, Message } from '@/types/chat';
import { ChatState } from '../types/chat-store';
import { generateChatResponse, generateTitle } from '../openai';

export const createSessionActions = (
  set: (fn: (state: ChatState) => Partial<ChatState>) => void,
  get: () => ChatState
) => ({
  createNewSession: async () => {
    const id = Date.now().toString();
    const newSession: ChatSession = {
      id,
      title: "Nova conversa",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    set((state) => {
      const sessionExists = state.sessions.some(session => session.id === id);
      if (sessionExists) {
        return state;
      }
      
      return {
        sessions: [newSession, ...state.sessions],
        currentSessionId: id,
        error: null
      };
    });
    
    return id;
  },

  setCurrentSession: (sessionId: string) => {
    // Fix: Pass a function that returns an object instead of directly passing an object
    set(state => ({ currentSessionId: sessionId }));
  },

  deleteSession: (sessionId: string) => {
    set(state => {
      const updatedSessions = state.sessions.filter(
        session => session.id !== sessionId
      );
      
      const newCurrentSessionId = 
        state.currentSessionId === sessionId
          ? updatedSessions.length > 0
            ? updatedSessions[0].id
            : null
          : state.currentSessionId;
      
      return {
        sessions: updatedSessions,
        currentSessionId: newCurrentSessionId
      };
    });
  },

  clearSessions: () => {
    // Fix: Pass a function that returns an object instead of directly passing an object
    set(state => ({
      sessions: [],
      currentSessionId: null
    }));
  }
});
