import axios from "axios";

const locationApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/location`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ================= ADD =================
export const addLocationApi = async (data: any) => {
  return locationApi.post("/add-location", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ================= LIST =================
export const getLocationsApi = async () => {
  return locationApi.get("/list-location");
};

// ================= DETAIL =================
export const getLocationByIdApi = async (id: string) => {
  return locationApi.get(`/location-detail/${id}`);
};

// ================= UPDATE =================
export const updateLocationApi = async (
  id: string,
  data: any
) => {
  return locationApi.put(
    `/update-location/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// ================= DELETE =================
export const deleteLocationApi = async (id: string) => {
  return locationApi.delete(`/delete-location/${id}`);
};

// ================= STATUS =================
export const changeLocationStatusApi = async (
  id: string
) => {
  return locationApi.patch(`/change-status/${id}`);
};