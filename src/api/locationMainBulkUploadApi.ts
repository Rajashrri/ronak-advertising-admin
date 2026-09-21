
import axios from "axios";

const bulkApi = axios.create({
  baseURL: `${
    import.meta.env.VITE_API_BASE_URL
  }/api/location-main-bulk-upload`,
});

export const getLocationMainBulkUploadListApi = (
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

export const locationMainBulkUploadApi = (
  data: FormData
) => {
  return bulkApi.post("/upload", data, {
    timeout: 10 * 60 * 1000,
  });
};

export const getLocationMainBulkUploadDetailApi = (
  id: string
) => {
  return bulkApi.get(`/detail/${id}`);
};
