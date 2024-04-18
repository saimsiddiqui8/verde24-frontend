import { Link, Outlet, useLocation } from "react-router-dom";
import verdeImage from "../../assets/form-img.png";

const links = [
  { title: "Dashboard", href: "/" },
  { title: "Doctors", href: "/doctors" },
  { title: "Patients", href: "/patients" },
  { title: "Hospitals", href: "/hospitals" },
];

const BASE_URL = "/admin-dashboard";

export default function AdminLayout() {
  const { pathname } = useLocation();
  return (
    <main className="grid grid-cols-12 my-8 mx-8 text-primary gap-8">
      <section className="col-span-4 pt-8 pb-5 h-fit border border-primary rounded-md relative">
        <div className="py-1 px-4">
          <img src={verdeImage} alt="Doctor" className="w-48 block mx-auto" />
          <p className="text-[#5C89D8] text-3xl text-center font-semibold my-1">
            Admin
          </p>
        </div>
        <div className="mt-5">
          {links.map((link) => (
            <Link
              to={BASE_URL + link?.href}
              className={`block py-0.5 px-8 border-y border-[#125DB94D] ${
                pathname === BASE_URL + link?.href && "text-selected"
              }`}
            >
              {link?.title}
            </Link>
          ))}
        </div>
      </section>
      <section className="col-span-8">
        <Outlet />
      </section>
    </main>
  );
}
