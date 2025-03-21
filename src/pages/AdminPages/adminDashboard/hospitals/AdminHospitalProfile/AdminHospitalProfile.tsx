import {  useNavigate, useParams } from "react-router-dom";
import { DashboardSection } from "../../../../../components";
import { publicRequest } from "../../../../../api/requestMethods";
import { useQuery } from "react-query";
import { HOSPITAL_QUERY } from "./queries";
import { useDispatch } from "react-redux";
import { loadingEnd, loadingStart } from "../../../../../redux/slices/loadingSlice";

export default function AdminHospitalProfile() {
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : undefined;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getHospital = async () => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: HOSPITAL_QUERY,
        variables: { id: numericId },
      });
      return response.data.data.findHospitalById;
    } catch (error) {
      console.error("Error fetching hospital:", error);
      throw error;
    }
  };

  const hospitalData = useQuery({
    queryKey: ["adminHospitals", id],
     queryFn: async () => {
              dispatch(loadingStart());
              return getHospital();
            },
            onSuccess: ()=> dispatch(loadingEnd()),
  });


  if (!hospitalData?.data) {
    return (
      <DashboardSection title="">
        <div className="h-48 flex flex-col justify-center items-center gap-2">
          <h2 className="text-2xl font-medium">No Hospital Found!</h2>
          <div className="w-48">
            <button
              className="form-btn"
              onClick={() => navigate("/admin-dashboard/hospitals")}
            >
              Go to hospitals
            </button>
          </div>
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection title={hospitalData?.data?.name}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span>Name:</span>
          <span>{hospitalData?.data?.name}</span>
        </div>
        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span>Location:</span>
          <span>{hospitalData?.data?.location}</span>
        </div>
        <div className="flex flex-col lg:flex-row items-start justify-start text-xs font-bold gap-2">
          <span>Phone Number:</span>
          <span>{hospitalData?.data?.phone_number}</span>
        </div>
      </div>
    </DashboardSection>
  );
}
