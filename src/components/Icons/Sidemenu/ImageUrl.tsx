import React from "react";
import { getUrl } from "../../../api/apiCalls/doctorsApi";
import { useQuery } from "react-query";
import pdfIcon from "../../../assets/pdfIcon.png";
import jpgIcon from "../../../assets/jpgicon.jpg";
import { useNavigate } from "react-router-dom";

const GET_IMG_URL = `
  query Query($fileKey: String!) {
    getFileUrl(fileKey: $fileKey)
  }
`;

type ImageComponentProp = {
  fileKey: string;
  istrue?:boolean;
  className?:string;
};

const ImageUrl: React.FC<ImageComponentProp> = ({ fileKey , istrue ,className}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getFileUrl", fileKey],
    queryFn: () => getUrl(GET_IMG_URL, { fileKey }),
    enabled: !!fileKey, 
  });
  const navigate = useNavigate();
  const handleOpenFile = (fileType: string) => {
    navigate("/patient-dashboard/files/view-file", { state: { fileUrl: data, fileType } });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary border-solid"></div>
      </div>
    );
  
  if (error) return <p>Error loading image</p>;

  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileKey);
  const isPDF = /\.pdf$/i.test(fileKey);

  return (
    <div className="my-2 text-center mx-auto">
      {isImage && !istrue ? (
        <img src={data} alt="image" className={`${className ?? "w-36 h-36"} rounded-full block mx-auto`}/>

      ) : isPDF ? (
        <>
          <img src={pdfIcon} alt="pdficon" className="w-32" />
          <button onClick={() => handleOpenFile("pdf")} className="text-blue-500 underline">
            View PDF
          </button>
        </>
      ): isImage && istrue ? (<><img src={jpgIcon} alt="jpgIcon" className="w-32" />
        <button onClick={() => handleOpenFile("image")} className="text-blue-500 underline">
            View JPG
          </button>
      </>
      ) : (
        <p className="text-gray-500">Unsupported file type</p>
      )}
    </div>
  );
};

export default ImageUrl;
