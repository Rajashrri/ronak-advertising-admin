import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { addCaseStudyTestimonialApi } from "../../api/caseStudyTestimonialApi";
import { useParams } from "react-router";

export default function AddCaseStudyTestimonial() {
const { caseStudyId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    briefIntro: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<any>({});

  

 

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};


    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.briefIntro.trim()) {
      newErrors.briefIntro = "Brief Intro is required";
    }

    if (!image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = new FormData();

data.append("caseStudyId", caseStudyId!);
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("briefIntro", formData.briefIntro);

      if (image) {
        data.append("image", image);
      }

      const response = await addCaseStudyTestimonialApi(data);

      if (response.data.success) {
        toast.success(response.data.message);

        setFormData({
          name: "",
          designation: "",
          briefIntro: "",
        });

        setImage(null);
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
      <PageBreadcrumb pageTitle="Add Case Study Testimonial" />

      <div className="space-y-6">
        <ComponentCard title="Add Case Study Testimonial">
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
                      placeholder="Enter Name"
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />

                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Designation
                    </label>

                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="Enter Designation"
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.designation ? "border-red-500" : ""
                      }`}
                    />

                    {errors.designation && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.designation}
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
                        setImage(e.target.files?.[0] || null)
                      }
                    />

                    {errors.image && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.image}
                      </p>
                    )}
                  </div>

                  {/* Brief Intro */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Brief Intro
                    </label>

                    <textarea
                      rows={4}
                      name="briefIntro"
                      value={formData.briefIntro}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-4 py-3 ${
                        errors.briefIntro ? "border-red-500" : ""
                      }`}
                    />

                    {errors.briefIntro && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.briefIntro}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <div>
                    <button
                      type="submit"
                      className="btn1"
                    >
                      Add Testimonial <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9766 5.96094L7.60156 10.3359C7.4375 10.5 7.21875 10.582 7 10.582C6.75391 10.582 6.53516 10.5 6.37109 10.3359C6.01562 10.0078 6.01562 9.43359 6.37109 9.10547L9.24219 6.20703H0.875C0.382812 6.20703 0 5.82422 0 5.33203C0 4.86719 0.382812 4.45703 0.875 4.45703H9.24219L6.37109 1.58594C6.01562 1.25781 6.01562 0.683594 6.37109 0.355469C6.69922 0 7.27344 0 7.60156 0.355469L11.9766 4.73047C12.332 5.05859 12.332 5.63281 11.9766 5.96094Z" fill="white"></path></svg>
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