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
import { CREATE_REPORT_BY_PATIENT, FIND_REPORT_BY_PATIENT_ID } from "./queries";
import { RootState } from "../../../../redux/store";
import {
  CreateReportByPatient,
  findPatientReportById,
} from "../../../../api/apiCalls/patientsApi";
import { notifyFailure, notifySuccess } from "../../../../utils/Utils";
import { Toaster } from "react-hot-toast";
import ImageUrl from "../../../../components/Icons/Sidemenu/ImageUrl";

const links = [
  { title: "All Files", href: "/" },
  {
    title: "Medical Leave Certifications",
    href: "/medical-leave-certifications",
  },
];

const BASE_URL = "/patient-dashboard/files";

interface PatientReport {
  id: number;
  files: string[];
  patient_id: number;
}

export default function Files() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileaws, setSelectedFileAws] = useState<string | null>(null);
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
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
    if (!selectedFileaws || !id) return;

    const response = await CreateReportByPatient(CREATE_REPORT_BY_PATIENT, {
      files: [selectedFileaws],
      patient_id: id,
    });

    if (!response) {
      throw new Error("Report creation failed!");
    }

    return response;
  };

  const { mutate } = useMutation(handlecreatereport, {
    onMutate: () => {
      dispatch(loadingStart());
    },
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

  const handlePatientReportById = async () => {
    if (!id) {
      return;
    }

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
        <div className="col-span-12 md:col-span-5">
          <div className="mt-2">
            {links.map((link, index) => (
              <Link
                key={index}
                to={BASE_URL + link?.href}
                className={`flex py-0.5 px-4 sm:px-8 border-b border-[#125DB94D] ${pathname === BASE_URL + link?.href && "text-[#3FB946]"}`}
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
        <div className="col-span-12 md:col-span-7 flex flex-wrap justify-between gap-y-4">
          {data && (data ?? []).length > 0 ? (
            data?.map((report: PatientReport, index: number) => (
              <div key={index} className="w-full grid grid-cols-3">
                {report.files && report.files.length > 0 ? (
                  report.files.map((img: string, index) => (
                    <ImageUrl key={index} fileKey={img} istrue={true} />
                  ))
                ) : (
                  <p className="text-primary text-lg text-center">
                    No Files Found
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-primary text-lg text-center w-full">
              No Data Found
            </p>
          )}
        </div>
      </div>
      <Toaster />
    </DashboardSection>
  );
}
