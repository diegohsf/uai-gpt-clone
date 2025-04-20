
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSession, Message } from '@/types/chat';
import { generateChatResponse, generateTitle } from './openai';

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createNewSession: () => Promise<string>;
  sendMessage: (content: string) => Promise<void>;
  setCurrentSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearSessions: () => void;
  getCurrentSession: () => ChatSession | null;
  getAllSessions: () => ChatSession[];
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      error: null,
      
      createNewSession: async () => {
        const id = Date.now().toString();
        const newSession: ChatSession = {
          id,
          title: "Nova conversa",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        // Usando uma função para atualizar o estado para evitar loops de renderização
        set((state) => {
          // Verificamos se a sessão já existe para evitar duplicações
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
      
      sendMessage: async (content: string) => {
        // Verify if there's an active session
        let sessionId = get().currentSessionId;
        if (!sessionId) {
          sessionId = await get().createNewSession();
        }
        
        // Create user message
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          role: 'user',
          content,
          timestamp: Date.now()
        };
        
        // Update state to reflect the user message
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
          
          // Generate AI response
          const aiResponse = await generateChatResponse(messages);
          
          // Create AI message
          const aiMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: aiResponse,
            timestamp: Date.now()
          };
          
          // Update chat with AI response
          set(state => {
            const updatedSessions = state.sessions.map(session => {
              if (session.id === sessionId) {
                // Update the session with the AI message
                const updatedSession = {
                  ...session,
                  messages: [...session.messages, aiMessage],
                  updatedAt: Date.now()
                };
                
                // If this is the first message, generate a title
                if (session.messages.length <= 1) {
                  // Usando uma Promise sem state update dentro
                  generateTitle([userMessage]).then(title => {
                    if (title) {
                      set(state => ({
                        sessions: state.sessions.map(s => 
                          s.id === sessionId ? { ...s, title } : s
                        )
                      }));
                    }
                  });
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
          });
        }
      },
      
      setCurrentSession: (sessionId: string) => {
        set({ currentSessionId: sessionId });
      },
      
      deleteSession: (sessionId: string) => {
        set(state => {
          // Filter out the session to be deleted
          const updatedSessions = state.sessions.filter(
            session => session.id !== sessionId
          );
          
          // If we're deleting the current session, set currentSessionId to the first available session or null
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
        set({
          sessions: [],
          currentSessionId: null
        });
      },
      
      getCurrentSession: () => {
        const { sessions, currentSessionId } = get();
        if (!currentSessionId) return null;
        return sessions.find(session => session.id === currentSessionId) || null;
      },
      
      getAllSessions: () => {
        return get().sessions.sort((a, b) => b.updatedAt - a.updatedAt);
      }
    }),
    {
      name: 'uai-gpt-chat-storage'
    }
  )
);
