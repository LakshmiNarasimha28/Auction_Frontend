import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConversations, getMessages } from "../services/chatservice.js";
import ConversationList from "../components/conversation.jsx";
import ChatWindow from "../components/chatWindow.jsx";
import MessageInput from "../components/message.jsx";
import useAuth from "../hooks/useAuth";
import { io } from "socket.io-client";

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket
  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      (import.meta.env.VITE_BACKEND_URL
        ? import.meta.env.VITE_BACKEND_URL.replace(/\/api\/?$/, "")
        : import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
        : "");

    if (!socketUrl) {
      console.error("Socket URL not configured");
      return;
    }

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    newSocket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join conversation room
  useEffect(() => {
    if (socket && activeConv) {
      socket.emit("joinConversation", activeConv._id);

      return () => {
        socket.emit("leaveConversation", activeConv._id);
      };
    }
  }, [socket, activeConv]);

  // Fetch conversations
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getConversations();
        setConversations(res.data.data || res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load conversations");
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConv) return;

    const fetchMessages = async () => {
      try {
        setMessagesLoading(true);
        setError("");
        const res = await getMessages(activeConv._id);
        setMessages(res.data.data || res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load messages");
        console.error("Error fetching messages:", err);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [activeConv]);

  const handleSend = (text) => {
    if (!socket || !activeConv || !text.trim()) return;

    const messageData = {
      conversationId: activeConv._id,
      sender: user._id || user.id,
      text: text.trim()
    };

    socket.emit("sendMessage", messageData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Messages
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              ></span>
              <span className="text-sm text-gray-600 font-medium">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: "calc(100vh - 250px)" }}>
          <div className="flex h-full">
            <ConversationList
              conversations={conversations}
              onSelect={setActiveConv}
              activeId={activeConv?._id}
            />

            {activeConv ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-4">
                  <h2 className="font-bold text-gray-900 text-lg">
                    {activeConv.auction?.title || "Chat"}
                  </h2>
                  {activeConv.participants && (
                    <p className="text-sm text-gray-600">
                      {activeConv.participants.length} participant{activeConv.participants.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {messagesLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-3"></div>
                      <p className="text-gray-600">Loading messages...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ChatWindow messages={messages} user={user} />
                    <MessageInput onSend={handleSend} />
                  </>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Conversation Selected</h3>
                  <p className="text-gray-600">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;