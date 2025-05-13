import { Link } from "react-router-dom";
import { DashboardSection, InputField } from "../../../../../components";
import { publicRequest } from "../../../../../api/requestMethods";
import { useQuery } from "react-query";
import { FaUserCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { DOCTOR_QUERY } from "./queries";
import { useDispatch } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";
import { SyntheticEvent, useState } from "react";

type Doctor = {
  id: number;
  first_name: string;
  last_name: string;
  is_verified: boolean;
};

export default function AdminDoctors() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
  };

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

  const { data } = useQuery({
    queryKey: ["adminDoctors"],
    queryFn: async () => {
      dispatch(loadingStart());
      return getDoctors();
    },
    onSuccess: () => dispatch(loadingEnd()),
  });

  const filteredDoctors = data?.filter((doctor: Doctor) =>
    (doctor.first_name + " " + doctor.last_name)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <DashboardSection title="Doctors">
      {data?.length === 0 ? (
        <p className="text-center text-primary my-6 text-2xl">No doctors available</p>
      ) : (
        <>
          <InputField
            label="Search Doctor"
            className="w-52 mb-5"
            name="search"
            placeholder="Enter doctor name"
            type="text"
            value={search}
            onChange={handleChange}
          />

          {filteredDoctors && filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-2">
              {filteredDoctors?.map((doctor: Doctor) => (
                <div
                  key={doctor?.id}
                  className="bg-gray-50 shadow rounded-lg px-4 py-4 relative"
                >
                  <div className="flex justify-center">
                    <FaUserCircle size={50} />
                  </div>
                  <h3 className="text-primary text-lg font-medium text-center my-2 whitespace-nowrap overflow-hidden text-ellipsis">
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
          ) : (
            <p className="text-center text-gray-500">
              No results found for{" "}
              <span className="font-semibold">"{search}"</span>
            </p>
          )}
        </>
      )}

      <div className="w-4/5 mx-auto">
        <Link to="/admin-dashboard/doctors/add-new">
          <button className="form-btn my-3">Add New Doctor</button>
        </Link>
      </div>
    </DashboardSection>
  );
}

