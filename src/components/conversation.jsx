const ConversationList = ({ conversations, onSelect, activeId }) => {
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          Conversations
        </h3>
        <p className="text-sm text-gray-600 mt-1">{conversations.length} active</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-600 text-sm">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = activeId === conv._id;
            const otherParticipant = conv.participants?.find((p) => p._id !== conv.currentUserId);

            return (
              <div
                key={conv._id}
                onClick={() => onSelect(conv)}
                className={`p-4 cursor-pointer transition-all border-b border-gray-100 hover:bg-gray-50 ${
                  isActive ? "bg-blue-50 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                    isActive ? "bg-blue-600" : "bg-gray-500"
                  }`}>
                    {getInitials(otherParticipant?.name || conv.auction?.title || "Chat")}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold truncate ${
                        isActive ? "text-blue-900" : "text-gray-900"
                      }`}>
                        {otherParticipant?.name || conv.auction?.title || "Chat"}
                      </h4>
                      {conv.lastMessage?.createdAt && (
                        <span className={`text-xs ${
                          isActive ? "text-blue-600" : "text-gray-500"
                        }`}>
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    {conv.auction?.title && otherParticipant && (
                      <p className="text-xs text-gray-500 truncate mb-1">
                        Re: {conv.auction.title}
                      </p>
                    )}
                    {conv.lastMessage?.text && (
                      <p className={`text-sm truncate ${
                        isActive ? "text-blue-700" : "text-gray-600"
                      }`}>
                        {conv.lastMessage.text}
                      </p>
                    )}
                  </div>

                  {/* Unread Badge */}
                  {conv.unreadCount > 0 && (
                    <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;