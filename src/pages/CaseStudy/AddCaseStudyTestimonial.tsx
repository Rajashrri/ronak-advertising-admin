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
                      Add Testimonial
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