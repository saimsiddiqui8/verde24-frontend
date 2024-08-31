import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Button,
  DashboardSection,
  InputField,
  PhoneInputComp,
} from "../../../../components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Toaster } from "react-hot-toast";
import { getLabById, updateLabById } from "../../../../api/apiCalls/labApi";
import { FIND_LAB_QUERY, UPDATED_LAB_QUERY } from "./queries";
import { notifySuccess, isPhoneValid } from "../../../../utils/Utils";

const inputs = [
  {
    label: "Name",
    type: "text",
    placeholder: "Enter Name",
    name: "name",
  },
  {
    label: "Laboratory Name",
    type: "text",
    placeholder: "Enter Laboratory Name",
    name: "lab_name",
  },
  {
    label: "City",
    type: "text",
    placeholder: "Enter City",
    name: "city",
  },
  {
    label: "Registration Number",
    type: "text",
    placeholder: "Enter Registration Number",
    name: "registration_number",
  },
  {
    label: "Registered Email",
    type: "email",
    placeholder: "Enter Registered Email",
    name: "registered_email",
  },
  {
    label: "Phone Number",
    type: "number",
    placeholder: "Enter Your Phone Number",
    name: "phone_number",
  },
];

const FormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    lab_name: z.string().min(1, { message: "Laboratory Name is required" }),
    city: z.string().min(1, { message: "City is required" }),
    registration_number: z
      .string()
      .min(1, { message: "Registration Number is required" }),
    registered_email: z.string().email({ message: "Invalid email address" }),
    phone_number: z.string().min(1, { message: "Phone Number is required" }),
  })
  .refine((data) => isPhoneValid(data.phone_number), {
    message: "Invalid Phone Number",
    path: ["phone_number"],
  });

const LabAccountManagement = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });

  const [edit, setEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const queryClient = useQueryClient();

  // Memoize the getLab function
  const getLab = () => {
    if (!id) return;
    return getLabById(FIND_LAB_QUERY, { findLabByIdId: Number(id) });
  };

  // Fetch Lab Data
  const labData = useQuery({
    queryKey: ["lab", id],
    queryFn: getLab,
  });

  // UseMemo to format initial form values
  const defaultLabData = useMemo(() => {
    if (labData.isLoading || !labData.data) {
      return {};
    }

    const { name, lab_name, city, registration_number, email, phone_number } =
      labData.data;
    return {
      name,
      lab_name,
      city,
      registration_number,
      registered_email: email,
      phone_number,
    };
  }, [labData.data]);

  useEffect(() => {
    if (labData.data) {
      reset(defaultLabData);
    }
  }, [labData.data, reset]);

  // Update Lab Data
  const updateLab = async (data: any) => {
    if (!id) return;
    const updatedId = Number(id);
    return updateLabById(UPDATED_LAB_QUERY, {
      updateLabId: updatedId,
      data: {
        ...data,
        logo: data.logo || "",
        is_verified: data.is_verified || false,
      },
    });
  };

  const { data, mutate } = useMutation(updateLab);

  const onSubmit = (data: any) => {
    setEdit(false);
    const updatedData = {
      name: data.name,
      lab_name: data.lab_name,
      city: data.city,
      registration_number: data.registration_number,
      email: data.registered_email,
      phone_number: data.phone_number,
      logo: selectedFile ? URL.createObjectURL(selectedFile) : "",
      is_verified: true,
    };
    mutate(updatedData);
  };

  useEffect(() => {
    if (data?.email) {
      notifySuccess("Profile Updated!");
      queryClient.invalidateQueries(["lab"]);
    }
  }, [data, queryClient]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <DashboardSection>
        <div className="p-4 bg-white shadow-md rounded-md">
          <form
            className="pt-2 pb-6 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Account Management
              </h2>
              <div className="flex gap-4">
                <Button
                  title="Edit"
                  className="w-20 bg-blue-500 text-white hover:bg-blue-600"
                  type="button"
                  onClick={() => setEdit(true)}
                />
                {edit && (
                  <Button
                    title="Save"
                    className="w-20 bg-green-500 text-white hover:bg-green-600"
                    type="submit"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-3/5">
                {inputs.map((input) => (
                  <div key={input.name} className="mb-4">
                    {input.name === "phone_number" ? (
                      <PhoneInputComp
                        label={input.label}
                        properties={{ ...register(input.name) }}
                        error={errors[input.name]}
                        disabled={!edit}
                      />
                    ) : (
                      <InputField
                        label={input.label}
                        name={input.name}
                        placeholder={input.placeholder}
                        type={input.type}
                        disabled={!edit}
                        properties={{ ...register(input.name) }}
                        error={errors[input.name]}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="w-full md:w-2/5 flex flex-col items-center">
                <div className="mt-4 flex flex-col items-center">
                  <span className="inline-block h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-2 border-green-500">
                    {selectedFile ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Selected logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-full w-full text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 24H0V0h24v24z" fill="none" />
                        <path d="M12 0c-1.65 0-3.22.67-4.38 1.76L0 12h5v7h7v5l6.24-6.24c1.09-1.16 1.76-2.73 1.76-4.38 0-3.31-2.69-6-6-6zm2 13.5v-2h-4v-2h4V7l3 3-3 3.5z" />
                      </svg>
                    )}
                  </span>
                  {edit && (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        className="mt-2 font-extrabold bg-white rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        type="button"
                        onClick={handleUploadClick}
                      >
                        Upload Logo
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </DashboardSection>
      <Toaster />
    </>
  );
};

export default LabAccountManagement;
