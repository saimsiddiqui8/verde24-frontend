import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import {
  getDoctorById,
  updateDoctor,
  uploadFileDoctor,
} from "../../../../../api/apiCalls/doctorsApi";
import {
  Button,
  DashboardSection,
  DropdownField,
  InputField,
  PhoneInputComp,
  RadioInput,
  TextareaField,
} from "../../../../../components";
import { RootState } from "../../../../../redux/store";
import { isPhoneValid, notifySuccess } from "../../../../../utils/Utils";
import {
  DOCTOR_UPDATE_QUERY,
  FILE_UPLOAD,
  GET_DOCTOR_QUERY,
} from "../consultationForm/queries";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";
import { UpdateDoctorData } from "../../../../../api/apiCalls/types";
import { Toaster } from "react-hot-toast";
import ImageUrl from "../../../../../components/Icons/Sidemenu/ImageUrl";
import CountrySelectComp from "../../../../../components/Countrydropdown";

const inputs = [
  {
    label: "Complete Name",
    type: "text",
    placeholder: "Enter Your Complete Name",
    name: "complete_name",
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
    label: "Email",
    type: "email",
    placeholder: "Enter Your Email",
    name: "email",
  },
  {
    label: "Phone Number",
    type: "number",
    placeholder: "Enter Your Phone Number",
    name: "phone_number",
  },
  {
    label: "City",
    type: "text",
    placeholder: "Enter Your City",
    name: "city",
  },
  {
    label: "Country",
    type: "text",
    placeholder: "Enter Your Country",
    name: "country",
  },
  {
    label: "Department",
    type: "text",
    placeholder: "Enter Your Department",
    name: "department",
  },
  {
    label: "Experience",
    type: "dropdown",
    placeholder: "Years In Medical Practice",
    name: "experience",
    options: [
      { label: "One Year", value: "1" },
      { label: "Two Years", value: "2" },
      { label: "Three Years", value: "3" },
      { label: "Four or More Years", value: "4+" },
    ],
  },
  {
    label: "Registration No.",
    type: "text",
    placeholder: "Enter Your Registration No.",
    name: "registration_no",
  },
  {
    label: "Qualification",
    type: "text",
    placeholder: "Enter Your Medical Qualification",
    name: "qualification",
  },
];

const contactDetails = [
  {
    label: "Address",
    type: "text",
    placeholder: "Enter Your Address here",
    name: "address",
  },
  {
    label: "Postal Code",
    type: "number",
    placeholder: "Enter Your Postal Code",
    name: "postal_code",
  },
];

const Qualification = [
  {
    label: "Institute",
    type: "text",
    placeholder: "Enter Your Institute Name",
    name: "institute",
  },
  {
    label: "Degree",
    type: "text",
    placeholder: "Enter Your Degree",
    name: "degree",
  },
];

const servicesAndSpecializations = [
  {
    label: "Services",
    type: "text",
    placeholder: "Enter Your Services",
    name: "services",
  },
  {
    label: "Specialization",
    type: "text",
    placeholder: "Enter Your Specialization",
    name: "specialization",
  },
];

const Experience = [
  {
    label: "Work",
    type: "text",
    placeholder: "Enter Your Workplace Name",
    name: "work",
  },
  {
    label: "Designation",
    type: "text",
    placeholder: "Enter Your Designation",
    name: "designation",
  },
];

const options = [{ label: "Video Consultation", value: "Video Consultation" }];

const consultationFee = [
  {
    label: "Regular Consultation Fee",
    type: "number",
    placeholder: "$500",
    name: "consultation_fee_regular",
  },
  {
    label: "Discounted Consultation Fee (Optional)",
    type: "number",
    placeholder: "$200",
    name: "consultation_fee_discounted",
  },
];

const Symptoms = [
  {
    label: "Enter Symptom",
    type: "text",
    placeholder: "Enter Symptom",
    name: "enterSymptom",
  },
];

