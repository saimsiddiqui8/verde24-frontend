import React, { useState, useRef } from "react";
import { Button, DashboardSection, InputField, PhoneInputComp } from "../../../../components";
import { Toaster } from "react-hot-toast";

const inputs = [
  {
    label: "Name",
    type: "text",
    placeholder: "Enter Name",
    name: "name",
  },
  {
    label: "Pharmacy Name",
    type: "text",
    placeholder: "Enter Pharmacy Name",
    name: "pharmacy_name",
  },
  {
    label: "City",
    type: "text",
    placeholder: "Enter City",
    name: "city",
  },
  {
    label: "Registration Number",
    type: "text",
    placeholder: "Enter Registration Number",
    name: "registration_number",
  },
  {
    label: "Registered Email",
    type: "email",
    placeholder: "Enter Registered Email",
    name: "registered_email",
  },
  {
    label: "Phone Number",
    type: "number",
    placeholder: "Enter Your Phone Number",
    name: "phone_number",
  },
];

const AccountManagement: React.FC = () => {
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    pharmacy_name: "",
    city: "",
    registration_number: "",
    registered_email: "",
    phone_number: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData, selectedFile);
  };

  return (
    <>
      <DashboardSection>
        <div>
          <form className="pt-2 pb-6" onSubmit={handleSubmit}>
            <div className="flex justify-between items-center my-4">
              <h2 className="text-2xl md:text-3xl font-semibold">Account Management</h2>
              <div className="flex gap-2">
                <Button
                  title="Edit"
                  className="w-20"
                  type="button"
                  onClick={() => setEdit(true)}
                />
                {edit && <Button onClick={() => setEdit(false)} title="Save" className="w-20" type="submit" />}
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/5">
                {inputs.map((input) => (
                  <div key={input.name} className="mb-4">
                    {input.name === "phone_number" ? (
                      <PhoneInputComp
                        label={input.label}
                        properties={{
                          value: formData[input.name as keyof typeof formData],
                          onChange: handleInputChange,
                          name: input.name,
                        }}
                        error={null}
                        disabled={!edit}
                      />
                    ) : (
                      <InputField
                        label={input.label}
                        name={input.name}
                        placeholder={input.placeholder}
                        type={input.type}
                        disabled={!edit}
                        properties={{
                          value: formData[input.name as keyof typeof formData],
                          onChange: handleInputChange,
                        }}
                        error={null}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="w-full md:w-2/5 flex flex-col items-center">
                <div className="mt-1 flex flex-col items-center">
                  <span className="inline-block h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-2 border-green-500">
                    {selectedFile ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Selected logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 24H0V0h24v24z" fill="none" />
                        <path d="M12 0c-1.65 0-3.22.67-4.38 1.76L0 12h5v7h7v5l6.24-6.24c1.09-1.16 1.76-2.73 1.76-4.38 0-3.31-2.69-6-6-6zm2 13.5v-2h-4v-2h4V7l3 3-3 3.5z" />
                      </svg>
                    )}
                  </span>
                  <button
                    className="mt-2 bg-white rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    type="button"
                    onClick={handleUploadClick}
                    style={{ color: "inherit" }}
                  >
                    Upload Logo
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <Toaster />
      </DashboardSection>
    </>
  );
};

export default AccountManagement;
