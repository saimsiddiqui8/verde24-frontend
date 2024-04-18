import { Link } from "react-router-dom";
import doctorsImg from "../../../assets/doctors.png";
import whiteLogoImg from "../../../assets/whiteLogo.png";
import syringeImg from "../../../assets/syringe.png";
import pillImg from "../../../assets/pill.png";
import cardImg1 from "../../../assets/homeCards/card1.png";
import cardImg2 from "../../../assets/homeCards/card2.png";
import cardImg3 from "../../../assets/homeCards/card3.png";
import cardImg4 from "../../../assets/homeCards/card4.png";
import cardImg5 from "../../../assets/homeCards/card5.png";
import consultImg1 from "../../../assets/consult/Uterus.png";
import consultImg2 from "../../../assets/consult/CamoCream.png";
import consultImg3 from "../../../assets/consult/Male.png";
import consultImg4 from "../../../assets/consult/Baby.png";
import consultImg5 from "../../../assets/consult/Psychotherapy.png";
import consultImg6 from "../../../assets/consult/Coughing.png";
import appImg1 from "../../../assets/appointment/image1.png";
import appImg2 from "../../../assets/appointment/image2.png";
import appImg3 from "../../../assets/appointment/image3.png";
import appImg4 from "../../../assets/appointment/image4.png";
import verdeAppImg1 from "../../../assets/verdeApp/image1.png";
import verdeAppImg2 from "../../../assets/verdeApp/image2.png";
import {
  Button,
  Footer,
  GooglePlayButton,
  InputField,
} from "../../../components";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import DropdownField from "../../../components/DropdownField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const cards = [
  {
    title: "Instant Video Consultation",
    desc: "Connect within 60 secs",
    img: cardImg1,
  },
  {
    title: "Find Doctor Near You",
    desc: "Conformed appointments",
    img: cardImg2,
  },
  { title: "Medicines", desc: "Essentials at your doorstep", img: cardImg3 },
  { title: "Lab Tests", desc: "Sample pickup at your home", img: cardImg4 },
  {
    title: "Surgeries",
    desc: "Safe and trusted surgery centers",
    img: cardImg5,
  },
];

const consult = [
  { img: consultImg1, title: "Period doubts or Pregnancy " },
  { img: consultImg2, title: "Acne, pimple or skin issues" },
  { img: consultImg3, title: "Performance issues in bed" },
  { img: consultImg4, title: "Cold, cough or fever" },
  { img: consultImg5, title: "Child not feeling well " },
  { img: consultImg6, title: "Depression or anxiety" },
];

const appointment = [
  {
    img: appImg1,
    title: "Dentist",
    desc: "Teething troubles? Schedule a dental checkup",
  },
  {
    img: appImg2,
    title: "Gynecologist/Obstetrician",
    desc: "Explore for women's health, pregnancy and infertility treatments",
  },
  {
    img: appImg3,
    title: "Dietitian/Nutrition",
    desc: "Get guidance on eating right, weight management and sports nutrition",
  },
  {
    img: appImg4,
    title: "Physiotherapist",
    desc: "Pulled a muscle? Get it treated by a trained physiotherapist",
  },
];

const FormSchema = z.object({
  location: z.string().min(1, { message: "Location is required" }),
  search: z.string().min(1, { message: "Search is required" }),
});

