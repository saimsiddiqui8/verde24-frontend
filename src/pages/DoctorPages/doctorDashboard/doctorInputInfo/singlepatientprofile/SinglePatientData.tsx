import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getPatientById } from "../../../../../api/apiCalls/patientsApi";
import { FIND_PATIENT_QUERY } from "../../../../PatientPages/patientDashboard/patientProfile/queries";
import { useQuery } from "react-query";
import { loadingEnd, loadingStart } from "../../../../../redux/slices/loadingSlice";
import { notifyFailure } from "../../../../../utils/Utils";
import ImageUrl from "../../../../../components/Icons/Sidemenu/ImageUrl";
import { Button } from "../../../../../components";
import patientui from "../../../../../assets/drmyprofile/patientui.png";

const SinglePatientData = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const getPatient = async () => {
    if (!id) return;
    return getPatientById(FIND_PATIENT_QUERY, { id: Number(id) });
  };

  const { data } = useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getPatient();
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: (err: Error) => {
      dispatch(loadingEnd());
      notifyFailure(err.message);
    },
  });

  return (
    <div className="flex gap-6">
      {/* Left Section */}
      <div className="w-7/12">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4 text-[#5C89D8]">
          Patient Profile
        </h2>

        <div className="grid grid-cols-3 gap-6 text-sm text-[#5C89D8]">
          {/* Patient Info */}
          <div className="col-span-2 space-y-2">
            {[
              { label: "Patient Name:", value: `${data?.first_name} ${data?.last_name}` },
              { label: "Patient ID:", value: data?.id },
              { label: "Insurance ID:", value: data?.insurance_id },
              { label: "Gender:", value: data?.gender },
              { label: "Age:", value: data?.age },
              { label: "Referred By:", value: data?.referredBy ?? "Someone" },
              { label: "Mobile Number:", value: data?.phone_number },
              { label: "Blood Group:", value: data?.blood_group },
              { label: "Membership:", value: data?.membership ?? "Gold" },
              { label: "Weight:", value: `${data?.weight}kg` },
              { label: "Other History:", value: data?.other_history },
            ].map((item, index) => (
              <div key={index} className="flex items-start whitespace-nowrap">
                <span className="w-40 shrink-0 font-semibold">{item.label}</span>
                <span className="flex-1">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="flex justify-center items-start pt-2 ms-8">
            {data?.image ? (
              <ImageUrl
                fileKey={data?.image}
                className="w-24 h-24 rounded-lg object-cover"
              />
            ) : (
              <img
                src={patientui}
                alt="Patient Icon"
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
          </div>
        </div>

        {/* Optional White Box */}
        <div className="mt-4 w-full h-24 bg-[#F5F7FB] rounded-md shadow-sm"></div>
      </div>

      {/* Right Section */}
     <div className="w-4/12">
  {/* Button Actions */}
  <div className="flex justify-end mb-4 gap-2">
    <Button title="Edit" className="text-[10px] px-2 py-2 w-24" />
    <Button title="Cancel" className="text-[10px] px-2 py-2 w-20" />
    <Button title="Save" className="text-[10px] px-2 py-2 w-20" />
  </div>

  {/* Patient UI Icon Placeholder */}
  <div className="flex justify-center mt-4">
    {/* <img
      src={patientui}
      alt="Patient Icon"
      className="w-24 h-24 object-contain"
    /> */}
  </div>
</div>

    </div>
  );
};

export default SinglePatientData;
