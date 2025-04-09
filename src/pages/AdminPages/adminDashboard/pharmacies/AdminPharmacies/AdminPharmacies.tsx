import { Link } from "react-router-dom";
import { DashboardSection } from "../../../../../components";
import { publicRequest } from "../../../../../api/requestMethods";
import { useQuery } from "react-query";
import { FaUserCircle } from "react-icons/fa";
import { MdLock, MdLockOpen } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";
import { GET_ALL_PHARMACY } from "./queries";
export default function AdminPharmacies() {
  const dispatch = useDispatch();
  const getPharmacies = async () => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: GET_ALL_PHARMACY,
      });
      return response.data.data.getAllPharmacies;
    } catch (error) {
      console.error("Error fetching getAllPharmacies:", error);
      throw error;
    }
  };

  const { data } = useQuery({
    queryKey: ["adminPharmacies"],
    queryFn: async () => {
      dispatch(loadingStart());
      return getPharmacies();
    },
    onSuccess: () => dispatch(loadingEnd()),
  });

  return (
    <DashboardSection title="Pharmacies">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-2">
        {data?.map((Pharmacy: Pharmacies) => (
          <div
            key={Pharmacy?.id}
            className="bg-gray-50 shadow rounded-lg px-4 py-4 relative"
          >
            <div className="flex justify-center">
              <FaUserCircle size={50} />
            </div>
            <h3 className="text-primary text-lg font-medium text-center my-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {Pharmacy?.pharmacy_name}
            </h3>
            <div className="w-4/5 mx-auto mt-4">
              <Link to={`/admin-dashboard/Pharmacies/${Pharmacy?.id}`}>
                <button className="form-btn text-sm">View Profile</button>
              </Link>
            </div>
            {Pharmacy?.is_verified ? (
              <div className="absolute top-2 right-2">
                <MdLock size={25} />
              </div>
            ) : (
              <div className="absolute top-2 right-2">
                <MdLockOpen size={25} />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* <div className="w-4/5 mx-auto">
        <Link to="/admin-dashboard/doctors/add-new">
          <button className="form-btn my-3">Add New Doctor</button>
        </Link>
      </div> */}
    </DashboardSection>
  );
}

type Pharmacies = {
  id: number;
  pharmacy_name: string;
  is_verified: boolean;
};
