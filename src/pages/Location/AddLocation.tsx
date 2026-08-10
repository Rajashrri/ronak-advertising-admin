import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import { addLocationApi } from "../../api/locationApi";

export default function AddLocation() {
  const [formData, setFormData] = useState({
    locationName: "",
    audience_reach: "",
    media_sites: "",
    ideal: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let err: any = {};

    if (!formData.locationName.trim()) {
      err.locationName = "Location Name is required";
    }

    if (!formData.audience_reach) {
      err.audience_reach = "Daily Audience Reach is required";
    }
    if (!formData.media_sites) {
      err.media_sites = "Ronak Media Sites is required";
    }

    if (!formData.ideal) {
      err.ideal = "Ideal for is required";
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

      data.append("locationName", formData.locationName);
      data.append("audience_reach", formData.audience_reach);
      data.append("media_sites", formData.media_sites);

      data.append("ideal", formData.ideal);

      if (image) {
        data.append("image", image);
      }

      const response = await addLocationApi(data);

      if (response.data.success) {
        toast.success(response.data.message);

        setFormData({
          locationName: "",
          audience_reach: "",
          media_sites: "",
          ideal: "",
        });

        setImage(null);
        setErrors({});
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Location" />

      <div className="space-y-6">
        <ComponentCard title="Add Location">
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

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Daily Audience Reach
                    </label>

                    <input
                      type="number"
                      name="audience_reach"
                      value={formData.audience_reach}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.audience_reach && (
                      <p className="text-red-500 text-sm">
                        {errors.audience_reach}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Ronak Media Sites
                    </label>

                    <input
                      type="number"
                      name="media_sites"
                      value={formData.media_sites}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.media_sites && (
                      <p className="text-red-500 text-sm">
                        {errors.media_sites}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Ideal for:
                    </label>

                    <input
                      type="text"
                      name="ideal"
                      value={formData.ideal}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.ideal && (
                      <p className="text-red-500 text-sm">{errors.ideal}</p>
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
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />

                    {errors.image && (
                      <p className="text-red-500 text-sm">{errors.image}</p>
                    )}
                  </div>

                  {/* Button */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="submit"
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Add
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
