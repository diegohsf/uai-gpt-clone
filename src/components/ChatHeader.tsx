
import { Button } from "@/components/ui/button";
import { PlusIcon, Menu } from "lucide-react";
import { useChatStore } from "@/lib/store";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatHeader() {
  const createNewSession = useChatStore((state) => state.createNewSession);
  const isMobile = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const handleNewChat = () => {
    createNewSession();
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-uai-primary">UaiGPT</h1>
        </div>
        <Button onClick={handleNewChat} variant="outline" size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Mobile sidebar */}
      {isMobile && showMobileSidebar && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileSidebar(false)}>
          <div 
            className="w-64 h-full" 
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onSelectChat={() => setShowMobileSidebar(false)} />
          </div>
        </div>
      )}
    </>
  );
}
