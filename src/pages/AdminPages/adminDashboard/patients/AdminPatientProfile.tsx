import { Link, useNavigate, useParams } from "react-router-dom";
import { DashboardSection } from "../../../../components";
import { publicRequest } from "../../../../api/requestMethods";
import { useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";

const PATIENT_QUERY = `
query($id: Int!) {
  findPatientById(id: $id) {
    id,
    first_name,
    last_name,
    email,
    phone_number,
    gender,
    is_verified
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

export default function AdminPatientProfile() {
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
        variables: { id: numericId },
      })
      .then((response) => response.data.data.findPatientById);
  };

  const patientData = useQuery({
    queryKey: ["adminPatients", id],
    queryFn: getPatient,
  });

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
          <span className="whitespace-nowrap">Name:</span>
          <span>
            {patientData?.data?.first_name + " " + patientData?.data?.last_name}
          </span>
        </div>
        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Email:</span>
          <span>{patientData?.data?.email}</span>
        </div>
        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Phone Number:</span>
          <span>{patientData?.data?.phone_number}</span>
        </div>
        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Gender:</span>
          <span>{patientData?.data?.gender}</span>
        </div>
        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span className="whitespace-nowrap">Wallet:</span>
          <span>{patientData?.data?.wallet}</span>
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
    </DashboardSection>
  );
}
