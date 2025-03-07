import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../Button";
import { useEffect } from "react";

const FileViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileUrl = location.state?.fileUrl;
  const fileType = location.state?.fileType;

  useEffect(() => {
    if (!fileUrl) {
      navigate(-1);
    }
  }, [fileUrl, navigate]);

  if (!fileUrl) {
    return <p className="text-red-500 text-center mt-10">Invalid Access: No file provided!</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Button
        onClick={() => navigate(-1)}
        title="Go Back"
        className="w-full sm:w-fit self-start mb-2"
        secondary={true}
      />

      {fileType === "pdf" ? (
        <div className="w-full max-w-4xl overflow-auto border rounded-lg shadow-lg bg-white">
          <iframe
            src={fileUrl}
            className="w-full h-[80vh] min-w-[300px] sm:min-w-[600px] md:min-w-[800px]"
          />
        </div>
      ) : (
        <img
          src={fileUrl}
          alt="File"
          className="w-full max-w-[90%] sm:max-w-[70%] md:max-w-[50%] max-h-[500px] h-auto rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};

export default FileViewer;
