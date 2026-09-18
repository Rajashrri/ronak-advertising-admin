import axios from "axios";

const bulkApi = axios.create({
  baseURL:
    `${import.meta.env.VITE_API_BASE_URL}/api/location-bulk-upload`,
});

export const getBulkUploadListApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return bulkApi.get("/list", {
    params: {
      page,
      limit,
      search,
    },
  });
};

export const bulkUploadApi = (
  data: FormData
) => {
  return bulkApi.post(
    "/upload",
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};

export const bulkUploadDetailApi = (
  id: string
) => {
  return bulkApi.get(
    `/detail/${id}`
  );
};