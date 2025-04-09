import { Button, DashboardSection, Modal } from "../../../../components";
import testlogo from "../../../../assets/labprofile/testlogo.png";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  FindAppointmentById,
  UpdateLabAppointmentStatus,
} from "../../../../api/apiCalls/labApi";
import {
  FIND_APPOINTMENT_BY_ID,
  UPDATE_LAB_APPOINTMENT_STATUS,
} from "./queries";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { notifyFailure, notifySuccess } from "../../../../utils/Utils";
import { RootState } from "../../../../redux/store";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { LabTestWrapper } from "../../../../api/apiCalls/types";

const LabPatientProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const idredux = useSelector((state: RootState) => state.user.currentUser?.id);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCancelAppointment = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedReason("");
    setCustomReason("");
    setError("");
  };

  const onSubmit = () => {
    if (!selectedReason) {
      setError("Please select a cancellation reason.");
      return;
    }

    if (selectedReason === "Custom" && !customReason) {
      setError("Please enter a custom reason.");
      return;
    }

    if (customReason && customReason.length < 5) {
      setError("Custom reason must be at least 5 characters long.");
      return;
    }

    mutate({
      AppointmentID: Number(id),
      status: "Cancelled",
      message: selectedReason === "Custom" ? customReason : selectedReason,
    });
    handleModalClose();
  };

  const radioOptions = [
    { label: "Test Not Required", value: "Test Not Required" },
    { label: "Patient Unable to Attend", value: "Patient Unable to Attend" },
    { label: "Rescheduled", value: "Rescheduled" },
    { label: "Technical Issues", value: "Technical Issues" },
    { label: "Custom", value: "Custom" },
  ];

  const FindAppointment = async () => {
    if (!id) return;
    return FindAppointmentById(FIND_APPOINTMENT_BY_ID, {
      findLabAppointmentByIdId: Number(id),
    });
  };

  const { data } = useQuery({
    queryKey: ["patientappointmentbyid", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return FindAppointment();
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error?.message || "Something went wrong!");
    },
  });

  console.log("ddddd", data);

  const updatelabstatus = (
    AppointmentID: number,
    status: string,
    message?: string,
  ) => {
    return UpdateLabAppointmentStatus(UPDATE_LAB_APPOINTMENT_STATUS, {
      updateLabAppointmentStatusId: AppointmentID,
      status: status,
      message: message,
    });
  };

  const { mutate } = useMutation({
    mutationFn: ({
      AppointmentID,
      status,
      message,
    }: {
      AppointmentID: number;
      status: string;
      message?: string;
    }) => updatelabstatus(AppointmentID, status, message),
    onMutate: () => {
      dispatch(loadingStart());
    },
    onSuccess: () => {
      dispatch(loadingEnd());
      notifySuccess("Appointment Status Updated!");
      queryClient.invalidateQueries(["patientappointment", idredux, "Pending"]);
      queryClient.invalidateQueries([
        "patientappointment",
        idredux,
        "Approved",
      ]);
      queryClient.invalidateQueries([
        "patientappointment",
        idredux,
        "Cancelled",
      ]);
      navigate(-1);
    },
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error?.message || "Something went wrong!");
    },
  });

  return (
    <DashboardSection title="View Test Details">
      <div className="flex flex-wrap justify-between">
        <div className="w-full lg:w-3/5">
          <div className="w-3/4 flex items-center justify-between p-3 mb-2 border border-gray-300 rounded-lg bg-white mt-4">
            <img
              src={testlogo}
              alt="profile"
              className="rounded-full w-12 h-12"
            />
            <div className="flex-1 ml-4">
              <div className="font-bold">{data?.patient_name}</div>
              <div>{data?.labTest?.title}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="mr-3 my-1 text-sm text-gray-600 text-primary">
                {data?.appointment_weekday}, {data?.appointment_date}
              </div>
              <div className="flex justify-center items-center gap-1">
                <div className="flex items-center justify-center w-6 h-6 text-sm text-white bg-red-500 rounded-full">
                  {data?.labTests?.length ?? []}
                </div>
              </div>
            </div>
          </div>

          <div className="w-3/4 p-3 border border-gray-300 rounded-lg bg-white-50 mt-1 text-sm">
            <div>
              <strong>Name:</strong> {data?.patient_name}
            </div>
            <div>
              <strong>Email:</strong> {data?.patient_email}
            </div>
            <div>
              <strong>Phone:</strong> {data?.patient_phone_number}
            </div>
            <div>
              <strong>Age:</strong> {data?.patient_age}
            </div>
            <div>
              <strong>Gender:</strong> {data?.patient_gender}
            </div>
            <div>
              <strong>Status:</strong> {data?.status}
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <Button
                onClick={handleCancelAppointment}
                title="Cancel"
                className="rounded-lg"
              />
              <Button
                onClick={() =>
                  mutate({ AppointmentID: Number(id), status: "Approved" })
                }
                title="Confirm Now"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {data?.labTests?.map((item: LabTestWrapper, index: number) => {
          const test = item.labTest;
          return (
            <div
              key={index}
              className="w-full lg:w-2/5 bg-white p-8 border-2 border-[#3FB946] rounded-3xl mt-5"
            >
              <h3 className="text-2xl font-bold text-[#3FB946] mb-4">
                Your Cart &nbsp;
                <span className="text-lg text-[#3FB946]">{index + 1} Test</span>
              </h3>

              <div className="pb-2 mb-2">
                <div className="flex justify-between border-y border-y-gray-500 py-2.5">
                  <span>{test?.title}</span>
                  <span className="">${test?.price}</span>
                </div>

                <p className="text-primary text-gray-600 mt-4">Preparation</p>
                <p className="text-primary text-gray-600 leading-5">
                  {test?.description}
                </p>
              </div>

              <div className="flex justify-evenly w-64 py-2 m-auto mt-5 font-bold text-lg border-2 border-[#3FB946] rounded-xl">
                <span className="text-[#3FB946]">Total</span>
                <span className="text-[#3FB946]">${test?.price}</span>
              </div>
            </div>
          );
        })}

        <Modal
          showModal={showModal}
          setModal={setShowModal}
          title="Cancel Lab Appointment"
        >
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold mb-4">
              Select Cancellation Reason
            </h3>

            <div className="flex flex-col space-y-3 mb-4">
              {radioOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={option.value}
                    checked={selectedReason === option.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="form-radio"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>

            {selectedReason === "Custom" && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter your custom reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="mt-2 p-2 border rounded w-full"
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <Button className="w-full mt-4" title="Submit" onClick={onSubmit} />
          </div>
        </Modal>
      </div>
      <Toaster />
    </DashboardSection>
  );
};

export default LabPatientProfile;
