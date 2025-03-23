import {
  Button,
  DashboardSection,
  DropdownField,
  InputField,
  PhoneInputComp,
} from "../../../../components";
import { useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isPhoneValid, notifySuccess } from "../../../../utils/Utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FIND_PATIENT_QUERY, UPDATE_PATIENT_QUERY } from "./queries";
import { Toaster } from "react-hot-toast";
import {
  getPatientById,
  updatePatientById,
} from "../../../../api/apiCalls/patientsApi";
import { UserData } from "../../../../api/apiCalls/types";
import ImageUrl from "../../../../components/Icons/Sidemenu/ImageUrl";
import { loadingEnd, loadingStart } from "../../../../redux/slices/loadingSlice";
import { uploadFileDoctor } from "../../../../api/apiCalls/doctorsApi";
import { FILE_UPLOAD } from "../../../DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";

const inputs = [
  {
    label: "Patient Name",
    type: "text",
    placeholder: "Enter Name",
    name: "patient_name",
  },
  {
    label: "Patient Age",
    type: "number",
    placeholder: "Enter Age in Years",
    name: "patient_age",
  },
  {
    label: "Insurance Id",
    type: "text",
    placeholder: "Enter Insurance Id",
    name: "insurance_id",
  },
  {
    label: "Gender",
    type: "dropdown",
    placeholder: "Select Your Gender",
    name: "gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
  },
  {
    label: "Weight",
    type: "number",
    placeholder: "Enter Your Weight in KG",
    name: "weight",
  },
  {
    label: "Phone Number",
    type: "number",
    placeholder: "Enter Your Phone Number",
    name: "phone_number",
  },
  {
    label: "Blood Group",
    type: "text",
    placeholder: "Enter Your Blood Group",
    name: "blood_group",
  },
  {
    label: "Other History",
    type: "text",
    placeholder: "Other History",
    name: "other_history",
  },
];

const FormSchema = z
  .object({
    patient_name: z.string().min(1, { message: "Patient Name is required" }),
    patient_age: z
    .coerce
    .number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    })
    .min(1, { message: "Age is required" }) 
    .gt(18, { message: "Age must be greater than 18" }),
    insurance_id: z.string().min(1, { message: "Insurance Id is required" }),
    phone_number: z.string().min(1, { message: "Phone Number is required" }),
    gender: z
      .string({
        invalid_type_error: "Gender is required",
      })
      .min(1, { message: "Gender is required" }),
      weight: z
      .coerce
      .number({
        required_error: "Weight is required",
        invalid_type_error: "Weight must be a number",
      })
      .min(1, { message: "Weight is required" }), 
    blood_group: z.string().min(1, { message: "Blood Group is required" }),
    other_history: z.string().min(1, { message: "Other History is required" }),
    image: z.string().min(1, { message: "Image is required" }),
  })
  .refine((data) => isPhoneValid(data.phone_number), {
    message: "Invalid Phone Number",
    path: ["phone_number"],
  });

