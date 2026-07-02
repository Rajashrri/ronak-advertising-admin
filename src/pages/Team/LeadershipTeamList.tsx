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
  getLeadershipApi,
  deleteLeadershipApi,
  changeLeadershipStatusApi,
} from "../../api/leadershipTeamApi";

interface Leadership {
  _id: string;
  image: string;
  name: string;
  designation: string;
  experience: string;
  linkedin: string;
  status: number;
}

export default function LeadershipTeamList() {
  const [leadership, setLeadership] = useState<Leadership[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeadership = async () => {
    try {
      setLoading(true);

      const response = await getLeadershipApi();

      if (response.data.success) {
        setLeadership(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadership();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteLeadershipApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchLeadership();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  const handleStatus = async (id: string) => {
    try {
      const response = await changeLeadershipStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchLeadership();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Status update failed"
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Leadership Team" />

      <div className="space-y-6">
        <ComponentCard title="Leadership Team List">

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

        ) : leadership.length > 0 ? (

          leadership.map((item, index) => (

            <TableRow
              key={item._id}
              className="border-b border-gray-100 transition-all duration-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            >

              <TableCell className="px-6 py-4 text-center font-medium">
                {index + 1}
              </TableCell>

              <TableCell className="px-6 py-4 text-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="mx-auto h-14 w-14 rounded-lg border border-gray-200 object-cover"
                />
              </TableCell>

              <TableCell className="px-6 py-4 font-medium">
                {item.name}
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
                    to={`/edit-leadership-team/${item._id}`}
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
              No Record Found
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