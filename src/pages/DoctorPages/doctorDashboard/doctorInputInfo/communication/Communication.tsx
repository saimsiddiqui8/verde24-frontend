import { useState } from "react";
import { Button, DashboardSection, DropdownField, InputField } from "../../../../../components";
import { useForm } from "react-hook-form";
import prescriptionimg from '../../../../../assets/prescriptionimg.jpg'
import { generateImageBasedPDF } from "../../../../../components/Prescription";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { getPatientById } from "../../../../../api/apiCalls/patientsApi";
import { FIND_PATIENT_QUERY } from "../../../../PatientPages/patientDashboard/patientProfile/queries";
import { useMutation, useQuery } from "react-query";
import { loadingEnd, loadingStart } from "../../../../../redux/slices/loadingSlice";
import { createPrescription, getDoctorById, uploadFileDoctor } from "../../../../../api/apiCalls/doctorsApi";
import { CREATE_PRESCRIPTION, FILE_UPLOAD, GET_DOCTOR_QUERY } from "../consultationForm/queries";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePrescriptionData } from "../../../../../api/apiCalls/types";
import { notifyFailure, notifySuccess } from "../../../../../utils/Utils";
import { Toaster } from "react-hot-toast";
const inputs1 = [
  {
    label: "History",
    name: "history",
    type: "text",
    placeholder: "Enter History",
  },
  {
    label: "Complaints",
    name: "complaints",
    type: "text",
    placeholder: "Enter Complaints",
  },
  {
    label: "Daignosis" ,
    name: "daignosis",
    type: "text",
    placeholder: "Enter Daignosis",
  },
  {
    label: "Observation",
    name: "observation",
    type: "text",
    placeholder: "Enter Observations",
  },
    {
    label: "Lab Test (optional)",
    name: "lab_test",
    type: "select",
    options: [
      { label: "Blood Test", value: "blood_test" },
      { label: "X-Ray", value: "xray" },
      { label: "MRI", value: "mri" },
    ],
  },
];

const inputs2 = [
   
  {
    label: "Medicine Name",
    name: "medicine_name",
    type: "text",
    placeholder: "Enter Medicine Name",
  },
  {
    label: "Dosage",
    name: "dosage",
    type: "select",
    options: [
      { label: "1 Tablet", value: "1_tablet" },
      { label: "2 Tablets", value: "2_tablets" },
      { label: "5 ml", value: "5_ml" },
    ],
  },
  {
    label: "Frequency",
    name: "frequency",
    type: "select",
    options: [
      { label: "Once a day", value: "once_day" },
      { label: "Twice a day", value: "twice_day" },
      { label: "Thrice a day", value: "thrice_day" },
    ],
  },
  {
    label: "Days",
    name: "days",
    type: "select",
    options: [
      { label: "3 Days", value: "3_days" },
      { label: "5 Days", value: "5_days" },
      { label: "7 Days", value: "7_days" },
    ],
  },
  {
    label: "Special Instruction (optional)",
    name: "special_instruction",
    type: "text",
    placeholder: "Enter Special Instructions",
  },
]


export const schema1 = z.object({
  history: z.string().min(1, { message: "History is required" }),
  complaints: z.string().min(1, { message: "Complaints are required" }),
  daignosis: z.string().min(1, { message: "Diagnosis is required" }),
  observation: z.string().min(1, { message: "Observation is required" }),
  lab_test: z.string().optional(), 
});

