
import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";
import { useChatStore } from "@/lib/store";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const isLoading = useChatStore((state) => state.isLoading);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message.trim());
      setMessage("");
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
      <div className="max-w-3xl mx-auto relative">
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Aguardando resposta..." : "Envie uma mensagem..."}
          disabled={isLoading}
          className="pr-12 py-6 border-uai-primary/50 rounded-xl"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading}
          className={`absolute right-1.5 top-1.5 bg-uai-primary hover:bg-uai-primary/90 text-white ${
            !message.trim() || isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
