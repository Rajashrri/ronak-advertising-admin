import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
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

import {
  getCaseStudyTestimonialsApi,
  deleteCaseStudyTestimonialApi,
  changeCaseStudyTestimonialStatusApi,
} from "../../api/caseStudyTestimonialApi";

interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  image: string;
  status: number;
  createdAt: string;
}

export default function CaseStudyTestimonialList() {
  const { caseStudyId } = useParams();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (caseStudyId) {
      fetchTestimonials();
    }
  }, [caseStudyId]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const response = await getCaseStudyTestimonialsApi(caseStudyId!);

      if (response.data.success) {
        setTestimonials(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: string) => {
    try {
      const response = await changeCaseStudyTestimonialStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTestimonials();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Status update failed");
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
      const response = await deleteCaseStudyTestimonialApi(id);

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
      <PageBreadcrumb pageTitle="Case Study Testimonials" />

      <div className="space-y-6">
        <ComponentCard title="Case Study Testimonials">
          {/* Add Button */}
          <div className="mb-5 flex justify-end">
            <Link
              to={`/add-case-study-testimonial/${caseStudyId}`}
              className="rounded-lg bg-brand-500 px-4 py-3 text-white hover:bg-brand-600"
            >
              Add Testimonial
            </Link>
          </div>

          {/* Paste Table Here */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-200 bg-gray-100">
                  <TableRow>
                    <TableCell isHeader>Sr No</TableCell>
                    <TableCell isHeader>Image</TableCell>
                    <TableCell isHeader>Name</TableCell>
                    <TableCell isHeader>Designation</TableCell>
                    <TableCell isHeader>Status</TableCell>
                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Date
                    </TableCell>
                    <TableCell isHeader>Action</TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : testimonials.length > 0 ? (
                    testimonials.map((item, index) => (
                      <TableRow
                        key={item._id}
                        className="border-b border-gray-100 transition-all duration-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                      >
                        <TableCell className="px-6 py-4 text-center font-medium">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-lg object-cover border"
                          />
                        </TableCell>

                        <TableCell className="px-6 py-4">{item.name}</TableCell>

                        <TableCell className="px-6 py-4">
                          {item.designation}
                        </TableCell>

                        <TableCell className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleStatus(item._id)}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ${
                              item.status === 1 ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                                item.status === 1
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />

                            <span
                              className={`absolute text-[8px] font-semibold ${
                                item.status === 1
                                  ? "left-1 text-white"
                                  : "right-1 text-gray-700"
                              }`}
                            >
                              {item.status === 1 ? "ON" : "OFF"}
                            </span>
                          </button>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center text-gray-600">
                          {item.createdAt
                            ? new Date(item.createdAt)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                                .replace(/\//g, "-")
                            : "-"}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <Link
                              to={`/edit-case-study-testimonial/${item._id}`}
                              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(item._id)}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
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
