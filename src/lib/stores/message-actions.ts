
import { StateCreator } from 'zustand';
import { Message } from '@/types/chat';
import { ChatState } from '../types/chat-store';
import { generateChatResponse, generateTitle } from '../openai';

export const createMessageActions = (
  set: (fn: (state: ChatState) => Partial<ChatState>) => void,
  get: () => ChatState
) => ({
  sendMessage: async (content: string) => {
    let sessionId = get().currentSessionId;
    if (!sessionId) {
      sessionId = await get().createNewSession();
    }
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    set(state => {
      const updatedSessions = state.sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, userMessage],
            updatedAt: Date.now()
          };
        }
        return session;
      });
      
      return {
        sessions: updatedSessions,
        isLoading: true,
        error: null
      };
    });
    
    try {
      const currentSession = get().sessions.find(s => s.id === sessionId);
      if (!currentSession) throw new Error("Sessão atual não encontrada");
      
      const messages = [...currentSession.messages, userMessage];
      const aiResponse = await generateChatResponse(messages);
      
      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      };
      
      set(state => {
        const updatedSessions = state.sessions.map(session => {
          if (session.id === sessionId) {
            const updatedSession = {
              ...session,
              messages: [...session.messages, aiMessage],
              updatedAt: Date.now()
            };
            
            if (session.messages.length <= 1) {
              setTimeout(() => {
                generateTitle([userMessage]).then(title => {
                  if (title) {
                    set(state => ({
                      sessions: state.sessions.map(s => 
                        s.id === sessionId ? { ...s, title } : s
                      )
                    }));
                  }
                });
              }, 0);
            }
            
            return updatedSession;
          }
          return session;
        });
        
        return {
          sessions: updatedSessions,
          isLoading: false
        };
      });
      
    } catch (error) {
      console.error("Error in sendMessage:", error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      } as Partial<ChatState>);
    }
  },
});
