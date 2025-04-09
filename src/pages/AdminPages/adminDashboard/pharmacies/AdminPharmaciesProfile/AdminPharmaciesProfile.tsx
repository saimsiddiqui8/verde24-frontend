import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { publicRequest } from "../../../../../api/requestMethods";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";
import { notifyFailure, notifySuccess } from "../../../../../utils/Utils";
import { DashboardSection } from "../../../../../components";
import ImageUrl from "../../../../../components/Icons/Sidemenu/ImageUrl";
import { PHARMACY_QUERY, UPDATE_BANNED_PHARMACY } from "./queries";

export default function AdminPharmaciesProfile() {
  const [verified, setVerified] = useState(false);
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : undefined;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const getPharmacy = async () => {
    return publicRequest
      .post("/graphql", {
        query: PHARMACY_QUERY,
        variables: { findPharmacyByIdId: numericId },
      })
      .then((response) => response?.data?.data?.findPharmacyById);
  };

  const pharmacyData = useQuery({
    queryKey: ["adminPharmacies", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getPharmacy();
    },
    onSuccess: () => dispatch(loadingEnd()),
  });

  useEffect(() => {
    setVerified(pharmacyData?.data?.is_verified);
  }, [pharmacyData.data]);

  const updateLab = async (data: { is_verified: boolean }) => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: UPDATE_BANNED_PHARMACY,
        variables: { updatePharmacyId: Number(id), data },
      });
      return response?.data?.data?.updatePharmacy;
    } catch (error) {
      console.error("Error creating updatePharmacy:");
      throw error;
    }
  };

  const verify = useMutation(updateLab);

  const handleVerify = () => {
    setVerified((prev) => !prev);
    verify.mutate(
      { is_verified: !verified },
      {
        onSuccess: () => {
          if (!verified) {
            notifySuccess("Pharmacy Banned!");
            queryClient.invalidateQueries({ queryKey: ["adminPharmacies"] });
          } else {
            notifySuccess("Pharmacy Unbanned!");
            queryClient.invalidateQueries({ queryKey: ["adminPharmacies"] });
          }
        },
        onError: () => {
          notifyFailure("Error updating Pharmacy!");
        },
      },
    );
  };

  if (!pharmacyData?.data) {
    return (
      <DashboardSection title="Lab Profile">
        <div className="h-48 flex flex-col justify-center items-center gap-2">
          <h2 className="text-2xl font-medium">No Pharmacy Found!</h2>
          <div className="w-48">
            <button
              className="form-btn"
              onClick={() => navigate("/admin-dashboard/pharmacies")}
            >
              Go to Pharmacy
            </button>
          </div>
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection title={pharmacyData?.data?.pharmacy_name}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">pharmacy Image:</span>
          <div className="flex items-center gap-4">
            {pharmacyData?.data?.logo ? (
              <ImageUrl
                fileKey={pharmacyData?.data?.logo}
                className="w-24 h-24 rounded-md shadow-md"
              />
            ) : (
              <span className="font-bold text-primary">Not updated</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">pharmacy Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs w-max ${
              pharmacyData?.data?.is_verified
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {pharmacyData?.data?.is_verified
              ? "pharmacy is Banned"
              : "Not Banned"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">pharmacy Name:</span>
          <span className="font-bold text-primary">
            {pharmacyData?.data?.pharmacy_name || "Not updated"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">Owner Name:</span>
          <span className="font-bold text-primary">
            {pharmacyData?.data?.name || "Not updated"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="font-bold text-primary">
            {pharmacyData?.data?.email || "Not updated"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">Phone Number:</span>
          <span className="font-bold text-primary">
            {pharmacyData?.data?.phone_number || "Not updated"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">
            Verification Status:
          </span>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={verified}
                onChange={() => handleVerify()}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
            <span className="font-bold text-primary">
              {verified ? "Unbanned" : "Banned"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">
            Registration Number:
          </span>
          <span className="font-bold text-primary">
            {pharmacyData?.data?.registration_number || "Not updated"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">City:</span>
          <span className="font-bold text-primary">
            {pharmacyData?.data?.city || "Not updated"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">Location:</span>
          <span className="font-bold text-primary">
            {pharmacyData?.data?.place_name || "Not updated"}
          </span>
        </div>
      </div>

      <Toaster />
    </DashboardSection>
  );
}
