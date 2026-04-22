import { useState, useEffect, useRef } from "react";
import {
  ChatBubbleLeftEllipsisIcon,
  StarIcon,
  XMarkIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export const FloatingVideo = ({ visible, onToggle }) => {
  if (!visible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-20 right-3 z-30 bg-gray-900 text-white p-2.5 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Mostrar video"
      >
        <VideoCameraIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-3 z-30 w-44 shadow-2xl rounded-lg overflow-hidden border border-gray-600 lg:hidden">
      <button
        onClick={onToggle}
        className="absolute top-1 right-1 z-10 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"
      >
        <XMarkIcon className="h-3.5 w-3.5" />
      </button>
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        {/* <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/x7gazu5rlT8?si=e-MiD73LRR3CHzMt"
          title="Bingo Live Stream"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        /> */}
        <img
          src="/ESCENARIO.png"
          alt="Video Placeholder"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export const DesktopVideo = () => {
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-white/10 shadow-lg"
      style={{ aspectRatio: "16/9" }}
    >
      {/* <iframe
        className="absolute inset-0 w-full h-full"
        src="https://www.youtube.com/embed/x7gazu5rlT8?si=e-MiD73LRR3CHzMt"
        title="Bingo Live Stream"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      /> */}
      <img
        src="/ESCENARIO.png"
        alt="Video Placeholder"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const ChatPanel = ({
  visible,
  onToggle,
  userUid,
  chat,
  logs,
  message,
  setMessage,
  sendChat,
}) => {
  const [activeTab, setActiveTab] = useState("chat");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (visible) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, visible]);

  const sortedChat = [...chat].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendChat(e);
    }
  };

  // Floating toggle button (mobile only, shown when panel is hidden)
  if (!visible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-20 left-3 z-30 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-colors lg:hidden"
        title="Abrir chat"
      >
        <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="flex flex-col bg-gray-800/90 rounded-xl overflow-hidden h-full border border-white/5">
      {/* Header with close (mobile) */}
      <div className="flex items-center border-b border-gray-700/50">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
            activeTab === "chat"
              ? "text-white border-b-2 border-indigo-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <ChatBubbleLeftEllipsisIcon className="h-3.5 w-3.5" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
            activeTab === "logs"
              ? "text-white border-b-2 border-indigo-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <StarIcon className="h-3.5 w-3.5" />
          Eventos
        </button>
        <button
          onClick={onToggle}
          className="p-2 text-gray-400 hover:text-white lg:hidden"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === "chat" ? (
          <div className="space-y-1.5">
            {sortedChat.map((msg, index) => {
              const isOwn = msg.userId === userUid;
              return (
                <div
                  key={index}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-2.5 py-1 ${
                      isOwn
                        ? "bg-green-700 text-white"
                        : "bg-gray-600 text-gray-100"
                    }`}
                  >
                    {!isOwn && (
                      <p className="text-[10px] font-semibold text-green-300">
                        {msg.userName}
                      </p>
                    )}
                    <p className="text-xs leading-snug">{msg.message}</p>
                    <p className="text-[9px] text-gray-300 text-right">
                      {msg.date?.split(" ")[1] || ""}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        ) : (
          <div className="space-y-1">
            {logs && logs.length > 0 ? (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="text-[11px] text-gray-300 bg-gray-700 rounded px-2 py-1"
                >
                  {log}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-2">
                Sin eventos aún
              </p>
            )}
          </div>
        )}
      </div>

      {/* Inline message input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1.5 p-2 border-t border-gray-700/50"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          className="flex-1 rounded-full border border-gray-600 bg-gray-700 text-white px-3 py-1.5 text-xs
            focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400
            placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-1.5 rounded-full transition-colors ${
            message.trim()
              ? "bg-indigo-600 hover:bg-indigo-500 text-white"
              : "bg-gray-600 text-gray-500 cursor-not-allowed"
          }`}
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
