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
import { LAB_QUERY, UPDATE_BANNED_LAB } from "./queries";

export default function AdminLabsProfile() {
  const [verified, setVerified] = useState(false);
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : undefined;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const getLab = async () => {
    return publicRequest
      .post("/graphql", {
        query: LAB_QUERY,
        variables: { findLabByIdId: numericId },
      })
      .then((response) => response?.data?.data?.findLabById);
  };

  const labData = useQuery({
    queryKey: ["adminLabs", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getLab();
    },
    onSuccess: () => dispatch(loadingEnd()),
  });

  useEffect(() => {
    setVerified(labData?.data?.is_verified);
  }, [labData.data]);

  const updateLab = async (data: { is_verified: boolean }) => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: UPDATE_BANNED_LAB,
        variables: { updateLabId: Number(id), data },
      });
      return response?.data?.data?.updateLab;
    } catch (error) {
      console.error("Error creating doctor:");
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
            notifySuccess("Lab Banned!");
            queryClient.invalidateQueries({ queryKey: ["adminLabs"] });
          } else {
            notifySuccess("Lab Unbanned!");
            queryClient.invalidateQueries({ queryKey: ["adminLabs"] });
          }
        },
        onError: () => {
          notifyFailure("Error updating Lab!");
        },
      },
    );
  };

  if (!labData?.data) {
    return (
      <DashboardSection title="Lab Profile">
        <div className="h-48 flex flex-col justify-center items-center gap-2">
          <h2 className="text-2xl font-medium">No Lab Found!</h2>
          <div className="w-48">
            <button
              className="form-btn"
              onClick={() => navigate("/admin-dashboard/labs")}
            >
              Go to labs
            </button>
          </div>
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection title={labData?.data?.lab_name}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">Lab Image:</span>
          <div className="flex items-center gap-4">
            {labData?.data?.logo ? (
              <ImageUrl
                fileKey={labData?.data?.logo}
                className="w-24 h-24 rounded-md shadow-md"
              />
            ) : (
              <span className="font-bold text-primary">Not updated</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">Lab Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs w-max ${
              labData?.data?.is_verified
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {labData?.data?.is_verified ? "Lab is Banned" : "Not Banned"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">Lab Name:</span>
          <span className="font-bold text-primary">
            {labData?.data?.lab_name || "Not updated"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">Owner Name:</span>
          <span className="font-bold text-primary">
            {labData?.data?.name || "Not updated"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="font-bold text-primary">
            {labData?.data?.email || "Not updated"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">Phone Number:</span>
          <span className="font-bold text-primary">
            {labData?.data?.phone_number || "Not updated"}
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
            {labData?.data?.registration_number || "Not updated"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">City:</span>
          <span className="font-bold text-primary">
            {labData?.data?.city || "Not updated"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-gray-700">Location:</span>
          <span className="font-bold text-primary">
            {labData?.data?.place_name || "Not updated"}
          </span>
        </div>
      </div>

      <Toaster />
    </DashboardSection>
  );
}
