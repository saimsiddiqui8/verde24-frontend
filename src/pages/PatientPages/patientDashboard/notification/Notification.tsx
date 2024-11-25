import { useSelector } from "react-redux";
import { DashboardSection } from "../../../../components";
import { RootState } from "../../../../redux/store";
import { publicRequest } from "../../../../api/requestMethods";
import { useQuery } from "react-query";
import { Patient_Notification, PatientNotification } from "./queries";

export default function Notification() {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);

  const getPatientNotification = async () => {
    try {
      const response = await publicRequest.post("/graphql", {
        query: Patient_Notification,
        variables: {
          findMyNotificationsId: id,
        },
      });
      return response?.data?.data?.findMyNotifications;
    } catch (error) {
      console.error("Error fetching patient notifications:", error);
    }
  };
  const Patientdata = useQuery({
    queryKey: ["Notification", id],
    queryFn: getPatientNotification,
  });

  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">Notifications</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="p-2 sm:p-4">ID</th>
              <th className="p-2 sm:p-4">Created At</th>
              <th className="p-2 sm:p-4">Message</th>
              <th className="p-2 sm:p-4">Role</th>
              <th className="p-2 sm:p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {Patientdata?.data?.map((notification: PatientNotification) => (
              <tr key={notification.id} className="odd:bg-[#f0f0f0]">
                <td className="p-2 sm:p-4">{notification.id}</td>
                <td className="p-2 sm:p-4">
                  {new Date(
                    parseInt(notification.createdAt),
                  ).toLocaleDateString()}
                </td>
                <td className="p-2 sm:p-4">{notification.message}</td>
                <td className="p-2 sm:p-4">{notification.role}</td>
                <td className="p-2 sm:p-4">
                  {notification.isRead ? "Read" : "Unread"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}
