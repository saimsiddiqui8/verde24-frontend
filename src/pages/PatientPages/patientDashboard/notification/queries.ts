export const Patient_Notification = `query FindMyNotifications($findMyNotificationsId: Int!) {
  findMyNotifications(id: $findMyNotificationsId) {
    id
    message
    isRead
    user_id
    role
    createdAt
  }
}`;

export interface PatientNotification {
  id: number;
  message: string;
  isRead: boolean;
  user_id: number;
  role: string;
  createdAt: string;
}
