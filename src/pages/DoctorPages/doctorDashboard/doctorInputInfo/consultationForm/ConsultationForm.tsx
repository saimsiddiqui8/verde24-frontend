import {
  DashboardSection,
  InputField,
  PhoneInputComp,
  RadioInput,
  TextareaField,
  DropdownField,
} from "../../../../../components";
import { IoMdAddCircle } from "react-icons/io";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isPhoneValid } from "../../../../../utils/Utils";
import { useState, KeyboardEvent } from "react";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../../../../firebase/config";
import {
  getDoctorById,
  updateDoctor,
} from "../../../../../api/apiCalls/doctorsApi";
import { RootState } from "../../../../../redux/store";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { DOCTOR_UPDATE_QUERY, GET_DOCTOR_QUERY } from "./queries";

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
    label: "Address Line 1",
    type: "text",
    placeholder: "Enter Your Address here",
    name: "address_line_1",
  },
  {
    label: "Address Line 2",
    type: "text",
    placeholder: "Enter Your Address here",
    name: "address_line_2",
  },
  {
    label: "Postal Code",
    type: "number",
    placeholder: "Enter Your Postal Code",
    name: "postal_code",
  },
];

const options = [
  { label: "Video Consultation", value: "male" },
  { label: "Clinic/ Hospital Visit", value: "female" },
  { label: "Both", value: "female" },
];

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

