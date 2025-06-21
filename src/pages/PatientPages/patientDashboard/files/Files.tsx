import {
  Button,
  DashboardSection,
  DropdownField,
  InputField,
} from "../../../../components";
import { Link, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { FILE_UPLOAD } from "../../../DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";
import { uploadFileDoctor } from "../../../../api/apiCalls/doctorsApi";
import {
  ASSIGN_TO_DOCTOR,
  CREATE_REPORT_BY_PATIENT,
  FIND_REPORT_BY_PATIENT_ID,
} from "./queries";
import { RootState } from "../../../../redux/store";
import {
  assignToDoctor,
  createReportByPatient,
  findAppointmentByPatient,
  findPatientReportById,
} from "../../../../api/apiCalls/patientsApi";
import { notifyFailure, notifySuccess } from "../../../../utils/Utils";
import { Toaster } from "react-hot-toast";
import ImageUrl from "../../../../components/Icons/Sidemenu/ImageUrl";
import Modal from "../../../../components/Modal";
import { GET_APPOINTMENT_BY_PATIENT_ID } from "../patientProfile/queries";
import { assigntodoctorauth } from "../../../../api/apiCalls/types";

const links = [
  { title: "All Files", href: "/files" },
  {
    title: "View Prescritions",
    href: "/prescriptions",
  },
];

const BASE_URL = "/patient-dashboard";

interface PatientReport {
  id: number;
  files: string[];
  patient_id: number;
}

type Meeting = {
  id?: number;
  startTime?: string;
  googleMeetUrl?: string;
  appointmentsId?: number;
};
type Appointment = {
  id: number;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  doctor_id: number;
  status: string;
  meeting: Meeting;
  doctor: {
    first_name: string;
    last_name: string;
  };
};

export default function Files() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileAws, setSelectedFileAws] = useState<string | null>(null);
  const [checkedFiles, setCheckedFiles] = useState<string[]>([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const getPatientAppointments = async () => {
    const response = await findAppointmentByPatient(
      GET_APPOINTMENT_BY_PATIENT_ID,
      { findAppointmentByPatientId: id },
    );
    if (!response) {
      throw new Error("Failed to fetch Patient Appointment!");
    }

    return response;
  };

  const { data: doctordata } = useQuery({
    queryKey: ["findpatientappointment", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getPatientAppointments();
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: (err: Error) => {
      dispatch(loadingEnd());
      notifyFailure(err.message);
    },
  });

  const uniqueDoctorsMap = new Map();

  (doctordata ?? []).forEach((appointment: Appointment) => {
    if (!uniqueDoctorsMap.has(appointment.doctor_id)) {
      uniqueDoctorsMap.set(appointment.doctor_id, appointment);
    }
  });

  const uniqueDoctors = Array.from(uniqueDoctorsMap.values());

  const handleFileCheck = (fileKey: string) => {
    setCheckedFiles((prev) =>
      prev.includes(fileKey)
        ? prev.filter((key) => key !== fileKey)
        : [...prev, fileKey]
    );
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !["application/pdf", "image/jpeg"].includes(file.type)) {
      notifyFailure("Only PDF and JPEG files are allowed!");
      return;
    }
    setSelectedFile(file);

    try {
      dispatch(loadingStart());
      const uploadedFileUrl = await uploadFileDoctor(FILE_UPLOAD, file);
      setSelectedFileAws(uploadedFileUrl);
      dispatch(loadingEnd());
    } catch (error) {
      dispatch(loadingEnd());
      console.error("File upload failed:", error);
    }
  };

  const handlecreatereport = async () => {
    if (!selectedFileAws || !id) return;

    const response = await createReportByPatient(CREATE_REPORT_BY_PATIENT, {
      files: [selectedFileAws],
      patient_id: id,
    });

    if (!response) {
      throw new Error("Report creation failed!");
    }
    return response;
  };

  const handlassignereportdoctor = async (data:assigntodoctorauth) => {
    const response = await assignToDoctor(ASSIGN_TO_DOCTOR, { data });
    if (!response) {
      throw new Error("Report send failed!");
    }
    return response;
  };

  const { mutate } = useMutation(handlecreatereport, {
    onMutate: () => dispatch(loadingStart()),
    onSuccess: () => {
      setSelectedFile(null);
      setSelectedFileAws(null);
      notifySuccess("Upload successful");
      queryClient.invalidateQueries(["PatientReport"]);
      dispatch(loadingEnd());
    },
    onError: (error: Error) => {
      notifyFailure(error.message || "Upload failed");
      dispatch(loadingEnd());
    },
  });

  const { mutate :assignmutate} = useMutation(handlassignereportdoctor, {
    onMutate: () => dispatch(loadingStart()),
    onSuccess: () => {
       notifySuccess("Files sent to doctor successfully.");
    setShowDoctorModal(false);
    setSelectedDoctor(null);
    setCheckedFiles([]);
      dispatch(loadingEnd());
    },
    onError: (error: Error) => {
      notifyFailure(error.message || "send failed");
      dispatch(loadingEnd());
    },
  });

  const handlePatientReportById = async () => {
    if (!id) return;
    const response = await findPatientReportById(FIND_REPORT_BY_PATIENT_ID, {
      getPatientReportId: id,
    });

    if (!response) {
      throw new Error("Failed to fetch patient report!");
    }

    return response;
  };

  const { data } = useQuery({
    queryKey: ["PatientReport", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return handlePatientReportById();
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error.message || "Failed to load patient report!");
    },
  });


  const { pathname } = useLocation();

  const handleSendToDoctor = () => {
    if (checkedFiles.length === 0) {
      notifyFailure("Please select at least one report to send.");
      return;
    }
    setShowDoctorModal(true);
  };


  const handleDoctorSubmit = async () => {
    if (!selectedDoctor || !id) {
      notifyFailure("Please select a doctor.");
      return;
    }
    const data = {
      patient_id: id, doctor_id: Number(selectedDoctor), files: checkedFiles
    }
    assignmutate(data);
  };


  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">Files</h2>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <Button title="Email" className="w-full sm:w-fit" secondary={true} />
          <Button
            title="Send to Doctor"
            className="w-full sm:w-fit"
            secondary={true}
            onClick={handleSendToDoctor}
          />
          <Button title="Print" className="w-full sm:w-fit" secondary={true} />
          <Button
            title="Upload Prescription"
            className="w-full sm:w-fit"
            secondary={true}
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 my-4">
        <InputField
          placeholder="Search by Disease"
          className="w-full sm:w-auto"
        />
        <DropdownField
          options={[]}
          name="doctors"
          placeholder="Search by doctors"
          className="w-full sm:w-auto"
        />
        <Button title="Search" className="w-full sm:w-fit" secondary />
      </div>

      <div className="my-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <div className="mt-2">
            {links.map((link, index) => (
              <Link
                key={index}
                to={BASE_URL + link?.href}
                className={`flex py-0.5 px-4 border-b border-[#125DB94D] ${pathname === BASE_URL + link?.href && "text-[#3FB946]"
                  }`}
              >
                {link?.title}
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-col items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf, .jpeg"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {selectedFile && (
              <div className="text-center space-y-4">
                <p className="text-sm text-primary">
                  Selected File: <br /> <strong>{selectedFile.name}</strong>
                </p>
                <Button
                  onClick={() => mutate()}
                  title="Submit"
                  className="w-full sm:w-fit mt-4 px-6 py-2"
                  secondary={true}
                />
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 md:col-span-9 m-auto">
          {data && data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data
                .flatMap((report: PatientReport) => report.files || [])
                .map((img: string, index: number) => (
                  <div
                    key={index}
                    className="relative rounded overflow-hidden shadow border"
                  >
                    <input
                      type="checkbox"
                      className="absolute top-2 left-2 z-10 w-4 h-4 accent-blue-500"
                      checked={checkedFiles.includes(img)}
                      onChange={() => handleFileCheck(img)}
                    />
                    <ImageUrl
                      fileKey={img}
                      isViewFileTrue={true}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-primary text-lg text-center w-full">No report Found</p>
          )}
        </div>

      </div>

      <Modal
        title="Select Doctor"
        showModal={showDoctorModal}
        setModal={setShowDoctorModal}
      >
        <div className="flex flex-col gap-4">
          {uniqueDoctors?.length === 0 ? (
            <p className="text-center text-lg text-primary font-extrabold">No doctor available to send</p>
          ) : (
            uniqueDoctors.map((doc) => (
              <label key={doc.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="selectedDoctor"
                  value={doc.id}
                  checked={selectedDoctor === doc.id}
                  onChange={() => setSelectedDoctor(doc.id)}
                />
                <span>
                  {doc?.doctor?.first_name + " " + doc?.doctor?.last_name}
                </span>
              </label>
            ))
          )}


          <Button
            title="Submit"
            className="mt-4 w-full"
            onClick={handleDoctorSubmit}
          />
        </div>
      </Modal>

      <Toaster />
    </DashboardSection>
  );
}
