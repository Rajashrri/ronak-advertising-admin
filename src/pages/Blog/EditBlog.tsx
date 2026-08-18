import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import RichTextEditor from "../../components/editor/RichTextEditor";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";

import { getCategoriesApi } from "../../api/blogCategoryApi";

import { getBlogByIdApi, updateBlogApi } from "../../api/blogApi";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [mainImage, setMainImage] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);

  const [oldMainImage, setOldMainImage] = useState("");
  const [oldFeaturedImage, setOldFeaturedImage] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchBlog();
  }, []);

  const fetchCategories = async () => {
    const response = await getCategoriesApi();

    if (response.data.success) {
      setCategories(response.data.data);
    }
  };

  const fetchBlog = async () => {
    const response = await getBlogByIdApi(id);

    const blog = response.data.data;

    setFormData({
      categoryId: blog.categoryId?._id,
      title: blog.title,
      slug: blog.slug,
      author: blog.author || "",
      date: blog.date ? new Date(blog.date).toISOString().split("T")[0] : "",
      shortDescription: blog.shortDescription,
      description: blog.description,
    });

    setOldMainImage(blog.mainImage);
    setOldFeaturedImage(blog.featuredImage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setFormData({
        ...formData,
        title: value,
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("categoryId", formData.categoryId);
      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append("shortDescription", formData.shortDescription);
      data.append("description", formData.description);
      data.append("author", formData.author);
      data.append("date", formData.date);
      console.log(mainImage);
      console.log(featuredImage);
      if (mainImage) {
        data.append("mainImage", mainImage);
      }

      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await updateBlogApi(id, data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/blog");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Blog" />

      <div className="space-y-6">
        <ComponentCard title="Edit Blog">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Blog Category
                    </label>

                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    >
                      <option value="">Select Category</option>

                      {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Blog Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>

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
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Author
                    </label>

                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                      placeholder="Enter author name"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Publish Date
                    </label>

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Main Image
                    </label>
                    {oldMainImage && (
                      <img
                        src={oldMainImage}
                        alt="Main"
                        width="120"
                        className="mb-3 rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMainImage(e.target.files[0])}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Featured Image
                    </label>
                    {oldFeaturedImage && (
                      <img
                        src={oldFeaturedImage}
                        alt="Featured"
                        width="120"
                        className="mb-3 rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFeaturedImage(e.target.files[0])}
                    />
                  </div>
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
                  </div>

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
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="btn2"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="btn1"
                    >
                      Update Blog <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9766 5.96094L7.60156 10.3359C7.4375 10.5 7.21875 10.582 7 10.582C6.75391 10.582 6.53516 10.5 6.37109 10.3359C6.01562 10.0078 6.01562 9.43359 6.37109 9.10547L9.24219 6.20703H0.875C0.382812 6.20703 0 5.82422 0 5.33203C0 4.86719 0.382812 4.45703 0.875 4.45703H9.24219L6.37109 1.58594C6.01562 1.25781 6.01562 0.683594 6.37109 0.355469C6.69922 0 7.27344 0 7.60156 0.355469L11.9766 4.73047C12.332 5.05859 12.332 5.63281 11.9766 5.96094Z" fill="white"></path></svg>
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
