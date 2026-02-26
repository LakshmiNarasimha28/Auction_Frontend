import API from "./axios";

export const getAuctions = () => API.get("/auctions");

export const getAuctionById = (id) =>
  API.get(`/auctions/${id}`);

export const createAuction = (formData) =>
  API.post("/auctions", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const placeBid = (auctionId, bidAmount) =>
  API.post(`/auctions/${auctionId}/bid`, { bidAmount });