import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";
import { notifyFailure } from "../../../../../utils/Utils";
import ImageUrl from "../../../../../components/Icons/Sidemenu/ImageUrl";
import { getReportByPatientDoctorId } from "../../../../../api/apiCalls/doctorsApi";
import { RootState } from "../../../../../redux/store";
import { GET_REPORT_BY_PATIENTDOCTOR_ID } from "../consultationForm/queries";

const PatientFiles = () => {
  const { id } = useParams();
  const doctorId = useSelector(
    (state: RootState) => state.user.currentUser?.id,
  );
  const dispatch = useDispatch();

  const handlePatientReportById = async () => {
    if (!id) return;
    const response = await getReportByPatientDoctorId(
      GET_REPORT_BY_PATIENTDOCTOR_ID,
      {
        patientId: Number(id),
        doctorId: Number(doctorId),
      },
    );

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

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-primary mb-4">
        View Patient Reports
      </h2>

      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {data
            .flatMap((report: { files: string[] }) => report.files || [])
            .map((fileUrl: string, index: number) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center border border-gray-200 rounded-md shadow p-3 bg-white"
              >
                <div className="w-full h-48 flex items-center justify-center">
                  <ImageUrl
                    fileKey={fileUrl}
                    isViewFileTrue={true}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-primary text-lg">No files found.</p>
      )}
    </div>
  );
};

export default PatientFiles;
