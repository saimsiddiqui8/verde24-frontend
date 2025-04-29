import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { DashboardSection, Modal } from "../../../../components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { stripePayment } from "../../../../api/apiCalls/doctorsApi";
import { CREATE_PAYMENT } from "../../../DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";
import { notifyFailure, notifySuccess } from "../../../../utils/Utils";
import { Toaster } from "react-hot-toast";
import { deleteLabBooking } from "../../../../redux/slices/LabBooking";
import {
  DeleteAllCard,
  LabAppointmentBooking,
} from "../../../../api/apiCalls/patientsApi";
import {
  DELETE_ALL_CARD,
  LAB_APPOINTMENT_BOOKING,
} from "../patientProfile/queries";
import { labAppointmentTypeCheckout } from "../../../../api/apiCalls/types";
import clock from "../../../../assets/clock.png";
import calender from "../../../../assets/calendar.png";
import bar from "../../../../assets/bar.png";
import { useMutation, useQueryClient } from "react-query";
const CheckoutLab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const patientId = useSelector(
    (state: RootState) => state.user.currentUser?.id,
  );
  const labBooking = useSelector((state: RootState) => state.Labbooking);
  const {
    labTests,
    currency,
    appointment_date,
    appointment_time,
    appointment_weekday,
    lab_id,
    patient_email,
    patient_age,
    patient_gender,
    patient_id,
    patient_name,
    patient_phone_number,
  } = labBooking;
  const queryClient = useQueryClient();
  const [skipValidation, setSkipValidation] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (skipValidation) return;
    if (
      !currency ||
      !appointment_date ||
      !appointment_time ||
      !appointment_weekday ||
      !lab_id ||
      !patient_email ||
      !patient_age ||
      !patient_id ||
      !patient_name ||
      !patient_phone_number
    ) {
      dispatch(deleteLabBooking());
      navigate("/patient-dashboard/book-lab-test");
      return;
    }
  }, [
    dispatch,
    currency,
    appointment_date,
    appointment_time,
    appointment_weekday,
    lab_id,
    patient_email,
    patient_age,
    patient_id,
    patient_name,
    patient_phone_number,
    skipValidation,
  ]);

  const amount = labTests?.reduce((acc, test) => acc + (test?.price || 0), 0);

  const stripe = useStripe();
  const elements = useElements();

  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        lineHeight: "24px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };
  const testIds = labTests
    .map((test) => test.id)
    .filter((id): id is number => id !== null && id !== undefined);

  const handleCreateAppointment = async (data: labAppointmentTypeCheckout) => {
    const response = await LabAppointmentBooking(LAB_APPOINTMENT_BOOKING, {
      data,
    });
    setShowModal(true);
    return response;
  };

  const handleCreatePayment = async (paymentMethodId: string) => {
    const paymentData = {
      amount: amount ?? null,
      currency: currency ?? null,
      payment_method: paymentMethodId,
      patient_id: patientId,
    };

    const response = await stripePayment(CREATE_PAYMENT, {
      data: paymentData,
    });

    if (response?.message === "Amount has been deducted from wallet!") {
      setPaymentId(response.message);
      const appointmentData: labAppointmentTypeCheckout = {
        appointment_date: appointment_date,
        appointment_time: appointment_time,
        appointment_weekday: appointment_weekday,
        lab_id: lab_id,
        patient_email: patient_email,
        patient_age: patient_age,
        patient_gender: patient_gender,
        patient_id: patient_id,
        patient_name: patient_name,
        patient_phone_number: patient_phone_number,
        labTests: testIds,
      };
      appointmentMutate(appointmentData);
    } else if (response?.payment?.id) {
      setPaymentId(response.payment.id);
      const appointmentData: labAppointmentTypeCheckout = {
        appointment_date: appointment_date,
        appointment_time: appointment_time,
        appointment_weekday: appointment_weekday,
        lab_id: lab_id,
        patient_email: patient_email,
        patient_age: patient_age,
        patient_gender: patient_gender,
        patient_id: patient_id,
        patient_name: patient_name,
        patient_phone_number: patient_phone_number,
        labTests: testIds,
        payment_id: parseInt(response.payment.id),
      };
      appointmentMutate(appointmentData);
    } else {
      throw new Error("Payment processing failed");
    }
  };

  const { mutate } = useMutation({
    mutationFn: handleCreatePayment,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      notifySuccess("Payment successful!");
    },
    onError: (error: Error) => {
      notifyFailure(error.message || "Payment processing failed");
      console.error("Payment error:", error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const { mutate: appointmentMutate } = useMutation({
    mutationFn: handleCreateAppointment,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      notifySuccess("Appointment successful!");
    },
    onError: (error: Error) => {
      notifyFailure(error.message || "Appointment processing failed");
      console.error("Appointment error:", error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (cardElement == null) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      notifyFailure(`${error.message}`);
      return;
    }

    if (paymentMethod) {
      mutate(paymentMethod.id);
    }
  };

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        handleModalClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const handleModalClose = async () => {
    setSkipValidation(true);
    setShowModal(false);
    if (testIds?.length > 1) {
      await DeleteAllCard(DELETE_ALL_CARD, { patientId: patientId });
      queryClient.invalidateQueries(["patientcard", patientId]);
    }
    dispatch(deleteLabBooking());
    navigate("/patient-dashboard/treatment-labs");
  };

  const handlecancel = () => {
    dispatch(deleteLabBooking());
    navigate("/patient-dashboard/book-lab-test");
  };
  return (
    <DashboardSection>
      <div className="checkout-container flex flex-col justify-center items-center">
        <div className="w-full bg-white border-primary border p-5 rounded-lg my-3 shadow-md">
          <h3 className="text-3xl font-bold mb-4">Appointment Details</h3>
          <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
            <div className="flex items-center space-x-4 ms-3">
              <img src={calender} alt="Calendar icon" />
              <h4 className="text-lg">Date</h4>
            </div>
            <p className="text-primary text-lg text-center flex-1">
              {appointment_date ?? "No Data"}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
            <div className="flex items-center space-x-4 ms-3">
              <img src={bar} alt="Bar icon" />
              <h4 className="text-lg">Day</h4>
            </div>
            <p className="text-primary text-lg text-center flex-1">
              {appointment_weekday ?? "No Data"}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
            <div className="flex items-center space-x-4 ms-3">
              <img src={clock} alt="Clock icon" />
              <h4 className="text-lg">Time</h4>
            </div>
            <p className="text-primary text-lg text-center flex-1">
              {appointment_time ?? "No Data"}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
            <div className="flex items-center space-x-4 ms-3">
              <img src={bar} alt="Money icon" />{" "}
              <h4 className="text-lg">Amount</h4>
            </div>
            <p className="text-primary text-lg text-center flex-1">
              {amount ?? "No Data"}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
            <div className="flex items-center space-x-4 ms-3">
              <img src={bar} alt="Currency icon" />{" "}
              <h4 className="text-lg">Currency</h4>
            </div>
            <p className="text-primary text-lg text-center flex-1">
              {currency ?? "No Data"}
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={handlecancel}
              className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] text-[#41BC63] px-8 py-2 rounded-[15px]"
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="checkout-box w-full max-w-md bg-white p-6 shadow-md rounded-lg mt-3">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Checkout
          </h2>
          <form
            className="border border-gray-300 p-4 rounded"
            onSubmit={handleSubmit}
          >
            <div className="stripe-card-element mb-4">
              <CardElement options={cardElementOptions} />
            </div>

            {isLoading ? (
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8l3.5-3.5L12 0l-8 8 3.5 3.5H0z"
                  ></path>
                </svg>
              </div>
            ) : (
              <div className="text-center">
                <button
                  className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] text-[#41BC63] px-8 py-2 rounded-[15px]"
                  type="submit"
                >
                  pay now
                </button>
              </div>
            )}
          </form>

          {showModal && (
            <Modal
              title="PAYMENT"
              showModal={showModal}
              setModal={() => setShowModal(false)}
            >
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-4">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your payment was successful. Here is your payment ID:
                </p>
                <p className="text-lg font-bold text-green-600 mb-6">
                  {paymentId}
                </p>
                <p className="text-lg font-bold text-green-600 mb-6">
                  Redirecting...
                </p>
              </div>
            </Modal>
          )}
        </div>
      </div>
      <Toaster />
    </DashboardSection>
  );
};

export default CheckoutLab;
