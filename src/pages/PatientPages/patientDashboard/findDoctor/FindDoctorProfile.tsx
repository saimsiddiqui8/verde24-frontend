import {
  Button,
  ContentSection,
  DashboardSection,
  InputField,
} from "../../../../components";
import doctorImg from "../../../../assets/doctor.png";

export default function FindDoctorProfile() {
  return (
    <DashboardSection>
      <div className="flex justify-between my-4">
        <h2 className="text-3xl font-semibold">Profile</h2>
        <div className="flex gap-2">
          <Button
            title="Save Doctor Profile"
            className="w-fit"
            secondary={true}
          />
          <Button title="Subscribe" className="w-fit" secondary={true} />
          <Button title="Report Doctor" className="w-fit" secondary={true} />
        </div>
      </div>
      <div className="flex gap-2 items-center my-4">
        <InputField label="Location" />
        <div className="w-fit">
          <Button title="Search" secondary={true} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <ContentSection className="mt-0 mb-1.5">
          <div className="flex justify-between gap-2 my-2">
            <div className="w-1/5">
              <img
                src={doctorImg}
                alt="Doctor"
                className="w-full h-auto p-2 rounded-full block mx-auto"
              />
            </div>
            <div className="w-3/5">
              <h2 className="text-3xl font-medium">Dr Muhammad Sohaib Ahmed</h2>
              <p>BDS (Gold Medalist) FCPS Res. (Orthodontics), RDS</p>
              <p>Dentist</p>
              <div className="flex justify-between">
                <div>
                  <p>Reviews</p>
                  <p>195</p>
                </div>
                <div>
                  <p>Experience</p>
                  <p>10 years</p>
                </div>
                <div>
                  <p>Satisfaction</p>
                  <p>100%</p>
                </div>
              </div>
            </div>
            <div className="w-1/5 flex flex-col gap-2">
              <Button title="Book Clinic Visit" secondary={true} />
              <Button title="Video Call" secondary={true} />
              <Button title="View Timings" secondary={true} />
            </div>
          </div>
          <div className="flex justify-between gap-4 my-2">
            <div className="border-primary border w-1/3 p-2 rounded-lg flex flex-col gap-2">
              <p className="text-sm">Video Consultation</p>
              <p className="text-sm">Available today</p>
              <p className="text-sm">Rs 2500</p>
            </div>
            <div className="border-primary border w-2/3 p-2 rounded-lg">
              <h5 className="text-base">
                Smile Solutions | Dental Clinic | Orthodontic & Implant Centre,
                Model Town, Lahore
              </h5>
              <p className="text-sm">Available today</p>
              <p className="text-sm">Rs 1000</p>
            </div>
          </div>
        </ContentSection>
      </div>
      <ContentSection>
        <h2 className="text-2xl font-semibold">238 Community Reviews</h2>
        <div className="my-1">
          <div className="flex">
            <p className="w-1/3">Wait Time</p>
            <p>12 mins</p>
          </div>
          <div className="flex">
            <p className="w-1/3">Avg. Time to Patient</p>
            <p>14 mins</p>
          </div>
          <div className="flex">
            <p className="w-1/3">Diagnosis Satisfaction</p>
            <p>97%</p>
          </div>
        </div>
      </ContentSection>
      <ContentSection>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medium">Verified Patient</h2>
          <div>Rating</div>
        </div>
        <div>
          <p>
            Verified patient shared utmost satisfaction with the care and
            services provided by Dr. Umer Mushtaq at Chughtai Medical Centre ,.
          </p>
          <p>Satisfied with diagnosis and treatment</p>
          <p>PA & Staff was helpful</p>
          <p>Hospital / Clinic environment was well-maintained</p>
          <p>Review shared on Marham feedback call - 20 hours ago</p>
        </div>
      </ContentSection>
      <h2 className="text-2xl font-semibold">More Reviews</h2>
      <ContentSection>
        <h2 className="text-2xl font-semibold">Qualification</h2>
      </ContentSection>
      <ContentSection>
        <h2 className="text-2xl font-semibold">Experience</h2>
      </ContentSection>
      <ContentSection>
        <h2 className="text-2xl font-semibold">Services</h2>
      </ContentSection>
      <ContentSection>
        <h2 className="text-2xl font-semibold">Diseases</h2>
      </ContentSection>
      <ContentSection>
        <h2 className="text-2xl font-semibold">Symptoms</h2>
      </ContentSection>
      <ContentSection>
        <h2 className="text-2xl font-semibold">
          Professional Statement by Dr. Umer Mushtaq
        </h2>
      </ContentSection>
      <h2 className="text-2xl font-semibold my-2">See more Nearby Doctors</h2>
      <ContentSection className="mt-0 mb-1.5">
        <div className="flex justify-between gap-2 my-2">
          <div className="w-1/5">
            <img
              src={doctorImg}
              alt="Doctor"
              className="w-full h-auto p-2 rounded-full block mx-auto"
            />
          </div>
          <div className="w-3/5">
            <h2 className="text-3xl font-medium">Dr Muhammad Sohaib Ahmed</h2>
            <p>BDS (Gold Medalist) FCPS Res. (Orthodontics), RDS</p>
            <p>Dentist</p>
            <div className="flex justify-between">
              <div>
                <p>Reviews</p>
                <p>195</p>
              </div>
              <div>
                <p>Experience</p>
                <p>10 years</p>
              </div>
              <div>
                <p>Satisfaction</p>
                <p>100%</p>
              </div>
            </div>
          </div>
          <div className="w-1/5 flex flex-col gap-2">
            <Button title="Book Clinic Visit" secondary={true} />
            <Button title="Video Call" secondary={true} />
            <Button title="View Timings" secondary={true} />
          </div>
        </div>
        <div className="flex justify-between gap-4 my-2">
          <div className="border-primary border w-1/3 p-2 rounded-lg flex flex-col gap-2">
            <p className="text-sm">Video Consultation</p>
            <p className="text-sm">Available today</p>
            <p className="text-sm">Rs 2500</p>
          </div>
          <div className="border-primary border w-2/3 p-2 rounded-lg">
            <h5 className="text-base">
              Smile Solutions | Dental Clinic | Orthodontic & Implant Centre,
              Model Town, Lahore
            </h5>
            <p className="text-sm">Available today</p>
            <p className="text-sm">Rs 1000</p>
          </div>
        </div>
      </ContentSection>
    </DashboardSection>
  );
}
