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
  getTestimonialsApi,
  deleteTestimonialApi,
  changeTestimonialStatusApi,
} from "../../api/testimonialApi";

interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  briefIntro: string;
  image: string;
  status: number;
}

export default function TestimonialList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const response = await getTestimonialsApi();

      if (response.data.success) {
        setTestimonials(response.data.data);
      }
    } catch (error) {
      console.log("Testimonial Fetch Error :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);
  const handleStatusChange = async (id: string) => {
    try {
      const response = await changeTestimonialStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTestimonials();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };
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
      const response = await deleteTestimonialApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTestimonials();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Testimonial List" />

      <div className="space-y-6">
        <ComponentCard title="Testimonial List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 text-start">
                      Sr No
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 text-start">
                      Image
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 text-start">
                      Name
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 text-start">
                      Designation
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 text-start">
                      Brief Intro
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 text-start">
                      Status
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 text-start">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell className="px-5 py-4">Loading...</TableCell>
                    </TableRow>
                  ) : testimonials.length > 0 ? (
                    testimonials.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="px-5 py-4">{index + 1}</TableCell>

                        <TableCell className="px-5 py-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-lg object-cover border"
                          />
                        </TableCell>

                        <TableCell className="px-5 py-4">{item.name}</TableCell>

                        <TableCell className="px-5 py-4">
                          {item.designation}
                        </TableCell>

                        <TableCell className="px-5 py-4 max-w-xs">
                          <p className="line-clamp-2">{item.briefIntro}</p>
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          <button
                            onClick={() => handleStatusChange(item._id)}
                            className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                              item.status === 1
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                          >
                            {item.status === 1 ? "Active" : "Inactive"}
                          </button>
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/edit-testimonial/${item._id}`}
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
                        No Testimonial Found
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
