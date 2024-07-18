import { useState, useEffect } from "react";
import {
  DashboardSection,
  InputField,
  PhoneInputComp,
  RadioInput,
} from "../../../../../components";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Toaster } from "react-hot-toast";
import { publicRequest } from "../../../../../api/requestMethods";
import {
  isPhoneValid,
  notifyFailure,
  notifySuccess,
} from "../../../../../utils/Utils";
import { useDispatch } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";
import {
  EXISTING_PATIENT_QUERY,
  GET_PATIENT_QUERY,
  UPDATE_PATIENT_QUERY,
} from "./queries";

const inputsArr = [
  {
    label: "First Name",
    type: "text",
    placeholder: "Enter Your First Name",
    name: "first_name",
    error: false,
  },
  {
    label: "Last Name",
    type: "text",
    placeholder: "Enter Your Last Name",
    name: "last_name",
    error: false,
  },
  {
    label: "Email",
    type: "email",
    placeholder: "Enter Your Email",
    name: "email",
    error: false,
  },
  {
    label: "Phone Number",
    type: "number",
    placeholder: "Enter Your Phone Number",
    name: "phone_number",
    error: false,
  },
  {
    label: "Gender",
    type: "radio",
    name: "gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
    error: false,
  },
];

const initialValue = {
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  gender: "",
};

export default function AdminEditPatient() {
  const [inputs, setInputs] = useState(inputsArr);
  const [inputValues, setInputValues] = useState<Inputs>(initialValue);
  const valid = isPhoneValid(inputValues?.phone_number);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = (e: any) => {
    setInputValues((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const setFieldError = (fieldName?: string) => {
    let updatedInputs;
    if (fieldName) {
      updatedInputs = inputs.map((input) => ({
        ...input,
        error: input.name === fieldName,
      }));
    } else {
      updatedInputs = inputs.map((input) => ({
        ...input,
        error: inputValues[input.name] === "",
      }));
    }
    setInputs(updatedInputs);
  };

  const createPatient = async (data: any) => {
    const { id, ...other } = data;
    console.log(other);
    return publicRequest
      .post("/graphql", {
        query: UPDATE_PATIENT_QUERY,
        variables: { id, data: other },
      })
      .then((response) => response?.data?.data?.updatePatient);
  };

  const { data, mutate } = useMutation(createPatient);

  const handleUpdate = () => {
    mutate(inputValues);
    console.log(inputValues);
  };

  console.log(data);
  useEffect(() => {
    if (data) {
      setInputValues(initialValue);
      if (data?.email) {
        notifySuccess("Patient Edit Success.");
        queryClient.invalidateQueries({
          queryKey: ["adminPatients"],
        });
        setTimeout(() => {
          navigate("/admin-dashboard/patients");
        }, 1000);
      } else {
        notifyFailure(data?.error || "Patient Edit Failure");
      }
      dispatch(loadingEnd());
    }
  }, [data]);

  const handleValidation = async () => {
    dispatch(loadingStart());
    if (patientData?.data?.email !== inputValues?.email) {
      const email = await patientEmail.refetch();
      if (email?.data?.id) {
        notifyFailure("Email Already Exists!");
        setFieldError("email");
      } else {
        handleUpdate();
      }
    } else {
      handleUpdate();
    }
    dispatch(loadingEnd());
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (Object.values(inputValues).every((value) => value !== "")) {
      if (!valid) {
        notifyFailure("Phone Number is not valid!");
        setFieldError("phone_number");
      } else {
        handleValidation();
        console.log("validate");
      }
    } else {
      setFieldError();
      notifyFailure("Please fill all fields!");
    }
  };

  const checkPatientEmail = async () => {
    return publicRequest
      .post("/graphql", {
        query: EXISTING_PATIENT_QUERY,
        variables: { email: inputValues?.email },
      })
      .then((response) => response?.data?.data?.findPatientByEmail);
  };

  const patientEmail = useQuery({
    queryFn: checkPatientEmail,
    enabled: false,
  });

  const getPatient = async () => {
    return publicRequest
      .post("/graphql", {
        query: GET_PATIENT_QUERY,
        variables: { id },
      })
      .then((response) => response?.data?.data?.findPatientById);
  };

  const patientData = useQuery({
    queryKey: ["adminPatients", id],
    queryFn: getPatient,
  });

  useEffect(() => {
    setInputValues(patientData?.data);
  }, [patientData?.data]);

  return (
    <DashboardSection title="Edit Patient">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-x-4 gap-y-0">
          {inputs?.map((input) => (
            <div className="col-span-6">
              {input.type === "radio" ? (
                <RadioInput
                  label={input?.label}
                  name={input?.name}
                  options={input?.options}
                  onChange={handleChange}
                  error={input.error}
                  selected={`${inputValues?.[input.name]}`}
                />
              ) : input.type === "number" ? (
                <PhoneInputComp
                  error={input.error}
                  onChange={(e) => {
                    setInputValues((prev) => ({
                      ...prev,
                      phone_number: e,
                    }));
                  }}
                  value={`${inputValues?.[input.name]}`}
                />
              ) : (
                <InputField
                  label={input.label}
                  name={input.name}
                  type={input.type}
                  placeholder={input.placeholder}
                  onChange={handleChange}
                  value={`${inputValues?.[input.name]}`}
                  error={input.error}
                />
              )}
            </div>
          ))}
        </div>
        <div className="w-48 mx-auto mt-4">
          <button className="form-btn">Submit</button>
        </div>
      </form>
      <Toaster />
    </DashboardSection>
  );
}

interface Inputs {
  [key: string]: string | string[] | boolean;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
}
