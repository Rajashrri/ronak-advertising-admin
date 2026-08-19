import { useEffect, useState } from "react";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import Badge from "../../components/ui/badge/Badge";

import {
  getTestimonialsApi,
  deleteTestimonialApi,
  changeTestimonialStatusApi,
} from "../../api/testimonialApi";

interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  briefIntro: string;
  image: string;
  status: number;
  createdAt: string;
}

export default function TestimonialList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedIntro, setSelectedIntro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const response = await getTestimonialsApi(page, limit, search);

      if (response.data.success) {
        setTestimonials(response.data.data);

        setTotalPages(response.data.pagination.totalPages);

        setTotalRecords(response.data.pagination.total);
      }
    } catch (error) {
      console.log("Testimonial Fetch Error :", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTestimonials();
  }, [page, limit, search]);
  const handleStatusChange = async (id: string) => {
    try {
      const response = await changeTestimonialStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTestimonials();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteTestimonialApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTestimonials();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Testimonial List" />

      <div className="space-y-6">
        <ComponentCard title="Testimonial List">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search testimonial..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              {/* Show Entries */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Show
                </span>

                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>

                <span className="text-sm text-gray-600 dark:text-gray-300">
                  entries
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Sr No
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      Designation
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Brief Intro
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Status
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : testimonials.length > 0 ? (
                    testimonials.map((item, index) => (
                      <TableRow
                        key={item._id}
                        className="border-b border-gray-100 transition-all duration-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                      >
                        <TableCell className="px-6 py-4 text-center font-medium">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-6 py-4 font-medium">
                          {item.name}
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          {item.designation}
                        </TableCell>

                        <TableCell className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedIntro(item.briefIntro);
                              setShowModal(true);
                            }}
                            className="rounded-md bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 transition hover:bg-indigo-200"
                          >
                            View
                          </button>
                        </TableCell>

                        <TableCell className="px-6 py-4 text-center">
                          <button onClick={() => handleStatusChange(item._id)}>
                            <Badge
                              size="sm"
                              color={item.status === 1 ? "success" : "error"}
                            >
                              {item.status === 1 ? "Active" : "Inactive"}
                            </Badge>
                          </button>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center text-gray-600">
                          {item.createdAt
                            ? new Date(item.createdAt)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                                .replace(/\//g, "-")
                            : "-"}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/edit-testimonial/${item._id}`}
                              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(item._id)}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        No Testimonial Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
                {/* Showing */}
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {totalRecords === 0 ? 0 : (page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, totalRecords)} of {totalRecords}{" "}
                  entries
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      page === 1
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        page === pageNumber
                          ? "bg-blue-600 text-white"
                          : "border bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      page === totalPages || totalPages === 0
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ComponentCard>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Brief Introduction</h2>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-2xl font-bold text-gray-500 hover:text-black"
                >
                  ×
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedIntro}
                </p>
              </div>

              <div className="mt-5 text-right">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