export const schema2 = z.object({
  medicine_name: z.string().min(1, { message: "Medicine name is required" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  days: z.string().min(1, { message: "Day selection is required" }),
  special_instruction: z.string().min(1, { message: "Special instruction is required" }),
});



const Communication = () => {
  const [fieldValues, setFieldValues] = useState<Record<string, string[]>>({
    history: [],
    complaints: [],
    lab_test: [],
    daignosis: [],
    observation: [],
    medicine_name: [],
    dosage: [],
    frequency: [],
    days: [],
    special_instruction: [],
  });
 const navigate = useNavigate();
  const {id} = useParams();
  const doctorId = useSelector((state: RootState) => state.user.currentUser?.id);
   const dispatch = useDispatch();
const {
  register: register1,
  handleSubmit: handleSubmit1,
  reset: reset1,
  formState: { errors: errors1 },
} = useForm({
  resolver: zodResolver(schema1),
});


const {
  register: register2,
  handleSubmit: handleSubmit2,
  reset: reset2,
  formState: { errors: errors2 },
} = useForm({
  resolver: zodResolver(schema2),
});


const fetchPatientAndDoctor = async () => {
  if (!id || !doctorId) return;

  dispatch(loadingStart());

  const [patient, doctor] = await Promise.all([
    getPatientById(FIND_PATIENT_QUERY, { id: Number(id) }),
    getDoctorById(GET_DOCTOR_QUERY, { findDoctorByIdId: doctorId }),
  ]);

  return { patient, doctor };
};

const { data } = useQuery({
  queryKey: ["patient-and-doctor", id, doctorId],
  queryFn: fetchPatientAndDoctor,
  onSuccess: () => dispatch(loadingEnd()),
  onError: () => dispatch(loadingEnd()),
});

const handleCreatePrescription = async (data:CreatePrescriptionData)=>{
 return await createPrescription(CREATE_PRESCRIPTION , {data});
}


const { mutate } = useMutation(handleCreatePrescription, {
  onMutate: () => {
    dispatch(loadingStart());
  },
  onSuccess: () => {
    dispatch(loadingEnd());
    notifySuccess("Prescription created successfully!");
    setFieldValues({
      history: [],
      complaints: [],
      lab_test: [],
      daignosis: [],
      observation: [],
      medicine_name: [],
      dosage: [],
      frequency: [],
      days: [],
      special_instruction: [],
    });
    setTimeout(() => {
      navigate(`/doctor-dashboard/my-patient/${id}/clinicalnotes`)
    }, 1000);
  },
  onError: (error: Error) => {
    dispatch(loadingEnd());
    notifyFailure(error.message || "Failed to create prescription");
  },
});



const handleFinalSubmit = async () => {

    const staticData = {
      patient_name: `${data?.patient?.first_name} ${data?.patient?.last_name}`,
      patient_id: String(data?.patient?.id),
      gender: data?.patient?.gender,
      age: String(data?.patient?.age),
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      diagnosis: fieldValues.daignosis[0] || "",
      doctor_name: `Dr. ${data?.doctor?.first_name} ${data?.doctor?.last_name}`,
      qualification: `Designation .${data?.doctor?.designation}`,
      medicines: fieldValues.medicine_name.map((med, i) => {
        const dose = fieldValues.dosage[i] || "";
        const freq = fieldValues.frequency[i] || "";
        const day = fieldValues.days[i] || "";
        const note = fieldValues.special_instruction[i] || "";
        return `${med} ${dose}, ${freq}, ${day} ${note}`;
      }),
      history: fieldValues.history || [],
      complaints: fieldValues.complaints || [],
      observation: fieldValues.observation || [],
    };

    // 1. Generate PDF Blob
    const blob = await generateImageBasedPDF(staticData, prescriptionimg);

    // 2. Convert blob to File (required by AWS uploader)
    const file = new File([blob], "prescription.pdf", { type: "application/pdf" });

    // 3. Upload to AWS
    const uploadedUrl = await uploadFileDoctor(FILE_UPLOAD, file);
    const payload: CreatePrescriptionData = {
  patientId: Number(data?.patient?.id), 
  doctorId: Number(data?.doctor?.id), 
  prescriptionUrl: uploadedUrl,
  history: fieldValues.history,
  complaints: fieldValues.complaints,
  labTests: fieldValues.lab_test,
  diagnosis: fieldValues.daignosis,
  observation: fieldValues.observation,
  specialInstructions: fieldValues.special_instruction,
};

    mutate(payload)

    // (Optional) download to user too

    // const downloadUrl = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = downloadUrl;
    // a.download = "prescription.pdf";
    // a.click();
    // URL.revokeObjectURL(downloadUrl);

};
const onSubmit1 = (data: any) => {
  const updated = { ...fieldValues };

  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      updated[key] = [...(updated[key] || []), String(value)];
    }
  });

  setFieldValues(updated);
  reset1()
};

const onSubmit2 = (data: any) => {
  const updated = { ...fieldValues };

  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      updated[key] = [...(updated[key] || []), String(value)];
    }
  });

  setFieldValues(updated);
  reset2()
};

