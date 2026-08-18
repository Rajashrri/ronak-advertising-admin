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

               
                  <div className="mt-6 flex justify-start gap-3">
             
                    <button
                      type="submit"
                      className="btn1"
                    >
                      Add <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9766 5.96094L7.60156 10.3359C7.4375 10.5 7.21875 10.582 7 10.582C6.75391 10.582 6.53516 10.5 6.37109 10.3359C6.01562 10.0078 6.01562 9.43359 6.37109 9.10547L9.24219 6.20703H0.875C0.382812 6.20703 0 5.82422 0 5.33203C0 4.86719 0.382812 4.45703 0.875 4.45703H9.24219L6.37109 1.58594C6.01562 1.25781 6.01562 0.683594 6.37109 0.355469C6.69922 0 7.27344 0 7.60156 0.355469L11.9766 4.73047C12.332 5.05859 12.332 5.63281 11.9766 5.96094Z" fill="white"></path></svg>
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