import { useNavigate, useParams } from "react-router-dom";
import { CheckboxInput, DashboardSection } from "../../../../../components";
import { publicRequest } from "../../../../../api/requestMethods";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState, useEffect } from "react";
import {
  DOCTOR_QUERY,
  HOSPITAL_QUERY,
  DOCTOR_UPDATE_QUERY,
  DOCTOR_ADD_HOSPITAL_QUERY,
  DOCTOR_REMOVE_HOSPITAL_QUERY,
} from "./queries";
import { notifyFailure, notifySuccess } from "../../../../../utils/Utils";
import { Toaster } from "react-hot-toast";

export default function AdminDoctorProfile() {
  const [selectedHospitals, setSelectedHospitals] =
    useState<CheckboxOption[]>();
  const [verified, setVerified] = useState(false);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getHospitals = async () => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: HOSPITAL_QUERY,
      });
      return response.data.data.hospitals;
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      throw error;
    }
  };

  const getDoctor = async () => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: DOCTOR_QUERY,
        variables: { id },
      });

      return response.data.data.findDoctorById;
    } catch (error) {
      console.error("Error fetching doctor:", error);
      throw error;
    }
  };

  const allHospitals = useQuery({
    queryKey: ["hospitals"],
    queryFn: getHospitals,
  });

  const doctorData = useQuery({
    queryKey: ["adminDoctors", id],
    queryFn: getDoctor,
  });

  function getAssignedHospitals(doctor: any) {
    return doctor?.map((item: any) => item?.hospital_id);
  }

  const assignedHospitals =
    getAssignedHospitals(doctorData?.data?.doctorHospitals) || [];

  const hospitals = (allHospitals?.data || []).map((hospital: Hospital) => ({
    id: hospital?.id,
    label: hospital?.name,
    value: hospital?.name,
    checked: assignedHospitals.includes(hospital?.id),
  }));

  useEffect(() => {
    setSelectedHospitals(hospitals);
    setVerified(doctorData?.data?.is_verified);
  }, [doctorData.data]);

  const createDoctorHospital = async (data: any) => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: DOCTOR_ADD_HOSPITAL_QUERY,
        variables: { data },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating doctor hospital:");
      throw error;
    }
  };

  const deleteDoctorHospital = async (data: any) => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: DOCTOR_REMOVE_HOSPITAL_QUERY,
        variables: { data },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting doctor hospital:");
      throw error;
    }
  };

  const addDoctorHospital = useMutation(createDoctorHospital);
  const removeDoctorHospital = useMutation(deleteDoctorHospital);

  const handleAssignment = (value: string) => {
    let current: CheckboxOption;
    const newArr = selectedHospitals?.map((item: CheckboxOption) => {
      if (value === item.value) {
        current = item;
        return { ...item, checked: !item.checked };
      } else {
        return item;
      }
    });
    if (current!?.checked) {
      removeDoctorHospital.mutate(
        {
          doctor_id: parseInt(id!),
          hospital_id: parseInt(current!?.id),
        },
        {
          onSuccess: () => {
            notifySuccess(`${current?.value} removed!`);
            queryClient.invalidateQueries({
              queryKey: ["adminHospitals"],
            });
            queryClient.invalidateQueries({
              queryKey: ["adminDoctors"],
            });
          },
          onError: () => {
            notifyFailure(`Deletion failed!`);
          },
        }
      );
    } else {
      addDoctorHospital.mutate(
        {
          doctor_id: parseInt(id!),
          hospital_id: parseInt(current!?.id),
        },
        {
          onSuccess: () => {
            notifySuccess(`${current?.value} assigned!`);
            queryClient.invalidateQueries({
              queryKey: ["adminHospitals"],
            });
            queryClient.invalidateQueries({
              queryKey: ["adminDoctors"],
            });
          },
          onError: () => {
            notifyFailure(`Assignment failed!`);
          },
        }
      );
    }
    setSelectedHospitals(newArr);
  };

  const updateDoctor = async (data: any) => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: DOCTOR_UPDATE_QUERY,
        variables: { id, data },
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
      }
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
      <div className="grid grid-cols-12 gap-6 my-2 items-start">
        <div className="col-span-6 flex items-center gap-2">
          <span>Name:</span>
          <span>
            {doctorData?.data?.first_name + " " + doctorData?.data?.last_name}
          </span>
        </div>
        <div className="col-span-6 flex items-center gap-2">
          <span>Email:</span>
          <span>{doctorData?.data?.email}</span>
        </div>
        <div className="col-span-6 flex items-center gap-2">
          <span>Phone Number:</span>
          <span>{doctorData?.data?.phone_number}</span>
        </div>
        <div className="col-span-6 flex items-center gap-2">
          <span>Gender:</span>
          <span>{doctorData?.data?.gender}</span>
        </div>
        <div className="col-span-6">
          <span>Hospital Assignment:</span>
          <CheckboxInput
            options={selectedHospitals}
            name="hospital_assignment"
            onChange={(e) => handleAssignment(e.target.value)}
          />
        </div>
        <div className="col-span-6 flex items-center gap-2">
          <span>Verified:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={verified}
              onChange={() => handleVerify()}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <Toaster />
    </DashboardSection>
  );
}

type Hospital = {
  id: string;
  name: string;
  checked?: boolean;
};

type CheckboxOption = {
  id: string;
  label: string;
  value: string;
  checked?: boolean;
};
