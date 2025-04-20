
export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-5 max-w-md">
        <h2 className="text-3xl font-bold text-uai-primary">UaiGPT</h2>
        <p className="text-lg text-gray-600">
          Chat com IA usando o modelo GPT-4o-mini da OpenAI.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Como usar:</h3>
            <p className="text-sm text-gray-600">
              Digite sua pergunta ou comando abaixo e a IA irá responder com base no conhecimento disponível.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Experimente perguntar:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>"Explique como fazer um pão de queijo"</li>
              <li>"O que é inteligência artificial?"</li>
              <li>"Escreva um poema sobre Minas Gerais"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
