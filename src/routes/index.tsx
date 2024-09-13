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
import OnlineHospitalAppointment from "../pages/PatientPages/patientDashboard/onlineAppointment/OnlineHospitalAppointment.tsx";
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
import PharmacySignIn from "../pages/PharmacyPages/pharmacySignIn/PharmacySignIn.tsx";
import PharmacySignUp from "../pages/PharmacyPages/pharmacySignUp/PharmacySignUp.tsx";
import LabSignIn from "../pages/LabPages/labSignIn/LabSignIn.tsx";
import LabSignUp from "../pages/LabPages/labSignUp/LabSignUp.tsx";
import PharmacyLayout from "./layouts/PharmacyLayout.tsx";
import LabLayout from "./layouts/LabLayout.tsx";
import AccountManagement from "../pages/PharmacyPages/pharmacyDashboard/accountManagement/AccountManagement.tsx";
import LabAccount from "../pages/LabPages/LabDashboard/labAccount/LabAccount.tsx";
import BookLabTest from "../pages/PatientPages/patientDashboard/booklabtest/BookLabTest.tsx";
import ConsultationForm from "../pages/DoctorPages/doctorDashboard/doctorInputInfo/consultationForm/ConsultationForm.tsx";
import Calendar from "../pages/DoctorPages/doctorDashboard/doctorInputInfo/calendar/Calendar.tsx";
import Appointments from "../pages/DoctorPages/doctorDashboard/doctorInputInfo/appointments/Appointments.tsx";
import MyPatientsSection from "../pages/DoctorPages/doctorDashboard/doctorInputInfo/mypatients/MyPatients.tsx";
import AddSlots from "../pages/DoctorPages/doctorDashboard/doctorInputInfo/addSlots/AddSlots.tsx";
import VerifiedProfile from "../pages/DoctorPages/doctorDashboard/doctorInputInfo/verifiedprofile/VerifiedProfile.tsx";
import DoctorDashboardAfterApproval from "./layouts/DoctorDashboardAfterApproval.tsx";
import Notification from "../pages/PatientPages/patientDashboard/notification/Notification.tsx";

interface RequireAuthProps {
  role: string;
}

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const RequireAuth = ({ role }: RequireAuthProps) => {
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
            <Route path="pharmacy/sign-in" element={<PharmacySignIn />} />
            <Route path="pharmacy/sign-up" element={<PharmacySignUp />} />
            <Route path="lab/sign-in" element={<LabSignIn />} />
            <Route path="lab/sign-up" element={<LabSignUp />} />
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
            <Route element={<DoctorLayout/>} path="doctor-dashboard">
              <Route index element={<ConsultationForm/>} />
            </Route>
            <Route element={<DoctorDashboardAfterApproval />} path="verified-doctor-dashboard">
              <Route path="verifiedprofile" element={<VerifiedProfile />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="mypatients" element={<MyPatientsSection />} />
              <Route path="schedule" element={<AddSlots />} />
            </Route>

          </Route>
          <Route element={<RequireAuth role={USER_ROLES.patient} />}>
            <Route element={<PatientLayout />} path="patient-dashboard">
              <Route index element={<PatientProfile />} />
              <Route path="find-doctor">
                <Route index element={<FindDoctor />} />
                <Route
                  path="appointment/:id"
                  element={<FindDoctorAppointment />}
                />
                <Route path="select-slot/:id" element={<SelectSlot />} />
                <Route path="book-slot/:id" element={<BookSlot />} />
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
              <Route
                path="/patient-dashboard/online-appointment/online-hospital-profile/:id"
                element={<OnlineHospitalAppointment />}
              />
              <Route
                path="book-lab-test"
                element={<BookLabTest/>}
              />
              <Route
                path="notification"
                element={<Notification/>}
              />
            </Route>
          </Route>
          <Route element={<RequireAuth role={USER_ROLES.pharmacy} />}>
            <Route element={<PharmacyLayout />} path="pharmacy-dashboard">
              <Route index element={<AccountManagement />} />
            </Route>
          </Route>
          <Route element={<RequireAuth role={USER_ROLES.lab} />}>
            <Route element={<LabLayout />} path="lab-dashboard">
              <Route index element={<LabAccount />} />
            </Route>
          </Route>
          <Route element={<RequireAuth role={USER_ROLES.admin} />}>
            <Route element={<AdminLayout />} path="admin-dashboard">
              <Route index element={<AdminDashboardHome />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="doctors/:id" element={<AdminDoctorProfile />} />
              <Route path="doctors/add-new" element={<AdminNewDoctor />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="patients/:id" element={<AdminPatientProfile />} />
              <Route path="patients/edit/:id" element={<AdminEditPatient />} />
              <Route path="hospitals" element={<AdminHospitals />} />
              <Route path="hospitals/:id" element={<AdminHospitalProfile />} />
              <Route path="hospitals/add-new" element={<AdminNewHospital />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="/*" element={<Page404 />} />
    </>,
  ),
);
