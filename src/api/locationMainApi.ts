import axios from "axios";

const locationMainApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/location-main`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// =======================
// ACTIVE LOCATIONS
// =======================

export const getActiveLocationsApi = async () => {
  return locationMainApi.get("/active-locations");
};

// =======================
// ADD
// =======================

export const addLocationMainApi = async (data: any) => {
  return locationMainApi.post(
    "/add-location-main",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// =======================
// LIST
// =======================

export const getLocationMainListApi = async () => {
  return locationMainApi.get(
    "/list-location-main"
  );
};

// =======================
// DETAIL
// =======================

export const getLocationMainDetailApi = async (
  id: string
) => {
  return locationMainApi.get(
    `/location-main-detail/${id}`
  );
};

// =======================
// UPDATE
// =======================

export const updateLocationMainApi = async (
  id: string,
  data: any
) => {
  return locationMainApi.put(
    `/update-location-main/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// =======================
// DELETE
// =======================

export const deleteLocationMainApi = async (
  id: string
) => {
  return locationMainApi.delete(
    `/delete-location-main/${id}`
  );
};

// =======================
// STATUS
// =======================

export const changeLocationMainStatusApi = async (
  id: string
) => {
  return locationMainApi.patch(
    `/change-status/${id}`
  );
};

export const deleteGalleryImageApi = (
  id: string,
  image: string
) => {
  return locationMainApi.delete(`/delete-gallery-image/${id}`, {
    data: {
      image,
    },
  });
};