import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RichTextEditor from "../../components/editor/RichTextEditor";

import {
  getCaseStudyByIdApi,
  updateCaseStudyApi,
} from "../../api/caseStudyApi";

export default function EditCaseStudy() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    industry: "",
    name: "",
    briefIntro: "",
    detail: "",
    slug: "",
  });

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [oldFeaturedImage, setOldFeaturedImage] = useState("");

  useEffect(() => {
    fetchCaseStudy();
  }, []);

  const fetchCaseStudy = async () => {
    try {
      const response = await getCaseStudyByIdApi(id);

      if (response.data.success) {
        const data = response.data.data;

        setFormData({
          industry: data.industry,
          name: data.name,
          briefIntro: data.briefIntro,
          detail: data.detail,
          slug: data.slug,
        });

        setOldFeaturedImage(data.featuredImage);
      }
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && { slug: generateSlug(value) }),
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("industry", formData.industry);
      data.append("name", formData.name);
      data.append("briefIntro", formData.briefIntro);
      data.append("detail", formData.detail);
      data.append("slug", formData.slug);
      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await updateCaseStudyApi(id!, data);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list-casestudy");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Case Study" />

      <div className="space-y-6">
        <ComponentCard title="Edit Case Study">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Industry
                    </label>

                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Case Study Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Slug
                    </label>

                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Featured Image
                    </label>

                    {oldFeaturedImage && (
                      <img
                        src={oldFeaturedImage}
                        alt=""
                        width={120}
                        className="mb-3 rounded"
                      />
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFeaturedImage(e.target.files?.[0] || null)
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Brief Intro
                    </label>

                    <textarea
                      rows={4}
                      name="briefIntro"
                      value={formData.briefIntro}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Detail
                    </label>

                    <RichTextEditor
                      value={formData.detail}
                      onChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          detail: val,
                        }))
                      }
                      height={400}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="rounded-lg border px-4 py-3"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="btn1"
                    >
                      Update Case Study <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9766 5.96094L7.60156 10.3359C7.4375 10.5 7.21875 10.582 7 10.582C6.75391 10.582 6.53516 10.5 6.37109 10.3359C6.01562 10.0078 6.01562 9.43359 6.37109 9.10547L9.24219 6.20703H0.875C0.382812 6.20703 0 5.82422 0 5.33203C0 4.86719 0.382812 4.45703 0.875 4.45703H9.24219L6.37109 1.58594C6.01562 1.25781 6.01562 0.683594 6.37109 0.355469C6.69922 0 7.27344 0 7.60156 0.355469L11.9766 4.73047C12.332 5.05859 12.332 5.63281 11.9766 5.96094Z" fill="white"></path></svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
