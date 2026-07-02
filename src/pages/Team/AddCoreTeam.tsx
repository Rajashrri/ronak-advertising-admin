import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { addCoreTeamApi } from "../../api/coreTeamApi";

export default function AddCoreTeam() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    let err: any = {};

    if (!formData.name.trim())
      err.name = "Name is required";

    if (!formData.designation.trim())
      err.designation = "Designation is required";

    if (!image)
      err.image = "Image is required";

    setErrors(err);

    if (Object.keys(err).length > 0) return;

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append(
        "designation",
        formData.designation
      );

      if (image) {
        data.append("image", image);
      }

      const response =
        await addCoreTeamApi(data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-coreteam");
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
      <PageBreadcrumb pageTitle="Add Core Team" />

      <div className="space-y-6">

        <ComponentCard title="Add Core Team">

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

            <div className="p-6">

              <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 gap-6">

                  {/* Name */}

                  <div>

                    <label className="mb-2 block">
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
                      <p className="text-red-500">
                        {errors.name}
                      </p>
                    )}

                  </div>

                  {/* Designation */}

                  <div>

                    <label className="mb-2 block">
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
                      <p className="text-red-500">
                        {errors.designation}
                      </p>
                    )}

                  </div>

                  {/* Image */}

                  <div>

                    <label className="mb-2 block">
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
                      <p className="text-red-500">
                        {errors.image}
                      </p>
                    )}

                  </div>

                  <button
                    type="submit"
                    className="rounded-lg bg-brand-500 px-5 py-3 text-white hover:bg-brand-600"
                  >
                    Add Core Team
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