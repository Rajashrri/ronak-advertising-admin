import { useEffect, useState } from "react";

import {
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";

import Badge from "../ui/badge/Badge";

import {
  getContactsApi,
  getNewsletterApi,
  getPopupEnquiriesApi,
  getLocationEnquiriesApi,
} from "../../api/listApi";

export default function EcommerceMetrics() {
  const [contactCount, setContactCount] = useState(0);
  const [newsletterCount, setNewsletterCount] = useState(0);
  const [popupCount, setPopupCount] = useState(0);
  const [locationCount, setLocationCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const fetchCounts = async () => {
    try {
      setLoading(true);

      const [
        contactResponse,
        newsletterResponse,
        popupResponse,
        locationResponse,
      ] = await Promise.all([
        getContactsApi(),
        getNewsletterApi(),
        getPopupEnquiriesApi(),
        getLocationEnquiriesApi(),
      ]);

      if (contactResponse.data.success) {
        setContactCount(contactResponse.data.data.length);
      }

      if (newsletterResponse.data.success) {
        setNewsletterCount(newsletterResponse.data.data.length);
      }

      if (popupResponse.data.success) {
        setPopupCount(popupResponse.data.data.length);
      }

      if (locationResponse.data.success) {
        setLocationCount(locationResponse.data.data.length);
      }
    } catch (error) {
      console.error("Dashboard Count Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-4 gap-6 sm:grid-cols-3 lg:grid-cols-4">

        {/* Contact Enquiries */}
        <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
            <GroupIcon className="size-7 text-gray-800 dark:text-white/90" />
          </div>

          <div className="mt-6 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Contact
              </span>

              <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                Enquiries
              </span>

              <h4 className="mt-3 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {loading ? "..." : contactCount}
              </h4>
            </div>

            <Badge color="success">
              <ArrowUpIcon />
              Total
            </Badge>
          </div>
        </div>

        {/* Newsletter */}
        <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
            <BoxIconLine className="size-7 text-gray-800 dark:text-white/90" />
          </div>

          <div className="mt-6 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Newsletter
              </span>

              <h4 className="mt-3 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {loading ? "..." : newsletterCount}
              </h4>
            </div>

            <Badge color="success">
              <ArrowUpIcon />
              Total
            </Badge>
          </div>
        </div>

        {/* Popup Enquiries */}
        <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
            <BoxIconLine className="size-7 text-gray-800 dark:text-white/90" />
          </div>

          <div className="mt-6 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Popup
              </span>

              <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                Enquiries
              </span>

              <h4 className="mt-3 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {loading ? "..." : popupCount}
              </h4>
            </div>

            <Badge color="success">
              <ArrowUpIcon />
              Total
            </Badge>
          </div>
        </div>

        {/* Location Enquiries */}
        <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
            <GroupIcon className="size-7 text-gray-800 dark:text-white/90" />
          </div>

          <div className="mt-6 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Location
              </span>

              <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                Enquiries
              </span>

              <h4 className="mt-3 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {loading ? "..." : locationCount}
              </h4>
            </div>

            <Badge color="success">
              <ArrowUpIcon />
              Total
            </Badge>
          </div>
        </div>

      </div>
    </div>
  );
}