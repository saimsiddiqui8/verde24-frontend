import { useState } from "react";
import { Button, DashboardSection, DropdownField, InputField } from "../../../../../components";
import { useForm } from "react-hook-form";

const inputs = [
  {
    label: "History",
    name: "history",
    type: "text",
    placeholder: "Enter History",
  },
  {
    label: "Complaints",
    name: "complaints",
    type: "text",
    placeholder: "Enter Complaints",
  },
  {
    label: "Lab Test",
    name: "lab_test",
    type: "select",
    options: [
      { label: "Blood Test", value: "blood_test" },
      { label: "X-Ray", value: "xray" },
      { label: "MRI", value: "mri" },
    ],
  },
  {
    label: "Special Requirements",
    name: "special_requirements",
    type: "text",
    placeholder: "Enter Special Requirements",
  },
  {
    label: "Observation",
    name: "observation",
    type: "text",
    placeholder: "Enter Observations",
  },
  {
    label: "Medicine Name",
    name: "medicine_name",
    type: "text",
    placeholder: "Enter Medicine Name",
  },
  {
    label: "Dosage",
    name: "dosage",
    type: "select",
    options: [
      { label: "1 Tablet", value: "1_tablet" },
      { label: "2 Tablets", value: "2_tablets" },
      { label: "5 ml", value: "5_ml" },
    ],
  },
  {
    label: "Frequency",
    name: "frequency",
    type: "select",
    options: [
      { label: "Once a day", value: "once_day" },
      { label: "Twice a day", value: "twice_day" },
      { label: "Thrice a day", value: "thrice_day" },
    ],
  },
  {
    label: "Days",
    name: "days",
    type: "select",
    options: [
      { label: "3 Days", value: "3_days" },
      { label: "5 Days", value: "5_days" },
      { label: "7 Days", value: "7_days" },
    ],
  },
  {
    label: "Special Instruction",
    name: "special_instruction",
    type: "text",
    placeholder: "Enter Special Instructions",
  },
];

const Communication = () => {
  const [fieldValues, setFieldValues] = useState<Record<string, string[]>>({
    history: [],
    complaints: [],
    lab_test: [],
    special_requirements: [],
    observation: [],
    medicine_name: [],
    dosage: [],
    frequency: [],
    days: [],
    special_instruction: [],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const updated = { ...fieldValues };
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
  updated[key] = [...(updated[key] || []), String(value)];
}

    });
    setFieldValues(updated);
    reset(); // clear form
  };

  const handleFinalSubmit = () => {
    console.log("Final submission data:", fieldValues);
    // You can send `fieldValues` to your API here
    setFieldValues({
      history: [],
      complaints: [],
      lab_test: [],
      special_requirements: [],
      observation: [],
      medicine_name: [],
      dosage: [],
      frequency: [],
      days: [],
      special_instruction: [],
    });
  };

  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-primary">Prescription</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT COLUMN - 25% */}
          <div className="w-full lg:w-[25%]">
            <h3 className="text-2xl font-extrabold text-[#3FB946]">Details</h3>

            {inputs.slice(0, 5).map((input, index) => (
              <div key={index}>
                {input.type === "select" ? (
                  <DropdownField
                    label={input.label}
                    name={input.name}
                    options={input.options!}
                    properties={{ ...register(input.name) }}
                    error={errors[input.name]}
                  />
                ) : (
                  <InputField
                    label={input.label}
                    name={input.name}
                    type="text"
                    placeholder={input.placeholder}
                    properties={{ ...register(input.name) }}
                    error={errors[input.name]}
                  />
                )}
              </div>
            ))}
          </div>

          {/* MIDDLE COLUMN - 25% */}
          <div className="w-full lg:w-[25%]">
            <h3 className="text-2xl font-extrabold text-[#3FB946]">Medication</h3>

            {inputs.slice(5).map((input, index) => (
              <div key={index}>
                {input.type === "select" ? (
                  <DropdownField
                    label={input.label}
                    name={input.name}
                    options={input.options!}
                    properties={{ ...register(input.name) }}
                    error={errors[input.name]}
                  />
                ) : (
                  <InputField
                    label={input.label}
                    name={input.name}
                    type="text"
                    placeholder={input.placeholder}
                    properties={{ ...register(input.name) }}
                    error={errors[input.name]}
                  />
                )}
              </div>
            ))}

            <Button title="Add Entry" className="text-xs w-28 h-9 mt-2" />
          </div>

          {/* RIGHT COLUMN - 50% */}
          <div className="w-full lg:w-[50%] bg-gray-50 p-5 rounded-md border border-gray-200">
            <h3 className="text-xl font-semibold text-[#3FB946] mb-4">Saved Entries</h3>

            {Object.entries(fieldValues).every(([, arr]) => arr.length === 0) ? (
              <p className="text-gray-500 italic">No entries added yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(fieldValues).map(([key, values]) =>
                  values.length > 0 ? (
                    <div key={key}>
                      <h4 className="font-semibold text-sm mb-1 capitalize">{key.replace(/_/g, " ")}</h4>
                      <ul className="list-decimal pl-4 text-xs text-gray-700 space-y-1">
                        {values.map((val, idx) => (
                          <li key={idx}>{val}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null
                )}
              </div>
            )}

            {Object.values(fieldValues).some(arr => arr.length > 0) && (
              <button
                type="button"
                className="mt-6 px-4 py-2 bg-primary text-white text-sm rounded-md"
                onClick={handleFinalSubmit}
              >
                Submit All to API
              </button>
            )}
          </div>
        </div>
      </form>
    </DashboardSection>
  );
};

export default Communication;
