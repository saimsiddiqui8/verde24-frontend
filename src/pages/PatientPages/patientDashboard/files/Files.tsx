import {
  Button,
  DashboardSection,
  DropdownField,
  InputField,
} from "../../../../components";
import pdfIcon from "../../../../assets/pdfIcon.png";
import { Link } from "react-router-dom";

const links = [
  { title: "All Files", href: "/" },
  {
    title: "Medical Leave Certifications",
    href: "/medical-leave-certifications",
  },
];

const BASE_URL = "/patient-dashboard/files";

export default function Files() {
  return (
    <DashboardSection>
  <div className="flex flex-col sm:flex-row justify-between my-4">
    <h2 className="text-2xl sm:text-3xl font-semibold">Files</h2>
    <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
      <Button title="Email" className="w-full sm:w-fit" secondary={true} />
      <Button title="Send to Doctor" className="w-full sm:w-fit" secondary={true} />
      <Button title="Print" className="w-full sm:w-fit" secondary={true} />
      <Button title="Upload Prescription" className="w-full sm:w-fit" secondary={true} />
    </div>
  </div>
  <div className="flex flex-col sm:flex-row items-center gap-2 my-4">
    <InputField placeholder="Search by Disease" className="w-full sm:w-auto" />
    <DropdownField options={[]} name="doctors" placeholder="Search by doctors" className="w-full sm:w-auto" />
    <Button title="Search" className="w-full sm:w-fit" secondary />
  </div>
  <div className="my-4 grid grid-cols-1 md:grid-cols-12 gap-4">
    <div className="col-span-12 md:col-span-5">
      <div className="mt-2">
        {links.map((link,index) => (
          <Link
            key={index}
            to={BASE_URL + link?.href}
            className="flex py-0.5 px-4 sm:px-8 border-b border-[#125DB94D]"
          >
            {/* <img className="fill-blue-500" src={link?.icon} /> */}
            {link?.title}
          </Link>
        ))}
      </div>
    </div>
    <div className="col-span-12 md:col-span-7 flex flex-wrap justify-between gap-y-4">
      {[...Array(9)].map((_, index) => (
        <div key={index} className="w-full sm:w-[30%]">
          <img src={pdfIcon} alt="Pdf Icon" className="w-full h-full" />
        </div>
      ))}
    </div>
  </div>
</DashboardSection>

  );
}
