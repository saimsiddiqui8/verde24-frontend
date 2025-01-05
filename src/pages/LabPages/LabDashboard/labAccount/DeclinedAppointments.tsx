import { DashboardSection } from "../../../../components";
import lablogo from '../../../../assets/labprofile/lablogo.png';
import testlogo from '../../../../assets/labprofile/testlogo.png';

const DeclinedAppointments = () => {
  const tests = [
    {
      name: "Collen",
      test: "Sugar Test",
      date: "Mon, 25 Dec 2024",
      status: "Booked",
    },
  ];

  return (
    <DashboardSection title="Upcoming Laboratory Tests">
      <div className="flex flex-wrap justify-between">
        <div className="w-full lg:w-3/5">
          {tests.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 mb-2 border border-primary rounded-lg bg-white"
            >
              <img
                src={testlogo}
                alt="profile"
                className="rounded-full w-12 h-12"
              />
              <div className="flex-1 ml-4">
                <div className="font-bold">{test.name}</div>
                <div>{test.test}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="mr-3 my-1 text-sm text-gray-600 text-primary">{test.date}</div>
                <div className="flex justify-center items-center gap-1">
                  <button
                    className="font-bold text-xs bg-red-500 border border-red-500 text-white px-6 py-2 rounded-[10px]"
                  >
                    {test.status}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-1/5 flex justify-center mt-6 lg:mt-0">
          <img
            src={lablogo}
            alt="Lab logo"
            className="rounded-lg w-36 h-36"
          />
        </div>
      </div>
    </DashboardSection>
  );
};

export default DeclinedAppointments