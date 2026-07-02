import { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import Badge from "../../components/ui/badge/Badge";

import {
  getArticlesApi,
  deleteArticleApi,
  changeArticleStatusApi,
} from "../../api/articleApi";

interface Article {
  _id: string;
  name: string;
  image: string;
  publishedDate: string;
  sourceName: string;
  briefIntro: string;
  articleLink: string;
  status: number;
}

export default function ArticleList() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchArticles = async () => {
    try {
      setLoading(true);

      const res = await getArticlesApi();

      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteArticleApi(id);

      if (res.data.success) {
        toast.success(res.data.message);
        fetchArticles();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // ================= STATUS =================
  const handleStatus = async (id: string) => {
    try {
      const res = await changeArticleStatusApi(id);

      if (res.data.success) {
        toast.success(res.data.message);
        fetchArticles();
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Articles List" />

      <div className="space-y-6">
        <ComponentCard title="Articles List">
         <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
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
            className="px-6 py-4 text-center text-sm font-semibold"
          >
            Published Date
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
            Action
          </TableCell>

        </TableRow>
      </TableHeader>

      <TableBody>

        {loading ? (

          <TableRow>
            <TableCell
              colSpan={5}
              className="py-10 text-center text-gray-500"
            >
              Loading...
            </TableCell>
          </TableRow>

        ) : items.length > 0 ? (

          items.map((item, index) => (

            <TableRow
              key={item._id}
              className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            >

              <TableCell className="px-6 py-4 text-center font-medium">
                {index + 1}
              </TableCell>

              <TableCell className="px-6 py-4 font-medium">
                {item.name}
              </TableCell>

              <TableCell className="px-6 py-4 text-center">
                {new Date(item.publishedDate).toLocaleDateString()}
              </TableCell>

              <TableCell className="px-6 py-4 text-center">
                <button onClick={() => handleStatus(item._id)}>
                  <Badge
                    size="sm"
                    color={item.status === 1 ? "success" : "error"}
                  >
                    {item.status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </button>
              </TableCell>

              <TableCell className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">

                  <Link
                    to={`/edit-article/${item._id}`}
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
              colSpan={5}
              className="py-10 text-center text-gray-500"
            >
              No Articles Found
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