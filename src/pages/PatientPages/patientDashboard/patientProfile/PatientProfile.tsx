import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { z } from "zod";
import {
  getPatientById,
  updatePatientById
} from "../../../../api/apiCalls/patientsApi";
import {
  Button,
  DashboardSection,
  InputField,
  PhoneInputComp
} from "../../../../components";
import { RootState } from "../../../../redux/store";
import { isPhoneValid, notifySuccess } from "../../../../utils/Utils";
import { FIND_PATIENT_QUERY, UPDATE_PATIENT_QUERY } from "./queries";

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
    type: "text",
    placeholder: "Enter Your Gender",
    name: "gender",
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
    patient_age: z.coerce.number().int({ message: "Age is required" }),
    insurance_id: z.string().min(1, { message: "Insurance Id is required" }),
    phone_number: z.string().min(1, { message: "Phone Number is required" }),
    gender: z
      .string({
        invalid_type_error: "Gender is required",
      })
      .min(1, { message: "Gender is required" }),
    weight: z.coerce.number().int({ message: "Weight is required" }),
    blood_group: z.string().min(1, { message: "Blood Group is required" }),
    other_history: z.string().min(1, { message: "Other History is required" }),
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
    // getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });
  const [edit, setEdit] = useState(false);
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const queryClient = useQueryClient();

  const getPatient = async () => {
    return getPatientById(FIND_PATIENT_QUERY, { id });
  };

  const patientData = useQuery({
    queryKey: ["patient", id],
    queryFn: getPatient,
  });

  function defaultPatientData() {
    if (patientData.isLoading || !patientData.data) {
      return {};
    }

    const {
      first_name,
      last_name,
      gender,
      phone_number,
      insurance_id,
      age,
      weight,
      blood_group,
      other_history,
    } = patientData?.data;
    return {
      patient_name: `${first_name} ${last_name}`,
      patient_age: age,
      insurance_id,
      phone_number,
      gender,
      weight,
      blood_group,
      other_history,
    };
  }

  useEffect(() => {
    reset(defaultPatientData());
    console.log(patientData?.data);
  }, [patientData?.data]);

  const updatePatient = async (data: any) => {
    return updatePatientById(UPDATE_PATIENT_QUERY, { id, data });
  };

  const { data, mutate } = useMutation(updatePatient);

  const onSubmit = (data: any) => {
    const userData = {
      first_name: data?.patient_name.split(" ")[0],
      last_name: data?.patient_name.split(" ")[1],
      gender: data?.gender,
      phone_number: data?.phone_number,
      insurance_id: data?.insurance_id,
      age: data?.patient_age,
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
  }, [data]);

  return (
    <>
      <DashboardSection>
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)} className="pt-2 pb-6 ">
            <div className="flex justify-between my-4 w-full">
              <h2 className="text-3xl font-semibold">Patient Profile</h2>
              <div className="flex gap-2">
                <Button
                  title="Edit"
                  className="w-20"
                  type="button"
                  onClick={() => setEdit(true)}
                />
                <Button title="Save" className="w-20" />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-4 gap-y-0">
              {inputs?.map((input) => (
                <div className="col-span-6">
                  {input?.name === "phone_number" ? (
                    <PhoneInputComp
                      label={input?.label}
                      // value={getValues("phonenumber")}
                      properties={{ ...register(input?.name) }}
                      error={errors[input?.name]}
                      disabled={!edit}
                    />
                  ) : (
                    <InputField
                      label={input.label}
                      name={input.name}
                      placeholder={input.placeholder}
                      type={input?.type}
                      disabled={!edit}
                      properties={{ ...register(input?.name) }}
                      error={errors[input?.name]}
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