export default function PatientProfile() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<UserData>({
    resolver: zodResolver(FormSchema),
  });
  const [edit, setEdit] = useState(false);
   const [image, setImage] = useState<string | null>();
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImage(URL.createObjectURL(file));
      try {
        dispatch(loadingStart());
        const uploadedFileUrl = await uploadFileDoctor(
          FILE_UPLOAD
          ,
          file
        );
        setValue("image", uploadedFileUrl, { shouldValidate: true });
        dispatch(loadingEnd());
      } catch (error) {
        dispatch(loadingEnd());
        console.error("File upload failed:", error);
      }
    };

  const getPatient = async () => {
    if (!id) return;
    return getPatientById(FIND_PATIENT_QUERY, { id: id });
  };

  const patientData = useQuery({
    queryKey: ["patient", id],
    queryFn: getPatient,
  });
  const defaultPatientData = useMemo(() => {
    if (patientData.isLoading || !patientData.data) {
      return {};
    }

    const {
      first_name,
      last_name,
      image,
      gender,
      phone_number,
      insurance_id,
      age,
      weight,
      blood_group,
      other_history,
    } = patientData.data;
    return {
      patient_name: `${first_name} ${last_name}`,
      patient_age: age === 0 ? null : age,
      image,
      insurance_id,
      phone_number,
      gender,
      weight:weight === 0 ? null : weight,
      blood_group,
      other_history,
    };
  }, [patientData?.data]);

  useEffect(() => {
    if (patientData?.data) {
      reset(defaultPatientData);
    }
  }, [patientData?.data, reset]);
  const updatePatient = async (data: UserData) => {
    if (!id) return;
    const updatedId = Number(id);
    return updatePatientById(UPDATE_PATIENT_QUERY, {
      updatePatientId: updatedId,
      data,
    });
  };

  const { data, mutate } = useMutation(updatePatient);

  const onSubmit: SubmitHandler<UserData> = (data: UserData) => {
    setEdit(false);
    const userData: UserData = {
      first_name: data?.patient_name?.split(" ")[0] ?? "",
      last_name: data?.patient_name?.split(" ")[1] ?? "",
      image:getValues("image") ?? "",
      gender: data?.gender,
      phone_number: data?.phone_number,
      insurance_id: data?.insurance_id,
      age: data?.patient_age ? parseInt(data.patient_age) : 0,
      weight: data?.weight,
      blood_group: data?.blood_group,
      other_history: data?.other_history,
    };
    mutate(userData);
  };
  

  useEffect(() => {
    if (data?.email) {
      notifySuccess("Profile Updated!");
      queryClient.invalidateQueries({
        queryKey: ["patient"],
      });
    }
  }, [data, queryClient]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  return (
    <>
      <DashboardSection>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="pt-2 pb-6">
            <div className="flex justify-between items-center my-4">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Patient Profile
              </h2>
              <div className="flex gap-4">
                <Button
                  title="Edit"
                  className="w-20"
                  type="button"
                  onClick={() => setEdit(true)}
                />
                {edit && <Button title="Save" className="w-20" type="submit" />}
              </div>
            </div>
            <div className="mt-4 flex flex-col items-start">
                  <span className="inline-block h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-2 border-green-500">
                  {image ? (
  <img
    src={image}
    alt="Selected logo"
    className="h-full w-full object-cover"
  />
) : defaultPatientData?.image ? (
  <ImageUrl fileKey={defaultPatientData.image} />
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
                       {errors["image"] && (
              <small className="text-red-500 font-medium uppercase">
                <>{errors["image"]?.message}</>
              </small>
            )}
                      <button
                        className="mt-2 font-extrabold bg-white rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        type="button"
                        onClick={handleUploadClick}
                      >
                        Upload Image
                      </button>
                    </>
                  )}
                </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              {inputs.map((input) => (
                <div key={input.name} className="mb-6 h-16">
                  {input.name === "phone_number" ? (
                    <PhoneInputComp
                      label={input.label}
                      properties={{ ...register(input.name) }}
                      error={errors[input.name]}
                      disabled={!edit}
                    />
                  ) : input?.type === "dropdown" ? (
                    <DropdownField
                      label={input?.label}
                      name={input?.name}
                      options={input?.options!}
                      placeholder={input?.placeholder}
                      properties={{ ...register(input?.name as keyof UserData) }}
                      error={errors[input?.name as keyof UserData]?.message}
                      disabled={!edit}
                    />
                  )
                  : (
                    <InputField
                      label={input.label}
                      name={input.name}
                      placeholder={input.placeholder}
                      type={input.type}
                      disabled={!edit}
                      properties={{ ...register(input.name as keyof UserData) }}
                      error={errors[input.name as keyof UserData]?.message}
                    />
                  )}
                </div>
              ))}
            </div>
          </form>
        </div>
        <Toaster />
      </DashboardSection>
    </>
  );
}
