import logo from "../assets/Logo.png";
import { FiPhoneCall } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";
import { BiChevronDown } from "react-icons/bi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { flushUser } from "../redux/slices/userSlice.ts";
import { RootState } from "../redux/store.ts";
import { USER_ROLES } from "../api/roles.ts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutQuery } from "../api/apiCalls/pharmacyApi.ts";
import { ShoppingCart } from "lucide-react";
import { CARD_BY_PATIENT_ID } from "../pages/PatientPages/patientDashboard/patientProfile/queries.ts";
import { FindCardById } from "../api/apiCalls/patientsApi.ts";
import { useQuery } from "react-query";
import { loadingEnd, loadingStart } from "../redux/slices/loadingSlice.ts";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const user = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (!user?.token) {
      return null;
    }
    await logoutQuery(user?.token);
    if (user?.role === USER_ROLES.admin) {
      navigate("/admin/sign-in");
    } else if (user?.role === USER_ROLES.doctor) {
      localStorage.removeItem("recentPatients");
      navigate("/doctor/sign-in");
    } else if (user?.role === USER_ROLES.pharmacy) {
      navigate("/pharmacy/sign-in");
    } else if (user?.role === USER_ROLES.lab) {
      navigate("/lab/sign-in");
    } else if (user?.role === USER_ROLES.patient) {
      navigate("/patient/sign-in");
    }
    dispatch(flushUser());
    setShowDropdown(false);
  };

  const getCard = async () => {
    if (!user?.id || user?.role !== USER_ROLES.patient) return;
    return FindCardById(CARD_BY_PATIENT_ID, { patientId: user?.id });
  };

  const { data } = useQuery({
    queryKey: ["patientcard", user?.id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getCard();
    },
    onSuccess: () => dispatch(loadingEnd()),
  });

  return (
    <nav className="w-full py-4 px-8 bg-white flex justify-between items-center border-b-2">
      <div className="flex gap-4 items-center">
        <Link to="/">
          <img src={logo} alt="Logo Image" className="w-32" />
        </Link>
        {location.pathname === "/" && (
          <div className="gap-3 items-center hidden lg:flex">
            <Link to="#">Doctors</Link>
            <Link to="#">Video Consult</Link>
            <Link to="#">Medicines</Link>
            <Link to="#">Lab Test</Link>
            <Link to="#">Surgeries</Link>
          </div>
        )}
      </div>
      <div className="flex gap-3 items-center">
        {location.pathname === "/" && (
          <div className="gap-3 items-center hidden lg:flex">
            <Link className="flex gap-1 items-center" to="#">
              For Corporate <BiChevronDown size={20} />
            </Link>
            <Link className="flex gap-1 items-center" to="#">
              For Providers <BiChevronDown size={20} />
            </Link>
            <Link className="flex gap-1 items-center" to="#">
              Security & Help <BiChevronDown size={20} />
            </Link>
          </div>
        )}
        {user?.role === USER_ROLES.patient && (
          <div
            onClick={() => navigate("/patient-dashboard/add-to-card")}
            className="relative cursor-pointer"
          >
            <ShoppingCart size={28} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {data?.length}
            </span>
          </div>
        )}
        <button className="py-1.5 px-6 rounded-[30px] btn-back text-white flex items-center gap-2">
          <FiPhoneCall fill="transparent" stroke="white" />
          Help
        </button>

        <div className="relative">
          <div
            className="border-2 border-[#3FB946] flex gap-2 py-1.5 px-3 rounded"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUserAlt className="text-[#125DB9] text-lg" />
            <BiChevronDown className="text-[#125DB9] text-lg" />
          </div>
          <div
            id="dropdown"
            className="absolute right-0 top-12 z-10 bg-white border-primary divide-y divide-blue-600 rounded-lg shadow w-20"
            style={{ display: showDropdown ? "block" : "none" }}
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                {user?.token ? (
                  <span
                    className="block px-4 py-2 text-primary hover:bg-blue-600 hover:text-white cursor-pointer"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </span>
                ) : (
                  location.pathname === "/" && (
                    <Link to="/patient/sign-in">
                      <span
                        className="block px-4 py-2 text-primary hover:bg-blue-600 hover:text-white cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        Login
                      </span>
                    </Link>
                  )
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
