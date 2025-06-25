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
import { GET_ALL_PHARMACY } from "./queries";
import { useState } from "react";

type Pharmacies = {
  id: number;
  pharmacy_name: string;
  is_verified: boolean;
};
export default function AdminPharmacies() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
  };

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

  const filteredPharmacies = data?.filter((pharmacy: Pharmacies) =>
    pharmacy?.pharmacy_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardSection title="Pharmacies">
      {data?.length === 0 ? (
        <p className="text-center text-primary my-6 text-2xl">
          No pharmacies available
        </p>
      ) : (
        <>
          <InputField
            label="Search Pharmacy"
            className="w-52 mb-5"
            name="search"
            placeholder="Enter pharmacy name"
            type="text"
            value={search}
            onChange={handleChange}
          />

          {filteredPharmacies && filteredPharmacies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-2">
              {filteredPharmacies.map((pharmacy: Pharmacies) => (
                <div
                  key={pharmacy?.id}
                  className="bg-gray-50 shadow rounded-lg px-4 py-4 relative"
                >
                  <div className="flex justify-center">
                    <FaUserCircle size={50} />
                  </div>
                  <h3 className="text-primary text-lg font-medium text-center my-2 whitespace-nowrap overflow-hidden text-ellipsis">
                    {pharmacy?.pharmacy_name}
                  </h3>
                  <div className="w-4/5 mx-auto mt-4">
                    <Link to={`/admin-dashboard/pharmacies/${pharmacy?.id}`}>
                      <button className="form-btn text-sm">View Profile</button>
                    </Link>
                  </div>
                  <div className="absolute top-2 right-2">
                    {pharmacy?.is_verified ? (
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
