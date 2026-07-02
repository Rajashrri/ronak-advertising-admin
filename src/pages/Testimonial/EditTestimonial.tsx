import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import {
  getTestimonialByIdApi,
  updateTestimonialApi,
} from "../../api/testimonialApi";

export default function EditTestimonial() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    briefIntro: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchTestimonial();
  }, []);

  const fetchTestimonial = async () => {
    try {
      const response = await getTestimonialByIdApi(id!);

      if (response.data.success) {
        const data = response.data.data;

        setFormData({
          name: data.name,
          designation: data.designation,
          briefIntro: data.briefIntro,
        });

        setPreview(data.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let err: any = {};

    if (!formData.name.trim()) err.name = "Name is required";
    if (!formData.designation.trim())
      err.designation = "Designation is required";
    if (!formData.briefIntro.trim())
      err.briefIntro = "Brief Intro is required";

    setErrors(err);

    if (Object.keys(err).length > 0) return;

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("briefIntro", formData.briefIntro);

      if (image) {
        data.append("image", image);
      }

      const response = await updateTestimonialApi(id!, data);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list-Testimonial");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Testimonial" />

      <div className="space-y-6">
        <ComponentCard title="Edit Testimonial">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">

                  <div>
                    <label>Name</label>

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

                  <div>
                    <label>Designation</label>

                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.designation && (
                      <p className="text-red-500">
                        {errors.designation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label>Current Image</label>

                    {preview && (
                      <img
                        src={preview}
                        alt=""
                        className="mt-2 h-24 w-24 rounded-lg border object-cover"
                      />
                    )}
                  </div>

                  <div>
                    <label>Change Image</label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImage(e.target.files?.[0] || null)
                      }
                    />
                  </div>

                  <div>
                    <label>Brief Intro</label>

                    <textarea
                      rows={5}
                      name="briefIntro"
                      value={formData.briefIntro}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />

                    {errors.briefIntro && (
                      <p className="text-red-500">
                        {errors.briefIntro}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="rounded-lg bg-brand-500 px-4 py-3 text-white"
                  >
                    Update Testimonial
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