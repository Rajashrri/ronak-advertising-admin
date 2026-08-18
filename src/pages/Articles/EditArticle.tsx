import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import { Link } from "react-router";

import {
  getArticleByIdApi,
  updateArticleApi,
} from "../../api/articleApi";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    publishedDate: "",
    sourceName: "",
    briefIntro: "",
    articleLink: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [errors, setErrors] = useState<any>({});

  // ================= LOAD DATA =================
  const fetchArticle = async () => {
    try {
      const res = await getArticleByIdApi(id as string);

      if (res.data.success) {
        const data = res.data.data;

        setFormData({
          name: data.name,
          publishedDate: data.publishedDate?.split("T")[0],
          sourceName: data.sourceName,
          briefIntro: data.briefIntro,
          articleLink: data.articleLink,
        });

        setPreview(data.image);
      }
    } catch (error) {
      toast.error("Failed to load article");
    }
  };

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= VALIDATION =================
  const validate = () => {
    let err: any = {};

    if (!formData.name) err.name = "Name is required";
    if (!formData.publishedDate)
      err.publishedDate = "Date is required";
    if (!formData.sourceName)
      err.sourceName = "Source is required";
    if (!formData.briefIntro)
      err.briefIntro = "Brief intro is required";
    if (!formData.articleLink)
      err.articleLink = "Article link is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("publishedDate", formData.publishedDate);
      data.append("sourceName", formData.sourceName);
      data.append("briefIntro", formData.briefIntro);
      data.append("articleLink", formData.articleLink);

      if (image) {
        data.append("image", image);
      }

      const res = await updateArticleApi(id as string, data);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/list-article");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Update failed"
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Article" />

      <div className="space-y-6">
        <ComponentCard title="Edit Article">
          <div className="rounded-xl border bg-white p-6">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAME */}
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* IMAGE */}
              <div>
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files?.[0] || null)
                  }
                />

                {/* Preview */}
                {preview && (
                  <img
                    src={preview}
                    className="h-20 w-20 mt-2 rounded border"
                  />
                )}
              </div>

              {/* DATE */}
              <div>
                <label>Published Date</label>
                <input
                  type="date"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                {errors.publishedDate && (
                  <p className="text-red-500 text-sm">
                    {errors.publishedDate}
                  </p>
                )}
              </div>

              {/* SOURCE */}
              <div>
                <label>Source Name</label>
                <input
                  type="text"
                  name="sourceName"
                  value={formData.sourceName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                {errors.sourceName && (
                  <p className="text-red-500 text-sm">
                    {errors.sourceName}
                  </p>
                )}
              </div>

              {/* BRIEF */}
              <div>
                <label>Brief Intro</label>
                <textarea
                  name="briefIntro"
                  value={formData.briefIntro}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  rows={4}
                />
                {errors.briefIntro && (
                  <p className="text-red-500 text-sm">
                    {errors.briefIntro}
                  </p>
                )}
              </div>

              {/* LINK */}
              <div>
                <label>Article Link</label>
                <input
                  type="text"
                  name="articleLink"
                  value={formData.articleLink}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                {errors.articleLink && (
                  <p className="text-red-500 text-sm">
                    {errors.articleLink}
                  </p>
                )}
              </div>

              {/* BUTTON */}
                 <div className="mt-6 flex justify-start gap-3">
                    <Link
                      to="/list-article"
                      className="btn2"
                    >
                      Back
                    </Link>

                    <button
                      type="submit"
                      className="btn1"
                    >
                      Update <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9766 5.96094L7.60156 10.3359C7.4375 10.5 7.21875 10.582 7 10.582C6.75391 10.582 6.53516 10.5 6.37109 10.3359C6.01562 10.0078 6.01562 9.43359 6.37109 9.10547L9.24219 6.20703H0.875C0.382812 6.20703 0 5.82422 0 5.33203C0 4.86719 0.382812 4.45703 0.875 4.45703H9.24219L6.37109 1.58594C6.01562 1.25781 6.01562 0.683594 6.37109 0.355469C6.69922 0 7.27344 0 7.60156 0.355469L11.9766 4.73047C12.332 5.05859 12.332 5.63281 11.9766 5.96094Z" fill="white"></path></svg>
                    </button>
                  </div>
            </form>

          </div>
        </ComponentCard>
      </div>
    </>
  );
}