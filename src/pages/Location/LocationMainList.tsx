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
  getLocationMainListApi,
  deleteLocationMainApi,
  changeLocationMainStatusApi,
} from "../../api/locationMainApi";

interface LocationMain {
  _id: string;
  locationId: {
    _id: string;
    locationName: string;
  };
  siteName: string;
  image: string;
  ytVideoLink: string;
  media: string;
  type: string;
  siteCode: string;
  latitude: string;
  longitude: string;
  status: number;
}

export default function LocationMainList() {
  const [locations, setLocations] = useState<LocationMain[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLocations = async () => {
    try {
      setLoading(true);

      const response = await getLocationMainListApi();

      if (response.data.success) {
        setLocations(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // ================= DELETE =================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteLocationMainApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchLocations();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  // ================= STATUS =================

  const handleStatus = async (id: string) => {
    try {
      const response =
        await changeLocationMainStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchLocations();
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
      <PageBreadcrumb pageTitle="Location Main List" />

      <div className="space-y-6">
        <ComponentCard title="Location Main List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

            <div className="max-w-full overflow-x-auto">

              <Table>

                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">

                  <TableRow>

                    <TableCell isHeader className="px-5 py-3">
                      Sr No
                    </TableCell>


                    <TableCell isHeader className="px-5 py-3">
                      Location
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3">
                      Site Name
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3">
                      Status
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3">
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
                  ) : locations.length > 0 ? (

                    locations.map((item, index) => (

                      <TableRow key={item._id}>

                        <TableCell className="px-5 py-4">
                          {index + 1}
                        </TableCell>

                      

                        <TableCell className="px-5 py-4">
                          {item.locationId?.locationName}
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          {item.siteName}
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
                              to={`/edit-location/${item._id}`}
                              className="rounded-lg bg-blue-500 px-3 py-2 text-white text-sm hover:bg-blue-600"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(item._id)
                              }
                              className="rounded-lg bg-red-500 px-3 py-2 text-white text-sm hover:bg-red-600"
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