import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export const MessageInput = ({ message, setMessage, sendChat }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendChat(e);
    }
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-3 py-2 z-40">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm
              focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400
              placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-2.5 rounded-full transition-colors ${
            message.trim()
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          title="Enviar"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};
