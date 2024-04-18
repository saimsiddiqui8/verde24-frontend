import { useQuery } from "react-query";
import { publicRequest } from "../../../../api/requestMethods";
import { DashboardSection } from "../../../../components";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminPatients() {
  const PATIENT_QUERY = `
  query {
    patients {
      id,
      first_name,
      last_name,
    }
  }
`;

  const getPatients = async () => {
    return publicRequest
      .post("/graphql", {
        query: PATIENT_QUERY,
      })
      .then((response) => response.data.data.patients);
  };

  const { data } = useQuery({
    queryKey: ["adminPatients"],
    queryFn: getPatients,
  });
  return (
    <DashboardSection title="Patients">
      <div className="grid grid-cols-12 gap-6 my-2">
        {data?.map((patient: Patient) => (
          <div
            key={patient?.id}
            className="col-span-4 bg-gray-50 shadow rounded-lg px-4 py-4"
          >
            <div className="flex justify-center">
              <FaUserCircle size={50} />
            </div>
            <h3 className="text-primary text-lg font-medium text-center my-2">
              {patient?.first_name + " " + patient?.last_name}
            </h3>
            <div className="w-4/5 mx-auto mt-4">
              <Link to={`/admin-dashboard/patients/${patient?.id}`}>
                <button className="form-btn text-sm">View Profile</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="w-48 mx-auto">
        <Link to="/admin-dashboard/doctors/add-new">
          <button className="form-btn my-3">Add New Doctor</button>
        </Link>
      </div> */}
    </DashboardSection>
  );
}

type Patient = {
  id: number;
  first_name: string;
  last_name: string;
};
