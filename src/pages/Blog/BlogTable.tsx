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
  getBlogsApi,
  deleteBlogApi,
  changeFeaturedApi,
  changeBlogStatusApi,
} from "../../api/blogApi";

interface Blog {
  _id: string;
  title: string;
  categoryId: {
    categoryName: string;
  };
  status: number;
  featured: number;
  createdAt: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const handleFeatured = async (id: string) => {
    try {
      const response = await changeFeaturedApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchBlogs();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Featured update failed");
    }
  };

  const handleStatus = async (id: string) => {
    try {
      const response = await changeBlogStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchBlogs();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const response = await getBlogsApi(page, limit, search);

      if (response.data.success) {
        setBlogs(response.data.data);

        setTotalPages(response.data.pagination.totalPages);

        setTotalRecords(response.data.pagination.total);
      }
    } catch (error) {
      console.log("Blog Fetch Error :", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, [page, limit, search]);

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

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await deleteBlogApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchBlogs();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Blog List" />

      <div className="space-y-6">
        <ComponentCard title="Blog List">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search blog..."
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
                      Category
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      Blog Title
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
                      Featured
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
                        colSpan={7}
                        className="py-10 text-center text-gray-500"
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : blogs.length > 0 ? (
                    blogs.map((item, index) => (
                      <TableRow
                        key={item._id}
                        className="border-b border-gray-100 transition-all duration-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                      >
                        <TableCell className="px-6 py-4 text-center font-medium">
                          {(page - 1) * limit + index + 1}
                        </TableCell>

                        <TableCell className="px-6 py-4 font-medium">
                          {item.categoryId?.categoryName}
                        </TableCell>

                        <TableCell className="px-6 py-4 max-w-md">
                          <p className="truncate font-medium">{item.title}</p>
                        </TableCell>

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

                        <TableCell className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleFeatured(item._id)}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ${
                              item.featured === 1
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                                item.featured === 1
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />

                            <span
                              className={`absolute text-[8px] font-semibold ${
                                item.featured === 1
                                  ? "left-1 text-white"
                                  : "right-1 text-gray-700"
                              }`}
                            >
                              {item.featured === 1 ? "ON" : "OFF"}
                            </span>
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
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <Link
                              to={`/edit-blog/${item._id}`}
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

                            <Link
                              to={`/seo/${item._id}`}
                              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                            >
                              SEO
                            </Link>
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
                        No Blog Found
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
      </div>
    </>
  );
}