export default function Homepage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(FormSchema) });

  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    // <div className="h-[80vh] flex justify-center items-center gap-4">
    //   <div className="w-36">
    //     <Link
    //       to="patient/sign-in"
    //       className="form-btn py-3 px-4 block text-center"
    //     >
    //       Patients
    //     </Link>
    //   </div>
    //   <div className="w-36">
    //     <Link
    //       to="doctor/sign-in"
    //       className="form-btn py-3 px-4 block text-center"
    //     >
    //       Doctor
    //     </Link>
    //   </div>
    //   <div className="w-36">
    //     <Link
    //       to="admin/sign-in"
    //       className="form-btn py-3 px-4 block text-center"
    //     >
    //       Admin
    //     </Link>
    //   </div>
    // </div>
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-8 flex flex-col sm:flex-row gap-2 sm:gap-4 px-8 items-center">
          <div className="w-11/12 sm:w-48">
            <InputField
              label="Location"
              placeholder="Nigeria"
              properties={{ ...register("location") }}
              error={errors["location"]}
            />
          </div>
          <div className="w-11/12 sm:w-80">
            <DropdownField
              label=""
              name="search"
              placeholder="Search by doctors, Clinic & hospitals, etc"
              options={[{ label: "One", value: "1" }]}
              properties={{ ...register("search") }}
              error={errors["search"]}
            />
          </div>
          <Link to="/patient/sign-in">
            <Button title="Search" className="w-22" />
          </Link>
        </div>
      </form>
      <div
        style={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),linear-gradient(272.02deg, #3FB98F 19.91%, #125DB9 78.47%)",
        }}
        className="relative flex flex-col sm:flex-row items-center bg-gradient-to-br to-[#3FB98F] from-[#125DB9] bg-opacity-20 w-[95%] sm:w-[99%] mx-auto my-8 py-8 sm:px-8 md:px-16 lg:px-32 rounded-xl"
      >
        <div className="w-full sm:w-7/12 sm:px-0">
          <div className="flex justify-center sm:justify-start gap-2">
            <img src={whiteLogoImg} alt="" className="w-16" />
            <h5 className="text-white">Transform</h5>
          </div>
          <h2 className="text-2xl font-semibold text-center sm:text-start text-white mt-1">
            Live a diabetes-free life
          </h2>
          <p className="text-sm text-center sm:text-start text-white">
            Join Verde’s Remission Program
          </p>
          <div className="flex flex-col sm:flex-row mt-2 sm:mt-0 gap-4 items-center">
            <div className="flex gap-2">
              <img src={syringeImg} alt="" className="w-5" />
              <p className="text-white">Reduce HbA1c</p>
            </div>
            <div className="flex gap-2">
              <img src={pillImg} alt="" className="w-5" />
              <p className="text-white">No more Medications</p>
            </div>
          </div>
          <div className="w-40 mx-auto sm:mx-0">
            <Link to="/patient/sign-up">
              <Button title="Sign-up today" className="mt-4" />
            </Link>
          </div>
        </div>
        <div className="w-full sm:w-5/12">
          <img src={doctorsImg} alt="" className="w-full" />
        </div>
        <div className="absolute bottom-0 right-0 bg-white p-2 rounded-tl-lg">
          <p>
            Based on medically proven research | Personalized care from medical
            team
          </p>
        </div>
      </div>
      <div className="flex justify-evenly flex-wrap my-12">
        {cards?.map((card) => (
          <div className="w-56 rounded-2xl shadow-xl text-primary">
            <div className="h-[70%] overflow-clip relative">
              <img src={card?.img} alt="" className="w-full object-cover" />
            </div>
            <div className="h-[30%] flex flex-col items-center gap-2 justify-center p-2">
              <h4 className="text-lg text-center">{card?.title}</h4>
              <p className="text-base text-center">{card?.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="my-12 px-8">
        <h2 className="text-2xl font-semibold">
          Consult top doctors online for any health concern
        </h2>
        <p className="text-base">
          Private online consultations with verified doctors in all specialists
        </p>
      </div>
      <div className="flex justify-evenly flex-wrap my-8">
        {consult?.map((card) => (
          <div className="w-40 text-primary">
            <div className="overflow-clip relative">
              <img src={card?.img} alt="" className="w-full object-cover" />
            </div>
            <div className="flex flex-col items-center gap-2 justify-center p-2">
              <h4 className="text-lg text-center">{card?.title}</h4>
            </div>
          </div>
        ))}
      </div>
      <div className="my-12 px-8">
        <h2 className="text-2xl font-semibold">
          Book an appointment for an in-clinic consultation
        </h2>
        <p className="text-base">
          Find experienced doctors across all specialties
        </p>
      </div>
      <div className="flex justify-evenly flex-wrap my-8">
        {appointment?.map((card) => (
          <div className="w-72 text-primary">
            <div className="overflow-clip relative">
              <img src={card?.img} alt="" className="w-full object-cover" />
            </div>
            <div className="flex flex-col items-center gap-2 justify-center p-2">
              <h4 className="text-lg text-center">{card?.title}</h4>
              <p className="text-base text-center">{card?.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-5/6 h-[1px] bg-primary mx-auto my-8"></div>
      <div className="flex justify-center items-center gap-4 flex-wrap my-8 px-8">
        <div className="w-80 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">
            Read top articles from health experts
          </h2>
          <p className="text-base">
            Health articles that keep you informed about good health practices
            and achieve your goals.
          </p>
          <div className="w-44 mx-auto sm:mx-0">
            <Button title="See all Articles" />
          </div>
        </div>
        <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
          {appointment?.slice(2)?.map((card) => (
            <div className="w-72 text-primary">
              <div className="overflow-clip relative">
                <img src={card?.img} alt="" className="w-full object-cover" />
              </div>
              <div className="flex flex-col items-center gap-2 justify-center p-2">
                <h4 className="text-lg text-center">{card?.title}</h4>
                <p className="text-base text-center">{card?.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-5/6 h-[1px] bg-primary mx-auto my-8"></div>
      <div className="flex flex-col items-center justify-center gap-4 my-12 w-4/5 sm:w-1/2 md:w-1/4 mx-auto">
        <h2 className="text-2xl font-semibold text-center">
          What our users have to say
        </h2>
        <p className="text-base text-center">
          Health articles that keep you informed about good health practices and
          achieve your goals.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-12 px-4 sm:px-8">
        <div className="w-72 relative">
          <img src={verdeAppImg1} alt="" className="w-44" />
          <img
            src={verdeAppImg2}
            alt=""
            className="absolute w-28 top-1/2 right-1/4 transform -translate-y-1/2"
          />
        </div>
        <div className="w-11/12 sm:w-80 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-[#222]">
            Download the Verde app
          </h2>
          <p className="text-sm text-[#222]">
            Access video consultation with United State’s top doctors on the
            Verde app. Connect with doctors online, available 24/7, from the
            comfort of your home.
          </p>
          <p className="text-base text-[#222]">
            Get the link to download the app
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <InputField label="Email" placeholder="Enter Email" />
            <Button title="Send Email" className="text-sm w-28" />
          </div>
          <div className="flex flex-col items-center sm:flex-row gap-2">
            <GooglePlayButton icon={<FaGooglePlay size={25} fill="white" />} />
            <GooglePlayButton icon={<FaApple size={25} fill="white" />} />
            {/* <Button title="See all Articles" /> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
