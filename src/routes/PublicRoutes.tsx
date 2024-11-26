import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { USER_ROLES } from "../api/roles";

export default function PublicRoutes() {
  const user = useSelector((state: RootState) => state.user.currentUser);

  if (user?.token) {
    if (user?.role === USER_ROLES.doctor) {
      return <Navigate to="/doctor-dashboard" />;
    }
    if (user?.role === USER_ROLES.patient) {
      return <Navigate to="/patient-dashboard" />;
    }
    if (user?.role === USER_ROLES.pharmacy) {
      return <Navigate to="/pharmacy-dashboard" />;
    }
    if (user?.role === USER_ROLES.lab) {
      return <Navigate to="/lab-dashboard" />;
    }
    if (user?.role === USER_ROLES.admin) {
      return <Navigate to="/admin-dashboard" />;
    }
  }

  return <Outlet />;
}
