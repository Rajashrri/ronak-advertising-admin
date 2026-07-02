import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { addCategoryApi } from "../../api/blogCategoryApi";
import { toast } from "react-toastify";

export default function AddCatogery() {

  const [formData, setFormData] = useState<{
    categoryName: string;
    slug: string;
  }>({
    categoryName: "",
    slug: "",
  });

  const [errors, setErrors] = useState<{
    categoryName?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "categoryName") {
      setFormData({
        categoryName: value,
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      });

      setErrors((prev) => ({
        ...prev,
        categoryName: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors: { categoryName?: string } = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category Name is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await addCategoryApi(formData);

      if (response.data.success) {
        toast.success(response.data.message);

        setFormData({
          categoryName: "",
          slug: "",
        });

        setErrors({});
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Blog Category" />

      <div className="space-y-6">
        <ComponentCard title="Add Blog Category">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">

                  {/* Category Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Category Name
                    </label>

                    <input
                      type="text"
                      name="categoryName"
                      value={formData.categoryName}
                      onChange={handleChange}
                      placeholder="Enter category name"
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.categoryName ? "border-red-500" : ""
                      }`}
                    />

                    {errors.categoryName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.categoryName}
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
                      placeholder="Enter slug"
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>

                  {/* Submit */}
                  <div>
                    <button
                      type="submit"
                      className="rounded-lg bg-brand-500 px-4 py-3 text-white"
                    >
                      Add Category
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