const aboutMe = {
  label: "Bibliography",
  // type: "text",
  placeholder: "Write About Yourself",
  name: "bibliography",
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const FormSchema = z
  .object({
    doctor_image: z.any(),
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
    consultation_mode: z
      .string({ invalid_type_error: "Consultation Mode is required" })
      .min(1, { message: "Consultation Mode is required" }),
    consultation_fee_regular: z.string().min(1, {
      message: "Regular Consultation Fee is required",
    }),
    consultation_fee_discounted: z.string().min(1, {
      message: "Discounted Consultation Fee is required",
    }),
    address_line_1: z.string().min(1, {
      message: "Address is required",
    }),
    address_line_2: z.string().optional(),
    postal_code: z.string().min(1, {
      message: "Postal Code is required",
    }),
    services: z.string().min(1, {
      message: "Services is required",
    }),
    specializations: z.string().min(1, {
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
    bibliography: z.string().optional(),
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
    }
  )
  .refine((data) => data.doctor_image, {
    message: "Image is required.",
    path: ["doctor_image"],
  })
  .refine((data) => ACCEPTED_IMAGE_TYPES.includes(data.doctor_image?.type), {
    message: ".jpg, .jpeg and .png files are accepted.",
    path: ["doctor_image"],
  })
  .refine((data) => data.doctor_image?.size <= MAX_FILE_SIZE, {
    message: `Max file size is 2MB.`,
    path: ["doctor_image"],
  });

const disabledFields = ["complete_name", "email", "gender", "phone_number"];

export default function ConsultationForm() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(FormSchema) });
  const [services, setServices] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [image, setImage] = useState();
  const [payout, setPayout] = useState("upi");
  const id = useSelector((state: RootState) => state.user.currentUser?.id);

  const imageUpload = async () => {
    try {
      const storage = getStorage(app);
      const storageReference = storageRef(
        storage,
        `images/${getValues("doctor_image").name}`
      );
      const uploadTask = await uploadBytesResumable(
        storageReference,
        getValues("doctor_image")
      );
      const url = await getDownloadURL(uploadTask.ref);
      return url;
    } catch (error) {
      console.error(error);
    }
  };

  const getInfo = () => {
    return {
      city: getValues("city"),
      country: getValues("country"),
      department: getValues("department"),
      experience: getValues("experience"),
      registration_no: getValues("registration_no"),
      qualification: getValues("qualification"),
      consultation_mode: getValues("consultation_mode"),
      consultation_fee_regular: parseFloat(
        getValues("consultation_fee_regular")
      ),
      consultation_fee_discounted: parseFloat(
        getValues("consultation_fee_discounted")
      ),
      booking_lead_time: getValues("lead_time"),
      payout_method: getValues("payout_method"),
      payout_method_id:
        payout === "upi" ? getValues("upi_id") : getValues("ac_no"),
      address: getValues("address_line_1") + " " + getValues("address_line_2"),
      postal_code: getValues("postal_code"),
      services,
      specialization: specializations,
      bibliography: getValues("bibliography"),
    };
  };

  const handleServices = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (getValues("services")) {
        setServices((prev) => [...prev, getValues("services")]);
      }
    }
  };

  const handleSpecializations = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (getValues("specializations")) {
        setSpecializations((prev) => [...prev, getValues("specializations")]);
      }
    }
  };

  const handleFileChange = (e: any) => {
    const newImage = e.target.files[0];
    console.log(newImage);
    setImage(newImage);
    setValue("doctor_image", newImage);
  };

  const getDoctor = () => {
    return getDoctorById(GET_DOCTOR_QUERY, { id });
  };

  const doctorData = useQuery({
    queryKey: ["Doctors", id],
    queryFn: getDoctor,
  });

  useEffect(() => {
    reset({
      complete_name:
        doctorData?.data?.first_name + " " + doctorData?.data?.last_name,
      ...doctorData?.data,
    });
  }, [doctorData?.data]);

  const onSubmit = async () => {
    const image_url = await imageUpload();
    if (image_url) {
      const res = await updateDoctor(DOCTOR_UPDATE_QUERY, {
        id: String(id),
        data: { image: image_url, ...getInfo() },
      });
      if (res) {
        console.log("Success");
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-6 ">
      <DashboardSection title="Basic Information">
        <div className="grid grid-cols-12 mt-6">
          <div className="col-span-4">
            <input
              type="file"
              className="bg-[#D9D9D9] w-40 h-40 rounded-full mx-auto"
              hidden
              id="upload-file"
              onChange={handleFileChange}
            />
            <label
              htmlFor="upload-file"
              className="bg-[#D9D9D9] w-40 h-40 rounded-full mx-auto block relative overflow-clip"
            >
              {image ? (
                <img
                  className="w-full h-full object-cover"
                  src={URL.createObjectURL(image)}
                  alt=""
                />
              ) : (
                ""
              )}
            </label>
            {errors["doctor_image"] && (
              <small className="text-red-500 font-medium uppercase">
                <>{errors["doctor_image"]?.message}</>
              </small>
            )}
            <h5 className="text-base text-primary font-semibold text-center my-2">
              Upload Photo
            </h5>
            <small className="text-xs text-center block text-primary">
              Allowed JPG, PNG; Max size of 2 MB
            </small>
          </div>
          <div className="col-span-7">
            <div className="grid grid-cols-12 gap-x-4 gap-y-0">
              {inputs?.map((input) => (
                <div className="col-span-6">
                  {input?.name === "phone_number" ? (
                    <PhoneInputComp
                      label={input?.label}
                      properties={{ ...register(input?.name) }}
                      error={errors[input?.name]}
                      disabled={disabledFields?.includes(input?.name)}
                    />
                  ) : input?.type === "dropdown" ? (
                    <DropdownField
                      label={input?.label}
                      name={input?.name}
                      options={input?.options!}
                      placeholder={input?.placeholder}
                      properties={{ ...register(input?.name) }}
                      error={errors[input?.name]}
                      disabled={disabledFields?.includes(input?.name)}
                    />
                  ) : (
                    <InputField
                      label={input.label}
                      name={input.name}
                      placeholder={input.placeholder}
                      properties={{ ...register(input?.name) }}
                      error={errors[input?.name]}
                      disabled={disabledFields?.includes(input?.name)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-12">
              <h5 className="col-span-2 font-semibold">Note:</h5>
              <small className="col-span-9">
                Your Email Id will not be shared with anyone. Registration No.
                will be printed on Prescription. Please specify the complete
                Registration No. Medical Qualification will be displayed under
                your name in doctor listing. All fields are requred.
              </small>
            </div>
          </div>
        </div>
      </DashboardSection>
      <DashboardSection title={"Consultation Mode"}>
        <>
          <div className="flex gap-2">
            <RadioInput
              // label={input?.label}
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
            {consultationFee?.map((input) => (
              <div className="col-span-4">
                <InputField
                  label={input?.label}
                  name={input?.name}
                  type={input?.type}
                  properties={{ ...register(input?.name) }}
                  error={errors[input?.name]}
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
      <DashboardSection title={"Booking Lead Time"}>
        <>
          <div className="grid grid-cols-12 gap-x-4 gap-y-0">
            <div className="col-span-4">
              <DropdownField
                label="Lead Time"
                name="lead_time"
                placeholder="immediate"
                options={[
                  { label: "Option 1", value: "Option 1" },
                  { label: "Option 2", value: "Option 2" },
                ]}
                properties={{ ...register("lead_time") }}
                error={errors["lead_time"]}
              />
            </div>
          </div>
          <p>
            Minimum time in advance for patients to book your appointments. e.g.
            if you set it to 3 hours, a patient booking at 1 PM will only see
            slots for 4 pm or later.
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
                />
              ) : payout?.toLowerCase() === "ac" ? (
                <InputField
                  key={"ac_no"}
                  label={"A/C No"}
                  name={"ac_no"}
                  placeholder="Enter AC NO"
                  properties={{ ...register("ac_no") }}
                  error={errors["upi_id"]}
                />
              ) : null}
            </div>
            <div className="col-span-4">
              <div className="flex items-center justify-center me-4">
                <input
                  type="radio"
                  value="upi"
                  // name="inline-radio-group"
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
                  // name="inline-radio-group"
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
          {contactDetails?.map((input) => (
            <div className="col-span-4">
              <InputField
                label={input.label}
                name={input.name}
                placeholder={input.placeholder}
                properties={{ ...register(input?.name) }}
                error={errors[input?.name]}
              />
            </div>
          ))}
        </div>
      </DashboardSection>
      <DashboardSection title={"Services and Specialization"}>
        <>
          <div className="grid grid-cols-12 gap-x-4 gap-y-0">
            <div className="col-span-4">
              <InputField
                label="Services"
                name="services"
                placeholder="Enter Your Services"
                properties={{ ...register("services") }}
                error={errors["services"]}
                onKeyDown={handleServices}
              />
              <div className="flex gap-2 flex-wrap mb-2">
                {services?.map((service: string) => (
                  <span className="py-1 px-2 rounded-md bg-primary text-white text-sm">
                    {service}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-span-4">
              <InputField
                label="Specialization"
                name="specializations"
                placeholder="Enter Your Specialization"
                properties={{ ...register("specializations") }}
                error={errors["specializations"]}
                onKeyDown={handleSpecializations}
              />
              <div className="flex gap-2 flex-wrap mb-2">
                {specializations?.map((specialization: string) => (
                  <span className="py-1 px-2 rounded-md bg-primary text-white text-sm">
                    {specialization}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p>Type and press to add new Services and Specialization.</p>
        </>
      </DashboardSection>
      <DashboardSection title={"Education (Optional)"}>
        <div className="flex items-center gap-2 text-base">
          <IoMdAddCircle size={20} />
          Add Row
        </div>
      </DashboardSection>
      <DashboardSection title={"Experience (Optional)"}>
        <div className="flex items-center gap-2 text-base">
          <IoMdAddCircle size={20} />
          Add Row
        </div>
      </DashboardSection>
      <DashboardSection title={"Membership (Optional)"}>
        <div className="flex items-center gap-2 text-base">
          <IoMdAddCircle size={20} />
          Add Row
        </div>
      </DashboardSection>
      <DashboardSection title={"Registration (Optional)"}>
        <div className="flex items-center gap-2 text-base">
          <IoMdAddCircle size={20} />
          Add Row
        </div>
      </DashboardSection>
      <DashboardSection title={"About Me (Optional)"}>
        <TextareaField
          properties={{ ...register("bibliography") }}
          label={aboutMe?.label}
          placeholder={aboutMe?.placeholder}
          name={aboutMe?.name}
          rows={4}
        />
      </DashboardSection>
      <div className="w-96 mx-auto">
        <button className="form-btn">Save Changes</button>
      </div>
    </form>
  );
}