const aboutMe = {
  label: "Bibliography",
  type: "text",
  placeholder: "Write About Yourself",
  name: "bibliography",
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg"];

const FormSchema = z
  .object({
    image: z.any(),
    complete_name: z.string().min(1, { message: "Name is required" }),
    email: z.string().min(1, { message: "Email is required" }).email(),
    phone_number: z.string().min(1, { message: "Phone Number is required" }),
    gender: z
      .string({
        invalid_type_error: "Gender is required",
      })
      .min(1, { message: "Gender is required" }),
    city: z.string().min(1, { message: "City is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    department: z.string().min(1, { message: "Department is required" }),
    experience: z.string().min(1, { message: "Experience is required" }),
    registration_no: z
      .string()
      .min(1, { message: "Registration No is required" }),
    qualification: z.string().min(1, { message: "Qualification is required" }),
    institute: z.string().min(1, { message: "Institute is required" }),
    work: z.string().min(1, { message: "Work is required" }),
    degree: z.string().min(1, { message: "Degree is required" }),
    designation: z.string().min(1, { message: "Designation is required" }),
    enterSymptom: z.string().min(1, { message: "Symptom is required" }),
    bibliography: z.string().min(1, { message: "Bibliography is required" }),
    consultation_mode: z
      .string({ invalid_type_error: "Consultation Mode is required" })
      .min(1, { message: "Consultation Mode is required" }),
    consultation_fee_regular: z.preprocess(
      (val) => Number(val),
      z.number().min(1, { message: "Discounted Consultation Fee is required" }),
    ),
    consultation_fee_discounted: z.preprocess(
      (val) => Number(val),
      z.number().min(1, { message: "Discounted Consultation Fee is required" }),
    ),
    address: z.string().min(1, {
      message: "Address is required",
    }),
    postal_code: z.string().min(1, {
      message: "Postal Code is required",
    }),
    services: z.string().min(1, {
      message: "Services is required",
    }),
    specialization: z.string().min(1, {
      message: "Specialization is required",
    }),
    payout_method: z.string().min(1, {
      message: "Payout Method is required",
    }),
    upi_id: z.string().optional(),
    ac_no: z.string().optional(),
    education: z.string().optional(),
    experience_detail: z.string().optional(),
    membership: z.string().optional(),
    registration: z.string().optional(),
  })
  .refine((data) => isPhoneValid(data.phone_number), {
    message: "Invalid Phone Number",
    path: ["phone_number"],
  })
  .refine(
    (data) => {
      if (!data.payout_method) {
        return true;
      }
      if (data.payout_method === "upi" && !data.upi_id) {
        return false;
      }
      if (data.payout_method === "ac" && !data.ac_no) {
        return false;
      }
      return true;
    },
    {
      message: "Please provide either UPI ID or A/C No",
      path: ["upi_id"],
    },
  )
  .refine((data) => !!data.image, {
    message: "Image is required.",
    path: ["image"],
  })
  .refine(
    (data) => {
      if (typeof data.image === "string") return true;
      return ACCEPTED_IMAGE_TYPES.includes(data.image?.type?.toLowerCase());
    },
    {
      message: ".JPG, .JPEG files are accepted.".toUpperCase(),
      path: ["image"],
    },
  )
  .refine(
    (data) => {
      if (typeof data.image === "string") return true;
      return data.image?.size && data.image.size <= MAX_FILE_SIZE;
    },
    {
      message: `Max file size is 2MB.`,
      path: ["image"],
    },
  );

const disabledFields = ["complete_name", "email", "gender", "phone_number"];

export default function VerifiedProfile() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(FormSchema) });
  const [image, setImage] = useState<string | null>();
  const [payout, setPayout] = useState("upi");
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const id = useSelector((state: RootState) => state.user.currentUser?.id);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    try {
      dispatch(loadingStart());
      const uploadedFileUrl = await uploadFileDoctor(FILE_UPLOAD, file);
      setValue("image", uploadedFileUrl, { shouldValidate: true });
      dispatch(loadingEnd());
    } catch (error) {
      dispatch(loadingEnd());
      console.error("File upload failed:", error);
    }
  };

  const getDoctor = () => {
    if (!id) return;
    return getDoctorById(GET_DOCTOR_QUERY, { findDoctorByIdId: id });
  };

  const doctorData = useQuery({
    queryKey: ["Doctors", id],
    queryFn: getDoctor,
  });

  const defaultDoctorData = useMemo(() => {
    if (doctorData.isLoading || !doctorData.data) {
      return {};
    }

    const {
      id,
      first_name,
      last_name,
      email,
      phone_number,
      gender,
      is_verified,
      form_submitted,
      image,
      city,
      country,
      department,
      experience,
      registration_no,
      qualification,
      consultation_mode,
      consultation_fee_regular,
      consultation_fee_discounted,
      payout_method_id,
      address,
      postal_code,
      work,
      degree,
      designation,
      enterSymptom,
      institute,
      ac_no,
      upi_id,
      services,
      specialization,
      bibliography,
    } = doctorData.data;

    return {
      id,
      complete_name: `${first_name} ${last_name}`,
      email,
      phone_number,
      gender,
      is_verified,
      form_submitted,
      image,
      city,
      country,
      department,
      experience,
      registration_no,
      qualification,
      consultation_mode,
      consultation_fee_regular,
      consultation_fee_discounted,
      payout_method_id,
      address,
      postal_code,
      work,
      degree,
      designation,
      enterSymptom,
      institute,
      ac_no,
      upi_id,
      services,
      specialization,
      bibliography,
    };
  }, [doctorData?.data]);

  useEffect(() => {
    if (doctorData?.data) {
      reset(defaultDoctorData);
    }
  }, [doctorData?.data, reset]);

  const updateDoctorId = async (data: UpdateDoctorData) => {
    if (!id) return;
    const response = await updateDoctor(DOCTOR_UPDATE_QUERY, {
      updateDoctorId: id,
      data,
    });
    return response;
  };

  const { data, mutate } = useMutation(updateDoctorId);

  const onSubmit = async (data: UpdateDoctorData) => {
    setEdit(false);
    const {
      work,
      degree,
      designation,
      enterSymptom,
      institute,
      complete_name,
      gender,
      phone_number,
      email,
      city,
      country,
      department,
      experience,
      registration_no,
      ac_no,
      upi_id,
      qualification,
      consultation_mode,
      consultation_fee_regular,
      consultation_fee_discounted,
      payout_method,
      address,
      postal_code,
      services,
      specialization,
      bibliography,
    } = data;

    const doctorData = {
      first_name: complete_name?.split(" ")[0],
      last_name: complete_name?.split(" ")[1],
      gender,
      ac_no,
      upi_id,
      phone_number,
      email,
      city,
      country,
      image: getValues("image"),
      department,
      experience,
      registration_no,
      qualification,
      consultation_mode,
      consultation_fee_regular:
        consultation_fee_regular !== undefined
          ? parseFloat(consultation_fee_regular.toString())
          : 0,
      consultation_fee_discounted:
        consultation_fee_discounted !== undefined
          ? parseFloat(consultation_fee_discounted.toString())
          : 0,
      payout_method_id: payout_method,
      address,
      postal_code,
      services,
      specialization,
      bibliography,
      work,
      degree,
      designation,
      enterSymptom,
      institute,
    };
    mutate(doctorData);
  };

  useEffect(() => {
    if (data?.email) {
      notifySuccess("Profile Updated!");
      queryClient.invalidateQueries({
        queryKey: ["Doctors"],
      });
    }
  }, [data, queryClient]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-6 ">
      <DashboardSection title="Basic Information">
        <div className="flex justify-end">
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
        <div className="grid grid-cols-12 mt-6">
          <div className="col-span-4">
            {edit && (
              <input
                type="file"
                className="bg-[#D9D9D9] w-40 h-40 rounded-full mx-auto"
                hidden
                id="upload-file"
                onChange={handleFileChange}
              />
            )}
            <label
              htmlFor="upload-file"
              className="bg-[#D9D9D9] w-36 h-36 rounded-full mx-auto block relative overflow-clip mt-16"
            >
              {image ? (
                <img
                  className="w-full h-full object-cover"
                  src={image}
                  alt=""
                />
              ) : defaultDoctorData?.image ? (
                <ImageUrl fileKey={defaultDoctorData.image} />
              ) : (
                ""
              )}
            </label>
            {errors["image"] && (
              <small className="text-red-500 font-medium uppercase">
                <>{errors["image"]?.message}</>
              </small>
            )}
            <h5 className="text-base text-primary font-semibold text-center my-2">
              Upload Photo
            </h5>
            <small className="text-xs text-center block text-primary">
              Allowed JPG JPEG, Max size of 2 MB
            </small>
          </div>
          <div className="col-span-7">
            <div className="grid grid-cols-12 gap-x-4 gap-y-0">
              {inputs?.map((input, index) => (
                <div key={index} className="col-span-6 h-20">
                  {input?.name === "phone_number" ? (
                    <PhoneInputComp
                      label={input?.label}
                      properties={{ ...register(input?.name) }}
                      error={errors[input?.name]}
                      disabled={!edit || disabledFields?.includes(input?.name)}
                    />
                  ) : input?.type === "dropdown" ? (
                    <DropdownField
                      label={input?.label}
                      name={input?.name}
                      options={input?.options!}
                      placeholder={input?.placeholder}
                      properties={{ ...register(input?.name) }}
                      error={errors[input?.name]}
                      disabled={!edit || disabledFields?.includes(input?.name)}
                    />
                  ) : input?.name === "country" ? (
                    <CountrySelectComp
                      name={input?.name}
                      label={input?.label}
                      control={control}
                      setValue={setValue}
                    />
                  ) : (
                    <InputField
                      label={input.label}
                      name={input.name}
                      placeholder={input.placeholder}
                      properties={{ ...register(input?.name) }}
                      error={errors[input?.name]}
                      disabled={!edit || disabledFields?.includes(input?.name)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-12">
              <h5 className="col-span-2 font-semibold mt-4">Note:</h5>
              <small className="col-span-9 mt-4">
                Your Email Id will not be shared with anyone. Registration No.
                will be printed on Prescription. Please specify the complete
                Registration No. Medical Qualification will be displayed under
                your name in doctor listing. All fields are required.
              </small>
            </div>
          </div>
        </div>
      </DashboardSection>
      <DashboardSection title={"Consultation Mode"}>
        <>
          <div className="flex gap-2">
            <RadioInput
              name="consultation_mode"
              options={options}
              properties={{ ...register("consultation_mode") }}
              error={errors["consultation_mode"]}
            />
          </div>
          <p className="mt-2 text-base">
            Both options will be given to the patients at the time of booking.
            You will see the consultation mode for each appointment on your
            appointment screen.
          </p>
          <p className="text-base">
            Video calling option will be disabled for in-person/visit
            appointments.
          </p>
        </>
      </DashboardSection>
      <DashboardSection title={"Consultation Fee"}>
        <>
          <div className="grid grid-cols-12 gap-x-4 gap-y-0">
            {consultationFee?.map((input, index) => (
              <div key={index} className="col-span-4">
                <InputField
                  label={input?.label}
                  name={input?.name}
                  type={input?.type}
                  properties={{ ...register(input?.name) }}
                  error={errors[input?.name]}
                  disabled={!edit}
                />
              </div>
            ))}
          </div>
          <p>
            We charge 30% (plus GST) as transaction fee for digital branding and
            platform services.
          </p>
        </>
      </DashboardSection>
      <DashboardSection title={"Payouts"}>
        <>
          <div className="grid grid-cols-12 gap-x-4 gap-y-0 items-center">
            <div className="col-span-4">
              {payout?.toLowerCase() === "upi" ? (
                <InputField
                  key={"upi_id"}
                  label={"UPI ID"}
                  name={"upi_id"}
                  placeholder="Enter UPI ID"
                  properties={{ ...register("upi_id") }}
                  error={errors["upi_id"]}
                  disabled={!edit}
                />
              ) : payout?.toLowerCase() === "ac" ? (
                <InputField
                  key={"ac_no"}
                  label={"A/C No"}
                  name={"ac_no"}
                  placeholder="Enter AC NO"
                  properties={{ ...register("ac_no") }}
                  error={errors["upi_id"]}
                  disabled={!edit}
                />
              ) : null}
            </div>
            <div className="col-span-4">
              <div className="flex items-center justify-center me-4">
                <input
                  type="radio"
                  value="upi"
                  {...register("payout_method")}
                  defaultChecked
                  onClick={() => setPayout("upi")}
                  name={"consultation"}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ms-2 text-sm font-medium text-primary">
                  UPI
                </label>
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex items-center justify-center me-4">
                <input
                  type="radio"
                  value="ac"
                  {...register("payout_method")}
                  onClick={() => setPayout("ac")}
                  name={"consultation"}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ms-2 text-sm font-medium text-primary">
                  A/C Transfer
                </label>
              </div>
            </div>
          </div>
          <p>
            Payouts will be discussed every Sunday for appointments completed up
            to seven days prior.
          </p>
        </>
      </DashboardSection>
      <DashboardSection title={"Contact Details"}>
        <div className="grid grid-cols-12 gap-x-4 gap-y-0">
          {contactDetails?.map((input, index) => (
            <div key={index} className="col-span-4">
              <InputField
                label={input.label}
                name={input.name}
                placeholder={input.placeholder}
                properties={{ ...register(input?.name) }}
                error={errors[input?.name]}
                disabled={!edit}
              />
            </div>
          ))}
        </div>
      </DashboardSection>
      <DashboardSection title={"Services and Specialization"}>
        <>
          <div className="grid grid-cols-12 gap-x-4 gap-y-0">
            {servicesAndSpecializations.map((input, index) => (
              <div key={index} className="col-span-4">
                <InputField
                  label={input.label}
                  name={input.name}
                  placeholder={input.placeholder}
                  properties={{ ...register(input.name) }}
                  error={errors[input.name]}
                  disabled={!edit}
                />
              </div>
            ))}
          </div>
          <p>Type and press to add new Services and Specialization.</p>
        </>
      </DashboardSection>
      <DashboardSection title={"Qualification"}>
        <div className="grid grid-cols-12 gap-x-4 gap-y-0">
          {Qualification?.map((input, index) => (
            <div className="col-span-4" key={index}>
              <InputField
                label={input.label}
                name={input.name}
                placeholder={input.placeholder}
                properties={{ ...register(input?.name) }}
                error={errors[input?.name]}
                disabled={!edit}
              />
            </div>
          ))}
        </div>
      </DashboardSection>
      <DashboardSection title={"Experience"}>
        <div className="grid grid-cols-12 gap-x-4 gap-y-0">
          {Experience?.map((input, index) => (
            <div className="col-span-4" key={index}>
              <InputField
                label={input.label}
                name={input.name}
                placeholder={input.placeholder}
                properties={{ ...register(input.name) }}
                error={errors[input.name]}
                disabled={!edit}
              />
            </div>
          ))}
        </div>
      </DashboardSection>
      <DashboardSection title={"Symptoms"}>
        <div className="flex items-center gap-2 text-base">
          {Symptoms?.map((input, index) => (
            <div key={index} className="col-span-4">
              <InputField
                label={input.label}
                name={input.name}
                placeholder={input.placeholder}
                properties={{ ...register(input?.name) }}
                error={errors[input?.name]}
                disabled={!edit}
              />
            </div>
          ))}
        </div>
      </DashboardSection>
      <DashboardSection title={"About Me"}>
        <TextareaField
          properties={{ ...register("bibliography") }}
          label={aboutMe?.label}
          placeholder={aboutMe?.placeholder}
          name={aboutMe?.name}
          error={errors[aboutMe?.name]}
          rows={4}
          disabled={!edit}
        />
      </DashboardSection>
      <Toaster />
    </form>
  );
}
