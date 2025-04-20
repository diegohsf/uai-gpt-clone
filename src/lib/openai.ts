
import { Message } from "@/types/chat";

const API_KEY = "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";
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export async function generateChatResponse(messages: Message[]): Promise<string> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro na API da OpenAI");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao chamar a API OpenAI:", error);
    throw error;
  }
}

export function generateTitle(messages: Message[]): Promise<string> {
  const userMessage = messages.find(msg => msg.role === "user")?.content || "";
  const truncated = userMessage.slice(0, 30);
  return Promise.resolve(truncated + (userMessage.length > 30 ? "..." : ""));
}
