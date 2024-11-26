import { useQuery } from "react-query";
import { publicRequest } from "../../../../../api/requestMethods";
import { Button, DashboardSection } from "../../../../../components";
import { Typography } from "@material-tailwind/react";

// Define Payment interface
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

const query = `query Payments {
  payments {
    id
    amount
    payment_date
    is_paid
  }
}`;

// Function to fetch payments
const getPayments = async (): Promise<Payment[]> => {
  try {
    const response = await publicRequest.post("/graphql", { query });
    return response.data.data.payments;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw new Error("Failed to fetch payments. Please try again later.");
  }
};

export default function AllTransactionHistory() {
  const { data: payments = [], isLoading } = useQuery<Payment[]>(
    "Payments",
    getPayments,
  );

  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          All Transaction Histories
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center my-4">
          <Typography variant="small">Loading payments...</Typography>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
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
              {payments.map(({ id, amount, payment_date, is_paid }) => (
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
                    <Typography variant="small" className="font-normal">
                      {is_paid ? "Paid" : "Pending"}
                    </Typography>
                  </td>
                  <td className="p-2 sm:p-4">
                    <Button
                      className="font-bold text-xs rounded-md"
                      title={is_paid ? "View" : "Pay Now"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardSection>
  );
}
