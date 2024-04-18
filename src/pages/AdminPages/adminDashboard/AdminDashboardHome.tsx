import { DashboardSection } from "../../../components";
import { FaUserDoctor, FaUser, FaHospital } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function AdminDashboardHome() {
  return (
    <DashboardSection title="Admin Overview">
      <div className="grid grid-cols-12 mt-6 gap-6">
        <div className="col-span-4 shadow-lg rounded border">
          <Link
            to="/admin-dashboard/doctors"
            className="h-full w-full flex flex-col items-center justify-center gap-2 px-2 py-4"
          >
            <FaUserDoctor size={50} />
            <h3 className="text-xl font-medium">Doctors</h3>
          </Link>
        </div>
        <div className="col-span-4 shadow-lg rounded border">
          <Link
            to="/admin-dashboard/patients"
            className="h-full w-full flex flex-col items-center justify-center gap-2 px-2 py-4"
          >
            <FaUser size={50} />
            <h3 className="text-xl font-medium">Patients</h3>
          </Link>
        </div>
        <div className="col-span-4 shadow-lg rounded border">
          <Link
            to="/admin-dashboard/hospitals"
            className="h-full w-full flex flex-col items-center justify-center gap-2 px-2 py-4"
          >
            <FaHospital size={50} />
            <h3 className="text-xl font-medium">Hospitals</h3>
          </Link>
        </div>
      </div>
    </DashboardSection>
  );
}
