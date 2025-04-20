
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/store";
import { PlusIcon, MessageCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface SidebarProps {
  onSelectChat?: () => void;
}

export default function Sidebar({ onSelectChat }: SidebarProps) {
  // Use separate selectors for each piece of state to avoid unnecessary re-renders
  const sessions = useChatStore(state => state.sessions);
  const currentSessionId = useChatStore(state => state.currentSessionId);
  const createNewSession = useChatStore(state => state.createNewSession);
  const setCurrentSession = useChatStore(state => state.setCurrentSession);
  const deleteSession = useChatStore(state => state.deleteSession);
  
  // Format sessions outside the render to not create a new array on each render
  const sortedSessions = sessions.slice().sort((a, b) => b.updatedAt - a.updatedAt);
  
  const handleNewChat = useCallback(() => {
    createNewSession();
    onSelectChat?.();
  }, [createNewSession, onSelectChat]);
  
  const handleSelectSession = useCallback((sessionId: string) => {
    setCurrentSession(sessionId);
    onSelectChat?.();
  }, [setCurrentSession, onSelectChat]);
  
  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short'
    });
  }, []);
  
  return (
    <div className="h-full flex flex-col bg-uai-dark text-white border-r">
      <div className="p-4">
        <Button 
          onClick={handleNewChat}
          className="w-full bg-uai-primary hover:bg-uai-primary/90 text-white"
        >
          <PlusIcon className="h-4 w-4 mr-2" /> Nova conversa
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {sortedSessions.map((session) => (
          <div 
            key={session.id} 
            className={cn(
              "flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-uai-secondary/20 group",
              currentSessionId === session.id ? "bg-uai-secondary/30" : ""
            )}
            onClick={() => handleSelectSession(session.id)}
          >
            <div className="flex items-center space-x-2 min-w-0">
              <MessageCircle className="h-4 w-4 flex-shrink-0" />
              <div className="truncate text-sm">{session.title}</div>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className="text-xs text-gray-400 hidden group-hover:block">
                {formatDate(session.updatedAt)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        
        {sessions.length === 0 && (
          <div className="text-center p-4 text-sm text-gray-400">
            Nenhuma conversa encontrada
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-uai-secondary/20">
        <div className="text-xs text-center text-gray-400">
          UaiGPT - Powered by OpenAI
        </div>
      </div>
    </div>
  );
}
