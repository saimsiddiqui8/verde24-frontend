import { useEffect, useState } from "react";
import PatientDetails from "./PatientDetails";
import SelectTimeSlot from "./SelectTimeSlot";
import { DashboardSection } from "../../../../components";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

const Stepper = () => {
        const navigate = useNavigate();
  const [step, setStep] = useState(1);
    const Labbooking = useSelector((state: RootState) => state.Labbooking);
    const {labTests , lab_id} =
    Labbooking;
    useEffect(() => {
      if (labTests?.length === 0) {
        navigate(-1);
      }
      }, [labTests , navigate])
        
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const stepLabels = ["Add Patient Details", "Select Time Slot"];

  return (
   <DashboardSection>
     <div className="w-full mx-auto p-">
      <div className="flex items-center justify-between mb-6 relative">
        {[1, 2].map((num, index) => (
          <div key={num} className="relative flex-1 flex flex-col items-center justify-center">
            {index > 0 && (
              <div
                className={`absolute h-0.5 w-full -z-10 ${
                  step >= num ? "bg-[#3FB946]" : "bg-primary"
                }`}
                style={{ left: "-50%", top: "25%", transform: "translateY(-50%)" }}
              />
            )}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold z-10 ${
                step >= num ? "bg-[#3FB946]" : "bg-gray-400"
              }`}
            >
              {num}
            </div>
            <p className={`mt-2 ${
                step >= num ? "font-bold" : ""
              } ${
                step >= num ? "text-[#3FB946]" : "text-primary"
              }`}>{stepLabels[index]}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg">
        {step === 1 && <PatientDetails nextStep={nextStep} id={lab_id}  data={labTests}/>}
        {step === 2 && <SelectTimeSlot prevStep={prevStep} data={labTests}/>}
      </div>
    </div>
   </DashboardSection>
  );
};

export default Stepper;
