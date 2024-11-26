import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getPatientById } from "../../../../api/apiCalls/patientsApi";
import { FIND_PATIENT_QUERY } from "../patientProfile/queries";
import { useQuery } from "react-query";

const Wallet = () => {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const getPatient = async () => {
    if (!id) return;
    return getPatientById(FIND_PATIENT_QUERY, { id: id });
  };

  const patientData = useQuery({
    queryKey: ["patient", id],
    queryFn: getPatient,
  });
  return (
    <div className="p-6 max-w-4xl mx-auto border border-primary rounded-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Payments</h2>

      <div className="flex gap-6 mb-6">
        <div className="border border-primary p-4 rounded-lg flex-1">
          <h3 className="text-sm font-semibold text-blue-600 py-2">Balance</h3>
          <p className="text-3xl font-bold text-blue-600 py-2">
            {" "}
            {`$ ${patientData?.data?.wallet == undefined ? "0" : patientData?.data?.wallet}`}
          </p>
          <a href="#" className="text-sm text-blue-600 mt-2 block">
            View Transactions
          </a>
        </div>
      </div>

      <div className="flex gap-10">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-blue-800 mb-3">
            Payment methods
          </h3>
          <div className="border rounded-lg p-3 bg-blue-50 flex justify-between items-center">
            <span className="ms-5">
              Credit card | <strong>Stripe</strong>
            </span>
          </div>
          <button className="border border-primary w-full p-3.5 rounded-lg text-left text-primary">
            Add a payment method
          </button>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-blue-800 mb-3">
            Manage Payment Methods
          </h3>
          <div className="border rounded-lg p-3 bg-blue-50 flex items-center space-x-9">
            <span>
              <strong>Stripe</strong>
            </span>
            <span>9651 *** *** 6664</span>
          </div>
          <p className="text-sm text-blue-600 mt-2 underline">
            Change or Remove active Payment Method
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
