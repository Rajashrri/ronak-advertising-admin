import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  getCaseStudyTestimonialByIdApi,
  updateCaseStudyTestimonialApi,
} from "../../api/caseStudyTestimonialApi";

export default function EditCaseStudyTestimonial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseStudyId, setCaseStudyId] = useState("");
  const [formData, setFormData] = useState({
    caseStudyId: "",
    name: "",
    designation: "",
    briefIntro: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [oldImage, setOldImage] = useState("");

  useEffect(() => {
    fetchTestimonial();
  }, []);

  const fetchTestimonial = async () => {
    const response = await getCaseStudyTestimonialByIdApi(id);

    const data = response.data.data;
    setCaseStudyId(data.caseStudyId._id);
    setFormData({
      caseStudyId: data.caseStudyId?._id,
      name: data.name,
      designation: data.designation,
      briefIntro: data.briefIntro,
    });

    setOldImage(data.image);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("caseStudyId", formData.caseStudyId);
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("briefIntro", formData.briefIntro);

      if (image) {
        data.append("image", image);
      }
      const response = await updateCaseStudyTestimonialApi(id, data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate(`/case-study-testimonial/${caseStudyId}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Edit Case Study Testimonial" />

      <div className="space-y-6">
        <ComponentCard title="Edit Case Study Testimonial">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="mb-2 block">Name</label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block">Designation</label>

                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block">Image</label>

                    {oldImage && (
                      <img
                        src={oldImage}
                        width={120}
                        className="mb-3 rounded"
                        alt=""
                      />
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block">Brief Intro</label>

                    <textarea
                      rows={4}
                      name="briefIntro"
                      value={formData.briefIntro}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="rounded-lg border px-5 py-3"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-brand-500 px-5 py-3 text-white"
                    >
                      Update Testimonial
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
