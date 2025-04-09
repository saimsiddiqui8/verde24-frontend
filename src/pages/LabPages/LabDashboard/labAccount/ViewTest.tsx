import { Button, DashboardSection } from "../../../../components";
import { RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteLabTestById,
  FindAllLabTestByLabId,
} from "../../../../api/apiCalls/labApi";
import { DELETE_LAB_TEST_BY_ID, FIND_ALL_LAB_TEST_BY_LAB_ID } from "./queries";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AddlabtestType } from "../../../../api/apiCalls/types";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifyFailure, notifySuccess } from "../../../../utils/Utils";
import { Toaster } from "react-hot-toast";

const ViewTest = () => {
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getAllLabTestById = async () => {
    if (!id) return;
    const response = await FindAllLabTestByLabId(FIND_ALL_LAB_TEST_BY_LAB_ID, {
      findAllLabTestsByLabIdId: id,
    });
    if (!response) {
      throw new Error("finding lab tests failed!");
    }
    return response;
  };

  const { data } = useQuery({
    queryKey: ["labtest", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getAllLabTestById();
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error?.message || "Something went wrong!");
    },
  });

  const filteredData = data?.filter((test: AddlabtestType) =>
    test?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handledeletelabtest = async (Testid: number) => {
    dispatch(loadingStart());
    const response = await DeleteLabTestById(DELETE_LAB_TEST_BY_ID, {
      deleteLabTestId: Testid,
    });
    dispatch(loadingEnd());
    if (!response) {
      throw new Error("deleting lab test failed!");
    }
    return response;
  };

  const { mutate } = useMutation(handledeletelabtest, {
    onSuccess: () => {
      notifySuccess("Deleted Successfully!");
      queryClient.invalidateQueries(["labtest"]);
    },
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error?.message || "Something went wrong!");
    },
  });

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
          {searchTerm
            ? `No results found for "${searchTerm}"`
            : "No Lab Tests Available"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData?.map((test: AddlabtestType, index: number) => (
            <div
              key={index}
              className="border border-primary py-4 px-6 rounded-3xl shadow-md flex flex-col items-center text-center"
            >
              <h2 className="text-xl font-semibold">
                {test?.title ?? "No Title Available"}
              </h2>
              <p className="text-gray-500">
                {test?.description ?? "No Description Available"}
              </p>
              <p className="text-sm font-medium">
                Price: ${test?.price ?? "N/A"}
              </p>

              <div className="flex flex-col gap-4 mt-3 w-full">
                <Button
                  onClick={() =>
                    navigate(`/lab-dashboard/add-test/${test?.id}`)
                  }
                  title="Update"
                  className="w-full"
                />
                <Button
                  onClick={() => test?.id && mutate(test.id)}
                  title="Delete"
                  className="w-full text-white bg-red-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <Toaster />
    </DashboardSection>
  );
};

export default ViewTest;
