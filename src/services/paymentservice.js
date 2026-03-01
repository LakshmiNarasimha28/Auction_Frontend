import API from "./axios";

export const createOrder = (auctionId) =>
  API.post(`/payments/${auctionId}/order`);

export const verifyPayment = (data) =>
  API.post("/payments/verify", data);

export const createDirectPayment = (auctionId) =>
  API.post(`/payments/${auctionId}/direct`);

export const confirmDirectPayment = (paymentId) =>
  API.patch(`/payments/${paymentId}/confirm`);

export const getPaymentDetails = (auctionId) =>
  API.get(`/payments/${auctionId}`);