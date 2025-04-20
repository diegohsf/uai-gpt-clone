
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={cn(
      "py-5 px-5 md:px-8",
      isUser ? "bg-white" : "bg-neutral-50"
    )}>
      <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white",
          isUser ? "bg-uai-primary" : "bg-uai-secondary"
        )}>
          {isUser ? (
            <span className="text-sm font-semibold">U</span>
          ) : (
            <span className="text-sm font-semibold">AI</span>
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="font-semibold">
            {isUser ? "Você" : "UaiGPT"}
          </div>
          
          {isUser ? (
            <div className="prose prose-sm md:prose-base max-w-none">
              {message.content}
            </div>
          ) : (
            <div className="prose prose-sm md:prose-base max-w-none markdown">
              <ReactMarkdown
                components={{
                  code({className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
