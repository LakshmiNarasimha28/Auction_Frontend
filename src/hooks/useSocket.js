import { io } from "socket.io-client";
import { useEffect } from "react";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.VITE_BACKEND_URL
    ? import.meta.env.VITE_BACKEND_URL.replace(/\/api\/?$/, "")
    : import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
    : "");

export const socket = socketUrl
  ? io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true
    })
  : null;

const useSocket = (auctionId, onNewBid, conversationId, onMessage) => {
  useEffect(() => {
    if (!socket || !auctionId) {
      return;
    }

    socket.emit("joinAuction", auctionId);
    socket.emit("joinConversation", conversationId);

    const handleNewBid = (bid) => {
      if (onNewBid) {
        onNewBid(bid);
      }
    };

    socket.on("newBid", handleNewBid);
    socket.on("receiveMessage", (message) => { onMessage(message);});

    return () => {
      socket.off("newBid", handleNewBid);
      socket.emit("leaveAuction", auctionId);
      socket.disconnect();
    };
  }, [auctionId, onNewBid, conversationId, onMessage]);
  
    return socket;
};

export default useSocket;