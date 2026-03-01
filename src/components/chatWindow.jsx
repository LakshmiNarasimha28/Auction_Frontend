import { useEffect, useRef } from "react";

const ChatWindow = ({ messages, user }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userId = user?._id || user?.id;

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ maxHeight: "calc(100vh - 400px)" }}>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-gray-400 text-sm">Start the conversation by sending a message</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, index) => {
            const senderId = msg.sender?._id || msg.sender;
            const isCurrentUser = String(senderId) === String(userId);
            const senderName = msg.sender?.name || "Unknown";
            const showAvatar = index === 0 || messages[index - 1]?.sender?._id !== msg.sender?._id;

            return (
              <div
                key={msg._id || index}
                className={`flex items-end gap-2 ${
                  isCurrentUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                {showAvatar ? (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                      isCurrentUser ? "bg-blue-600" : "bg-gray-500"
                    }`}
                  >
                    {getInitials(senderName)}
                  </div>
                ) : (
                  <div className="w-8 h-8"></div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    isCurrentUser ? "items-end" : "items-start"
                  }`}
                >
                  {showAvatar && !isCurrentUser && (
                    <p className="text-xs text-gray-600 mb-1 px-3">{senderName}</p>
                  )}
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      isCurrentUser
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isCurrentUser ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef}></div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;