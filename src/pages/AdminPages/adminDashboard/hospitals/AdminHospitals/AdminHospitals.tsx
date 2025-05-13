import { Link } from "react-router-dom";
import { DashboardSection, InputField } from "../../../../../components";
import { publicRequest } from "../../../../../api/requestMethods";
import { useQuery } from "react-query";
import { FaHospitalAlt } from "react-icons/fa";
import { HOSPITAL_QUERY } from "./queries";
import { useDispatch } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";
import { useState } from "react";

type Hospital = {
  id: number;
  name: string;
};

export default function AdminHospitals() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
  };

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
    queryFn: async () => {
      dispatch(loadingStart());
      return getHospitals();
    },
    onSuccess: () => dispatch(loadingEnd()),
  });

  const filteredHospitals = data?.filter((hospital: Hospital) =>
    hospital.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardSection title="Hospitals">
      {data?.length === 0 ? (
        <p className="text-center text-primary my-6 text-2xl">No hospitals available</p>
      ) : (
        <>
          <InputField
            label="Search Hospital"
            className="w-52 mb-5"
            name="search"
            placeholder="Enter hospital name"
            type="text"
            value={search}
            onChange={handleChange}
          />

          {filteredHospitals && filteredHospitals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-2">
              {filteredHospitals.map((hospital: Hospital) => (
                <div
                  key={hospital?.id}
                  className="bg-gray-50 shadow rounded-lg px-4 py-4"
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
          ) : (
            <p className="text-center text-gray-500">
              No results found for{" "}
              <span className="font-semibold">"{search}"</span>
            </p>
          )}
        </>
      )}

      <div className="w-full sm:w-48 mx-auto mt-4">
        <Link to="/admin-dashboard/hospitals/add-new">
          <button className="form-btn my-3 w-full sm:w-auto">
            Add New Hospital
          </button>
        </Link>
      </div>
    </DashboardSection>
  );
}


