import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  getCaseStudyTestimonialsApi,
  deleteCaseStudyTestimonialApi,
  changeCaseStudyTestimonialStatusApi,
} from "../../api/caseStudyTestimonialApi";

interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  image: string;
  status: number;
  createdAt: string;
}

export default function CaseStudyTestimonialList() {
  const { caseStudyId } = useParams();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);

  // ================= SEARCH & PAGINATION =================

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // ================= FETCH =================

  const fetchTestimonials = async () => {
    if (!caseStudyId) return;

    try {
      setLoading(true);

      const response = await getCaseStudyTestimonialsApi(
        caseStudyId,
        page,
        limit,
        search,
      );

      if (response.data.success) {
        setTestimonials(response.data.data);

        setTotalPages(response.data.pagination?.totalPages || 1);

        setTotalRecords(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [caseStudyId, page, limit, search]);

  // ================= STATUS =================

  const handleStatus = async (id: string) => {
    try {
      const response = await changeCaseStudyTestimonialStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTestimonials();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  // ================= DELETE =================

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
      const response = await deleteCaseStudyTestimonialApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        // If last item of page is deleted
        if (testimonials.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          fetchTestimonials();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Case Study Testimonials" />

      <div className="space-y-6">
        <ComponentCard title="Case Study Testimonials">
          {/* ================= TOP CONTROLS ================= */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* LEFT - SEARCH + ENTRIES */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}

              <div className="w-full sm:w-64">
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
                <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  Show
                </span>

                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>

                <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  entries
                </span>
              </div>
            </div>

            {/* RIGHT - ADD BUTTON */}

            <div className="flex justify-end">
              <Link
                to={`/add-case-study-testimonial/${caseStudyId}`}
                className="btn1"
              >
                Add Testimonial
                <svg
                  width="13"
                  height="11"
                  viewBox="0 0 13 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2"
                >
                  <path
                    d="M11.9766 5.96094L7.60156 10.3359C7.4375 10.5 7.21875 10.582 7 10.582C6.75391 10.582 6.53516 10.5 6.37109 10.3359C6.01562 10.0078 6.01562 9.43359 6.37109 9.10547L9.24219 6.20703H0.875C0.382812 6.20703 0 5.82422 0 5.33203C0 4.86719 0.382812 4.457 0.875 4.457H9.24219L6.37109 1.58594C6.01562 1.25781 6.01562 0.683594 6.37109 0.355469C6.69922 0 7.27344 0 7.60156 0.355469L11.9766 4.73047C12.332 5.05859 12.332 5.63281 11.9766 5.96094Z"
                    fill="white"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* ================= TABLE ================= */}

          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="overflow-x-auto px-2 pb-2">
              <Table>
                {/* HEADER */}

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
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Image
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

                {/* BODY */}

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
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
                        {/* SR NO */}

                        <TableCell className="px-6 py-4 text-center font-medium">
                          {(page - 1) * limit + index + 1}
                        </TableCell>

                        {/* IMAGE */}

                        <TableCell className="px-6 py-4 text-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="mx-auto h-14 w-14 rounded-lg border border-gray-200 object-cover"
                          />
                        </TableCell>

                        {/* NAME */}

                        <TableCell className="px-6 py-4 font-medium">
                          {item.name}
                        </TableCell>

                        {/* DESIGNATION */}

                        <TableCell className="px-6 py-4">
                          {item.designation}
                        </TableCell>

                        {/* STATUS */}

                        <TableCell className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleStatus(item._id)}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ${
                              item.status === 1 ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                                item.status === 1
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />

                            <span
                              className={`absolute text-[8px] font-semibold ${
                                item.status === 1
                                  ? "left-1 text-white"
                                  : "right-1 text-gray-700"
                              }`}
                            >
                              {item.status === 1 ? "ON" : "OFF"}
                            </span>
                          </button>
                        </TableCell>

                        {/* DATE */}

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

                        {/* ACTION */}

                        <TableCell className="px-6 py-4">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <Link
                              to={`/edit-case-study-testimonial/${item._id}`}
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
                        colSpan={7}
                        className="py-10 text-center text-gray-500"
                      >
                        No Testimonial Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ================= BOTTOM ================= */}

            <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
              {/* SHOWING */}

              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {totalRecords === 0 ? 0 : (page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, totalRecords)} of {totalRecords} entries
              </div>

              {/* PAGINATION */}

              <div className="flex flex-wrap items-center gap-2">
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
        </ComponentCard>
      </div>
    </>
  );
}
