import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { addMediaCoverageApi } from "../../api/mediaCoverageApi";

export default function AddMediaCoverage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    publishedDate: "",
    sourceName: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let err: any = {};

    if (!formData.name.trim())
      err.name = "Name is required";

    if (!formData.publishedDate.trim())
      err.publishedDate = "Published Date is required";

    if (!formData.sourceName.trim())
      err.sourceName = "Source Name is required";

    if (!image) err.image = "Image is required";

    setErrors(err);

    if (Object.keys(err).length > 0) return;

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append(
        "publishedDate",
        formData.publishedDate
      );
      data.append("sourceName", formData.sourceName);

      if (image) {
        data.append("image", image);
      }

      const response = await addMediaCoverageApi(data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-mediacoverage");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Media Coverage" />

      <div className="space-y-6">
        <ComponentCard title="Add Media Coverage">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">

                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.name && (
                      <p className="text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Published Date */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Published Date
                    </label>

                    <input
                      type="date"
                      name="publishedDate"
                      value={formData.publishedDate}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.publishedDate && (
                      <p className="text-red-500">
                        {errors.publishedDate}
                      </p>
                    )}
                  </div>

                  {/* Source Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Source Name
                    </label>

                    <input
                      type="text"
                      name="sourceName"
                      value={formData.sourceName}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.sourceName && (
                      <p className="text-red-500">
                        {errors.sourceName}
                      </p>
                    )}
                  </div>

                  {/* Image */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImage(
                          e.target.files?.[0] || null
                        )
                      }
                      className="w-full"
                    />

                    {errors.image && (
                      <p className="text-red-500">
                        {errors.image}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-500 px-4 py-3 text-white hover:bg-brand-600"
                  >
                    Add Media Coverage
                  </button>

                </div>
              </form>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}