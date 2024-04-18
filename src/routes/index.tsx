import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import Navbar from "../components/Navbar";
import ProtectedRoutes from "./ProtectedRoutes";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { USER_ROLES } from "../api/roles";
import DoctorLayout from "./layouts/DoctorLayout";
import PatientLayout from "./layouts/PatientLayout";
import AdminLayout from "./layouts/AdminLayout";
import {
  ForgotPasswordCode,
  ForgotPasswordEmail,
  ForgotPasswordReset,
  Homepage,
  Page404,
  Unauthorized,
} from "../pages/CommonPages";
import {
  BookSlot,
  CompletedProcedures,
  Files,
  FindDoctor,
  FindDoctorAppointment,
  FindDoctorProfile,
  OnlineAppointment,
  PatientProfile,
  PatientSignIn,
  PatientSignUp,
  Prescriptions,
  SelectSlot,
  TreatmentPlans,
} from "../pages/PatientPages";
import {
  DoctorProfile,
  DoctorSignIn,
  DoctorSignUp,
} from "../pages/DoctorPages";
import {
  AdminDashboardHome,
  AdminDoctorProfile,
  AdminDoctors,
  AdminEditPatient,
  AdminHospitalProfile,
  AdminHospitals,
  AdminNewDoctor,
  AdminNewHospital,
  AdminPatientProfile,
  AdminPatients,
  AdminSignIn,
} from "../pages/AdminPages";
import AuthenticationRoutes from "./AuthenticationRoutes";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const RequireAuth = ({ role }: any) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  return <>{user?.role === role ? <Outlet /> : <Unauthorized />}</>;
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AppLayout />}>
        <Route element={<PublicRoutes />}>
          <Route index element={<Homepage />} />
          <Route element={<AuthenticationRoutes />}>
            <Route path="patient/sign-in" element={<PatientSignIn />} />
            <Route path="patient/sign-up" element={<PatientSignUp />} />
            <Route path="doctor/sign-in" element={<DoctorSignIn />} />
            <Route path="doctor/sign-up" element={<DoctorSignUp />} />
            <Route path="admin/sign-in" element={<AdminSignIn />} />
            <Route path="forgot-password">
              <Route path="1" element={<ForgotPasswordEmail />} />
              <Route path="2" element={<ForgotPasswordCode />} />
              <Route path="3" element={<ForgotPasswordReset />} />
            </Route>
          </Route>
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route element={<RequireAuth role={USER_ROLES.doctor} />}>
            <Route element={<DoctorLayout />} path="doctor-dashboard">
              <Route index element={<div>Doctor Home</div>} />
              <Route path="profile" element={<DoctorProfile />} />
              <Route path="appointments" element={<DoctorProfile />} />
              <Route path="my-patients" element={<DoctorProfile />} />
              <Route path="schedule-slots" element={<DoctorProfile />} />
              <Route path="payment-and-payouts" element={<DoctorProfile />} />
            </Route>
          </Route>
          <Route element={<RequireAuth role={USER_ROLES.patient} />}>
            <Route element={<PatientLayout />} path="patient-dashboard">
              <Route index element={<PatientProfile />} />
              <Route path="find-doctor">
                <Route index element={<FindDoctor />} />
                <Route path="appointment">
                  <Route path=":id" element={<FindDoctorAppointment />} />
                  <Route path="select-slot/:id" element={<SelectSlot />} />
                  <Route path="book-slot/:id" element={<BookSlot />} />
                </Route>
                <Route path="profile/:id" element={<FindDoctorProfile />} />
              </Route>
              <Route path="treatment-plans" element={<TreatmentPlans />} />
              <Route
                path="completed-procedures"
                element={<CompletedProcedures />}
              />
              <Route path="files" element={<Files />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route
                path="online-appointment"
                element={<OnlineAppointment />}
              />
            </Route>
          </Route>
          <Route element={<RequireAuth role={USER_ROLES.admin} />}>
            <Route element={<AdminLayout />} path="admin-dashboard">
              <Route index element={<AdminDashboardHome />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="doctors/:id" element={<AdminDoctorProfile />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="patients/:id" element={<AdminPatientProfile />} />
              <Route path="patients/edit/:id" element={<AdminEditPatient />} />
              <Route path="hospitals" element={<AdminHospitals />} />
              <Route path="hospitals/:id" element={<AdminHospitalProfile />} />
              <Route path="doctors/add-new" element={<AdminNewDoctor />} />
              <Route path="hospitals/add-new" element={<AdminNewHospital />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="/*" element={<Page404 />} />
    </>
  )
);
