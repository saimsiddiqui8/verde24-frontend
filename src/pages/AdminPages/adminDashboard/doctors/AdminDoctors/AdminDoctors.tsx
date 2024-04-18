import { Link } from "react-router-dom";
import { DashboardSection } from "../../../../../components";
import { publicRequest } from "../../../../../api/requestMethods";
import { useQuery } from "react-query";
import { FaUserCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { DOCTOR_QUERY } from "./queries";

export default function AdminDoctors() {
  const getDoctors = async () => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: DOCTOR_QUERY,
      });
      return response.data.data.doctors;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["adminDoctors"],
    queryFn: getDoctors,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <DashboardSection title="Doctors">
      <div className="grid grid-cols-12 gap-6 my-2">
        {data?.map((doctor: Doctor) => (
          <div
            key={doctor?.id}
            className="col-span-4 bg-gray-50 shadow rounded-lg px-4 py-4 relative"
          >
            <div className="flex justify-center">
              <FaUserCircle size={50} />
            </div>
            <h3 className="text-primary text-lg font-medium text-center my-2">
              {doctor?.first_name + " " + doctor?.last_name}
            </h3>
            <div className="w-4/5 mx-auto mt-4">
              <Link to={`/admin-dashboard/doctors/${doctor?.id}`}>
                <button className="form-btn text-sm">View Profile</button>
              </Link>
            </div>
            {doctor?.is_verified && (
              <div className="absolute top-2 right-2">
                <MdVerified size={25} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="w-48 mx-auto">
        <Link to="/admin-dashboard/doctors/add-new">
          <button className="form-btn my-3">Add New Doctor</button>
        </Link>
      </div>
    </DashboardSection>
  );
}

type Doctor = {
  id: number;
  first_name: string;
  last_name: string;
  is_verified: boolean;
};
