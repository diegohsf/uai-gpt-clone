
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

export async function generateChatResponse(messages: Message[]): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('chat-completion', {
      body: { messages }
    });

    if (error) {
      throw new Error(error.message || "Erro na função de chat");
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return data.content;
  } catch (error) {
    console.error("Erro ao chamar a função de chat:", error);
    throw error;
  }
}

export function generateTitle(messages: Message[]): Promise<string> {
  const userMessage = messages.find(msg => msg.role === "user")?.content || "";
  const truncated = userMessage.slice(0, 30);
  return Promise.resolve(truncated + (userMessage.length > 30 ? "..." : ""));
}
