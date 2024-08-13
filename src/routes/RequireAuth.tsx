import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Outlet } from "react-router-dom";
import { Unauthorized } from "../pages/CommonPages";

interface Role {
  role: string;
}

export const RequireAuth = ({ role }: Role) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  return <>{user?.role === role ? <Outlet /> : <Unauthorized />}</>;
};
