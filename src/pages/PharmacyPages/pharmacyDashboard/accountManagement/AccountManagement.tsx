import {
  Button,
  DashboardSection,
  InputField,
  PhoneInputComp,
} from "../../../../components";
import { useEffect, useMemo, useState, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  isPhoneValid,
  notifyFailure,
  notifySuccess,
} from "../../../../utils/Utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FIND_PHARMACY_QUERY, UPDATED_PHARMACY_QUERY } from "./queries";
import { Toaster } from "react-hot-toast";
import {
  getPharmacyById,
  updatePharmacyById,
} from "../../../../api/apiCalls/pharmacyApi";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { uploadFileDoctor } from "../../../../api/apiCalls/doctorsApi";
import { FILE_UPLOAD } from "../../../DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";
import { UpdatedPharmacyData } from "../../../../api/apiCalls/types";
import ImageUrl from "../../../../components/Icons/Sidemenu/ImageUrl";

const inputs = [
  {
    label: "Name",
    type: "text",
    placeholder: "Enter Name",
    name: "name",
  },
  {
    label: "Pharmacy Name",
    type: "text",
    placeholder: "Enter Pharmacy Name",
    name: "pharmacy_name",
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
    name: "email",
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
    pharmacy_name: z.string().min(1, { message: "Pharmacy Name is required" }),
    city: z.string().min(1, { message: "City is required" }),
    registration_number: z
      .string()
      .min(1, { message: "Registration Number is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone_number: z.string().min(1, { message: "Phone Number is required" }),
    logo: z.string().min(1, { message: "Image is required" }),
  })
  .refine((data) => isPhoneValid(data.phone_number), {
    message: "Invalid Phone Number",
    path: ["phone_number"],
  });

export default function AccountManagement() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<UpdatedPharmacyData>({
    resolver: zodResolver(FormSchema),
  });

  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState<string | null>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    try {
      dispatch(loadingStart());
      const uploadedFileUrl = await uploadFileDoctor(FILE_UPLOAD, file);
      setValue("logo", uploadedFileUrl);
      dispatch(loadingEnd());
    } catch (error) {
      dispatch(loadingEnd());
      console.error("File upload failed:", error);
    }
  };

  const getPharmacy = async () => {
    if (!id) return;
    return getPharmacyById(FIND_PHARMACY_QUERY, {
      findPharmacyByIdId: id,
    });
  };

  const pharmacyData = useQuery({
    queryKey: ["pharmacy", id],
    queryFn: getPharmacy,
  });

  const defaultPharmacyData = useMemo(() => {
    if (pharmacyData.isLoading || !pharmacyData.data) {
      return {};
    }

    const {
      name,
      pharmacy_name,
      city,
      registration_number,
      email,
      phone_number,
      logo,
    } = pharmacyData.data;
    return {
      name,
      pharmacy_name,
      city,
      registration_number,
      email,
      phone_number,
      logo,
    };
  }, [pharmacyData?.data]);

  useEffect(() => {
    if (pharmacyData?.data) {
      reset(defaultPharmacyData);
    }
  }, [pharmacyData?.data, reset]);

  const updatePharmacy = async (data: UpdatedPharmacyData) => {
    if (!id) return;

    const response = await updatePharmacyById(UPDATED_PHARMACY_QUERY, {
      updatePharmacyId: id,
      data,
    });

    if (!response) {
      throw new Error("Failed to update Pharmacy!");
    }

    return response;
  };

  const { mutate } = useMutation(updatePharmacy, {
    onMutate: () => {
      dispatch(loadingStart());
    },
    onSuccess: () => {
      dispatch(loadingEnd());
      notifySuccess("Profile Updated!");
      queryClient.invalidateQueries(["pharmacy"]);
    },
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error.message || "Something went wrong!");
    },
  });

  const onSubmit: SubmitHandler<UpdatedPharmacyData> = (
    data: UpdatedPharmacyData,
  ) => {
    setEdit(false);
    const updatedData = {
      name: data.name,
      pharmacy_name: data.pharmacy_name,
      city: data.city,
      registration_number: data.registration_number,
      email: data.email,
      phone_number: data.phone_number,
      logo: getValues("logo") ?? "",
    };
    mutate(updatedData);
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
                        properties={{
                          ...register(input.name as keyof UpdatedPharmacyData),
                        }}
                        error={errors[input.name as keyof UpdatedPharmacyData]}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="w-full md:w-2/5 flex flex-col items-center">
                <div className="mt-4 flex flex-col items-center">
                  <span className="inline-block h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-2 border-green-500">
                    {image ? (
                      <img
                        src={image}
                        alt="Selected logo"
                        className="h-full w-full object-cover"
                      />
                    ) : defaultPharmacyData?.logo ? (
                      <ImageUrl fileKey={defaultPharmacyData.logo} />
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
                        style={{ color: "inherit" }}
                      >
                        Upload Logo
                      </button>
                    </>
                  )}
                  {errors["logo"] && (
                    <small className="text-red-500 font-medium uppercase">
                      <>{errors["logo"]?.message}</>
                    </small>
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
}
