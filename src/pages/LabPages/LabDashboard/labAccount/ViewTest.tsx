import { Button, DashboardSection } from "../../../../components";
import { RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DeleteLabTestById, FindAllLabTestByLabId } from "../../../../api/apiCalls/labApi";
import { DELETE_LAB_TEST_BY_ID, FIND_ALL_LAB_TEST_BY_LAB_ID } from "./queries";
import { useQuery, useQueryClient } from "react-query";
import ImageUrl from "../../../../components/Icons/Sidemenu/ImageUrl";
import { AddlabtestType } from "../../../../api/apiCalls/types";
import { loadingEnd, loadingStart } from "../../../../redux/slices/loadingSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewTest = () => {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
   const queryClient = useQueryClient();
   const navigate = useNavigate();

  const getAllLabTestById = () => {
    if (!id) return;
    return FindAllLabTestByLabId(FIND_ALL_LAB_TEST_BY_LAB_ID, { findAllLabTestsByLabIdId: id });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["labtest", id],
    queryFn: getAllLabTestById,
    onSuccess: () => dispatch(loadingEnd()),
    onError: () => dispatch(loadingEnd()),
  });

  if (isLoading) {
    dispatch(loadingStart());
  }

  const filteredData = data?.filter((test: AddlabtestType) =>
    test?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handledeletelabtest = async (Testid: number) => {
    try {
      dispatch(loadingStart());
      await DeleteLabTestById(DELETE_LAB_TEST_BY_ID, { deleteLabTestId: Testid });
      queryClient.invalidateQueries(["labtest"]);
    } catch (error) {
      console.error("Failed to delete lab test:", error);
    } finally {
      dispatch(loadingEnd()); 
    }
  };
  

  return (
    <DashboardSection title="Lab Test">
      <div className="relative my-6">
        <input
          id="search"
          type="text"
          placeholder="Search..."
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block px-2.5 pb-2.5 pt-4 w-60 text-sm text-primary placeholder:text-blue-600 bg-transparent rounded-lg border border-primary appearance-none focus:outline-none peer"
        />
        <label
          htmlFor="search"
          className="absolute text-sm text-primary duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] whitespace-nowrap bg-white px-2 peer-focus:px-2 text-primary peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
        >
          Search Test
        </label>
      </div>

      {filteredData?.length <= 0 ? (
        <div className="min-h-[150px] flex flex-col justify-center items-center text-primary text-lg">
          {searchTerm ? `No results found for "${searchTerm}"` : "No Lab Tests Available"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData?.map((test: AddlabtestType, index: number) => (
            <div key={index} className="border p-4 rounded-lg shadow-md flex flex-col items-center text-center">
              {test?.images?.[0] && <ImageUrl fileKey={test?.images[0]} />}
              <h2 className="text-lg font-semibold mt-2">{test?.title ?? "No Title Available"}</h2>
              <p className="text-gray-500">{test?.description ?? "No Description Available"}</p>
              <p className="font-bold">Price: ${test?.price ?? "N/A"}</p>
              <p className="text-sm">Pickup Charge: ${test?.pickupCharge ?? "N/A"}</p>
              <div className="flex gap-4 mt-3">
                <Button onClick={() => navigate(`/lab-dashboard/add-test/${test?.id}`)}  title="Update" className="w-28 py-2" />
                <Button
  onClick={() => test?.id && handledeletelabtest(test.id)}
  title="Delete"
  className="w-28 py-2 bg-red-500 text-white"
/>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
};

export default ViewTest;
