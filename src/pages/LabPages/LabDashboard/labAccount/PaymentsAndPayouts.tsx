import { DashboardSection } from "../../../../components";
import { Button } from "@material-tailwind/react";

const TABLE_HEAD = [
  "Activity",
  "Description",
  "Date & Time",
  "Status",
  "Amount",
];

const PaymentsAndPayouts = () => {
  const paymentDetails = [
    {
      id: "P001",
      description: "Completed",
      payment_date: "2024-12-20T14:00:00",
      amount: 200,
    },
    {
      id: "P002",
      description: "Completed",
      payment_date: "2024-12-22T10:30:00",
      amount: 200,
    },
    {
      id: "P003",
      description: "Completed",
      payment_date: "2024-12-23T16:15:00",
      amount: 200,
    },
  ];

  return (
    <DashboardSection title="Payments and Payouts">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="bg-white p-2 sm:p-4">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paymentDetails.length > 0 ? (
              paymentDetails.map(({ id, description, payment_date, amount }) => (
                <tr key={id} className="odd:bg-[#5C89D826]">
                  <td className="p-2 sm:p-4">{id}</td>
                  <td className="p-2 sm:p-4">{description}</td>
                  <td className="p-2 sm:p-4">
                    {new Date(payment_date).toLocaleString()}
                  </td>
                  <td className="p-2 sm:p-4">
                    <Button
                      className={`font-bold text-xs px-4 py-2 rounded-lg ${
                        amount
                          ? "bg-[#EBF9F1] border border-[#41BC63] text-[#41BC63]"
                          : "bg-[#FFF0F0] border border-[#F56565] text-[#F56565]"
                      }`}
                    >
                      {amount ? "Paid" : "Pending"}
                    </Button>
                  </td>
                  <td className="p-2 sm:p-4">
                  {amount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
};

export default PaymentsAndPayouts;
