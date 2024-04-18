import { useNavigate } from "react-router-dom";
import { DashboardSection, InputField } from "../../../../../components";
import { useState } from "react";
import { publicRequest } from "../../../../../api/requestMethods";
import { useMutation, useQueryClient } from "react-query";
import {
  areAllValuesTruthy,
  notifyFailure,
  notifySuccess,
} from "../../../../../utils/Utils";
import { Toaster } from "react-hot-toast";
import { HOSPITAL_QUERY } from "./queries";

const inputs = [
  {
    label: "Name",
    type: "text",
    placeholder: "Enter Name",
    name: "name",
  },
  {
    label: "Location",
    type: "text",
    placeholder: "Enter location",
    name: "location",
  },
  {
    label: "Phone Number",
    type: "number",
    placeholder: "Enter Phone Number",
    name: "phone_number",
  },
];

export default function AdminNewHospital() {
  const [inputValues, setInputValues] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createHospital = async (data: any) => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: HOSPITAL_QUERY,
        variables: { data },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error creating hospital:", error);
      throw error;
    }
  };

  const { mutate } = useMutation(createHospital);

  const handleChange = (e: any) => {
    setInputValues((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      Object.keys(inputValues)?.length === inputs?.length &&
      areAllValuesTruthy(inputValues)
    ) {
      mutate(inputValues, {
        onSuccess: mutateSuccess,
        onError: mutateFail,
      });
    } else {
      notifyFailure("Please fill all the fields!");
    }
  };

  function mutateSuccess() {
    notifySuccess("New Hospital Created! Redirecting...");
    queryClient.invalidateQueries({ queryKey: ["adminHospitals"] });
    setTimeout(() => {
      navigate("/admin-dashboard/hospitals");
    }, 1000);
  }

  function mutateFail() {
    notifyFailure("Hospital creation failed!");
  }

  return (
    <DashboardSection title="Add New Hospital">
      <form onSubmit={handleSubmit} className="pt-2">
        <div className="grid grid-cols-12 gap-x-4 gap-y-0">
          {inputs?.map((input) => (
            <div className="col-span-6">
              <InputField
                label={input.label}
                name={input.name}
                placeholder={input.placeholder}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        <div className="mx-auto w-64">
          <button className="form-btn">Submit</button>
        </div>
        <Toaster />
      </form>
    </DashboardSection>
  );
}
