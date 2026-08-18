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
                      className="btn2"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="btn1"
                    >
                      Update Category <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9766 5.96094L7.60156 10.3359C7.4375 10.5 7.21875 10.582 7 10.582C6.75391 10.582 6.53516 10.5 6.37109 10.3359C6.01562 10.0078 6.01562 9.43359 6.37109 9.10547L9.24219 6.20703H0.875C0.382812 6.20703 0 5.82422 0 5.33203C0 4.86719 0.382812 4.45703 0.875 4.45703H9.24219L6.37109 1.58594C6.01562 1.25781 6.01562 0.683594 6.37109 0.355469C6.69922 0 7.27344 0 7.60156 0.355469L11.9766 4.73047C12.332 5.05859 12.332 5.63281 11.9766 5.96094Z" fill="white"></path></svg>
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