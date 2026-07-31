import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  getLocationMainDetailApi,
  updateLocationSeoApi,
} from "../../api/locationMainApi";

export default function UpdateLocationSeo() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    mainImageAlt: "",
    featuredImageAlt: "",
    schemaCode: "",
  });

  const [errors, setErrors] = useState<any>({});

  // ===========================
  // LOAD DETAIL
  // ===========================

  const fetchDetail = async () => {
    try {
      setLoading(true);

      const response = await getLocationMainDetailApi(id!);

      if (response.data.success) {
        const item = response.data.data;

        setFormData({
          metaTitle: item.metaTitle || "",
          metaKeywords: item.metaKeywords || "",
          metaDescription: item.metaDescription || "",
          mainImageAlt: item.mainImageAlt || "",
          featuredImageAlt: item.featuredImageAlt || "",
          schemaCode: item.schemaCode || "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  // ===========================
  // HANDLE CHANGE
  // ===========================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // SUBMIT
  // ===========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let err: any = {};

    if (!formData.metaTitle.trim()) err.metaTitle = "Meta Title is required";

    setErrors(err);

    if (Object.keys(err).length > 0) return;

    try {
      const response = await updateLocationSeoApi(id!, formData);

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Update SEO" />

      <div className="space-y-6">
        <ComponentCard title="Update SEO">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Meta Title */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Meta Title
                    </label>

                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 focus:border-blue-500 focus:outline-none"
                    />

                    {errors.metaTitle && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.metaTitle}
                      </p>
                    )}
                  </div>
                  {/* Meta Keywords */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Meta Keywords
                    </label>

                    <input
                      type="text"
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleChange}
                      placeholder="keyword1, keyword2, keyword3"
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  {/* Alt Tag Main Image */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Alt Tag Main Image
                    </label>

                    <input
                      type="text"
                      name="mainImageAlt"
                      value={formData.mainImageAlt}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  {/* Alt Tag Featured Image */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Alt Tag Featured Image
                    </label>

                    <input
                      type="text"
                      name="featuredImageAlt"
                      value={formData.featuredImageAlt}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  {/* Meta Description */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Meta Description
                    </label>

                    <textarea
                      rows={5}
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  {/* Schema Code */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Schema Code
                    </label>

                    <textarea
                      rows={12}
                      name="schemaCode"
                      value={formData.schemaCode}
                      onChange={handleChange}
                      placeholder="Paste JSON-LD Schema here"
                      className="w-full rounded-lg border border-gray-300 p-4 font-mono text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>{" "}
                </div>

                {/* Buttons */}

                <div className="mt-8">
                  <div className="flex justify-end gap-3">
                    <Link
                      to="/list-location"
                      className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Back
                    </Link>

                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Updating..." : "Update SEO"}
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
