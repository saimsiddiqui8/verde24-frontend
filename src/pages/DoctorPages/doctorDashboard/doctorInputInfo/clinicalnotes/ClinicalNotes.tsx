import { useParams } from "react-router-dom";
import { Button } from "../../../../../components";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import {
  loadingStart,
  loadingEnd,
} from "../../../../../redux/slices/loadingSlice";
import { notifyFailure } from "../../../../../utils/Utils";
import { getAllPrescription } from "../../../../../api/apiCalls/doctorsApi";
import { GET_ALL_PRESCRIPTION } from "../consultationForm/queries";

type Prescription = {
  id: number;
  complaints: string[];
  labTests?: string[]; 
  diagnosis: string[];
  observation: string[];
  specialInstructions: string[];
  prescriptionUrl: string;
  history: string[];
  createdAt: string;
  updatedAt: string;
};

const ClinicalNotes = () => {
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
    queryKey: ["ClinicalNotes", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return handleGetPrescription();
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error.message || "Failed to load patient report!");
    },
  });

  const prescriptions: Prescription[] = data ?? [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between my-4 items-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary">Clinical Notes</h2>
        <div className="flex gap-2 mt-2 sm:mt-0">
          {/* <Button title="Edit Medical Hostry Vitals" className="text-sm px-3 py-1 w-fit" />
          <Button title="Cancel" className="text-sm px-3 py-2 w-fit" />
          <Button title="Save Vitals" className="text-sm px-3 py-2 w-fit" /> */}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg overflow-hidden">
        {prescriptions.map((prescription) => (
          <div key={prescription.id} className="mb-6">
            {/* Date */}
            <div className="bg-[#E7EDF9] text-[13px] font-medium px-4 py-2 rounded-sm mb-3">
              {new Date(prescription.createdAt).toLocaleDateString()}
            </div>

            {/* Dynamic Sections */}
            {[
              { label: "History", values: prescription.history },
              { label: "Complaints", values: prescription.complaints },
              { label: "Observation", values: prescription.observation },
              { label: "Diagnoses", values: prescription.diagnosis },
              { label: "Lab Tests", values: prescription.labTests || [] }, 
              { label: "Special Instructions", values: prescription.specialInstructions },
            ].map(
              (section, sIdx) =>
                section.values?.length > 0 && (
                  <div key={sIdx} className="mb-3">
                    <div className="bg-[#E7EDF9] text-[13px] font-semibold px-4 py-2 rounded-sm mb-1">
                      {section.label}
                    </div>
                    {section.values.map((val, vIdx) => (
                      <div
                        key={vIdx}
                        className="bg-[#E7EDF9] text-[12px] px-4 py-1 border-t border-white"
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicalNotes;
