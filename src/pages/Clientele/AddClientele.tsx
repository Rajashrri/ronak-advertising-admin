import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import { addClientApi } from "../../api/clienteleApi";

export default function AddClientele() {
  const [clientName, setClientName] = useState("");
  const [clientLogo, setClientLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let err: any = {};

    if (!clientName.trim()) err.clientName = "Client Name is required";
    if (!clientLogo) err.clientLogo = "Client Logo is required";

    setErrors(err);

    if (Object.keys(err).length) return;

    try {
      const formData = new FormData();

      formData.append("clientName", clientName);

      if (clientLogo) {
        formData.append("clientLogo", clientLogo);
      }

      const response = await addClientApi(formData);

      if (response.data.success) {
        toast.success(response.data.message);

        setClientName("");
        setClientLogo(null);
        setErrors({});
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Client" />

      <div className="space-y-6">
        <ComponentCard title="Add Client">
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="p-6">

              <form onSubmit={handleSubmit}>

                <div className="grid gap-6">

                  <div>
                    <label>Client Name</label>

                    <input
                      type="text"
                      value={clientName}
                      onChange={(e)=>setClientName(e.target.value)}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.clientName && (
                      <p className="text-red-500">
                        {errors.clientName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label>Client Logo</label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e)=>
                        setClientLogo(e.target.files?.[0] || null)
                      }
                    />

                    {errors.clientLogo && (
                      <p className="text-red-500">
                        {errors.clientLogo}
                      </p>
                    )}
                  </div>

                  <button
                    className="rounded-lg bg-brand-500 px-4 py-3 text-white"
                  >
                    Save Client
                  </button>

                </div>

              </form>

            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}