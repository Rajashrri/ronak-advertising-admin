import { useState } from "react";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { addLeadershipApi } from "../../api/leadershipTeamApi";

export default function AddLeadershipTeam() {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    experience: "",
    linkedin: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const err: any = {};

    if (!formData.name.trim()) {
      err.name = "Name is required";
    }

    if (!formData.designation.trim()) {
      err.designation = "Designation is required";
    }

    if (!formData.experience.trim()) {
      err.experience = "Experience is required";
    }

    if (!formData.linkedin.trim()) {
      err.linkedin = "LinkedIn Link is required";
    } else {
      const regex =
        /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i;

      if (!regex.test(formData.linkedin)) {
        err.linkedin = "Enter valid LinkedIn URL";
      }
    }

    if (!image) {
      err.image = "Image is required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("experience", formData.experience);
      data.append("linkedin", formData.linkedin);

      if (image) {
        data.append("image", image);
      }

      const response = await addLeadershipApi(data);

      if (response.data.success) {
        toast.success(response.data.message);

        setFormData({
          name: "",
          designation: "",
          experience: "",
          linkedin: "",
        });

        setImage(null);
        setErrors({});
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Leadership Team" />

      <div className="space-y-6">
        <ComponentCard title="Add Leadership Team">
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
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
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
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.designation && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.designation}
                      </p>
                    )}
                  </div>

                  {/* Experience */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Years of Experience
                    </label>

                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Example : 10+ Years"
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.experience && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.experience}
                      </p>
                    )}
                  </div>

                  {/* LinkedIn */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      LinkedIn Link
                    </label>

                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://www.linkedin.com/in/username"
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.linkedin && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.linkedin}
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
                        setImage(
                          e.target.files?.[0] || null
                        )
                      }
                    />

                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.image}
                      </p>
                    )}
                  </div>

                  {/* Preview */}

                  {image && (
                    <div>
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="h-28 w-28 rounded-lg border object-cover"
                      />
                    </div>
                  )}

                  {/* Button */}

                  <button
                    type="submit"
                    className="rounded-lg bg-brand-500 px-5 py-3 text-white hover:bg-brand-600"
                  >
                    Add Leadership Team
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