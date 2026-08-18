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
                      className="btn1"
                    >
                      Add Category <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9766 5.96094L7.60156 10.3359C7.4375 10.5 7.21875 10.582 7 10.582C6.75391 10.582 6.53516 10.5 6.37109 10.3359C6.01562 10.0078 6.01562 9.43359 6.37109 9.10547L9.24219 6.20703H0.875C0.382812 6.20703 0 5.82422 0 5.33203C0 4.86719 0.382812 4.45703 0.875 4.45703H9.24219L6.37109 1.58594C6.01562 1.25781 6.01562 0.683594 6.37109 0.355469C6.69922 0 7.27344 0 7.60156 0.355469L11.9766 4.73047C12.332 5.05859 12.332 5.63281 11.9766 5.96094Z" fill="white"></path></svg>
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