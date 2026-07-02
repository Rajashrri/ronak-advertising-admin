import axios from "axios";

const frontApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/blog`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});
export const getCategoriesApi = async () => {
  return frontApi.get("/list");
};

export const changeFeaturedApi = async (id) => {
  return frontApi.patch(`/change-featured/${id}`);
};

export const addBlogApi = async (data) => {
  return frontApi.post("/add-blog", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getBlogsApi = async () => {
  return frontApi.get("/list-blog");
};

export const deleteBlogApi = async (id) => {
  return frontApi.delete(`/delete-blog/${id}`);
};

export const getBlogByIdApi = async (id) => {
  return frontApi.get(`/blog-detail/${id}`);
};
export const updateBlogApi = async (id, data) => {
  return frontApi.put(
    `/update-blog/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getSeoByIdApi = (id) => {
  return frontApi.get(`/blog-seo/${id}`);
};

export const updateSeoApi = (id, data) => {
  return frontApi.put(`/blog-updateseo/${id}`, data);
};