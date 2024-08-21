import { Link, Outlet, useLocation} from "react-router-dom";
import doctorImg from "../../assets/doctor.png";

const links = [
  { title: "Account Management", href: "/account-management" },
  { title: "Prescription Received", href: "/prescription-received" },
  { title: "Settings", href: "/settings" },
  { title: "History", href: "/history" },
  { title: "Payments And Payouts", href: "/payments-and-payouts" },
  { title: "Blank", href: "/blank" },
];


const BASE_URL = "/pharmacy-dashboard";

export default function PharmacyLayout() {
  const { pathname } = useLocation();

  return (
    <main className="grid grid-cols-1 md:grid-cols-12 my-8 mx-4 md:mx-8 text-primary gap-4 md:gap-8">
      <section className="col-span-1 md:col-span-4 pt-10 pb-5 h-fit border border-primary rounded-md relative">
        <div className="py-1 px-4">
          <img
            src={doctorImg}
            alt="Doctor"
            className="w-24 md:w-36 h-24 md:h-36 rounded-full block mx-auto"
          />
        </div>
        <div className="mt-5">
          {links.map((link, index) => (
            <Link key={index}
              to={BASE_URL + link?.href}
              className={`block py-0.5 px-4 md:px-8 border-y border-[#125DB94D] ${
                pathname === BASE_URL + link?.href && "text-selected"
              }`}
            >
              {link?.title}
            </Link>
          ))}
        </div>
      </section>
      <section className="col-span-1 md:col-span-8">
        <Outlet />
      </section>
    </main>
  );
}
