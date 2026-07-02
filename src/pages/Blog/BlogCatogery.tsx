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

import { getCategoriesApi, deleteCategoryApi } from "../../api/blogCategoryApi";
interface Category {
  _id: string;
  categoryName: string;
  slug: string;
}

export default function BlogCatogery() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await getCategoriesApi();

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log("Category Fetch Error :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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
    const response = await deleteCategoryApi(id);

    if (response.data.success) {
      toast.success(response.data.message);

      fetchCategories();
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Delete failed"
    );
  }
};
  return (
    <>
      <PageBreadcrumb pageTitle="Blog Category" />

      <div className="space-y-6">
        <ComponentCard title="Blog Category">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
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
                      Project Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
                    >
                      Slug
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

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {loading ? (
                    <TableRow>
                      <TableCell className="px-5 py-4">Loading...</TableCell>
                    </TableRow>
                  ) : categories.length > 0 ? (
                    categories.map((item, index) => (
                      <TableRow key={item._id}>
                        {/* SR NO */}
                        <TableCell className="px-5 py-4 text-start">
                          {index + 1}
                        </TableCell>

                        {/* CATEGORY NAME */}
                        <TableCell className="px-5 py-4 text-start">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.categoryName}
                            </span>
                          </div>
                        </TableCell>

                        {/* SLUG */}
                        <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500">
                          {item.slug}
                        </TableCell>

                        {/* STATUS */}
                        <TableCell className="px-5 py-4 text-start">
                          <Badge size="sm" color="success">
                            Active
                          </Badge>
                        </TableCell>

                        {/* ACTION */}
                        <TableCell className="px-5 py-4 text-start">
                          <div className="flex gap-2">
                            <Link
                              to={`/edit-category/${item._id}`}
                              className="inline-flex items-center rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(item._id)}
                              className="inline-flex items-center rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="px-5 py-4 text-center">
                        No Category Found
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
