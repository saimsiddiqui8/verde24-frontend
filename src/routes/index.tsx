import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  Navigate,
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
import { DoctorSignIn, DoctorSignUp } from "../pages/DoctorPages";

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
import AllTransactionHistory from "../pages/AdminPages/adminDashboard/hospitals/allTransactionHistory/AllTransactionHistory.tsx";
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
import TransactionHistory from "../pages/PatientPages/patientDashboard/transactionHistory/TransactionHistory.tsx";
import Checkout from "../pages/PatientPages/patientDashboard/checkout/Checkout.tsx";
import Wallet from "../pages/PatientPages/patientDashboard/wallet/Wallet.tsx";
import UpcomingLaboratoryTests from "../pages/LabPages/LabDashboard/labAccount/UpcomingLaboratoryTests.tsx";
import LabBookedAppointments from "../pages/LabPages/LabDashboard/labAccount/LabBookedAppointments.tsx";
import DeclinedAppointments from "../pages/LabPages/LabDashboard/labAccount/DeclinedAppointments.tsx";
import PaymentsAndPayouts from "../pages/LabPages/LabDashboard/labAccount/PaymentsAndPayouts.tsx";
import CollectionCenter from "../pages/LabPages/LabDashboard/labAccount/CollectionCenter.tsx";
import LabPatientProfile from "../pages/LabPages/LabDashboard/labAccount/LabPatientProfile.tsx";
import Patientgoogleauth from "../pages/PatientPages/patientSignIn/Patientgoogleauth.tsx";
import PharmacyLocation from "../pages/PharmacyPages/pharmacyDashboard/PharmacyLocation.tsx";
import LabLocation from "../pages/LabPages/LabDashboard/LabLocation.tsx";
import AddTest from "../pages/LabPages/LabDashboard/labAccount/AddTest.tsx";
import ViewTest from "../pages/LabPages/LabDashboard/labAccount/ViewTest.tsx";
import FileViewer from "../components/Icons/Sidemenu/FileViewer.tsx";
import AllLabTest from "../pages/PatientPages/patientDashboard/booklabtest/AllLabTest.tsx";
import LabDetails from "../pages/PatientPages/patientDashboard/booklabtest/LabDetails.tsx";
import TestProfile from "../pages/PatientPages/patientDashboard/booklabtest/TestProfile.tsx";
import Stepper from "../pages/PatientPages/patientDashboard/booklabtest/Stepper.tsx";
import CheckoutLab from "../pages/PatientPages/patientDashboard/checkout/CheckoutLab.tsx";
import Card from "../pages/PatientPages/patientDashboard/Cart/Card.tsx";
import TreatmentLabs from "../pages/PatientPages/patientDashboard/treatmentLabs/TreatmentLabs.tsx";
import AdminLabs from "../pages/AdminPages/adminDashboard/labs/AdminLabs/AdminLabs.tsx";
import AdminLabsProfile from "../pages/AdminPages/adminDashboard/labs/AdminLabsProfile/AdminLabsProfile.tsx";
import AdminPharmacies from "../pages/AdminPages/adminDashboard/pharmacies/AdminPharmacies/AdminPharmacies.tsx";
import AdminPharmaciesProfile from "../pages/AdminPages/adminDashboard/pharmacies/AdminPharmaciesProfile/AdminPharmaciesProfile.tsx";
import BannedAccountNotice from "../components/BannedAccountNotice.tsx";

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

const RequireVerification = () => {
  const is_verified = useSelector((state: RootState) => state.user.currentUser?.is_verified);

  if (is_verified === undefined) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return is_verified ? <Outlet /> : <Navigate to="/doctor-dashboard-unverified" replace />;
};

const RequireBannedPatient = () => {
  const is_banned = useSelector((state: RootState) => state.user.currentUser?.is_verified);

  if (is_banned === undefined) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return is_banned ? <Navigate to="/patient-banned-account" replace /> : <Outlet />;
};

const RequireBannedPharmacy = () => {
  const is_banned = useSelector((state: RootState) => state.user.currentUser?.is_verified);

  if (is_banned === undefined) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return is_banned ? <Navigate to="/pharmacy-banned-account" replace /> : <Outlet />;
};

