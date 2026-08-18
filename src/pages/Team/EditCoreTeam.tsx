import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { Link } from "react-router";

import {
  getCoreTeamByIdApi,
  updateCoreTeamApi,
} from "../../api/coreTeamApi";

export default function EditCoreTeam() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchMember();
  }, []);

  const fetchMember = async () => {
    try {
      const response = await getCoreTeamByIdApi(id!);

      if (response.data.success) {
        const item = response.data.data;

        setFormData({
          name: item.name,
          designation: item.designation,
        });

        setImagePreview(item.image);
      }
    } catch (error) {
      toast.error("Unable to load data");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      setImage(file);

      setImagePreview(URL.createObjectURL(file));
    }
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

      const response = await updateCoreTeamApi(
        id!,
        data
      );

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-coreteam");
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
      <PageBreadcrumb pageTitle="Edit Core Team" />

      <div className="space-y-6">

        <ComponentCard title="Edit Core Team">

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
                      onChange={handleImage}
                    />
                  </div>

                  {/* Image Preview */}

                  {imagePreview && (
                    <div>
                      <label className="mb-2 block font-medium">
                        Current Image
                      </label>

                      <img
                        src={imagePreview}
                        alt="Core Team"
                        className="h-32 w-32 rounded-lg border object-cover"
                      />
                    </div>
                  )}

                  {/* Submit Button */}

                  <div className="mt-6 flex justify-end gap-3">
                    <Link
                      to="/list-coreteam"
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
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

                </div>

              </form>

            </div>

          </div>

        </ComponentCard>

      </div>

    </>
  );
}