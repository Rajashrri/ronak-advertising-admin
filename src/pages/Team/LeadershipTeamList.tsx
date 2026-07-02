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

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

            <div className="max-w-full overflow-x-auto">

              <Table>

                <TableHeader>

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
                      Designation
                    </TableCell>

                    <TableCell isHeader>
                      Experience
                    </TableCell>

                    <TableCell isHeader>
                      LinkedIn
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

                      <TableCell className="px-5 py-4">
                        Loading...
                      </TableCell>

                    </TableRow>

                  ) : leadership.length > 0 ? (

                    leadership.map((item, index) => (

                      <TableRow key={item._id}>

                        <TableCell className="px-5 py-4">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-5 py-4">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-lg object-cover border"
                          />

                        </TableCell>

                        <TableCell className="px-5 py-4">
                          {item.name}
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          {item.designation}
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          {item.experience}
                        </TableCell>

                        <TableCell className="px-5 py-4">

                          <a
                            href={item.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Profile
                          </a>

                        </TableCell>

                        <TableCell className="px-5 py-4">

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

                        <TableCell className="px-5 py-4">

                          <div className="flex gap-2">

                            <Link
                              to={`/edit-leadership-team/${item._id}`}
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

                      <TableCell className="px-5 py-4 text-center">
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