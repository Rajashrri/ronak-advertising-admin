import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import Badge from "../../components/ui/badge/Badge";

import {
  getLocationMainBulkUploadListApi,
  locationMainBulkUploadApi,
} from "../../api/locationMainBulkUploadApi";

interface ErrorLog {
  rowNo: number;
  locationName?: string;
  message: string;
}

interface BulkUploadRecord {
  _id: string;
  fileName: string;
  totalRecords: number;
  successRecords: number;
  failedRecords: number;
  status: string;
  createdAt: string;
  errorLog?: ErrorLog[];
}

export default function BulkUpload() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [records, setRecords] = useState<BulkUploadRecord[]>([]);

  const [search, setSearch] = useState("");
  const [mainZip, setMainZip] = useState<File | null>(null);
  const [galleryZip, setGalleryZip] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [openModal, setOpenModal] = useState(false);

  const [excel, setExcel] = useState<File | null>(null);

  const [viewRecord, setViewRecord] = useState<BulkUploadRecord | null>(null);

  /* --------------------------------
     Fetch List
  -------------------------------- */

  const fetchBulkUploads = async () => {
    try {
      setLoading(true);

      const response = await getLocationMainBulkUploadListApi(
        page,
        limit,
        search,
      );

      if (response.data.success) {
        setRecords(response.data.data || []);

        setTotalPages(response.data.pagination?.totalPages || 1);

        setTotalRecords(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Bulk upload list error:", error);

      toast.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBulkUploads();
  }, [page, limit, search]);

  /* --------------------------------
     Upload Form
  -------------------------------- */

  const resetUploadForm = () => {
    setExcel(null);
    setMainZip(null);
    setGalleryZip(null);
  };

  const closeUploadModal = () => {
    if (uploading) return;

    setOpenModal(false);
    resetUploadForm();
  };

  /* --------------------------------
     Upload
  -------------------------------- */

const handleUpload = async () => {
  setUploading(true);

  try {
    // =========================
    // REQUIRED FILES
    // =========================

    if (!excel) {
      toast.error("Please select Excel file");
      return;
    }

    if (!mainZip) {
      toast.error("Please select Main Images ZIP");
      return;
    }


    // =========================
    // EXCEL VALIDATION
    // =========================

    const excelExtension = excel.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (
      excelExtension !== "xlsx" &&
      excelExtension !== "xls"
    ) {
      toast.error("Please select a valid Excel file");
      return;
    }

    // =========================
    // MAIN ZIP VALIDATION
    // =========================

    const mainZipExtension = mainZip.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (mainZipExtension !== "zip") {
      toast.error("Please select a valid Main Images ZIP file");
      return;
    }

    // =========================
    // GALLERY ZIP VALIDATION
    // =========================


    // =========================
    // FORM DATA
    // =========================

    const formData = new FormData();

    formData.append("excel", excel);
    formData.append("mainZip", mainZip);
if (galleryZip) {
  formData.append(
    "galleryZip",
    galleryZip
  );
}
    // =========================
    // UPLOAD
    // =========================

    setUploading(true);

    const response =
      await locationMainBulkUploadApi(formData);

    if (response.data.success) {
      toast.success(
        response.data.message ||
          "Bulk upload completed"
      );

      setOpenModal(false);

      resetUploadForm();

      setPage(1);

      await fetchBulkUploads();
    }
 } catch (error: any) {
  console.error("Bulk upload error:", error);

  console.error(
    "Backend response:",
    error.response?.data
  );

  toast.error(
    error.response?.data?.message ||
      "Upload failed"
  );
} finally {
  setUploading(false);
}
};

  /* --------------------------------
     Search
  -------------------------------- */

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  /* --------------------------------
     Limit
  -------------------------------- */

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  /* --------------------------------
     File Size
  -------------------------------- */

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Bulk Upload Location Master" />

      <div className="space-y-6">
        <ComponentCard title="Bulk Upload Location Master">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {/* =====================================
                HEADER
            ====================================== */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Download Sample */}

              <a
                href="/sample/location-site-bulk-upload.xlsx"
                download="location-bulk-upload-sample.xlsx"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Download Sample
              </a>

              {/* Bulk Upload */}

              <button
                type="button"
                onClick={() => setOpenModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <span className="text-lg leading-none">+</span>
                Bulk Upload
              </button>
            </div>
            {/* =====================================
                FILTER BAR
            ====================================== */}

            <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search */}

                <div className="relative w-full md:max-w-sm">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-4-4" />
                    </svg>
                  </span>

                  <input
                    type="text"
                    placeholder="Search file name..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Entries */}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Show</span>

                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <option value={5}>5</option>

                    <option value={10}>10</option>

                    <option value={20}>20</option>

                    <option value={50}>50</option>
                  </select>

                  <span>entries</span>
                </div>
              </div>
            </div>

            {/* =====================================
                TABLE
            ====================================== */}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableCell
                      isHeader
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      #
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      File Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Total
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Success
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Failed
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Status
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Date
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {/* Loading */}

                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                          <span className="text-sm text-gray-500">
                            Loading upload history...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : records.length > 0 ? (
                    records.map((item, index) => (
                      <TableRow
                        key={item._id}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
                      >
                        {/* Sr No */}

                        <TableCell className="px-6 py-4 text-sm font-medium text-gray-500">
                          {(page - 1) * limit + index + 1}
                        </TableCell>

                        {/* File */}

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <path d="M14 2v6h6" />
                                <path d="M8 13h8" />
                                <path d="M8 17h8" />
                                <path d="M8 9h2" />
                              </svg>
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[260px] truncate text-sm font-semibold text-gray-800 dark:text-white">
                                {item.fileName}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                Location Master
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Total */}

                        <TableCell className="px-6 py-4">
                          <span className="inline-flex min-w-[40px] justify-center rounded-md bg-gray-100 px-2.5 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            {item.totalRecords}
                          </span>
                        </TableCell>

                        {/* Success */}

                        <TableCell className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                            {item.successRecords}
                          </span>
                        </TableCell>

                        {/* Failed */}

                        <TableCell className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                            {item.failedRecords}
                          </span>
                        </TableCell>

                        {/* Status */}

                        <TableCell className="px-6 py-4">
                          <Badge
                            size="sm"
                            color={
                              item.status === "Completed"
                                ? "success"
                                : item.status === "Failed"
                                  ? "error"
                                  : "warning"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>

                        {/* Date */}

                        <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </TableCell>

                        {/* Action */}

                        <TableCell className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setViewRecord(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            View
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="py-16 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
                            <svg
                              width="26"
                              height="26"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <path d="M14 2v6h6" />
                              <path d="M9 13h6" />
                              <path d="M9 17h6" />
                            </svg>
                          </div>

                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            No upload records found
                          </p>

                          <p className="mt-1 text-sm text-gray-400">
                            Upload an Excel and ZIP file to get started.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* =====================================
                PAGINATION
            ====================================== */}

            <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {totalRecords === 0 ? 0 : (page - 1) * limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {Math.min(page * limit, totalRecords)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {totalRecords}
                </span>{" "}
                entries
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1 || loading}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  ← Previous
                </button>

                <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white">
                  {page}
                </div>

                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* =====================================
              UPLOAD MODAL
          ====================================== */}

          {openModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
                {/* Modal Header */}

                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 16V4" />
                        <path d="m7 9 5-5 5 5" />
                        <path d="M5 20h14" />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Bulk Upload Locations
                      </h2>

                      <p className="text-xs text-gray-500">
                        Upload Excel data and location images
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={closeUploadModal}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:hover:bg-gray-800"
                  >
                    ×
                  </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-5 p-6">
                  {/* =====================================
      EXCEL
  ====================================== */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Excel File
                    </label>

                    <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-500/10">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                          <path d="M8 13h8" />
                          <path d="M8 17h6" />
                        </svg>
                      </div>

                      <div className="min-w-0 flex-1">
                        {excel ? (
                          <>
                            <p className="truncate text-sm font-semibold text-gray-700 dark:text-gray-200">
                              {excel.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {formatFileSize(excel.size)}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Choose Excel file
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              .xlsx or .xls
                            </p>
                          </>
                        )}
                      </div>

                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        disabled={uploading}
                        onChange={(e) => setExcel(e.target.files?.[0] || null)}
                        className="hidden"
                      />

                      <span className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900">
                        Browse
                      </span>
                    </label>
                  </div>

                  {/* =====================================
      MAIN IMAGES ZIP
  ====================================== */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Main Images ZIP
                    </label>

                    <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 7h5l2 2h11v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <path d="M12 12v5" />
                          <path d="m10 15 2 2 2-2" />
                        </svg>
                      </div>

                      <div className="min-w-0 flex-1">
                        {mainZip ? (
                          <>
                            <p className="truncate text-sm font-semibold text-gray-700 dark:text-gray-200">
                              {mainZip.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {formatFileSize(mainZip.size)}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Choose main images ZIP
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Main images only • .zip
                            </p>
                          </>
                        )}
                      </div>

                      <input
                        type="file"
                        accept=".zip"
                        disabled={uploading}
                        onChange={(e) =>
                          setMainZip(e.target.files?.[0] || null)
                        }
                        className="hidden"
                      />

                      <span className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900">
                        Browse
                      </span>
                    </label>
                  </div>

                  {/* =====================================
      GALLERY IMAGES ZIP
  ====================================== */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Gallery Images ZIP
                    </label>

                    <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition hover:border-purple-400 hover:bg-purple-50/50 dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-500/10">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />

                          <circle cx="8.5" cy="8.5" r="1.5" />

                          <path d="m21 15-5-5L5 21" />
                        </svg>
                      </div>

                      <div className="min-w-0 flex-1">
                        {galleryZip ? (
                          <>
                            <p className="truncate text-sm font-semibold text-gray-700 dark:text-gray-200">
                              {galleryZip.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {formatFileSize(galleryZip.size)}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Choose gallery images ZIP
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Gallery images only • .zip
                            </p>
                          </>
                        )}
                      </div>

                      <input
                        type="file"
                        accept=".zip"
                        disabled={uploading}
                        onChange={(e) =>
                          setGalleryZip(e.target.files?.[0] || null)
                        }
                        className="hidden"
                      />

                      <span className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900">
                        Browse
                      </span>
                    </label>
                  </div>

                  {/* =====================================
      UPLOAD INSTRUCTIONS
  ====================================== */}

                  {/* <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                    <div className="flex gap-3">
                      <div className="mt-0.5 shrink-0 text-blue-600">
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="9" />

                          <path d="M12 11v5" />

                          <path d="M12 8h.01" />
                        </svg>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                          Upload Instructions
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-300/80">
                          Excel ke <b>Location Name</b>, <b>Site Name</b>,{" "}
                          <b>Media Type</b> aur <b>Image</b> required hain.
                          <br />
                          Location Name ka spelling Location Master se exactly
                          same hona chahiye.
                          <br />
                          Media Type sirf{" "}
                          <b>
                            Gantry, Flag, Hoarding, Cantilever, BQS (Bus
                            Shelter), Kiosk
                          </b>{" "}
                          allowed hai.
                          <br />
                          <b>Main Image</b> ko <b>Main Images ZIP</b> me hona
                          chahiye.
                          <br />
                          <b>Gallery Images</b> ko <b>Gallery Images ZIP</b> me
                          hona chahiye.
                          <br />
                          Gallery images Excel me comma separated honi chahiye.
                          <br />
                          Maximum <b>10 Gallery Images</b> allowed hain.
                          <br />
                          All images must be <b>.webp</b>.
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/40">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={closeUploadModal}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={handleUpload}
                    className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        Upload
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =====================================
              VIEW DETAILS MODAL
          ====================================== */}

          {viewRecord && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
                {/* Header */}

                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Bulk Upload Details
                      </h2>

                      <p className="max-w-[500px] truncate text-sm text-gray-500">
                        {viewRecord.fileName}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewRecord(null)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
                  >
                    ×
                  </button>
                </div>

                {/* Summary */}

                <div className="grid grid-cols-2 gap-4 border-b border-gray-200 bg-gray-50/60 p-6 sm:grid-cols-4 dark:border-gray-800 dark:bg-gray-800/30">
                  {/* Total */}

                  <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Total
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                      {viewRecord.totalRecords}
                    </p>
                  </div>

                  {/* Success */}

                  <div className="rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/10">
                    <p className="text-xs font-medium uppercase tracking-wide text-green-600">
                      Success
                    </p>

                    <p className="mt-2 text-2xl font-bold text-green-600">
                      {viewRecord.successRecords}
                    </p>
                  </div>

                  {/* Failed */}

                  <div className="rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                    <p className="text-xs font-medium uppercase tracking-wide text-red-600">
                      Failed
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-600">
                      {viewRecord.failedRecords}
                    </p>
                  </div>

                  {/* Status */}

                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                      Status
                    </p>

                    <div className="mt-3">
                      <Badge
                        size="sm"
                        color={
                          viewRecord.status === "Completed"
                            ? "success"
                            : viewRecord.status === "Failed"
                              ? "error"
                              : "warning"
                        }
                      >
                        {viewRecord.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Error Log */}

                <div className="min-h-0 flex-1 overflow-y-auto p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Failed Records
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        Details of records that could not be imported.
                      </p>
                    </div>

                    {viewRecord.failedRecords > 0 && (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        {viewRecord.failedRecords} Failed
                      </span>
                    )}
                  </div>

                  {viewRecord.errorLog && viewRecord.errorLog.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Row
                              </th>

                              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Location
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Error
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {viewRecord.errorLog.map((error, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                              >
                                <td className="whitespace-nowrap px-4 py-4">
                                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-gray-100 px-2 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    {error.rowNo}
                                  </span>
                                </td>

                                <td className="px-4 py-4">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {error.locationName || "-"}
                                  </span>
                                </td>

                                <td className="px-4 py-4">
                                  <div className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                                    <span className="leading-5 text-red-600 dark:text-red-400">
                                      {error.message}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-green-100 bg-green-50 py-12 dark:border-green-500/20 dark:bg-green-500/10">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="m5 12 4 4L19 6" />
                        </svg>
                      </div>

                      <p className="font-semibold text-green-700 dark:text-green-400">
                        No failed records
                      </p>

                      <p className="mt-1 text-sm text-green-600/70">
                        All records were uploaded successfully.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}

                <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/30">
                 <button
  type="button"
  disabled={uploading}
  onClick={handleUpload}
  className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
>
  {uploading ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      Uploading...
    </>
  ) : (
    <>
      Upload
      <span>→</span>
    </>
  )}
</button>
                </div>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
