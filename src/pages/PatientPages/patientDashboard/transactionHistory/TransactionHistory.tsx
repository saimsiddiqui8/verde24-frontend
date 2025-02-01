import { Button, DashboardSection } from "../../../../components";
import { Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { findPaymentByPatient } from "../../../../api/apiCalls/patientsApi";
import { FIND_PAYMENT_BY_PATIENTID } from "../../../DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/queries";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { notifyFailure } from "../../../../utils/Utils";
import { useEffect, useState } from "react";

interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  is_paid: boolean;
}

const TABLE_HEAD = [
  "ID",
  "Amount",
  "Transaction Date & Time",
  "Status",
  "Action",
];

export default function TransactionHistory() {
  const [paymentDetails, setPaymentDetails] = useState<Payment[]>([]);
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();

  const getPaymentByPatient = async () => {
    dispatch(loadingStart());
    try {
      const response = await findPaymentByPatient(FIND_PAYMENT_BY_PATIENTID, {
        findPaymentByPatientId: id,
      });
      setPaymentDetails(response || []);
      dispatch(loadingEnd());
    } catch (err: any) {
      notifyFailure(err.toString());
      dispatch(loadingEnd());
    }
  };

  useEffect(() => {
    getPaymentByPatient();
  }, []);

  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Transaction History
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD?.map((head) => (
                <th key={head} className="bg-white p-2 sm:p-4">
                  <Typography
                    variant="small"
                    className="font-normal leading-none"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paymentDetails.length > 0 ? (
              paymentDetails.map(({ id, amount, payment_date, is_paid }) => (
                <tr key={id} className="odd:bg-[#5C89D826]">
                  <td className="p-2 sm:p-4">
                    <Typography variant="small" className="font-normal">
                      {id}
                    </Typography>
                  </td>
                  <td className="p-2 sm:p-4">
                    <Typography variant="small" className="font-normal">
                      {amount}
                    </Typography>
                  </td>
                  <td className="p-2 sm:p-4">
                    <Typography variant="small" className="font-normal">
                      {new Date(Number(payment_date)).toLocaleString()}
                    </Typography>
                  </td>
                  <td className="p-2 sm:p-4">
                    <Button
                      className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] bg-none text-[#41BC63]"
                      title={is_paid ? "Paid" : "Pending"}
                    />
                  </td>
                  <td className="p-2 sm:p-4">
                    <Button
                      className="font-bold text-xs bg-[#EBF9F1] border border-[#41BC63] bg-none text-[#41BC63]"
                      title={is_paid ? "View" : "Pay Now"}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-2xl">
                  No payment found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}
