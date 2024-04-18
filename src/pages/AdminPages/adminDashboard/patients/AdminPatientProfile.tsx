import { Link, useNavigate, useParams } from "react-router-dom";
import { DashboardSection } from "../../../../components";
import { publicRequest } from "../../../../api/requestMethods";
import { useQuery } from "react-query";

export default function AdminPatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const PATIENT_QUERY = `
    query($id:String!) {
      findPatientById(id: $id) {
        id,
        first_name,
        last_name,
        email,
        phone_number,
        gender,
        is_verified
      }
    }
  `;

  const getPatient = async () => {
    return publicRequest
      .post("/graphql", {
        query: PATIENT_QUERY,
        variables: { id },
      })
      .then((response) => response.data.data.findPatientById);
  };

  const patientData = useQuery({
    queryKey: ["adminPatients", id],
    queryFn: getPatient,
  });

  if (!patientData?.data) {
    return (
      <DashboardSection title="">
        <div className="h-48 flex flex-col justify-center items-center gap-2">
          <h2 className="text-2xl font-medium">No Patient Found!</h2>
          <div className="w-48">
            <button
              className="form-btn"
              onClick={() => navigate("/admin-dashboard/patients")}
            >
              Go to patients
            </button>
          </div>
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection
      title={patientData?.data?.first_name + " " + patientData?.data?.last_name}
    >
      <div className="grid grid-cols-12 gap-6 my-2">
        <div className="col-span-6 flex items-center gap-2">
          <span>Name:</span>
          <span>
            {patientData?.data?.first_name + " " + patientData?.data?.last_name}
          </span>
        </div>
        <div className="col-span-6 flex items-center gap-2">
          <span>Email:</span>
          <span>{patientData?.data?.email}</span>
        </div>
        <div className="col-span-6 flex items-center gap-2">
          <span>Phone Number:</span>
          <span>{patientData?.data?.phone_number}</span>
        </div>
        <div className="col-span-6 flex items-center gap-2">
          <span>Gender:</span>
          <span>{patientData?.data?.gender}</span>
        </div>
      </div>
      <div className="w-48 mx-auto mt-6">
        <Link to={`/admin-dashboard/patients/edit/${patientData?.data?.id}`}>
          <button className="form-btn">Edit Patient</button>
        </Link>
      </div>
    </DashboardSection>
  );
}
