
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

  useEffect(() => {
    if (!currentSessionId) {
      createNewSession();
    }
  }, [currentSessionId, createNewSession]);

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
