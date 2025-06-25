import { Link } from "react-router-dom";
import { DashboardSection, InputField } from "../../../../../components";
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
import { useState } from "react";

type Lab = {
  id: number;
  lab_name: string;
  is_verified: boolean;
};

export default function AdminLabs() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
  };

  const getLabs = async () => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: GET_ALL_LABS,
      });
      return response?.data?.data?.getAllLabs;
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

  const filteredLabs = data?.filter((lab: Lab) =>
    lab?.lab_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardSection title="Labs">
      {data?.length === 0 ? (
        <p className="text-center text-primary my-6 text-2xl">
          No labs available
        </p>
      ) : (
        <>
          <InputField
            label="Search Lab"
            className="w-52 mb-5"
            name="search"
            placeholder="Enter lab name"
            type="text"
            value={search}
            onChange={handleChange}
          />

          {filteredLabs && filteredLabs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-2">
              {filteredLabs.map((lab: Lab) => (
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
                  <div className="absolute top-2 right-2">
                    {lab?.is_verified ? (
                      <MdLock size={25} />
                    ) : (
                      <MdLockOpen size={25} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No results found for{" "}
              <span className="font-semibold">"{search}"</span>
            </p>
          )}
        </>
      )}
    </DashboardSection>
  );
}
