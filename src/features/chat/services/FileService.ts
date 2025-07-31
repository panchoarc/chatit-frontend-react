import instance from "@/config/axios";

export const uploadFileToConversation = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await instance.post(`/files`, formData);
    console.log("Response", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const FileService = {
  uploadFileToConversation,
};

export default FileService;
