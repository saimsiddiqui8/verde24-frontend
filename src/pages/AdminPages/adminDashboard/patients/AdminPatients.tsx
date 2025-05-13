import { useQuery } from "react-query";
import { publicRequest } from "../../../../api/requestMethods";
import { DashboardSection, InputField } from "../../../../components";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { SyntheticEvent, useState } from "react";

  const PATIENT_QUERY = `
  query {
    patients {
      id,
      first_name,
      last_name,
    }
  }
`;

  type Patient = {
    id: number;
    first_name: string;
    last_name: string;
  };


export default function AdminPatients() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const getPatients = async () => {
    return publicRequest
      .post("/graphql", {
        query: PATIENT_QUERY,
      })
      .then((response) => response.data.data.patients);
  };

  const { data } = useQuery({
    queryKey: ["adminPatients"],
    queryFn: async () => {
      dispatch(loadingStart());
      return getPatients();
    },
    onSuccess: () => dispatch(loadingEnd()),
  });

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
  };

  const filteredPatients = data?.filter((patient: Patient) =>
    (patient.first_name + " " + patient.last_name)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <DashboardSection title="Patients">
      {data?.length === 0 ? (
        <p className="text-center text-primary my-6 text-2xl">No patients available</p>
      ) : (
        <>
          <InputField
            label="Search Patient"
            className="w-52 mb-5"
            name="search"
            placeholder="Enter patient name"
            type="text"
            value={search}
            onChange={handleChange}
          />

          {filteredPatients && filteredPatients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-2">
              {filteredPatients?.map((patient: Patient) => (
                <div
                  key={patient?.id}
                  className="bg-gray-50 shadow rounded-lg px-4 py-4"
                >
                  <div className="flex justify-center">
                    <FaUserCircle size={50} />
                  </div>
                  <h3 className="text-primary text-lg font-medium text-center my-2 whitespace-nowrap overflow-hidden text-ellipsis">
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

