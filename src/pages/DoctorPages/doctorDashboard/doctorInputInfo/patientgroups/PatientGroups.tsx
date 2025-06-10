import { Link } from "react-router-dom";
import patientui from "../../../../../assets/drmyprofile/patientui.png";

const PatientGroups = () => {
  const dummyPatients = [
    {
      patient_id: 1,
      first_name: "John",
      last_name: "Doe",
      image: null,
    },
    {
      patient_id: 2,
      first_name: "Jane",
      last_name: "Smith",
      image: null,
    },
    {
      patient_id: 3,
      first_name: "Ali",
      last_name: "Khan",
      image: null,
    },
  ];

  return (
    <>
      <div className="flex items-center justify-end gap-3 mb-4 flex-nowrap">
        {/* <InputField
          label=""
          className="w-52"
          name="search"
          placeholder="Search Patient"
          type="text"
          value=""
          onChange={() => {}}
        />
        <Button title="Add New" className="text-xs w-32 h-9" />
        <Button title="Save Vitals" className="text-xs w-32 h-9" /> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyPatients.map((data) => (
          <Link
            key={data.patient_id}
            to={`profile/${data.patient_id}`} // relative path
          >
            <div className="flex flex-col items-center justify-start py-1 px-2 cursor-pointer">
              <img
                src={patientui}
                alt="Patient Icon"
                className="w-full object-contain"
              />
              <span className="text-xs truncate mt-1" style={{ color: "#5C89D8" }}>
                {data.first_name + " " + data.last_name}
              </span>
              <span className="text-xs" style={{ color: "#5C89D8" }}>
                {`PAT-${String(data.patient_id).padStart(3, "0")}`}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default PatientGroups;
