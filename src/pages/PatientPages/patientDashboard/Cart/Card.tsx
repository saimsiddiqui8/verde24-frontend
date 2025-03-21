import { useDispatch, useSelector } from "react-redux";
import { Button, DashboardSection } from "../../../../components";
import { RootState } from "../../../../redux/store";
import { DeleteCard, FindCardById } from "../../../../api/apiCalls/patientsApi";
import { CARD_BY_PATIENT_ID, DELETE_CARD } from "../patientProfile/queries";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { loadingEnd, loadingStart } from "../../../../redux/slices/loadingSlice";
import { notifySuccess } from "../../../../utils/Utils";
import { Toaster } from "react-hot-toast";

interface LabTest {
    title: string;
    price: number;
    description: string;
    lab_id: number;
  }
  
  interface CartItem {
    id: number;
    patient_id: number;
    labTest_id: number;
    labTest: LabTest;
  }
  
const Card = () => {
      const id = useSelector((state: RootState) => state.user.currentUser?.id);
      const dispatch = useDispatch();
      const queryClient = useQueryClient();
      
      const getCard = async () => {
        if (!id) return;
        return FindCardById(CARD_BY_PATIENT_ID, { patientId: id });
      };

      const handledeleteCard = async (deleteItemFromCartId:number) => {
        if (!id) return;
        return DeleteCard(DELETE_CARD, { deleteItemFromCartId: deleteItemFromCartId });
      };
      
        
       const { data } = useQuery({
              queryKey: ["patientcard", id],
              queryFn: async () => {
                dispatch(loadingStart()); 
                return getCard();
              },
              onSuccess: () => dispatch(loadingEnd()), 
            });

             const { mutate} = useMutation(handledeleteCard, {
                onMutate: () => {
                  dispatch(loadingStart()); 
                },
                onSuccess: () => {
                  dispatch(loadingEnd())
                  notifySuccess("Cart Deleted!");
                  queryClient.invalidateQueries(["patientcard", id]);
                },
              });

       const total = data?.reduce((total:number, item:CartItem) => total + item.labTest.price, 0)

  return (
    <DashboardSection title="Your Carts">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data?.length > 0 ? (
  data.map((item: CartItem, index: number) => (
    <div
      key={item.id}
      className="bg-white p-6 md:p-8 border-2 border-[#3FB946] rounded-3xl flex flex-col justify-center"
    >
      <h3 className="text-2xl font-bold text-[#3FB946] mb-4">
        Your Cart &nbsp;&nbsp;&nbsp;
        <span className="text-lg text-[#3FB946]">{index + 1} Test</span>
      </h3>

      <div className="pb-2 mb-2">
        <div className="flex justify-between border-y border-y-gray-500 py-3">
          <span>{item?.labTest?.title}</span>
          <span>${item?.labTest?.price}</span>
        </div>
        <p className="text-primary text-gray-600 mt-4">Preparation</p>
        <p className="text-primary text-gray-600 leading-5">{item?.labTest?.description}</p>
      </div>

      <div className="flex justify-around py-3 mt-6 font-bold text-lg border-2 border-[#3FB946] rounded-xl">
        <span className="text-[#3FB946]">Total</span>
        <span className="text-[#3FB946]">${item?.labTest?.price}</span>
      </div>

      <div className="m-auto mt-4">
        <Button
          onClick={() => mutate(item?.id)}
          title="Delete"
          secondary={true}
          className="rounded-xl w-32 p-3"
        />
      </div>
    </div>
  ))
) : (
  <p className="text-start text-primary text-xl font-semibold mt-5">No carts added</p>
)}
      </div>

     {data?.length > 0 &&  <div className="mt-8 border-2 border-primary p-6 flex flex-col items-center">
        <h3 className="text-2xl font-bold text-[#3FB946]">Grand Total</h3>
        <p className="text-lg text-primary font-semibold my-2">${total}</p>

          <Button title="Proceed to Checkout" secondary={true} className="rounded-xl w-52 text-lg p-3" />
      </div>}
      <Toaster/>
    </DashboardSection>
  );
};

export default Card;
