import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RichTextEditor from "../../components/editor/RichTextEditor";
import { toast } from "react-toastify";

import { getCategoriesApi } from "../../api/blogCategoryApi";

import { addBlogApi } from "../../api/blogApi";

export default function AddBlog() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    slug: "",
    author: "",
    date: "",
    shortDescription: "",
    description: "",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "title") {
    setFormData((prev) => ({
      ...prev,
      title: value,
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

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Blog Title is required";
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short Description is required";
    }
    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!mainImage) {
      newErrors.mainImage = "Main Image is required";
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

      data.append("categoryId", formData.categoryId);
      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append("shortDescription", formData.shortDescription);
      data.append("description", formData.description);
      data.append("author", formData.author);
      data.append("date", formData.date);
      if (mainImage) {
        data.append("mainImage", mainImage);
      }

      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await addBlogApi(data);

      if (response.data.success) {
        toast.success(response.data.message);

        setFormData({
          categoryId: "",
          title: "",
          slug: "",
          author: "",
          date: "",
          shortDescription: "",
          description: "",
        });

        setMainImage(null);
        setFeaturedImage(null);
        setErrors({});
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Blog" />

      <div className="space-y-6">
        <ComponentCard title="Add Blog">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  {/* Category */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Blog Category
                    </label>

                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.categoryId ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select Category</option>

                      {categories.map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.categoryName}
                        </option>
                      ))}
                    </select>

                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.categoryId}
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Blog Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter blog title"
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.title ? "border-red-500" : ""
                      }`}
                    />

                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.title}
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
                  {/* Author */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Author
                    </label>

                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Enter author name"
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.author ? "border-red-500" : ""
                      }`}
                    />

                    {errors.author && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.author}
                      </p>
                    )}
                  </div>
                  {/* Date */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Publish Date
                    </label>

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.date ? "border-red-500" : ""
                      }`}
                    />

                    {errors.date && (
                      <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                    )}
                  </div>
                  {/* Main Image */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Main Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setMainImage(e.target.files?.[0] || null)
                      }
                    />

                    {errors.mainImage && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.mainImage}
                      </p>
                    )}
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

                  {/* Short Description */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Short Description
                    </label>

                    <textarea
                      rows={3}
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />

                    {errors.shortDescription && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.shortDescription}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Description
                    </label>
                <RichTextEditor
  value={formData.description}
  onChange={(val) =>
    setFormData((prev) => ({
      ...prev,
      description: val,
    }))
  }
  height={400}
/>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <div>
                    <button
                      type="submit"
                      className="rounded-lg bg-brand-500 px-4 py-3 text-white hover:bg-brand-600"
                    >
                      Add Blog
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
