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

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const user = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (user?.role === USER_ROLES.admin) {
      navigate("/admin/sign-in");
    } else if (user?.role === USER_ROLES.doctor) {
      navigate("/doctor/sign-in");
    } else if (user?.role === USER_ROLES.patient) {
      navigate("/patient/sign-in");
    }
    dispatch(flushUser());
    setShowDropdown(false);
  };
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
        {location.pathname === "/" ? (
          <div className="gap-3 items-center hidden lg:flex">
            <Link className="flex gap-1 items-center" to="#">
              For Corp-orates <BiChevronDown size={20} />
            </Link>
            <Link className="flex gap-1 items-center" to="#">
              For Providers <BiChevronDown size={20} />
            </Link>
            <Link className="flex gap-1 items-center" to="#">
              Security & Help <BiChevronDown size={20} />
            </Link>
          </div>
        ) : (
          <button className="py-1.5 px-6 rounded-[30px] btn-back text-white flex items-center gap-2">
            <FiPhoneCall fill="transparent" stroke="white" />
            Help
          </button>
        )}
        <div className="relative">
          <div
            className="border-2 border-[#3FB946] flex gap-2 py-1.5 px-3 rounded"
            onClick={() =>
              user?.token ? setShowDropdown((prev) => !prev) : {}
            }
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
                <span
                  className="block px-4 py-2 text-primary hover:bg-blue-600 hover:text-white cursor-pointer"
                  onClick={() => handleLogout()}
                >
                  Logout
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
