import { Button, DashboardSection } from "../../../../components";
import { useNavigate, useParams } from "react-router-dom";
import { FIND_LAB_TEST_BY_ID } from "../../../LabPages/LabDashboard/labAccount/queries";
import { useQuery } from "react-query";
import { FindLabTestById } from "../../../../api/apiCalls/labApi";
import { useDispatch } from "react-redux";
import testimg from '../../../../assets/test-img.png'
import { loadingEnd, loadingStart } from "../../../../redux/slices/loadingSlice";
import { useEffect } from "react";
import { deleteLabDetail } from "../../../../redux/slices/LabBooking";




const TestProfile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
    if (!id) {
      navigate(-1);
    }
    }, [id , navigate])
    

      const {data , isLoading} = useQuery(
        ["labTest", id], 
        () => FindLabTestById(FIND_LAB_TEST_BY_ID, { findLabTestByIdId:  Number(id) }), 
        {
            enabled: !!id,
            onSuccess: () => dispatch(loadingEnd()), 
          }
      );
      if(isLoading){
        dispatch(loadingStart())
      }

      const handleback = ()=>{
        dispatch(deleteLabDetail());
        navigate(-1);
      }
  return (
    <DashboardSection>
 {data && <>
 <div className="w-full text-end"> 
  <Button onClick={handleback} title="Go back" secondary={true} className="rounded-xl w-24" />
 </div>
    <div className="flex flex-wrap justify-between px-8">
    <div className="w-full lg:w-3/6 flex flex-col items-center lg:items-start gap-6">
     <div className="self-start">
     <div className="w-full lg:w-3/4 text-center lg:text-left">
     <img src={testimg} alt="profile" className="rounded-full w-40 sm:w-52 lg:w-72" />
     </div>
        <h1 className="text-primary text-2xl font-bold my-3">{data?.title}</h1>
        <p className="text-primary my-1">Also known as a Vitamin A Blood</p>
        <h4 className="text-primary text-xl">Certified Labs</h4>
        <h1 className="text-primary text-2xl mt-2">${data?.price}</h1>
      </div>
    </div>

    <div className="w-full lg:w-3/6 bg-white p-6 md:p-8 border-2 border-[#3FB946] rounded-3xl mt-6 lg:mt-10">
      <h3 className="text-2xl font-bold text-[#3FB946] mb-4">
        Your Cart &nbsp; <span className="text-lg text-[#3FB946]">1 Test</span>
      </h3>
      <div className="pb-2 mb-2">
        <div className="flex justify-between border-t border-t-gray-500 pt-5">
          <span>{data?.title}</span>
          <span>${data?.price}</span>
        </div>
      </div>
      <div className="flex justify-around py-3 mt-6 font-bold text-lg border-2 border-[#3FB946] rounded-xl">
        <span className="text-[#3FB946]">Total</span>
        <span className="text-[#3FB946]">${data?.price}</span>
      </div>
      <div className="mt-4 text-center">
        <Button  onClick={()=> navigate(`/patient-dashboard/book-lab-test/stepper/${data?.id}`)} title="Proceed to Checkout" secondary={true} className="rounded-xl p-3 text-lg sm:text-2xl" />
      </div>
    </div>
  </div>
  <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-8 mt-5 lg:ms-12">
    <Button title="Add to Cart" secondary={true} className="rounded-xl w-40 sm:w-44 text-lg sm:text-xl p-3" />
    <Button onClick={()=> navigate(`/patient-dashboard/book-lab-test/stepper/${data?.id}`)} title="Book Now" secondary={true} className="rounded-xl w-40 sm:w-44 text-lg sm:text-xl p-3" />
  </div>
 </>}
</DashboardSection>

  );
};

export default TestProfile;
