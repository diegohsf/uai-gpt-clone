
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import { useChatStore } from '@/lib/store';

const Index = () => {
  const isMobile = useIsMobile();
  const createNewSession = useChatStore((state) => state.createNewSession);
  const currentSessionId = useChatStore((state) => state.currentSessionId);
  const sessions = useChatStore((state) => state.sessions);

  // Log store state for debugging
  useEffect(() => {
    console.log("Chat sessions loaded:", sessions.length);
  }, [sessions]);

  // Usamos um useEffect para criar uma nova sessão apenas se não existir
  useEffect(() => {
    const initializeChat = async () => {
      if (!currentSessionId) {
        console.log("No current session, creating a new one");
        await createNewSession();
      } else {
        console.log("Current session exists:", currentSessionId);
      }
    };
    
    initializeChat();
    // Adicionamos createNewSession como dependência para evitar warnings
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSessionId]);

  return (
    <div className="flex h-screen bg-white dark:bg-uai-dark">
      {/* Sidebar - hidden on mobile unless toggled */}
      {!isMobile && (
        <div className="w-64 h-full flex-shrink-0">
          <Sidebar />
        </div>
      )}
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
};

export default Index;
