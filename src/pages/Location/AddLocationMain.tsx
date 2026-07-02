import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  addLocationMainApi,
  getActiveLocationsApi,
} from "../../api/locationMainApi";

interface Location {
  _id: string;
  locationName: string;
}

export default function AddLocationMain() {
  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState({
    locationId: "",
    siteName: "",
    ytVideoLink: "",
    detail: "",
    media: "",
    type: "",
    siteCode: "",
    latitude: "",
    longitude: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const [gallery, setGallery] = useState<File[]>([]);

  const [errors, setErrors] = useState<any>({});

  // ===========================
  // LOAD ACTIVE LOCATIONS
  // ===========================

  const fetchLocations = async () => {
    try {
      const res = await getActiveLocationsApi();

      if (res.data.success) {
        setLocations(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // ===========================
  // HANDLE CHANGE
  // ===========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // IMAGE
  // ===========================

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      setImage(e.target.files[0]);
    }
  };

  // ===========================
  // GALLERY
  // ===========================

  const handleGallery = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setGallery(Array.from(e.target.files));
    }
  };

  // ===========================
  // SUBMIT
  // ===========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    let err: any = {};

    if (!formData.locationId)
      err.locationId = "Select Location";

    if (!formData.siteName.trim())
      err.siteName = "Site Name required";

    if (!image)
      err.image = "Image required";

    setErrors(err);

    if (Object.keys(err).length > 0) return;

    try {

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (image) {
        data.append("image", image);
      }

      gallery.forEach((file) => {
        data.append("gallery", file);
      });

      const response =
        await addLocationMainApi(data);

      if (response.data.success) {

        toast.success(response.data.message);

        setFormData({
          locationId: "",
          siteName: "",
          ytVideoLink: "",
          detail: "",
          media: "",
          type: "",
          siteCode: "",
          latitude: "",
          longitude: "",
        });

        setImage(null);
        setGallery([]);
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
      <PageBreadcrumb pageTitle="Add Location Main" />

      <div className="space-y-6">
        <ComponentCard title="Add Location Main">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">

              <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Location */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Select Location
                    </label>

                    <select
                      name="locationId"
                      value={formData.locationId}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    >
                      <option value="">
                        Select Location
                      </option>

                      {locations.map((item) => (
                        <option
                          key={item._id}
                          value={item._id}
                        >
                          {item.locationName}
                        </option>
                      ))}
                    </select>

                    {errors.locationId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.locationId}
                      </p>
                    )}
                  </div>

                  {/* Site Name */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Site Name
                    </label>

                    <input
                      type="text"
                      name="siteName"
                      value={formData.siteName}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.siteName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.siteName}
                      </p>
                    )}
                  </div>

                  {/* Image */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                    />

                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.image}
                      </p>
                    )}
                  </div>

                  {/* YouTube */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      YT Video Link
                    </label>

                    <input
                      type="text"
                      name="ytVideoLink"
                      value={formData.ytVideoLink}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>

                  {/* Gallery */}

                  <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                      Media Gallery Images
                    </label>
  <p className="mb-2 text-sm font-medium text-red-500">
    Note: You can upload multiple images (Add More).
  </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGallery}
                    />

                    {gallery.length > 0 && (

                      <div className="mt-4 flex flex-wrap gap-3">

                        {gallery.map((file, index) => (

                          <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            className="h-20 w-20 rounded-lg border object-cover"
                          />

                        ))}

                      </div>

                    )}

                  </div>

                  {/* Detail */}

                  <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                      Detail
                    </label>

                    <textarea
                      rows={5}
                      name="detail"
                      value={formData.detail}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />

                  </div>

                </div>

                {/* Site Information */}

                <div className="mt-10">

                  <h3 className="mb-5 text-lg font-semibold">
                    Site Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Media
                      </label>

                      <input
                        type="text"
                        name="media"
                        value={formData.media}
                        onChange={handleChange}
                        className="h-11 w-full rounded-lg border px-4"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Type
                      </label>

                      <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="h-11 w-full rounded-lg border px-4"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Site Code
                      </label>

                      <input
                        type="text"
                        name="siteCode"
                        value={formData.siteCode}
                        onChange={handleChange}
                        className="h-11 w-full rounded-lg border px-4"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Latitude
                      </label>

                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        className="h-11 w-full rounded-lg border px-4"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Longitude
                      </label>

                      <input
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        className="h-11 w-full rounded-lg border px-4"
                      />
                    </div>

                  </div>

                </div>

                <div className="mt-8">

                  <button
                    type="submit"
                    className="rounded-lg bg-brand-500 px-6 py-3 text-white"
                  >
                    Add Location
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