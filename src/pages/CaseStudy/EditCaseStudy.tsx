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
        });

        setOldFeaturedImage(data.featuredImage);
      }
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("industry", formData.industry);
      data.append("name", formData.name);
      data.append("briefIntro", formData.briefIntro);
      data.append("detail", formData.detail);

      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await updateCaseStudyApi(id!, data);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list-casestudy");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
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
                        setFeaturedImage(
                          e.target.files?.[0] || null
                        )
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
                      className="rounded-lg bg-brand-500 px-4 py-3 text-white"
                    >
                      Update Case Study
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