const isReadyToGenerate = 
  fieldValues?.observation?.length > 0 &&
  fieldValues?.complaints?.length > 0 &&
  fieldValues?.medicine_name?.length > 0 &&
  fieldValues?.history?.length > 0;

  return (
    <DashboardSection>
  {/* Page Heading */}
  <div className="flex flex-col sm:flex-row justify-between my-4">
    <h2 className="text-2xl sm:text-3xl font-semibold text-primary">Prescription</h2>
  </div>

  {/* Main Flex Grid */}
  <div className="flex flex-col lg:flex-row gap-6">

    {/* LEFT COLUMN - Details Form */}
    <form onSubmit={handleSubmit1(onSubmit1)} className="w-full lg:w-[25%] space-y-2">
      <h3 className="text-2xl font-extrabold text-[#3FB946] mb-4">Details</h3>
      {inputs1.map((input, index) => (
        <div key={index}>
          {input.type === "select" ? (
            <DropdownField
              label={input.label}
              name={input.name}
              options={input.options!}
              properties={{ ...register1(input.name) }}
              error={errors1[input.name]}
            />
          ) : (
            <InputField
              label={input.label}
              name={input.name}
              type="text"
              placeholder={input.placeholder}
              properties={{ ...register1(input.name) }}
              error={errors1[input.name]}
            />
          )}
        </div>
      ))}
      <Button title="Add details" className="text-xs w-28 h-9 mt-2" />
    </form>

    {/* MIDDLE COLUMN - Medication Form */}
    <form onSubmit={handleSubmit2(onSubmit2)} className="w-full lg:w-[25%] space-y-2">
      <h3 className="text-2xl font-extrabold text-[#3FB946] mb-4">Medication</h3>
      {inputs2.map((input, index) => (
        <div key={index}>
          {input.type === "select" ? (
            <DropdownField
              label={input.label}
              name={input.name}
              options={input.options!}
              properties={{ ...register2(input.name) }}
              error={errors2[input.name]}
            />
          ) : (
            <InputField
              label={input.label}
              name={input.name}
              type="text"
              placeholder={input.placeholder}
              properties={{ ...register2(input.name) }}
              error={errors2[input.name]}
            />
          )}
        </div>
      ))}
      <Button title="Add medication" className="text-xs w-32 h-9 mt-2" />
    </form>

    {/* RIGHT COLUMN - Prescription Template Preview */}
    <div className="w-full lg:w-[50%] p-4 rounded-md bg-blue-800">
      <div
        className="relative w-full h-[700px] rounded shadow border bg-white"
        style={{
          backgroundImage: `url(${prescriptionimg})`,
          backgroundSize: "contain",
          backgroundPosition: "top left",
          backgroundRepeat: "no-repeat",
          backgroundColor: "white",
        }}
      >
        {/* Doctor Info */}
        <div className="absolute left-[20px] top-[5px] font-bold text-lg text-primary">
          Dr: {data?.doctor?.first_name} {data?.doctor?.last_name}
        </div>
        <div className="absolute left-[20px] top-[30px] font-bold text-sm text-primary">
          Designation: {data?.doctor?.designation}
        </div>

        {/* Patient Info */}
        <div className="absolute right-[105px] top-[121px] text-sm text-black">
          {data?.patient?.first_name} {data?.patient?.last_name}
        </div>
        <div className="absolute left-[95px] top-[121px] text-sm text-black">
          {data?.patient?.id}
        </div>
        <div className="absolute left-[85px] top-[141px] text-sm text-black">
          {data?.patient?.gender}
        </div>
        <div className="absolute left-[64px] top-[161px] text-sm text-black">
          {data?.patient?.age}
        </div>
        <div className="absolute right-[130px] top-[161px] text-sm text-black">
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>

        {/* Diagnosis */}
        <div className="absolute left-[95px] top-[180px] text-sm text-black">
          {fieldValues?.daignosis[0] || ""}
        </div>

        {/* History */}
        <div className="absolute left-[30px] top-[218px] text-[0.50rem] text-black">
          {fieldValues?.history?.length > 0 && "History:"}
          <ul className="w-24 list-disc">
            {fieldValues.history.map((history, i) => (
              <li key={i}>{history}</li>
            ))}
          </ul>
        </div>

        {/* Medicine List */}
        <div className="absolute left-[140px] top-[280px] text-xs text-black">
          {fieldValues?.medicine_name?.length > 0 && "Medicine:"}
          <ul className="list-disc">
            {fieldValues.medicine_name.map((med, i) => {
              const dose = fieldValues.dosage[i] || "";
              const freq = fieldValues.frequency[i] || "";
              const day = fieldValues.days[i] || "";
              return (
                <li key={i}>
                  {med} {dose}, {freq}, {day}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Complaints */}
        <div className="absolute left-[30px] top-[330px] text-[0.50rem] text-black">
          {fieldValues?.complaints?.length > 0 && "Complaints:"}
          <ul className="w-24 list-disc">
            {fieldValues.complaints.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Observations */}
        <div className="absolute left-[30px] top-[440px] text-[0.50rem] text-black">
          {fieldValues?.observation?.length > 0 && "Observation:"}
          <ul className="w-24 list-disc">
            {fieldValues.observation.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
    {isReadyToGenerate && (
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
    <Button
      onClick={handleFinalSubmit}
      type="button"
      title="Generate PDF"
      className="text-xs w-40 h-9"
    />
  </div>
)}


      </div>
    </div>
  </div>
  <Toaster/>
</DashboardSection>

  );
};

export default Communication;
