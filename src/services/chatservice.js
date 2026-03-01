import API from "./axios";

export const getConversations = () =>
  API.get("/chat/conversation");

export const getMessages = (id) =>
  API.get(`/chat/messages/${id}`);

export const createConversation = (data) =>
  API.post("/chat/conversation", data);

export const sendMessage = (data) =>
  API.post("/chat/messages", data);