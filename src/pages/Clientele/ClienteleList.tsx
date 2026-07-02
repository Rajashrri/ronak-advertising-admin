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
  getClientApi,
  deleteClientApi,
  changeStatusApi,
} from "../../api/clienteleApi";

interface Client {
  _id: string;
  clientName: string;
  clientLogo: string;
  status: number;
}

export default function ClienteleList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);

      const response = await getClientApi();

      if (response.data.success) {
        setClients(response.data.data);
      }
    } catch (error) {
      console.log("Client Fetch Error :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
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
      const response = await deleteClientApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchClients();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  const handleStatusChange = async (id: string) => {
    try {
      const response = await changeStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchClients();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Clientele List" />

      <div className="space-y-6">
        <ComponentCard title="Clientele List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader>Sr No</TableCell>

                    <TableCell isHeader>
                      Client Logo
                    </TableCell>

                    <TableCell isHeader>
                      Client Name
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
                      <TableCell>Loading...</TableCell>
                    </TableRow>
                  ) : clients.length > 0 ? (
                    clients.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          {index + 1}
                        </TableCell>

                        <TableCell>
                          <img
                            src={item.clientLogo}
                            alt={item.clientName}
                            className="h-14 w-14 rounded-lg border object-cover"
                          />
                        </TableCell>

                        <TableCell>
                          {item.clientName}
                        </TableCell>

                        <TableCell>
                          <button
                            onClick={() =>
                              handleStatusChange(item._id)
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

                        <TableCell>
                          <div className="flex gap-2">
                            <Link
                              to={`/edit-clientele/${item._id}`}
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
                      <TableCell className="text-center">
                        No Client Found
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