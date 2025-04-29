import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";
import { Unauthorized } from "../pages/CommonPages";

interface Role {
  role: string;
}

export const RequireAuth = ({ role }: Role) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  return <>{user?.role === role ? <Outlet /> : <Unauthorized />}</>;
};

export const RequireVerification = () => {
  const is_verified = useSelector(
    (state: RootState) => state.user.currentUser?.is_verified,
  );

  if (is_verified === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return is_verified ? (
    <Outlet />
  ) : (
    <Navigate to="/doctor-dashboard-unverified" replace />
  );
};

export const RequireBannedPatient = () => {
  const isBanned = useSelector(
    (state: RootState) => state.user.currentUser?.is_verified,
  );

  if (isBanned === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return isBanned ? (
    <Navigate to="/patient-banned-account" replace />
  ) : (
    <Outlet />
  );
};

export const RequireBannedPharmacy = () => {
  const isBanned = useSelector(
    (state: RootState) => state.user.currentUser?.is_verified,
  );

  if (isBanned === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return isBanned ? (
    <Navigate to="/pharmacy-banned-account" replace />
  ) : (
    <Outlet />
  );
};

export const RequireBannedLab = () => {
  const isBanned = useSelector(
    (state: RootState) => state.user.currentUser?.is_verified,
  );

  if (isBanned === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return isBanned ? <Navigate to="/lab-banned-account" replace /> : <Outlet />;
};
