import axios from "axios";

const mediaCoverageApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/media-coverage`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Add
export const addMediaCoverageApi = async (data: any) => {
  return mediaCoverageApi.post(
    "/add-media-coverage",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// List
export const getMediaCoverageApi = async () => {
  return mediaCoverageApi.get(
    "/list-media-coverage"
  );
};

// Detail
export const getMediaCoverageByIdApi = async (
  id: string
) => {
  return mediaCoverageApi.get(
    `/media-coverage-detail/${id}`
  );
};

// Update
export const updateMediaCoverageApi = async (
  id: string,
  data: any
) => {
  return mediaCoverageApi.put(
    `/update-media-coverage/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// Delete
export const deleteMediaCoverageApi = async (
  id: string
) => {
  return mediaCoverageApi.delete(
    `/delete-media-coverage/${id}`
  );
};

// Status Toggle
export const changeMediaCoverageStatusApi =
  async (id: string) => {
    return mediaCoverageApi.patch(
      `/change-status/${id}`
    );
  };