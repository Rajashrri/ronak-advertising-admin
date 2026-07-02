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
  getCoreTeamApi,
  deleteCoreTeamApi,
  changeCoreTeamStatusApi,
} from "../../api/coreTeamApi";

interface CoreTeam {
  _id: string;
  image: string;
  name: string;
  designation: string;
  status: number;
}

export default function CoreTeamList() {
  const [members, setMembers] = useState<CoreTeam[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await getCoreTeamApi();

      if (response.data.success) {
        setMembers(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
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

    if (!result.isConfirmed) return;

    try {
      const response = await deleteCoreTeamApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchMembers();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  const handleStatus = async (id: string) => {
    try {
      const response = await changeCoreTeamStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchMembers();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Status update failed"
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Core Team List" />

      <div className="space-y-6">
        <ComponentCard title="Core Team List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

            <div className="max-w-full overflow-x-auto">

              <Table>

                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">

                  <TableRow>

                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start"
                    >
                      Sr No
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start"
                    >
                      Image
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start"
                    >
                      Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start"
                    >
                      Designation
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start"
                    >
                      Status
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start"
                    >
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

                  ) : members.length > 0 ? (

                    members.map((item, index) => (

                      <TableRow key={item._id}>

                        <TableCell className="px-5 py-4">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-lg border object-cover"
                          />
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          {item.name}
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          {item.designation}
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
                              to={`/edit-core-team/${item._id}`}
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

                          </div>

                        </TableCell>

                      </TableRow>

                    ))

                  ) : (

                    <TableRow>

                      <TableCell
                        className="px-5 py-4 text-center"
                        colSpan={6}
                      >
                        No Core Team Member Found
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