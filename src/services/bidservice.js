import API from "./axios";

export const placeBid = async (auctionId, amount) => {
  const numericAmount = Number(amount);

  try {
    return await API.post(`/auctions/${auctionId}/bid`, { bidAmount: numericAmount });
  } catch {
    return API.post(`/bids/${auctionId}`, { amount: numericAmount });
  }
};

export const getBids = async (auctionId) => {
  try {
    return await API.get(`/auctions/${auctionId}/bids`);
  } catch {
    return API.get(`/bids/${auctionId}`);
  }
};