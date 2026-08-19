import axios from "axios";

const caseStudyApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/case-study`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Add
export const addCaseStudyApi = async (data: FormData) => {
  return caseStudyApi.post("/add-case-study", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCaseStudiesApi = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  return caseStudyApi.get("/list-case-study", {
    params: {
      page,
      limit,
      search,
    },
  });
};

// Detail
export const getCaseStudyByIdApi = async (id: string) => {
  return caseStudyApi.get(`/case-study-detail/${id}`);
};

// Update
export const updateCaseStudyApi = async (
  id: string,
  data: FormData
) => {
  return caseStudyApi.put(
    `/update-case-study/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// Delete
export const deleteCaseStudyApi = async (id: string) => {
  return caseStudyApi.delete(`/delete-case-study/${id}`);
};

// Featured
export const changeFeaturedApi = async (id: string) => {
  return caseStudyApi.patch(`/change-featured/${id}`);
};

// Status
export const changeCaseStudyStatusApi = async (id: string) => {
  return caseStudyApi.patch(`/change-status/${id}`);
};

// SEO Detail
export const getCaseStudySeoApi = async (id: string) => {
  return caseStudyApi.get(`/case-study-seo/${id}`);
};

// SEO Update
export const updateCaseStudySeoApi = async (
  id: string,
  data: any
) => {
  return caseStudyApi.put(
    `/case-study-updateseo/${id}`,
    data
  );
};