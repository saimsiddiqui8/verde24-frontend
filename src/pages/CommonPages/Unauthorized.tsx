import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="h-[80vh] flex flex-col justify-center items-center gap-2">
      <h2 className="text-5xl">401!</h2>
      <h3 className="text-3xl">Unauthorized!</h3>
      <button className="form-btn !w-48 mt-3" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
