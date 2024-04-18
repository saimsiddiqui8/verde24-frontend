import { Link, useNavigate, useParams } from "react-router-dom";
import { DashboardSection } from "../../../../../components";
import { publicRequest } from "../../../../../api/requestMethods";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { DOCTOR_QUERY, HOSPITAL_QUERY } from "./queries";

export default function AdminHospitalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getHospital = async () => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: HOSPITAL_QUERY,
        variables: { id },
      });
      return response.data.data.findHospitalById;
    } catch (error) {
      console.error("Error fetching hospital:", error);
      throw error;
    }
  };

  const hospitalData = useQuery({
    queryKey: ["adminHospitals", id],
    queryFn: getHospital,
  });

  const doctorHospitals = hospitalData?.data?.doctorHospitals;

  const getDoctors = async () => {
    try {
      if (!doctorHospitals) {
        return [];
      }
      const ids = doctorHospitals.map((i: { doctor_id: string }) =>
        parseInt(i.doctor_id)
      );
      const response = await publicRequest.post("/graphql", {
        query: DOCTOR_QUERY,
        variables: {
          ids,
        },
      });
      return response.data.data.findDoctorsByIds;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  };

  const doctorData = useQuery({
    queryKey: ["adminDoctors", "hospitals", id],
    queryFn: getDoctors,
    enabled: false,
  });

  useEffect(() => {
    doctorData.refetch();
  }, [doctorHospitals]);

  if (!hospitalData?.data) {
    return (
      <DashboardSection title="">
        <div className="h-48 flex flex-col justify-center items-center gap-2">
          <h2 className="text-2xl font-medium">No Hospital Found!</h2>
          <div className="w-48">
            <button
              className="form-btn"
              onClick={() => navigate("/admin-dashboard/hospitals")}
            >
              Go to hospitals
            </button>
          </div>
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection title={hospitalData?.data?.name}>
      <div className="grid grid-cols-12 gap-6 my-2">
        <div className="col-span-6 flex items-center gap-2">
          <span>Name:</span>
          <span>{hospitalData?.data?.name}</span>
        </div>
        <div className="col-span-6 flex items-center gap-2">
          <span>Location:</span>
          <span>{hospitalData?.data?.location}</span>
        </div>
        <div className="col-span-6 flex items-center gap-2">
          <span>Phone Number:</span>
          <span>{hospitalData?.data?.phone_number}</span>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-base font-medium">Doctors Assigned:</h3>
        <div className="mt-2">
          <ul className="pl-6">
            {doctorData?.data?.length > 0 ? (
              doctorData?.data?.map((doctor: Doctor) => (
                <li className="list-disc">
                  <Link to={`/admin-dashboard/doctors/${doctor?.id}`}>
                    {"Dr. " + doctor?.first_name + " " + doctor?.last_name}
                  </Link>
                </li>
              ))
            ) : (
              <small>No Doctors to Show!</small>
            )}
          </ul>
        </div>
      </div>
    </DashboardSection>
  );
}

type Doctor = {
  id: string;
  first_name: string;
  last_name: string;
};
