import instance from "@/config/axios";

export const getStatus = async (currentUserId: string) => {
  try {
    const response = await instance.get(`/presence/${currentUserId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const PresenceService = {
  getStatus,
};

export default PresenceService;
