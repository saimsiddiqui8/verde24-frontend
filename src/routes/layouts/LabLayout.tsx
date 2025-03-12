import { Link, Outlet, useLocation } from "react-router-dom";
import labImg from "../../assets/lab-logo.png";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { getLabById } from "../../api/apiCalls/labApi";
import { FIND_LAB_QUERY } from "../../pages/LabPages/LabDashboard/labAccount/queries";
import { useQuery } from "react-query";
import ImageUrl from "../../components/Icons/Sidemenu/ImageUrl";

const links = [
  { title: "Account Management", href: "/" },
  { title: "Lab Location", href: "/lab-location" },
  { title: "Add Test", href: "/add-test" },
  { title: "Available Test", href: "/available-test" },
  { title: "Upcoming Lab Test", href: "/upcoming-lab-test" },
  { title: "Lab Booked Appointments", href: "/lab-booked-appointments" },
  { title: "Declined Appointments", href: "/declined-appointments" },
  { title: "Payments And Payouts", href: "/payments-and-payouts" },
  { title: "Collection Center", href: "/collection-center" },
];

const BASE_URL = "/lab-dashboard";

export default function LabLayout() {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
   const getLab = () => {
      if (!id) return;
      return getLabById(FIND_LAB_QUERY, { findLabByIdId: id });
    };
  
    const {data} = useQuery({
      queryKey: ["lab", id],
      queryFn: getLab,
    });
  const { pathname } = useLocation();
  return (
    <main className="grid grid-cols-1 md:grid-cols-12 my-8 mx-4 md:mx-8 text-primary gap-4 md:gap-8">
      <section className="col-span-1 md:col-span-3 pt-10 pb-5 h-fit border border-primary rounded-md relative">
        <div className="py-1 px-4">
        {data?.logo ? 
          <ImageUrl fileKey={data?.logo} /> : 
          <img
          src={labImg}
          alt="Doctor"
          className="w-24 md:w-36 h-24 md:h-36 rounded-full block mx-auto"
        />}
        </div>
        <div className="mt-5">
          {links.map((link, index) => (
            <Link
              key={index}
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
      <section className="col-span-1 md:col-span-9">
        <Outlet />
      </section>
    </main>
  );
}
