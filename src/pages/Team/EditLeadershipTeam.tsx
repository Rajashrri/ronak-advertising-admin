import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  getLeadershipDetailApi,
  updateLeadershipApi,
} from "../../api/leadershipTeamApi";
import { Link } from "react-router";

export default function EditLeadershipTeam() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [imagePreview, setImagePreview] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    experience: "",
    linkedin: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchLeadership();
  }, []);

  const fetchLeadership = async () => {
    try {
      const response = await getLeadershipDetailApi(id!);

      if (response.data.success) {
        const item = response.data.data;

        setFormData({
          name: item.name,
          designation: item.designation,
          experience: item.experience,
          linkedin: item.linkedin,
        });

        setImagePreview(item.image);
      }
    } catch (error) {
      toast.error("Unable to fetch record");
    } finally {
      setLoading(false);
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
      setImage(e.target.files[0]);

      setImagePreview(
        URL.createObjectURL(e.target.files[0])
      );
    }
  };

  const validate = () => {
    const err: any = {};

    if (!formData.name.trim())
      err.name = "Name is required";

    if (!formData.designation.trim())
      err.designation = "Designation is required";

    // if (!formData.experience.trim())
    //   err.experience = "Experience is required";

    // if (!formData.linkedin.trim())
    //   err.linkedin = "LinkedIn Link is required";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const data = new FormData();

      data.append("name", formData.name);

      data.append(
        "designation",
        formData.designation
      );

      data.append(
        "experience",
        formData.experience
      );

      data.append("linkedin", formData.linkedin);

      if (image) {
        data.append("image", image);
      }

      const response = await updateLeadershipApi(
        id!,
        data
      );

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-leadershipteam");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
      );
    }
  };

  if (loading) {
    return <h3 className="p-5">Loading...</h3>;
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Leadership Team" />

      <div className="space-y-6">

        <ComponentCard title="Edit Leadership Team">

          <div className="rounded-xl border bg-white">

            <div className="p-6">

              <form onSubmit={handleSubmit}>

                <div className="grid gap-6">

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

                  {/* Experience */}

                  <div>

                    <label className="mb-2 block">
                      Years of Experience
                    </label>

                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {/* {errors.experience && (
                      <p className="text-red-500">
                        {errors.experience}
                      </p>
                    )} */}

                  </div>
                                    {/* LinkedIn */}

                  <div>
                    <label className="mb-2 block">
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

                    {/* {errors.linkedin && (
                      <p className="text-red-500">
                        {errors.linkedin}
                      </p>
                    )} */}
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
                        alt="Leadership"
                        className="h-32 w-32 rounded-lg border object-cover"
                      />
                    </div>
                  )}

                  {/* Update Button */}

                  <div className="mt-6 flex justify-start gap-3">
                    <Link
                      to="/list-leadershipteam"
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
                </div>

              </form>

            </div>

          </div>

        </ComponentCard>

      </div>

    </>
  );
}