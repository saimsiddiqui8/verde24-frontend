import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button, DashboardSection, Modal } from "../../../../components";
import { useNavigate } from "react-router-dom";
import { CreateAppointmentType, Doctor } from "../../../../api/apiCalls/types";
import { useEffect, useState } from "react";
import { RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import {
  getDoctorById,
  stripePayment,
} from "../../../../api/apiCalls/doctorsApi";
import {
  GET_DOCTOR_QUERY,
  CREATE_PAYMENT,
  CREATE_APPOINTMENT,
} from "../../../DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";
import { notifyFailure } from "../../../../utils/Utils";
import { createAppointment } from "../../../../api/apiCalls/patientsApi";
import { deleteBooking } from "../../../../redux/slices/bookingSlice";
import clock from "../../../../assets/clock.png";
import calender from "../../../../assets/calendar.png";
import bar from "../../../../assets/bar.png";

const Checkout = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const patientId = useSelector(
    (state: RootState) => state.user.currentUser?.id,
  );
  const booking = useSelector((state: RootState) => state.booking);
  const { id, amount, currency, selectedDate, selectedDay, selectedTime } =
    booking;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedDate || !selectedDay || !selectedTime) {
      navigate(-1);
      return;
    }

    if (!id) {
      dispatch(loadingStart());
      return;
    }

    const fetchDoctor = async () => {
      dispatch(loadingStart());
      try {
        const doctorData = await getDoctorById(GET_DOCTOR_QUERY, {
          findDoctorByIdId: id,
        });
        setDoctor(doctorData);
        dispatch(loadingEnd());
      } catch (err: any) {
        notifyFailure(err.toString());
      }
    };

    fetchDoctor();
  }, [id, dispatch, selectedDate, selectedDay, selectedTime]);

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

  const handleCreateAppointment = async (payId?: string) => {
    const appointmentData: CreateAppointmentType = {
      appointment_date: selectedDate?.fullDate,
      appointment_time: selectedTime,
      patient_id: patientId,
      doctor_id: id,
      duration: 60,
    };

    if (payId) {
      appointmentData.payment_id = parseInt(payId);
    }

    try {
      await createAppointment(CREATE_APPOINTMENT, {
        data: appointmentData,
      });

      setShowModal(true);
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePayment = async (paymentMethodId: string) => {
    const paymentData = {
      amount: amount,
      currency: currency,
      payment_method: paymentMethodId,
      patient_id: patientId,
    };

    try {
      setIsLoading(true);
      const response = await stripePayment(CREATE_PAYMENT, {
        data: paymentData,
      });
      if (response?.message == "Amount has been deducted from wallet!") {
        setPaymentId(response?.message);
        await handleCreateAppointment();
      } else if (response?.payment?.id) {
        setPaymentId(response.payment.id);
        await handleCreateAppointment(response?.payment?.id);
      } else {
        throw new Error("Payment processing failed");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      console.log(error.message);
      return;
    }

    if (paymentMethod) {
      console.log("pay", paymentMethod.id);

      await handleCreatePayment(paymentMethod.id);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    dispatch(deleteBooking());
    navigate("/patient-dashboard/treatment-plans");
  };

  return (
    <DashboardSection>
      <div className="checkout-container flex flex-col justify-center items-center">
        {/* Doctor Details Section */}
        {doctor && (
          <div className="w-full bg-white border-primary border p-5 rounded-lg my-3 shadow-md">
            <h3 className="text-3xl font-bold mb-4">Appointment Details</h3>

            {/* Doctor's Name */}
            <div className="doctor-info text-center md:text-left mb-4 py-3 bg-[#E7EDF9]">
              <h2 className="text-lg font-bold text-primary-800 ms-4">
                Doctor: {doctor.first_name} {doctor.last_name}
              </h2>
            </div>

            {/* Date Slot */}
            <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
              <div className="flex items-center space-x-4 ms-3">
                <img src={calender} alt="Calendar icon" />
                <h4 className="text-lg">Date</h4>
              </div>
              <p className="text-primary text-lg text-center flex-1">
                {selectedDate?.fullDate ?? "No Data"}
              </p>
            </div>

            {/* Day Slot */}
            <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
              <div className="flex items-center space-x-4 ms-3">
                <img src={bar} alt="Bar icon" />
                <h4 className="text-lg">Day</h4>
              </div>
              <p className="text-primary text-lg text-center flex-1">
                {selectedDay ?? "No Data"}
              </p>
            </div>

            {/* Time Slot */}
            <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
              <div className="flex items-center space-x-4 ms-3">
                <img src={clock} alt="Clock icon" />
                <h4 className="text-lg">Time</h4>
              </div>
              <p className="text-primary text-lg text-center flex-1">
                {selectedTime ?? "No Data"}
              </p>
            </div>

            {/* Amount Slot */}
            <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
              <div className="flex items-center space-x-4 ms-3">
                <img src={bar} alt="Money icon" />{" "}
                {/* Replace with your amount icon */}
                <h4 className="text-lg">Amount</h4>
              </div>
              <p className="text-primary text-lg text-center flex-1">
                {amount ?? "No Data"}
              </p>
            </div>

            {/* Currency Slot */}
            <div className="flex items-center justify-between mb-4 py-3 bg-[#E7EDF9]">
              <div className="flex items-center space-x-4 ms-3">
                <img src={bar} alt="Currency icon" />{" "}
                {/* Replace with your currency icon */}
                <h4 className="text-lg">Currency</h4>
              </div>
              <p className="text-primary text-lg text-center flex-1">
                {currency ?? "No Data"}
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate(-1)}
                className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] text-[#41BC63] px-8 py-2 rounded-[15px]"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

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

            {/* Pay Now Button with Spinner */}
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

          {/* Success Modal */}
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
                <Button
                  className="w-full"
                  title="Continue"
                  onClick={() => handleModalClose()}
                />
              </div>
            </Modal>
          )}
        </div>
      </div>
    </DashboardSection>
  );
};

export default Checkout;
