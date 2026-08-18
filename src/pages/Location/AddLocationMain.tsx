import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RichTextEditor from "../../components/editor/RichTextEditor";

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
    mediaType: "",
    siteCode: "",
    latitude: "",
    longitude: "",
    slug: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const [gallery, setGallery] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const createSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "siteName") {
        updated.slug = createSlug(value);
      }

      return updated;
    });
  };

  // ===========================
  // IMAGE
  // ===========================

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setImage(e.target.files[0]);
    }
  };

  // ===========================
  // GALLERY
  // ===========================

  const addGalleryFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (!imageFiles.length) return;

    setGallery((prev) => [...prev, ...imageFiles]);
  };

  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addGalleryFiles(Array.from(e.target.files));
    }

    // Same file dobara select karne ke liye input reset
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    addGalleryFiles(files);
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };
  // ===========================
  // SUBMIT
  // ===========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let err: any = {};

    if (!formData.locationId) err.locationId = "Select Location";

    if (!formData.siteName.trim()) err.siteName = "Site Name required";

    if (!image) err.image = "Image required";
    if (!formData.mediaType) {
      err.mediaType = "Media Type is required";
    }
    setErrors(err);

    if (Object.keys(err).length > 0) return;
    setIsSubmitting(true);
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

      const response = await addLocationMainApi(data);

      if (response.data.success) {
        toast.success(response.data.message);

        setFormData({
          locationId: "",
          siteName: "",
          ytVideoLink: "",
          detail: "",
          media: "",
          type: "",
          mediaType: "",
          siteCode: "",
          latitude: "",
          longitude: "",
          slug: "",
        });

        setImage(null);
        setGallery([]);
        setErrors({});
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
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
                      <option value="">Select Location</option>

                      {locations.map((item) => (
                        <option key={item._id} value={item._id}>
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

                  {/* Slug */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Slug
                    </label>

                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="e.g. mumbai-airport"
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.slug && (
                      <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                    )}
                  </div>
                  {/* Image */}
                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium">
                      Media Type <span className="text-red-500">*</span>
                    </label>

                    <select
                      name="mediaType"
                      value={formData.mediaType}
                      onChange={handleChange}
                      className="w-full rounded-lg border p-3"
                    >
                      <option value="">Select Media Type</option>
                      <option value="Gantry">Gantry</option>
                      <option value="Flag">Flag</option>

                      <option value="Hoarding">Hoarding</option>
                      <option value="Cantilever">Cantilever</option>
                      <option value="BQS (Bus Shelter)">
                        BQS (Bus Shelter)
                      </option>
                      <option value="Kiosk">Kiosk</option>
                    </select>

                    {errors.mediaType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mediaType}
                      </p>
                    )}
                  </div>
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

                    <p className="mb-3 text-sm text-gray-500">
                      You can select images one by one, select multiple images,
                      or drag & drop images here.
                    </p>

                    {/* Drag & Drop Area */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${
                        isDragging
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGallery}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />

                      <div className="text-center">
                        <div className="mb-3 text-4xl">📁</div>

                        <p className="text-sm font-medium text-gray-700">
                          Drag & Drop images here
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          or click to select images
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          You can add images one by one or multiple at once
                        </p>
                      </div>
                    </div>

                    {/* Gallery Preview */}
                    {gallery.length > 0 && (
                      <div className="mt-5">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-700">
                            Selected Images ({gallery.length})
                          </h4>

                          <button
                            type="button"
                            onClick={() => setGallery([])}
                            className="text-sm font-medium text-red-500 hover:text-red-700"
                          >
                            Remove All
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                          {gallery.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="group relative overflow-hidden rounded-lg border bg-white"
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="h-28 w-full object-cover"
                              />

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white opacity-0 transition group-hover:opacity-100"
                              >
                                ×
                              </button>

                              <div className="truncate px-2 py-1 text-xs text-gray-500">
                                {file.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Detail */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Detail
                    </label>

                    <RichTextEditor
                      value={formData.detail}
                      onChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          detail: val,
                        }))
                      }
                      height={400}
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
                  <div className="mt-6 flex justify-start gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                        isSubmitting
                          ? "cursor-not-allowed bg-blue-400"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                          Uploading...
                        </span>
                      ) : (
                        "Add"
                      )}
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
