import { io } from "socket.io-client";
import { useEffect } from "react";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.VITE_BACKEND_URL
    ? import.meta.env.VITE_BACKEND_URL.replace(/\/api\/?$/, "")
    : import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
    : "");

const socket = socketUrl
  ? io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true
    })
  : null;

const useSocket = (auctionId, onNewBid) => {
  useEffect(() => {
    if (!socket || !auctionId) {
      return;
    }

    socket.emit("joinAuction", auctionId);

    const handleNewBid = (bid) => {
      if (onNewBid) {
        onNewBid(bid);
      }
    };

    socket.on("newBid", handleNewBid);

    return () => {
      socket.off("newBid", handleNewBid);
      socket.emit("leaveAuction", auctionId);
    };
  }, [auctionId, onNewBid]);
};

export default useSocket;