import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RichTextEditor from "../../components/editor/RichTextEditor";
import { toast } from "react-toastify";

import { addCaseStudyApi } from "../../api/caseStudyApi";

export default function AddCaseStudy() {
  const [formData, setFormData] = useState({
    industry: "",
    name: "",
    slug: "",
    briefIntro: "",
    detail: "",
  });

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Case Study Name is required";
    }

    if (!formData.briefIntro.trim()) {
      newErrors.briefIntro = "Brief Intro is required";
    }

    if (!formData.detail.trim()) {
      newErrors.detail = "Detail is required";
    }

    if (!featuredImage) {
      newErrors.featuredImage = "Featured Image is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const data = new FormData();

      data.append("industry", formData.industry);
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("briefIntro", formData.briefIntro);
      data.append("detail", formData.detail);

      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await addCaseStudyApi(data);

      if (response.data.success) {
        toast.success(response.data.message);

        setFormData({
          industry: "",
          name: "",
          slug: "",
          briefIntro: "",
          detail: "",
        });

        setFeaturedImage(null);
        setErrors({});
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Case Study" />

      <div className="space-y-6">
        <ComponentCard title="Add Case Study">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">

                  {/* Industry */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Industry
                    </label>

                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.industry ? "border-red-500" : ""
                      }`}
                    />

                    {errors.industry && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.industry}
                      </p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Case Study Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />

                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Slug */}
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

                  {/* Featured Image */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Featured Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFeaturedImage(e.target.files?.[0] || null)
                      }
                    />

                    {errors.featuredImage && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.featuredImage}
                      </p>
                    )}
                  </div>

                  {/* Brief Intro */}
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

                    {errors.briefIntro && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.briefIntro}
                      </p>
                    )}
                  </div>

                  {/* Detail */}
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

                    {errors.detail && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.detail}
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="rounded-lg bg-brand-500 px-4 py-3 text-white hover:bg-brand-600"
                    >
                      Add Case Study
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