const RequireBannedLab = () => {
  const is_banned = useSelector((state: RootState) => state.user.currentUser?.is_verified);

  if (is_banned === undefined) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return is_banned ? <Navigate to="/lab-banned-account" replace /> : <Outlet />;
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
          <Route path="auth" element={<Patientgoogleauth />} />
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
        <Route element={<ProtectedRoutes />}>
          <Route element={<RequireAuth role={USER_ROLES.doctor} />}>
          <Route element={<RequireVerification />}>
    <Route path="doctor-dashboard" element={<DoctorDashboardAfterApproval />}>
      <Route index element={<VerifiedProfile />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="mypatients" element={<MyPatientsSection />} />
      <Route path="schedule" element={<AddSlots />} />
    </Route>
  </Route>

  <Route path="doctor-dashboard-unverified" element={<DoctorLayout />}>
    <Route index element={<ConsultationForm />} />
  </Route>
          </Route>
          <Route element={<RequireAuth role={USER_ROLES.patient} />}>
          <Route element={<RequireBannedPatient />}>
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
                <Route path="checkout" element={<Checkout />} />
                <Route path="profile/:id" element={<FindDoctorProfile />} />
              </Route>
              <Route path="treatment-plans" element={<TreatmentPlans />} />
              <Route path="treatment-labs" element={<TreatmentLabs />} />
              <Route path="wallet" element={<Wallet />} />
              <Route
                path="transaction-history"
                element={<TransactionHistory />}
              />
              <Route
                path="completed-procedures"
                element={<CompletedProcedures />}
              />
              <Route path="files" element={<Files />} />
              <Route path="/patient-dashboard/files/view-file" element={<FileViewer />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route
                path="online-appointment"
              >
              <Route index element={<OnlineAppointment />} />
              <Route
                path="online-hospital-profile/:id"
                element={<OnlineHospitalAppointment />}
              />
               </Route>
              <Route path="book-lab-test"  >
              <Route index element={<BookLabTest />} />
              <Route path="lab-profile/:id" element={<AllLabTest />} />
              <Route path="lab-details/:id" element={<LabDetails />} />
              <Route path="test-profile/:id" element={<TestProfile />} />
              <Route path="stepper" element={<Stepper />} />
              <Route path="checkout-lab" element={<CheckoutLab />} />
              </Route>
              <Route path="notification" element={<Notification />} />
              <Route path="add-to-card" element={<Card />} />
            </Route>
            </Route>
              <Route path="patient-banned-account" element={<BannedAccountNotice />} />
          </Route>
          <Route element={<RequireAuth role={USER_ROLES.pharmacy} />}>
          <Route element={<RequireBannedPharmacy />}>
            <Route element={<PharmacyLayout />} path="pharmacy-dashboard">
              <Route index element={<AccountManagement />} />
              <Route path="pharmacy-location" element={<PharmacyLocation/>} />
            </Route>
            </Route>
            <Route path="pharmacy-banned-account" element={<BannedAccountNotice />} />
          </Route>
          <Route element={<RequireAuth role={USER_ROLES.lab} />}>
          <Route element={<RequireBannedLab />}>
            <Route element={<LabLayout />} path="lab-dashboard">
              <Route index element={<LabAccount />} />
              <Route path="lab-location" element={<LabLocation/>} />
              <Route path="add-test/:labid?" element={<AddTest/>} />
              <Route path="available-test" element={<ViewTest/>} />
              <Route path="upcoming-lab-test" >
              <Route index element={<UpcomingLaboratoryTests/>} />
              <Route path="labpatientprofile/:id" element={<LabPatientProfile/>} />
              </Route>
              <Route path="lab-booked-appointments" element={<LabBookedAppointments/>} />
              <Route path="declined-appointments" element={<DeclinedAppointments/>} />
              <Route path="payments-and-payouts" element={<PaymentsAndPayouts/>} />
              <Route path="collection-center" element={<CollectionCenter/>} />
            </Route>
            </Route>
            <Route path="lab-banned-account" element={<BannedAccountNotice />} />
          </Route>
          <Route element={<RequireAuth role={USER_ROLES.admin} />}>
            <Route element={<AdminLayout />} path="admin-dashboard">
              <Route index element={<AdminDashboardHome />} />
              <Route
                path="transaction-histories"
                element={<AllTransactionHistory />}
              />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="doctors/:id" element={<AdminDoctorProfile />} />
              <Route path="doctors/add-new" element={<AdminNewDoctor />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="patients/:id" element={<AdminPatientProfile />} />
              <Route path="patients/edit/:id" element={<AdminEditPatient />} />
              <Route path="hospitals" element={<AdminHospitals />} />
              <Route path="hospitals/:id" element={<AdminHospitalProfile />} />
              <Route path="hospitals/add-new" element={<AdminNewHospital />} />
              <Route path="labs" element={<AdminLabs />} />
              <Route path="labs/:id" element={<AdminLabsProfile />} />
              <Route path="pharmacies" element={<AdminPharmacies />} />
              <Route path="pharmacies/:id" element={<AdminPharmaciesProfile />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="/*" element={<Page404 />} />
    </>,
  ),
);
