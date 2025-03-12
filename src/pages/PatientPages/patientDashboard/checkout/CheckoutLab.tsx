import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button, DashboardSection, Modal } from "../../../../components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import {
  stripePayment,
} from "../../../../api/apiCalls/doctorsApi";
import {
  GET_DOCTOR_QUERY,
  CREATE_PAYMENT,
  CREATE_APPOINTMENT,
} from "../../../DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";
import { notifyFailure } from "../../../../utils/Utils";
import clock from "../../../../assets/clock.png";
import calender from "../../../../assets/calendar.png";
import bar from "../../../../assets/bar.png";
import { Toaster } from "react-hot-toast";
import { deleteLabBooking } from "../../../../redux/slices/LabBooking";
import { LabAppointmentBooking } from "../../../../api/apiCalls/patientsApi";
import { LAB_APPOINTMENT_BOOKING } from "../patientProfile/queries";
import { labAppointmenttype } from "../../../../api/apiCalls/types";

const CheckoutLab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const patientId = useSelector(
    (state: RootState) => state.user.currentUser?.id,
  );
  const Labbooking = useSelector((state: RootState) => state.Labbooking);
  const { amount, currency , appointment_date,appointment_time,appointment_weekday,labTest_id,lab_id,patient_email,patient_age,patient_gender,patient_id,patient_name,patient_phone_number} =
  Labbooking;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // if (!selectedDate || !selectedDay || !selectedTime) {
    //   navigate(-1);
    //   return;
    // }

    // if (!id) {
    //   dispatch(loadingStart());
    //   return;
    // }
  }, [ dispatch]);

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
    const appointmentData:labAppointmenttype = {
          appointment_date: appointment_date,
          appointment_time: appointment_time,
          appointment_weekday: appointment_weekday,
          labTest_id:labTest_id,
          lab_id:lab_id,
          patient_email:patient_email,
          patient_age:patient_age,
          patient_gender:patient_gender,
          patient_id: patient_id,
          patient_name:patient_name,
          patient_phone_number:patient_phone_number,
          status:"Pending",
        };
    
        if (payId) {
          appointmentData.payment_id = parseInt(payId);
        }
    
        try {
          await LabAppointmentBooking(LAB_APPOINTMENT_BOOKING, {
           data: appointmentData,
          });
    
          setShowModal(true);
        } catch (error) {
          console.error("Error creating lab appointment:", error);
          throw error;
        } finally {
          setIsLoading(false);
        }

  };

  
  const handleCreatePayment = async (paymentMethodId: string) => {
    const paymentData = {
      amount: amount ?? null,
      currency: currency ?? null,
      payment_method: paymentMethodId,
      patient_id: patientId,
    };

    try {
      setIsLoading(true);
      const response = await stripePayment(CREATE_PAYMENT, {
        data: paymentData,
      });
      console.log("ressss", response);
      
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
      await handleCreatePayment(paymentMethod.id);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    dispatch(deleteLabBooking());
    navigate("/patient-dashboard/treatment-plans");
  };

  return (
    <DashboardSection>
      <div className="checkout-container flex flex-col justify-center items-center">
        {/* Doctor Details Section */}
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
      <Toaster/>
    </DashboardSection>
  );
};

export default CheckoutLab;
