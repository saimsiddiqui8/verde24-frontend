import { AlertTriangle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function BannedAccountNotice() {
  const is_banned = useSelector(
    (state: RootState) => state.user.currentUser?.is_verified,
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (is_banned) {
      return;
    } else {
      navigate(-1);
    }
  }, [is_banned]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="text-red-500 w-10 h-10" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Account Suspended
        </h2>
        <p className="text-gray-600 mb-4">
          Your account has been{" "}
          <span className="font-semibold text-red-500">banned</span>. Please
          contact our support team for further assistance.
        </p>
        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">
            📧 Contact Support:
            <span className="font-medium text-blue-600 ml-1">
              info@verde24health.com
            </span>
          </p>
        </div>
        <button
          onClick={() =>
            (window.location.href = "mailto:info@verde24health.com")
          }
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}
