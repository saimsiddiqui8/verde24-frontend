import { Link } from "react-router-dom";
import { DashboardSection } from "../../../../../components";
import { publicRequest } from "../../../../../api/requestMethods";
import { useQuery } from "react-query";
import { FaHospitalAlt } from "react-icons/fa";
import { HOSPITAL_QUERY } from "./queries";

export default function AdminHospitals() {
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

  const { data } = useQuery({
    queryKey: ["adminHospitals"],
    queryFn: getHospitals,
  });

  return (
    <DashboardSection title="Hospitals">
      <div className="grid grid-cols-12 gap-6 my-2">
        {data?.map((hospital: Hospital) => (
          <div
            key={hospital?.id}
            className="col-span-4 bg-gray-50 shadow rounded-lg px-4 py-4"
          >
            <div className="flex justify-center">
              <FaHospitalAlt size={50} />
            </div>
            <h3 className="text-primary text-lg font-medium text-center my-2">
              {hospital?.name}
            </h3>
            <div className="w-4/5 mx-auto mt-4">
              <Link to={`/admin-dashboard/hospitals/${hospital?.id}`}>
                <button className="form-btn text-sm">View Info</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="w-48 mx-auto mt-4">
        <Link to="/admin-dashboard/hospitals/add-new">
          <button className="form-btn my-3">Add New Hospital</button>
        </Link>
      </div>
    </DashboardSection>
  );
}

type Hospital = {
  id: number;
  name: string;
};
