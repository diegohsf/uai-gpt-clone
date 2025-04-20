
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useChatStore } from "@/lib/store";

interface ErrorDisplayProps {
  message?: string;
}

export default function ErrorDisplay({ message }: ErrorDisplayProps) {
  const error = useChatStore((state) => state.error);
  const createNewSession = useChatStore((state) => state.createNewSession);

  const handleRetry = () => {
    createNewSession();
  };

  const errorMessage = message || error || "Ocorreu um erro ao processar sua solicitação";

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-red-500 text-xl">!</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Ops! Algo deu errado</h2>
        <p className="text-gray-600">
          {errorMessage}
        </p>
        <Button onClick={handleRetry} className="bg-uai-primary hover:bg-uai-primary/90">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
