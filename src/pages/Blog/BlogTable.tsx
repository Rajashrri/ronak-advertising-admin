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

import { getBlogsApi, deleteBlogApi } from "../../api/blogApi";

interface Blog {
  _id: string;
  title: string;
  categoryId: {
    categoryName: string;
  };
  status: number;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const response = await getBlogsApi();

      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      console.log("Blog Fetch Error :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

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
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Blog List" />

      <div className="space-y-6">
        <ComponentCard title="Blog List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Sr No
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Category Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Title
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Status
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {loading ? (
                    <TableRow>
                      <TableCell className="px-5 py-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : blogs.length > 0 ? (
                    blogs.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="px-5 py-4 text-start">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {item.categoryId?.categoryName}
                          </span>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {item.title}
                          </span>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          <Badge
                            size="sm"
                            color={
                              item.status === 1
                                ? "success"
                                : "error"
                            }
                          >
                            {item.status === 1
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start">
                          <div className="flex gap-2">
                            <Link
                              to={`/edit-blog/${item._id}`}
                              className="inline-flex items-center rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(item._id)
                              }
                              className="inline-flex items-center rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                            >
                              Delete
                            </button>


                             <Link
                              to={`/seo/${item._id}`}
                              className="inline-flex items-center rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                            >
                              SEO
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="px-5 py-4 text-center">
                        No Blog Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}