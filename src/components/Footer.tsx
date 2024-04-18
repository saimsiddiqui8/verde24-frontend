import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-600 to-indigo-900 py-10 px-16 flex flex-col sm:flex-row items-start justify-center gap-10">
      <div className="">
        <h5 className="text-white text-lg">Verde</h5>
        <div className="flex flex-col gap-2 text-white text-sm my-2">
          <Link to="#">About</Link>
          <Link to="#">Contact Us</Link>
          <Link to="#">Terms & Conditions</Link>
          <Link to="#">Privacy Policy</Link>
        </div>
      </div>
      <div className="">
        <h5 className="text-white text-lg">Patients</h5>
        <div className="flex flex-col gap-2 text-white text-sm my-2">
          <Link to="#">Search for doctors</Link>
          <Link to="#">Search for clinics</Link>
          <Link to="#">Search for hospitals</Link>
          <Link to="#">Book Diagnostic Tests</Link>
          <Link to="#">Verde Plus</Link>
          <Link to="#">Covid Hospital listing</Link>
          <Link to="#">Verde Care Clinics</Link>
          <Link to="#">Read about medicines</Link>
          <Link to="#">Verde drive Health app </Link>
        </div>
      </div>
      <div>
        <div className="">
          <h5 className="text-white text-lg">For Doctor</h5>
          <div className="flex flex-col gap-2 text-white text-sm my-2">
            <Link to="#">Verde Profile</Link>
          </div>
        </div>
        <div className="">
          <h5 className="text-white text-lg">For Clinics</h5>
          <div className="flex flex-col gap-2 text-white text-sm my-2">
            <Link to="#">Verde</Link>
            <Link to="#">Verde Reach</Link>
            <Link to="#">Verde Pro</Link>
          </div>
        </div>
      </div>
      <div className="">
        <h5 className="text-white text-lg">More</h5>
        <div className="flex flex-col gap-2 text-white text-sm my-2">
          <Link to="#">Help</Link>
          <Link to="#">Contact Us</Link>
          <Link to="#">Terms & Conditions</Link>
          <Link to="#">Privacy Policy</Link>
        </div>
      </div>
      <div className="">
        <h5 className="text-white text-lg">Social</h5>
        <div className="flex flex-col gap-2 text-white text-sm my-2">
          <Link to="#">Facebook</Link>
          <Link to="#">Twitter</Link>
          <Link to="#">Linkedin</Link>
          <Link to="#">Youtube</Link>
        </div>
      </div>
    </footer>
  );
}
