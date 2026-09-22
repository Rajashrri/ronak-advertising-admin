
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


export const downloadLocationMainBulkUploadApi = async (
  id: string
) => {
  const response = await bulkApi.get(
    `/download/${id}`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data]);

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "location-main-bulk-upload.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};