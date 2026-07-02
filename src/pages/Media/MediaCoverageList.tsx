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

      <div className="space-y-6">
        <ComponentCard title="Media Coverage List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

            <div className="max-w-full overflow-x-auto">

              <Table>

                <TableHeader className="border-b">

                  <TableRow>

                    <TableCell isHeader>
                      Sr No
                    </TableCell>

                    <TableCell isHeader>
                      Image
                    </TableCell>

                    <TableCell isHeader>
                      Name
                    </TableCell>

                    <TableCell isHeader>
                      Published Date
                    </TableCell>

                    <TableCell isHeader>
                      Source
                    </TableCell>

                    <TableCell isHeader>
                      Status
                    </TableCell>

                    <TableCell isHeader>
                      Action
                    </TableCell>

                  </TableRow>

                </TableHeader>

                <TableBody>

                  {loading ? (
                    <TableRow>
                      <TableCell>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : items.length > 0 ? (
                    items.map((item, index) => (
                      <TableRow key={item._id}>

                        {/* Sr No */}
                        <TableCell>
                          {index + 1}
                        </TableCell>

                        {/* Image */}
                        <TableCell>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-lg border object-cover"
                          />
                        </TableCell>

                        {/* Name */}
                        <TableCell>
                          {item.name}
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                          {new Date(
                            item.publishedDate
                          ).toLocaleDateString()}
                        </TableCell>

                        {/* Source */}
                        <TableCell>
                          {item.sourceName}
                        </TableCell>

                        {/* Status */}
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

                        {/* Actions */}
                        <TableCell>
                          <div className="flex gap-2">

                            <Link
                              to={`/edit-media-coverage/${item._id}`}
                              className="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(item._id)
                              }
                              className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
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