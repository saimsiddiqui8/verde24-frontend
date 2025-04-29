import { useNavigate, useParams } from "react-router-dom";
import { Button, DashboardSection, InputField } from "../../../../components";
import lablogo from "../../../../assets/lab-logo.png";
import ImageUrl from "../../../../components/Icons/Sidemenu/ImageUrl";
import {
  FIND_ALL_LAB_TEST_BY_LAB_ID,
  FIND_LAB_QUERY,
} from "../../../LabPages/LabDashboard/labAccount/queries";
import {
  FindAllLabTestByLabId,
  getLabById,
} from "../../../../api/apiCalls/labApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingEnd,
  loadingStart,
} from "../../../../redux/slices/loadingSlice";
import { AddLabTestType } from "../../../../api/apiCalls/types";
import { useEffect, useState } from "react";
import testimg from "../../../../assets/test-img.png";
import { RootState } from "../../../../redux/store";
import {
  addLabDetail,
  addLabTestLocal,
  clearAlllabTests,
  deleteLabDetail,
} from "../../../../redux/slices/LabBooking";
import { ADD_TO_CARD } from "../patientProfile/queries";
import { addToCard } from "../../../../api/apiCalls/patientsApi";
import { notifyFailure, notifySuccess } from "../../../../utils/Utils";
import { Toaster } from "react-hot-toast";

const AllLabTest = () => {
  const [search, setsearch] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const patientID = useSelector(
    (state: RootState) => state.user.currentUser?.id,
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) {
      navigate(-1);
    }
  }, [id, navigate]);

  const getLab = () => {
    if (!id) return;
    return getLabById(FIND_LAB_QUERY, { findLabByIdId: Number(id) });
  };

  const singleLabData = useQuery({
    queryKey: ["lab", id],
    queryFn: getLab,
  });

  const getAllLabTestById = () => {
    if (!id) return;
    return FindAllLabTestByLabId(FIND_ALL_LAB_TEST_BY_LAB_ID, {
      findAllLabTestsByLabIdId: Number(id),
    });
  };

  const { data } = useQuery({
    queryKey: ["labtest", id],
    queryFn: async () => {
      dispatch(loadingStart());
      return getAllLabTestById();
    },
    onSuccess: () => dispatch(loadingEnd()),
    onError: () => dispatch(loadingEnd()),
  });

  const handleaddtocard = async (labTest_id: number) => {
    if (!patientID) return;

    const response = await addToCard(ADD_TO_CARD, {
      data: { patient_id: patientID, labTest_id },
    });
    return response;
  };

  const { mutate } = useMutation(handleaddtocard, {
    onMutate: () => {
      dispatch(loadingStart());
    },
    onSuccess: () => {
      dispatch(loadingEnd());
      notifySuccess("Item added to cart!");
      queryClient.invalidateQueries(["patientcard", patientID]);
    },
    onError: (error: Error) => {
      dispatch(loadingEnd());
      notifyFailure(error.message || "Failed to add to cart!");
    },
  });

  const filteredData = data?.filter((item: AddLabTestType) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleviewprofile = (
    testid: number,
    amount: number,
    title: string,
    description: string,
  ) => {
    dispatch(
      addLabDetail({
        lab_id: Number(id),
        patient_id: patientID,
        currency: "usd",
      }),
    );
    dispatch(
      addLabTestLocal({
        title: title,
        price: amount,
        description: description,
        id: testid,
      }),
    );

    navigate(`/patient-dashboard/book-lab-test/stepper`);
  };
  const handleBack = () => {
    dispatch(deleteLabDetail());
    dispatch(clearAlllabTests());
    navigate(-1);
  };

  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-1">
        <h2 className="text-2xl sm:text-3xl font-semibold">Book Lab Test</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <InputField
          label="Search"
          placeholder="Search Test Here"
          value={search}
          onChange={(e: React.SyntheticEvent) =>
            setsearch((e.target as HTMLInputElement).value)
          }
        />
      </div>

      {singleLabData?.data && (
        <div className="border-primary border rounded-lg p-3 cursor-pointer">
          <div className="flex flex-col sm:flex-row items-center gap-4 my-2">
            <div className="w-32 sm:w-1/5 relative flex-shrink-0">
              {singleLabData?.data?.logo ? (
                <ImageUrl fileKey={singleLabData.data.logo} />
              ) : (
                <img
                  src={lablogo}
                  alt="Lab Logo"
                  className="w-full h-auto p-2 rounded-full mx-auto"
                />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-3xl font-medium">
                {singleLabData.data.lab_name} | {singleLabData.data.name}
              </h2>
              <div className="flex justify-center sm:justify-start gap-10 mt-2">
                <div>
                  <p className="text-sm sm:text-base">Reviews</p>
                  <p className="font-medium">195</p>
                </div>
                <div>
                  <p className="text-sm sm:text-base">Satisfaction</p>
                  <p className="font-medium">100%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 my-2">
            <div className="border-primary border w-full sm:w-2/3 p-2 rounded-lg">
              <h5 className="text-base text-center sm:text-left">
                Address: {singleLabData.data.place_name}
              </h5>
            </div>
            <div className="w-full sm:w-1/3 p-2 rounded-lg flex flex-col gap-2 justify-center items-center">
              <Button
                onClick={handleBack}
                className="w-36"
                title="Go back"
                secondary
              />
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {filteredData?.map((test: AddLabTestType, index: number) => (
          <div
            key={index}
            className="border border-primary py-2 rounded-3xl shadow-md flex flex-col items-center text-center"
          >
            <img
              src={testimg}
              alt="profile"
              className="rounded-full w-40 sm:w-52 lg:w-28"
            />
            <h2 className="text-xl font-semibold">
              {test?.title ?? "No Title Available"}
            </h2>
            <p className="text-sm">Price ${test?.price ?? "N/A"}</p>
            <div className="flex flex-col gap-3 mt-1">
              <Button
                onClick={() =>
                  test?.id &&
                  handleviewprofile(
                    test?.id,
                    test?.price,
                    test?.title,
                    test?.description,
                  )
                }
                className="w-32"
                title="View Profile"
                secondary
              />
              <Button
                onClick={() => test?.id && mutate(test?.id)}
                className="w-32"
                title="Add to Cart"
                secondary
              />
            </div>
          </div>
        ))}
      </div>
      <Toaster />
    </DashboardSection>
  );
};

export default AllLabTest;
