import API from "./axios";

// Get all conversations for the authenticated user
export const getConversations = () =>
  API.get("/chats/chat");

// Get messages for a specific conversation
export const getMessages = (conversationId) =>
  API.get(`/chats/messages/${conversationId}`);

// Create a new conversation
export const createConversation = (data) =>
  API.post("/chats/chat", data);

// Note: Message sending is handled via Socket.IO in the chat component
// See server.js for the socket event: socket.emit('sendMessage', data)