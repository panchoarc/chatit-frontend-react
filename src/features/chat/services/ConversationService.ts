import instance from "@/config/axios";

export const getUserConversations = async () => {
  try {
    const response = await instance.get(`/conversations`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getChatMembers = async (conversationId: number) => {
  try {
    const response = await instance.get(
      `/conversations/${conversationId}/members`
    );

    const { data } = response.data;
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getChatMessages = async (
  conversationId: number,
  page: number = 0,
  size: number = 50
) => {
  try {
    const response = await instance.get(
      `/conversations/${conversationId}/messages`,
      {
        params: { page, size },
      }
    );

    const { data, pagination } = response.data;
    return {
      conversations: data,
      pagination: pagination,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

const ConversationService = {
  getUserConversations,
  getChatMembers,
  getChatMessages,
};

export default ConversationService;
