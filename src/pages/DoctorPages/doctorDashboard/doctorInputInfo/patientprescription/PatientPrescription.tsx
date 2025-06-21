import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllPrescription } from "../../../../../api/apiCalls/doctorsApi";
import { GET_ALL_PRESCRIPTION } from "../consultationForm/queries";
import { useQuery } from "react-query";
import { loadingEnd, loadingStart } from "../../../../../redux/slices/loadingSlice";
import { notifyFailure } from "../../../../../utils/Utils";
import ImageUrl from "../../../../../components/Icons/Sidemenu/ImageUrl";


type Prescription = {
  id: number;
  labTests: string[];
  specialInstructions: string[];
  prescriptionUrl: string;
  createdAt: string;
  doctor?:{
    first_name:string;
      last_name:string;
  }
};


const PatientPrescription = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const handleGetPrescription = async () => {
    if (!id) return;

    const response = await getAllPrescription(GET_ALL_PRESCRIPTION, {
      patientId: Number(id),
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
   <div className="p-6">
  <h2 className="text-xl font-semibold text-primary mb-4">
    View Prescriptions
  </h2>

  {data && data.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data.map((prescription: Prescription) => (
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
            <p className="text-gray-600 font-medium">
              <span className="font-semibold text-primary">Date:</span>{" "}
              {new Date(prescription.createdAt).toLocaleDateString()}
            </p>

            <div>
              <p className="text-gray-700 font-semibold">Special Instructions:</p>
              {prescription.specialInstructions?.length > 0 ? (
                <ul className="list-disc list-inside text-gray-600 text-xs">
                  {prescription.specialInstructions.map((inst: string, idx: number) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-xs">No instructions</p>
              )}
            </div>

            {prescription.labTests?.length > 0 && (
              <div>
                <p className="text-primary font-semibold">Lab Tests:</p>
                <ul className="list-disc list-inside text-gray-600 text-xs">
                  {prescription.labTests.map((test: string, idx: number) => (
                    <li key={idx}>{test}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-primary text-lg">No prescriptions found.</p>
  )}
</div>

  );
};

export default PatientPrescription;
