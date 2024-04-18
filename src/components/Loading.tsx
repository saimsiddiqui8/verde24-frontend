import { RevolvingDot } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Loading = () => {
  const loading = useSelector((state: RootState) => state.loading.loading);
  console.log(loading);
  return (
    <>
      {loading ? (
        <div className="fixed h-full w-full bg-[#000000aa] flex justify-center items-center z-50">
          <RevolvingDot
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="revolving-dot-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : null}
    </>
  );
};

export default Loading;
