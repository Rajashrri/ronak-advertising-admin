import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";

import {
  getClientDetailApi,
  updateClientApi,
} from "../../api/clienteleApi";

export default function EditClientele() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");

  const [logo, setLogo] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {

    const response = await getClientDetailApi(id!);

    if (response.data.success) {

      setClientName(response.data.data.clientName);

      setPreview(response.data.data.clientLogo);

    }
  };

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    let err:any = {};

    if (!clientName.trim()) {
      err.clientName = "Client Name is required";
    }

    setErrors(err);

    if (Object.keys(err).length) return;

    try {

      const formData = new FormData();

      formData.append("clientName", clientName);

      if (logo) {

        formData.append("clientLogo", logo);

      }

      const response = await updateClientApi(id!, formData);

      if (response.data.success) {

        toast.success(response.data.message);

        navigate("/list-clientele");

      }

    } catch (error:any) {

      toast.error(error.response?.data?.message);

    }

  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Client" />

      <div className="space-y-6">

        <ComponentCard title="Edit Client">

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

                    {errors.clientName &&
                      <p className="text-red-500">
                        {errors.clientName}
                      </p>
                    }

                  </div>

                  <div>

                    <label>Current Logo</label>

                    {preview && (

                      <img
                        src={preview}
                        className="mt-2 h-24 w-24 rounded border object-cover"
                      />

                    )}

                  </div>

                  <div>

                    <label>Change Logo</label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e)=>
                        setLogo(e.target.files?.[0] || null)
                      }
                    />

                  </div>

                  <button
                    className="rounded-lg bg-brand-500 px-4 py-3 text-white"
                  >
                    Update Client
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