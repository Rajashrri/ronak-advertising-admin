import { useEffect, useState } from "react";
import { Link } from "react-router";
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

import Badge from "../../components/ui/badge/Badge";

import {
  getMediaCoverageApi,
  deleteMediaCoverageApi,
  changeMediaCoverageStatusApi,
} from "../../api/mediaCoverageApi";

interface MediaCoverage {
  _id: string;
  name: string;
  image: string;
  publishedDate: string;
  sourceName: string;
  status: number;
}

export default function MediaCoverageList() {
  const [items, setItems] = useState<MediaCoverage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getMediaCoverageApi();

      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteMediaCoverageApi(id);

      if (res.data.success) {
        toast.success(res.data.message);
        fetchData();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  const handleStatus = async (id: string) => {
    try {
      const res = await changeMediaCoverageStatusApi(id);

      if (res.data.success) {
        toast.success(res.data.message);
        fetchData();
      }
    } catch (error: any) {
      toast.error("Status update failed");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Media Coverage List" />

      <div className="space-y-8">
        <ComponentCard title="Media Coverage List">
         <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
  <div className="overflow-x-auto">

    <Table>

      <TableHeader className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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
              className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 dark:border-gray-800 dark:hover:bg-gray-800"
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
                    to={`/edit-media-coverage/${item._id}`}
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
              No Media Coverage Found
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