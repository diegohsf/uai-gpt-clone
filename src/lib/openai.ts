
import { Message } from "@/types/chat";

const API_KEY = "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";
const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export async function generateChatResponse(messages: Message[]): Promise<string> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        models: [
          "anthropic/claude-sonnet-4",
          "google/gemini-pro-1.5", 
          "openai/gpt-4.1-mini"
        ],
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.1,
        max_tokens: 1000000,
        top_p: 1
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro na API do OpenRouter");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao chamar a API OpenRouter:", error);
    throw error;
  }
}

export function generateTitle(messages: Message[]): Promise<string> {
  const userMessage = messages.find(msg => msg.role === "user")?.content || "";
  const truncated = userMessage.slice(0, 30);
  return Promise.resolve(truncated + (userMessage.length > 30 ? "..." : ""));
}
