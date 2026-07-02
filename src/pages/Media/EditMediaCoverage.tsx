import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Link } from "react-router";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  getMediaCoverageByIdApi,
  updateMediaCoverageApi,
} from "../../api/mediaCoverageApi";

export default function EditMediaCoverage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    publishedDate: "",
    sourceName: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getMediaCoverageByIdApi(id!);

      if (res.data.success) {
        const data = res.data.data;

        setFormData({
          name: data.name,
          publishedDate: data.publishedDate
            ? data.publishedDate.split("T")[0]
            : "",
          sourceName: data.sourceName,
        });

        setImagePreview(data.image);
      }
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let err: any = {};

    if (!formData.name.trim()) err.name = "Name is required";

    if (!formData.publishedDate.trim())
      err.publishedDate = "Published Date is required";

    if (!formData.sourceName.trim()) err.sourceName = "Source Name is required";

    setErrors(err);

    if (Object.keys(err).length > 0) return;

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("publishedDate", formData.publishedDate);
      data.append("sourceName", formData.sourceName);

      if (image) {
        data.append("image", image);
      }

      const response = await updateMediaCoverageApi(id!, data);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list-mediacoverage");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Media Coverage" />

      <div className="space-y-6">
        <ComponentCard title="Edit Media Coverage">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block">Name</label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.name && (
                      <p className="text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Published Date */}
                  <div>
                    <label className="mb-1.5 block">Published Date</label>

                    <input
                      type="date"
                      name="publishedDate"
                      value={formData.publishedDate}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.publishedDate && (
                      <p className="text-red-500">{errors.publishedDate}</p>
                    )}
                  </div>

                  {/* Source Name */}
                  <div>
                    <label className="mb-1.5 block">Source Name</label>

                    <input
                      type="text"
                      name="sourceName"
                      value={formData.sourceName}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.sourceName && (
                      <p className="text-red-500">{errors.sourceName}</p>
                    )}
                  </div>

                  {/* Image */}
                  <div>
                    <label className="mb-1.5 block">Image</label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                    />
                  </div>

                  {/* Preview */}
                  {imagePreview && (
                    <div>
                      <label className="mb-2 block">Preview</label>

                      <img
                        src={imagePreview}
                        alt="preview"
                        className="h-32 w-32 rounded-lg border object-cover"
                      />
                    </div>
                  )}

                  {/* Submit */}
                 <div className="mt-6 flex justify-end gap-3">
                    <Link
                      to="/list-mediacoverage"
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Back
                    </Link>

                    <button
                      type="submit"
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Update
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
