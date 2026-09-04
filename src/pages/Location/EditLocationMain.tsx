import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RichTextEditor from "../../components/editor/RichTextEditor";

import {
  getActiveLocationsApi,
  getLocationMainDetailApi,
  updateLocationMainApi,
  deleteGalleryImageApi,
} from "../../api/locationMainApi";
import { Link } from "react-router";

interface Location {
  _id: string;
  locationName: string;
}

export default function EditLocationMain() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState({
    locationId: "",
    siteName: "",
    ytVideoLink: "",
    detail: "",
    media: "",
    mediaType: "",
    type: "",
    siteCode: "",
    latitude: "",
    longitude: "",
    slug: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const [oldImage, setOldImage] = useState("");
  const [gallery, setGallery] = useState<File[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [oldGallery, setOldGallery] = useState<string[]>([]);

  const [isDragging, setIsDragging] = useState(false);

  const [errors, setErrors] = useState<any>({});

  // ===========================
  // LOAD LOCATIONS
  // ===========================
  const handleDeleteGallery = async (image: string) => {
    try {
      const response = await deleteGalleryImageApi(id!, image);

      if (response.data.success) {
        toast.success(response.data.message);

        setOldGallery(oldGallery.filter((img) => img !== image));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };
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

  // ===========================
  // LOAD DETAIL
  // ===========================

  const fetchDetail = async () => {
    try {
      const res = await getLocationMainDetailApi(id!);

      if (res.data.success) {
        const item = res.data.data;

        setFormData({
          locationId: item.locationId?._id,
          siteName: item.siteName,
          ytVideoLink: item.ytVideoLink,
          detail: item.detail,
          media: item.media,
          type: item.type,
          mediaType: item.mediaType,

          siteCode: item.siteCode,
          latitude: item.latitude,
          longitude: item.longitude,
          slug: item.slug || "",
        });

        setOldImage(item.image);
        setOldGallery(item.mediaGallery || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchDetail();
  }, []);

  // ===========================
  // CHANGE
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "siteName" ? { slug: createSlug(value) } : {}),
    }));
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

    const totalImages = oldGallery.length + gallery.length + imageFiles.length;

    if (totalImages > 10) {
      setErrors((prev: any) => ({
        ...prev,
        gallery: "Maximum 10 images allowed.",
      }));
      return;
    }

    setErrors((prev: any) => ({
      ...prev,
      gallery: "",
    }));

    setGallery((prev) => [...prev, ...imageFiles]);
  };

  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addGalleryFiles(Array.from(e.target.files));
    }

    // Same image dobara select karne ke liye input reset
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

  const removeNewGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };
  // ===========================
  // UPDATE
  // ===========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let err: any = {};

    if (!formData.locationId) err.locationId = "Select Location";
    if (!formData.mediaType) err.mediaType = "Select Media Type";

    if (!formData.siteName.trim()) err.siteName = "Site Name is required";

    setErrors(err);

    if (Object.keys(err).length > 0) return;
    setIsUpdating(true);
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

      const response = await updateLocationMainApi(id!, data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-location");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Edit Location Main" />

      <div className="space-y-6">
        <ComponentCard title="Edit Location Main">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select Location */}

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
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Slug
                    </label>

                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
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
                  {/* Current Image */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Current Image
                    </label>

                    {oldImage && (
                      <img
                        src={oldImage}
                        alt=""
                        className="h-28 w-28 rounded-lg border object-cover"
                      />
                    )}
                  </div>

                  {/* Replace Image */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Replace Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                    />
                  </div>

                  {/* YouTube */}

                  <div className="md:col-span-2">
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

                  {/* Old Gallery */}
                  {/* Gallery Section */}

                  <div className="md:col-span-2">
                    <label className="mb-4 block text-sm font-medium">
                      Media Gallery
                      <p className="mb-3 text-sm text-red-500">
                        (Maximum 10 images allowed.)
                      </p>
                    </label>

                    {/* ================= EXISTING GALLERY ================= */}

                    {oldGallery.length > 0 && (
                      <div className="mb-6">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-700">
                            Existing Gallery ({oldGallery.length})
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                          {oldGallery.map((img, index) => (
                            <div
                              key={`${img}-${index}`}
                              className="group relative overflow-hidden rounded-lg border bg-white"
                            >
                              <img
                                src={img}
                                alt={`Gallery ${index + 1}`}
                                className="h-28 w-full object-cover"
                              />

                              {/* Delete Existing Image */}
                              <button
                                type="button"
                                onClick={() => handleDeleteGallery(img)}
                                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-700"
                                title="Delete image"
                              >
                                ×
                              </button>

                              <div className="truncate px-2 py-1 text-xs text-gray-500">
                                Image {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ================= DRAG DROP ================= */}

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Add New Gallery Images
                      </label>

                      <p className="mb-3 text-sm text-gray-500">
                        Add images one by one, select multiple images, or drag &
                        drop images.
                      </p>
                      {errors.gallery && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.gallery}
                        </p>
                      )}
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
                    </div>

                    {/* ================= NEW IMAGE PREVIEW ================= */}

                    {gallery.length > 0 && (
                      <div className="mt-6">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-700">
                            New Images ({gallery.length})
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

                              {/* Remove New Image */}
                              <button
                                type="button"
                                onClick={() => removeNewGalleryImage(index)}
                                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-700"
                                title="Remove image"
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
                  <h3 className="mb-6 text-lg font-semibold">
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
                    <Link to="/list-location" className="btn2">
                      Back
                    </Link>

                    <button
                      type="submit"
                      disabled={isUpdating}
                      className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                        isUpdating ? "cursor-not-allowed btn1" : "btn1"
                      }`}
                    >
                      {isUpdating ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                          Updating...
                        </span>
                      ) : (
                        "Update"
                      )}{" "}
                      <svg
                        width="13"
                        height="11"
                        viewBox="0 0 13 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.9766 5.96094L7.60156 10.3359C7.4375 10.5 7.21875 10.582 7 10.582C6.75391 10.582 6.53516 10.5 6.37109 10.3359C6.01562 10.0078 6.01562 9.43359 6.37109 9.10547L9.24219 6.20703H0.875C0.382812 6.20703 0 5.82422 0 5.33203C0 4.86719 0.382812 4.45703 0.875 4.45703H9.24219L6.37109 1.58594C6.01562 1.25781 6.01562 0.683594 6.37109 0.355469C6.69922 0 7.27344 0 7.60156 0.355469L11.9766 4.73047C12.332 5.05859 12.332 5.63281 11.9766 5.96094Z"
                          fill="white"
                        ></path>
                      </svg>
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
