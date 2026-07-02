import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  getCategoryByIdApi,
  updateCategoryApi,
} from "../../api/blogCategoryApi";

import { toast } from "react-toastify";

type FormDataType = {
  categoryName: string;
  slug: string;
};

type ErrorType = {
  categoryName: string;
};

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataType>({
    categoryName: "",
    slug: "",
  });

  const [errors, setErrors] = useState<ErrorType>({
    categoryName: "",
  });

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      if (!id) return;

      const response = await getCategoryByIdApi(id);

      if (response.data.success) {
        setFormData({
          categoryName: response.data.data.categoryName || "",
          slug: response.data.data.slug || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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

      setErrors({
        categoryName: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: ErrorType = {
      categoryName: "",
    };

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category Name is required";
    }

    setErrors(newErrors);

    if (newErrors.categoryName) return;

    try {
      if (!id) return;

      const response = await updateCategoryApi(id, formData);

      if (response.data.success) {
        toast.success(response.data.message);

        setTimeout(() => {
          navigate("/blog-catogery");
        }, 1000);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Blog Category" />

      <div className="space-y-6">
        <ComponentCard title="Edit Blog Category">
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
                        errors.categoryName
                          ? "border-red-500"
                          : "border-gray-300"
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
                      className="h-11 w-full rounded-lg border border-gray-300 px-4"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/blog-catogery")}
                      className="rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-100"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-brand-500 px-4 py-3 text-white hover:bg-brand-600"
                    >
                      Update Category
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