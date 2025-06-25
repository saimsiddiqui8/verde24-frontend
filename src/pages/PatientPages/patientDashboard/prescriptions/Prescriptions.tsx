import {
  Button,
  DashboardSection,
  DropdownField,
  InputField,
} from "../../../../components";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllPrescription } from "../../../../api/apiCalls/doctorsApi";
import { GET_PRESCRIPTION_BY_DOCTOR_NAME } from "../files/queries";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { notifyFailure } from "../../../../utils/Utils";
import { Toaster } from "react-hot-toast";
import ImageUrl from "../../../../components/Icons/Sidemenu/ImageUrl";

const links = [
  { title: "All Prescriptions", href: "/prescriptions" },
  { title: "View All Files", href: "/files" },
];

const BASE_URL = "/patient-dashboard";

type Prescription = {
  id: number;
  labTests: string[];
  specialInstructions: string[];
  prescriptionUrl: string;
  createdAt: string;
  doctor?: {
    first_name: string;
    last_name: string;
  };
};

export default function Prescriptions() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const id = useSelector((state: RootState) => state.user.currentUser?.id);

  const handleGetPrescription = async () => {
    if (!id) return;

    const response = await getAllPrescription(GET_PRESCRIPTION_BY_DOCTOR_NAME, {
      patientId: id,
    });

    if (!response) {
      throw new Error("Failed to fetch patient report!");
    }

    return response;
  };

  const { data } = useQuery({
    queryKey: ["PatientPrescriptions", id],
    queryFn: async () => {
      dispatch(loadingStart());
      const result = await handleGetPrescription();
      dispatch(loadingEnd());
      return result;
    },
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error.message || "Failed to load patient report!");
    },
    enabled: !!id,
  });

  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">Prescriptions</h2>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button title="Email" className="w-full sm:w-fit" secondary={true} />
          <Button title="Print" className="w-full sm:w-fit" secondary={true} />
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
      <div className="my-4 grid grid-cols-1 md:grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-3">
          <div className="mt-2">
            {links.map((link) => (
              <Link
                key={link?.href}
                to={BASE_URL + link?.href}
                className={`flex py-0.5 px-4 border-b border-[#125DB94D] ${
                  pathname === BASE_URL + link?.href && "text-[#3FB946]"
                }`}
              >
                {link?.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="col-span-12 md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
          {data && data.length > 0 ? (
            data.map((prescription: Prescription) => (
              <div
                key={prescription.id}
                className="rounded overflow-hidden shadow border hover:shadow-lg transition bg-white flex flex-col items-center text-center"
              >
                {/* Image/File Centered */}
                <div className="w-full h-48 flex items-center justify-center bg-gray-50">
                  <ImageUrl
                    fileKey={prescription.prescriptionUrl}
                    isViewFileTrue={true}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* File info */}
                <div className="w-full p-4 border-t text-left space-y-2 text-sm">
                  <p className="font-medium">
                    <span className="font-semibold text-primary">Date:</span>{" "}
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-[0.60rem]">
                    <span className="text-primary font-bold">
                      Send by Doctor:
                    </span>{" "}
                    {prescription?.doctor?.first_name +
                      " " +
                      prescription?.doctor?.last_name}
                  </p>

                  <div>
                    <p className="font-semibold">Special Instructions:</p>
                    {prescription.specialInstructions?.length > 0 ? (
                      <ul className="list-disc list-inside text-xs">
                        {prescription.specialInstructions.map(
                          (inst: string, idx: number) => (
                            <li key={idx}>{inst}</li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-xs">No instructions</p>
                    )}
                  </div>

                  {prescription.labTests?.length > 0 && (
                    <div>
                      <p className="text-primary font-semibold">Lab Tests:</p>
                      <ul className="list-disc list-inside text-gray-600 text-xs">
                        {prescription.labTests.map(
                          (test: string, idx: number) => (
                            <li key={idx}>{test}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-primary text-lg col-span-full">
              No prescriptions found.
            </p>
          )}
        </div>
      </div>
      <Toaster />
    </DashboardSection>
  );
}
