
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChatState } from './types/chat-store';
import { createSessionActions } from './stores/session-actions';
import { createMessageActions } from './stores/message-actions';
import { createSessionSelectors } from './stores/session-selectors';

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      error: null,
      
      ...createSessionActions(set, get),
      ...createMessageActions(set, get),
      ...createSessionSelectors(set, get)
    }),
    {
      name: 'uai-gpt-chat-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId
      }),
    }
  )
);
