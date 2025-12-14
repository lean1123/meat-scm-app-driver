import axiosClient from './axiosClient';

export const acceptBidTransport = async (bidId: string) => {
  const res = await axiosClient.post(`transport-bids/${bidId}/confirm`);
  return res;
};
