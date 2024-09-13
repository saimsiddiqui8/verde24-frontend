import DoctorDashboardAfterApproval from "./DoctorDashboardAfterApproval";
import DoctorLayout from "./DoctorLayout";

const DoctorDashboard = () => {
	const isveri = false;
  return (
	<div>
	  {isveri ? (<DoctorDashboardAfterApproval/>):(<DoctorLayout/>)}
	</div>
  )
}

export default DoctorDashboard
