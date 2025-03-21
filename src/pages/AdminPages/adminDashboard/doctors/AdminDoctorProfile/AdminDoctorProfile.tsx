import { useNavigate, useParams } from "react-router-dom";
import { DashboardSection } from "../../../../../components";
import { publicRequest } from "../../../../../api/requestMethods";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState, useEffect } from "react";
import {
  DOCTOR_QUERY,
  DOCTOR_UPDATE_QUERY,
} from "./queries";
import { notifyFailure, notifySuccess } from "../../../../../utils/Utils";
import { Toaster } from "react-hot-toast";
import ImageUrl from "../../../../../components/Icons/Sidemenu/ImageUrl";

export default function AdminDoctorProfile() {
  const [verified, setVerified] = useState(false);
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : undefined;
  const queryClient = useQueryClient();
  const navigate = useNavigate();


  const getDoctor = async () => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: DOCTOR_QUERY,
        variables: { findDoctorByIdId: numericId },
      });

      return response.data.data.findDoctorById;
    } catch (error) {
      console.error("Error fetching doctor:", error);
      throw error;
    }
  };

  const doctorData = useQuery({
    queryKey: ["adminDoctors", id],
    queryFn: getDoctor,
  });



  useEffect(() => {
    setVerified(doctorData?.data?.is_verified);
  }, [doctorData.data]);



  const updateDoctor = async (data: { is_verified: boolean }) => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: DOCTOR_UPDATE_QUERY,
        variables: { id: Number(id), data },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating doctor:");
      throw error;
    }
  };

  const verify = useMutation(updateDoctor);

  const handleVerify = () => {
    setVerified((prev) => !prev);
    verify.mutate(
      { is_verified: !verified },
      {
        onSuccess: () => {
          if (!verified) {
            notifySuccess("Doctor Verified!");
            queryClient.invalidateQueries({ queryKey: ["adminDoctors"] });
          } else {
            notifySuccess("Doctor Unverified!");
            queryClient.invalidateQueries({ queryKey: ["adminDoctors"] });
          }
        },
        onError: () => {
          notifyFailure("Error updating doctor!");
        },
      },
    );
  };

  if (!doctorData?.data) {
    return (
      <DashboardSection title="">
        <div className="h-48 flex flex-col justify-center items-center gap-2">
          <h2 className="text-2xl font-medium">No Doctor Found!</h2>
          <div className="w-48">
            <button
              className="form-btn"
              onClick={() => navigate("/admin-dashboard/doctors")}
            >
              Go to doctors
            </button>
          </div>
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection
      title={
        "Dr. " +
        doctorData?.data?.first_name +
        " " +
        doctorData?.data?.last_name
      }
    >
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2 items-start">
  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
  <span>Image:</span>
    <span>
      {doctorData?.data?.image ? <ImageUrl fileKey={doctorData?.data?.image} className="w-24 h-24"/>:"Not updated"}
    </span>
  </div>
  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
  <span>Form:</span>
  <span>{doctorData?.data?.form_submitted ? "Doctor sumbit the form" : "Not submitted"}</span>
  </div>
  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Name:</span>
    <span>
      {doctorData?.data?.first_name && doctorData?.data?.last_name
        ? doctorData?.data?.first_name + " " + doctorData?.data?.last_name
        : "Not updated"}
    </span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Email:</span>
    <span>{doctorData?.data?.email || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Phone Number:</span>
    <span>{doctorData?.data?.phone_number || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Gender:</span>
    <span>{doctorData?.data?.gender || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Verified:</span>
    <label className="relative inline-flex flex-col lg:flex-row items-start justify-start text-xs font-bold cursor-pointer">
      <input
        type="checkbox"
        checked={verified}
        onChange={() => handleVerify()}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Verified:</span>
    <span>{doctorData?.data?.is_verified ? "Doctor is verified" : "Doctor is not verified"}</span>
  </div>
  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>City:</span>
    <span>{doctorData?.data?.city || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Country:</span>
    <span>{doctorData?.data?.country || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Department:</span>
    <span>{doctorData?.data?.department || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Experience:</span>
    <span>{doctorData?.data?.experience || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Registration No.:</span>
    <span>{doctorData?.data?.registration_no || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Qualification:</span>
    <span>{doctorData?.data?.qualification || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Consultation Mode:</span>
    <span>{doctorData?.data?.consultation_mode || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Consultation Fee (Regular):</span>
    <span>{doctorData?.data?.consultation_fee_regular || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Consultation Fee (Discounted):</span>
    <span>{doctorData?.data?.consultation_fee_discounted || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Payout Method:</span>
    <span>{doctorData?.data?.payout_method_id || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Address:</span>
    <span>{doctorData?.data?.address || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Postal Code:</span>
    <span>{doctorData?.data?.postal_code || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Bibliography:</span>
    <span>{doctorData?.data?.bibliography || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Work:</span>
    <span>{doctorData?.data?.work || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Degree:</span>
    <span>{doctorData?.data?.degree || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Designation:</span>
    <span>{doctorData?.data?.designation || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Enter Symptom:</span>
    <span>{doctorData?.data?.enterSymptom || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Institute:</span>
    <span>{doctorData?.data?.institute || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Account No.:</span>
    <span>{doctorData?.data?.ac_no || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>UPI ID:</span>
    <span>{doctorData?.data?.upi_id || "Not updated"}</span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Services:</span>
    <span>
      {doctorData?.data?.services && doctorData?.data?.services.length > 0
        ? doctorData?.data?.services.join(", ")
        : "Not updated"}
    </span>
  </div>

  <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
    <span>Specialization:</span>
    <span>
      {doctorData?.data?.specialization && doctorData?.data?.specialization.length > 0
        ? doctorData?.data?.specialization.join(", ")
        : "Not updated"}
    </span>
  </div>
</div>

      <Toaster />
    </DashboardSection>
  );
}

