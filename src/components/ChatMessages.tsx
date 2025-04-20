
import { useEffect, useRef } from "react";
import { useChatStore } from "@/lib/store";
import MessageItem from "./MessageItem";
import EmptyState from "./EmptyState";
import ErrorDisplay from "./ErrorDisplay";

export default function ChatMessages() {
  const currentSession = useChatStore((state) => state.getCurrentSession());
  const isLoading = useChatStore((state) => state.isLoading);
  const error = useChatStore((state) => state.error);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentSession?.messages]);
  
  if (error) {
    return <ErrorDisplay />;
  }
  
  if (!currentSession || currentSession.messages.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden">
      {currentSession.messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="py-5 px-5 md:px-8 bg-neutral-50">
          <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white bg-uai-secondary">
              <span className="text-sm font-semibold">AI</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold">UaiGPT</div>
              <div className="mt-1.5 h-4 w-12 bg-gray-200 animate-pulse-light rounded"></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
