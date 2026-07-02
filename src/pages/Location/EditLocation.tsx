import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";

import {
  getLocationByIdApi,
  updateLocationApi,
} from "../../api/locationApi";

export default function EditLocation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    locationName: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState<any>({});

  // ================= GET DETAIL =================

  const fetchLocation = async () => {
    try {
      const response = await getLocationByIdApi(id as string);

      if (response.data.success) {
        const data = response.data.data;

        setFormData({
          locationName: data.locationName,
        });

        setPreview(data.image);
      }
    } catch (error) {
      toast.error("Failed to fetch location");
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // ================= HANDLE CHANGE =================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= VALIDATION =================

  const validate = () => {
    let err: any = {};

    if (!formData.locationName.trim()) {
      err.locationName = "Location Name is required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // ================= UPDATE =================

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const data = new FormData();

      data.append("locationName", formData.locationName);

      if (image) {
        data.append("image", image);
      }

      const response = await updateLocationApi(
        id as string,
        data
      );

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-locationmaster");
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
      <PageBreadcrumb pageTitle="Edit Location" />

      <div className="space-y-6">
        <ComponentCard title="Edit Location">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">

              <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 gap-6">

                  {/* Location Name */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Location Name
                    </label>

                    <input
                      type="text"
                      name="locationName"
                      value={formData.locationName}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.locationName && (
                      <p className="text-red-500 text-sm">
                        {errors.locationName}
                      </p>
                    )}
                  </div>

                  {/* Old Image */}

                  {preview && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Current Image
                      </label>

                      <img
                        src={preview}
                        alt="Location"
                        className="h-24 w-24 rounded-lg border object-cover"
                      />
                    </div>
                  )}

                  {/* Upload New */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Change Image
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
                  </div>

                  {/* Button */}

                  <button
                    type="submit"
                    className="rounded-lg bg-brand-500 px-4 py-3 text-white"
                  >
                    Update Location
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