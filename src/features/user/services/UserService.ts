import instance from "@/config/axios";
const getProfile = async () => {
  try {
    const response = await instance.get(`/users/me`);
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const updateProfile = async (formData) => {
  try {
    const response = await instance.postForm(`/users`, formData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getUserStatus = async (username) => {
  try {
    const response = await instance.get(`/users/${username}/status`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const UserService = {
  getProfile,
  updateProfile,
  getUserStatus,
};

export default UserService;
