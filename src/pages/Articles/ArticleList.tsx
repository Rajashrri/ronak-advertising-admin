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
          <div className="overflow-hidden rounded-xl border bg-white">

            <div className="overflow-x-auto max-w-full">

              <Table>

                <TableHeader className="border-b">

                  <TableRow>

                    <TableCell isHeader>Sr No</TableCell>
                    <TableCell isHeader>Image</TableCell>
                    <TableCell isHeader>Name</TableCell>
                    <TableCell isHeader>Published Date</TableCell>
                    <TableCell isHeader>Source</TableCell>
                    <TableCell isHeader>Status</TableCell>
                    <TableCell isHeader>Action</TableCell>

                  </TableRow>

                </TableHeader>

                <TableBody>

                  {loading ? (
                    <TableRow>
                      <TableCell>Loading...</TableCell>
                    </TableRow>
                  ) : items.length > 0 ? (
                    items.map((item, index) => (
                      <TableRow key={item._id}>

                        {/* SR NO */}
                        <TableCell>
                          {index + 1}
                        </TableCell>

                        {/* IMAGE */}
                        <TableCell>
                          <img
                            src={item.image}
                            className="h-14 w-14 rounded border object-cover"
                          />
                        </TableCell>

                        {/* NAME */}
                        <TableCell>
                          {item.name}
                        </TableCell>

                        {/* DATE */}
                        <TableCell>
                          {new Date(
                            item.publishedDate
                          ).toLocaleDateString()}
                        </TableCell>

                        {/* SOURCE */}
                        <TableCell>
                          {item.sourceName}
                        </TableCell>

                        {/* STATUS */}
                        <TableCell>
                          <button
                            onClick={() =>
                              handleStatus(item._id)
                            }
                          >
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
                          </button>
                        </TableCell>

                        {/* ACTION */}
                        <TableCell>
                          <div className="flex gap-2">

                            <Link
                              to={`/edit-article/${item._id}`}
                              className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(item._id)
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Delete
                            </button>

                          </div>
                        </TableCell>

                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
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