import { Outlet } from "react-router-dom";
import { Navbar } from "../components";

export const AppLayout = () => {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  };