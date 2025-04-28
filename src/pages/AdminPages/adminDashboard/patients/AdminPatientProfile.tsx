import { Link, useNavigate, useParams } from "react-router-dom";
import { DashboardSection } from "../../../../components";
import { publicRequest } from "../../../../api/requestMethods";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import ImageUrl from "../../../../components/Icons/Sidemenu/ImageUrl";
import { notifyFailure, notifySuccess } from "../../../../utils/Utils";
import { Toaster } from "react-hot-toast";

const PATIENT_QUERY = `
query FindPatientById($findPatientByIdId: Int!) {
  findPatientById(id: $findPatientByIdId) {
    id
    first_name
    last_name
    image
    email
    phone_number
    gender
    is_verified
    insurance_id
    age
    weight
    blood_group
    other_history
    wallet
  }
}
`;

const incrementWallet = `
mutation IncrementPatientWallet($data: IncrementWallet!) {
incrementPatientWallet(data: $data) {
id
wallet
}
}`;

const updateBanned = `
mutation UpdatePatient($updatePatientId: Int!, $data: PatientInputUpdate!) {
  updatePatient(id: $updatePatientId, data: $data) {
    id
    is_verified
  }
}`;
export default function AdminPatientProfile() {
  const [verified, setVerified] = useState(false);
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : undefined;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [walletIncrement, setWalletIncrement] = useState("");

  const handleIncrementWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const incrementValue = parseFloat(walletIncrement);
    if (!isNaN(incrementValue)) {
      dispatch(loadingStart());
      try {
        await publicRequest.post("/graphql", {
          query: incrementWallet,
          variables: {
            data: {
              patient_id: numericId,
              amount: incrementValue,
            },
          },
        });
        setWalletIncrement("");
        queryClient.invalidateQueries({
          queryKey: ["adminPatients", id],
        });
        dispatch(loadingEnd());
      } catch (error) {
        console.error("Error updating wallet:", error);
      }
    }
  };

  const getPatient = async () => {
    return publicRequest
      .post("/graphql", {
        query: PATIENT_QUERY,
        variables: { findPatientByIdId: numericId },
      })
      .then((response) => response?.data?.data?.findPatientById);
  };

  const patientData = useQuery({
    queryKey: ["adminPatients", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getPatient();
    },
    onSuccess: () => dispatch(loadingEnd()),
  });

  useEffect(() => {
    setVerified(patientData?.data?.is_verified);
  }, [patientData.data]);

  const updatePatient = async (data: { is_verified: boolean }) => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: updatebanned,
        variables: { updatePatientId: Number(id), data },
      });
      return response?.data?.data?.updatePatient;
    } catch (error) {
      console.error("Error creating doctor:");
      throw error;
    }
  };

  const verify = useMutation(updatePatient);

  const handleVerify = () => {
    setVerified((prev) => !prev);
    verify.mutate(
      { is_verified: !verified },
      {
        onSuccess: () => {
          if (!verified) {
            notifySuccess("Patient Banned!");
            queryClient.invalidateQueries({ queryKey: ["adminPatients"] });
          } else {
            notifySuccess("Patient Unbanned!");
            queryClient.invalidateQueries({ queryKey: ["adminPatients"] });
          }
        },
        onError: () => {
          notifyFailure("Error updating Patient!");
        },
      },
    );
  };

  if (!patientData?.data) {
    return (
      <DashboardSection title="">
        <div className="h-48 flex flex-col justify-center items-center gap-2">
          <h2 className="text-2xl font-medium">No Patient Found!</h2>
          <div className="w-48">
            <button
              className="form-btn"
              onClick={() => navigate("/admin-dashboard/patients")}
            >
              Go to patients
            </button>
          </div>
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection
      title={patientData?.data?.first_name + " " + patientData?.data?.last_name}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-2">
        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span>Image:</span>
          <span>
            {patientData?.data?.image ? (
              <ImageUrl
                fileKey={patientData?.data?.image}
                className="w-24 h-24"
              />
            ) : (
              "Not updated"
            )}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span>Banned:</span>
          <span>
            {patientData?.data?.is_verified
              ? "Patient is banned"
              : "Not banned"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Name:</span>
          <span>
            {patientData?.data?.first_name || patientData?.data?.last_name
              ? patientData?.data?.first_name +
                " " +
                patientData?.data?.last_name
              : "Not updated"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Email:</span>
          <span>{patientData?.data?.email || "Not updated"}</span>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Phone Number:</span>
          <span>{patientData?.data?.phone_number || "Not updated"}</span>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Gender:</span>
          <span>{patientData?.data?.gender || "Not updated"}</span>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span>{patientData?.data?.is_verified ? "Unbanned" : "Banned"}:</span>
          <label className="relative inline-flex flex-col lg:flex-row items-start justify-start text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={verified}
              onChange={() => handleVerify()}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Wallet:</span>
          <span>{patientData?.data?.wallet || "Not updated"}</span>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Insurance_id:</span>
          <span>{patientData?.data?.insurance_id || "Not updated"}</span>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Age:</span>
          <span>
            {patientData?.data?.age ? patientData?.data?.age : "Not updated"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Weight:</span>
          <span>
            {patientData?.data?.weight
              ? patientData?.data?.weight
              : "Not updated"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Blood_group:</span>
          <span>{patientData?.data?.blood_group || "Not updated"}</span>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Other History:</span>
          <span>{patientData?.data?.other_history || "Not updated"}</span>
        </div>
      </div>

      <div className="w-4/5 sm:w-48 mx-auto mt-6">
        <Link to={`/admin-dashboard/patients/edit/${patientData?.data?.id}`}>
          <button className="form-btn w-full sm:w-auto">Edit Patient</button>
        </Link>
      </div>

      <div className="w-full walled mt-6">
        <form onSubmit={handleIncrementWallet}>
          <div className="flex flex-col sm:flex-row items-start justify-start text-xs font-bold gap-2">
            <span className="whitespace-nowrap">Add to Wallet:</span>
            <input
              type="number"
              name="walletIncrement"
              className="block px-2.5 text-sm text-primary placeholder:text-blue-600 bg-transparent rounded-lg border border-primary appearance-none focus:outline-none peer"
              placeholder="Enter amount"
              value={walletIncrement}
              onChange={(e) => setWalletIncrement(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <button type="submit" className="form-btn">
              Add Amount
            </button>
          </div>
        </form>
      </div>

      <Toaster />
    </DashboardSection>
  );
}
