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
import { GET_ALL_LABS } from "./queries";

export default function AdminLabs() {
  const dispatch = useDispatch();
  const getLabs = async () => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: GET_ALL_LABS,
      });
      return response.data.data.getAllLabs;
    } catch (error) {
      console.error("Error fetching getAllLabs:", error);
      throw error;
    }
  };

  const { data } = useQuery({
    queryKey: ["adminLabs"],
    queryFn: async () => {
      dispatch(loadingStart());
      return getLabs();
    },
    onSuccess: () => dispatch(loadingEnd()),
  });

  return (
    <DashboardSection title="Labs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-2">
        {data?.map((lab: Lab) => (
          <div
            key={lab?.id}
            className="bg-gray-50 shadow rounded-lg px-4 py-4 relative"
          >
            <div className="flex justify-center">
              <FaUserCircle size={50} />
            </div>
            <h3 className="text-primary text-lg font-medium text-center my-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {lab?.lab_name}
            </h3>
            <div className="w-4/5 mx-auto mt-4">
              <Link to={`/admin-dashboard/labs/${lab?.id}`}>
                <button className="form-btn text-sm">View Profile</button>
              </Link>
            </div>
            {lab?.is_verified ? (
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

type Lab = {
  id: number;
  lab_name: string;
  is_verified: boolean;
};
