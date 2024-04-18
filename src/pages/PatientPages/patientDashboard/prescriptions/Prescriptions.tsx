import {
  Button,
  DashboardSection,
  DropdownField,
  InputField,
} from "../../../../components";
import pdfIcon from "../../../../assets/pdfIcon.png";
import { Link } from "react-router-dom";

const links = [{ title: "All Prescriptions", href: "/" }];

const BASE_URL = "/patient-dashboard/files";

export default function Prescriptions() {
  return (
    <DashboardSection>
      <div className="flex justify-between my-4">
        <h2 className="text-3xl font-semibold">Prescriptions</h2>
        <div className="flex gap-2">
          <Button title="Email" className="w-fit" secondary={true} />
          <Button title="Print" className="w-fit" secondary={true} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <InputField placeholder="Search by Disease" />
        <DropdownField
          options={[]}
          name="doctors"
          placeholder="Search by doctors"
        />
        <Button title="Search" className="w-fit" secondary />
      </div>
      <div className="my-4 grid grid-cols-12 gap-4">
        <div className="col-span-5">
          <div className="mt-2">
            {links.map((link) => (
              <Link
                to={BASE_URL + link?.href}
                className="flex py-0.5 px-8 border-b border-[#125DB94D]"
              >
                {/* <img className="fill-blue-500" src={link?.icon} /> */}
                {link?.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="col-span-7 flex flex-wrap justify-between gap-y-4">
          {[...Array(9)].map(() => (
            <div className="w-[30%]">
              <img src={pdfIcon} alt="Pdf Icon" className="w-full h-full" />
            </div>
          ))}
        </div>
      </div>
    </DashboardSection>
  );
}
