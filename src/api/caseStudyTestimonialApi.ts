import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/case-study-testimonial`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export const addCaseStudyTestimonialApi = async (data: FormData) => {
  return api.post("/add-case-study-testimonial", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCaseStudyTestimonialsApi = async (caseStudyId: string) => {
  return api.get(`/list-case-study-testimonial/${caseStudyId}`);
};

export const getCaseStudyTestimonialByIdApi = async (id: string) => {
  return api.get(`/case-study-testimonial-detail/${id}`);
};

export const updateCaseStudyTestimonialApi = async (
  id: string,
  data: FormData
) => {
  return api.put(`/update-case-study-testimonial/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCaseStudyTestimonialApi = async (id: string) => {
  return api.delete(`/delete-case-study-testimonial/${id}`);
};

export const changeCaseStudyTestimonialStatusApi = async (id: string) => {
  return api.patch(`/change-status/${id}`);
};

export const getSeoByIdApi = async (id: string) => {
  return api.get(`/seo/${id}`);
};

export const updateSeoApi = async (id: string, data: any) => {
  return api.put(`/update-seo/${id}`, data);
};