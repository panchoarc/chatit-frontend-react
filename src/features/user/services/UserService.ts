import instance from "@/config/axios";

const getProfile = async () => {
  try {
    const response = await instance.get(`/users/me`);
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};
const UserService = {
  getProfile,
};

export default UserService;
