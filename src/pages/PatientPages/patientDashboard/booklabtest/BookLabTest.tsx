import {
  Button,
  DashboardSection,
  InputField,
} from "../../../../components";
import lablogo from "../../../../assets/lab-logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { GET_NEAREST_LABS, SEARCH_LABS_NAME, SEARCH_LABS_TEST } from "../patientProfile/queries";
import { findNearestLabs, SearchLabname, SearchLabtest } from "../../../../api/apiCalls/patientsApi";
import { useMutation, useQuery } from "react-query";
import { RiMapPinLine, RiTimerLine } from "react-icons/ri";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import ImageUrl from "../../../../components/Icons/Sidemenu/ImageUrl";


export default function BookLabTest() {
  const [radius, setRadius] = useState("");
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [labs, setLabs] = useState<any[]>([]);
  const [labSearch, setLabSearch] = useState("");
  const [testSearch, setTestSearch] = useState("");

  const latitude = useSelector(
    (state: RootState) => state.user.currentUser?.latitude
  );
  const longitude = useSelector(
    (state: RootState) => state.user.currentUser?.longitude
  );
  const labWrapperRef = useRef<HTMLDivElement>(null);
  const testWrapperRef = useRef<HTMLDivElement>(null);
  const [isLabDropdownOpen, setIsLabDropdownOpen] = useState(false);
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (labWrapperRef.current && !labWrapperRef.current.contains(e.target as Node)) {
        setIsLabDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (testWrapperRef.current && !testWrapperRef.current.contains(e.target as Node)) {
        setIsTestDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownOptions = useMemo(
    () => [
      { label: "5 km", value: "5" },
      { label: "10 km", value: "10" },
      { label: "15 km", value: "15" },
      { label: "20 km", value: "20" },
      { label: "25 km", value: "25" },
      { label: "All", value: "750" },
    ],
    []
  );

  const getNearestLab = useCallback(async () => {
    if (!latitude || !longitude) return;
    return findNearestLabs(GET_NEAREST_LABS, {
      latitude,
      longitude,
      radiusInKm: Number(radius),
    });
  }, [latitude, longitude, radius]);

  const { mutateAsync, isLoading } = useMutation(getNearestLab);

  const handleSearch = useCallback(async () => {
    if (!radius) {
      setError("Please select a radius");
      return;
    }
    setError("");
    setSearched(true);

    try {
      const result = await mutateAsync();
      setLabs(result || []);
    } catch (error) {
      console.error("Error fetching labs:", error);
      setLabs([]);
    }
  }, [radius, mutateAsync]);

  const noLabsMessage =
    searched && !isLoading && labs.length === 0 ? (
      <p className="text-center text-red-500 mt-4">
        No labs found in {radius} km radius
      </p>
    ) : null;


    const { data: labResults, refetch } = useQuery(
      ["searchLabs", labSearch],
      () => SearchLabname(SEARCH_LABS_NAME, { labName: labSearch }),
      {
        enabled: false, 
        keepPreviousData: true,
      }
    );

    const { data: labtestResults, refetch:testrefetch } = useQuery(
      ["searchLabsTest", testSearch],
      () => SearchLabtest(SEARCH_LABS_TEST, { labTestName: testSearch }),
      {
        enabled: false, 
        keepPreviousData: true,
      }
    );
    
    useEffect(() => {
      const debounce = setTimeout(() => {
        if (labSearch.trim() !== "") {
          refetch();
        }
        if (testSearch.trim() !== "") {
          testrefetch();
        }
      }, 500);
    
      return () => clearTimeout(debounce);
    }, [labSearch, testSearch]);
    

  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row justify-between my-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">Select Lab</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
  <div className="relative w-full sm:w-2/6">
    <select
      name="radius"
      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-primary placeholder:text-blue-600 bg-transparent rounded-lg border border-primary appearance-none focus:outline-none peer"
      value={radius}
      onChange={(e) => {
        setRadius(e.target.value);
        setSearched(false);
      }}
    >
      <option value="" disabled>
        Select Radius
      </option>
      {dropdownOptions.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
      <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 20 20">
        <path d="M5.23 7.21a.75.75 0 011.04.02L10 10.958l3.73-3.73a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.04z" />
      </svg>
    </div>
  </div>

  <div className="relative w-full sm:w-2/5" ref={labWrapperRef}>
    <InputField
      label="Search Labs"
      placeholder="Search lab by name"
      value={labSearch}
      onFocus={() => setIsLabDropdownOpen(true)}
      onChange={(e) => setLabSearch((e.target as HTMLInputElement).value)}
    />
    {labSearch && isLabDropdownOpen && (
      <div className="absolute w-full bg-white border top-20 rounded-md shadow-md z-10 max-h-40 overflow-y-auto">
        {(labResults ?? []).length > 0 ? (
          labResults.map((lab: SearchLabName) => (
            <div
              key={lab.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <Link to={`/patient-dashboard/book-lab-test/lab-profile/${lab?.id}`}>
                <div className="font-medium">{lab.lab_name}</div>
                <div className="text-sm text-gray-500">{lab.place_name}</div>
              </Link>
            </div>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-gray-500">
            No labs found for {labSearch}
          </div>
        )}
      </div>
    )}
  </div>

  <div className="relative w-full sm:w-2/5" ref={testWrapperRef}>
    <InputField
      label="Search Lab Tests"
      placeholder="Search lab test by name"
      value={testSearch}
      onFocus={() => setIsTestDropdownOpen(true)}
      onChange={(e) => setTestSearch((e.target as HTMLInputElement).value)}
    />
    {testSearch && isTestDropdownOpen && (
      <div className="absolute w-full bg-white border top-20 rounded-md shadow-md z-10 max-h-40 overflow-y-auto">
        {(labtestResults ?? [])?.length > 0 ? (
          labtestResults?.map((labtest: LabTest) => (
            <Link to={`/patient-dashboard/book-lab-test/lab-profile/${labtest?.lab_id}`} key={labtest?.lab_id}>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                {labtest?.title}
              </div>
            </Link>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-gray-500">
            No tests found for {testSearch}
          </div>
        )}
      </div>
    )}
  </div>

  <Button
    onClick={handleSearch}
    title={isLoading ? "Searching..." : "Search"}
    className="w-full sm:w-auto"
    secondary
  />
</div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!radius ? (
        <p className="text-center text-primary text-2xl mt-4">
          Please search radius
        </p>
      ) : (
        noLabsMessage
      )}

      {labs.map((lab, index) => (
       <Link to={`/patient-dashboard/book-lab-test/lab-profile/${lab?.id}`}>
        <div
          key={index}
          className="border-primary border rounded-lg p-3 cursor-pointer mt-4"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 my-2">
            <div className="w-32 sm:w-1/5 relative flex-shrink-0">
            {lab?.logo ? <ImageUrl fileKey={lab?.logo} /> :   <img
                src={lablogo}
                alt="Doctor"
                className="w-full h-auto p-2 rounded-full mx-auto"
              />}
            
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-3xl font-medium">
                {lab.lab_name} | {lab.name}
              </h2>
              <div className="flex justify-center sm:justify-between gap-10 mt-2">
                <div>
                  <p className="text-sm sm:text-base">Reviews</p>
                  <p className="font-medium">195</p>
                </div>
                <div>
                  <p className="text-sm sm:text-base">Satisfaction</p>
                  <p className="font-medium">100%</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm sm:text-base">Distance</p>
                  <div className="flex items-center gap-1">
                    <RiMapPinLine size={20} className="text-primary" />
                    <p className="font-medium text-sm">{lab?.distance} km</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm sm:text-base">Duration</p>
                  <div className="flex items-center gap-1">
                    <RiTimerLine size={20} className="text-primary" />
                    <p className="font-medium text-sm">{lab?.duration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 my-2">
            <div className="border-primary border w-full sm:w-2/3 p-2 rounded-lg h-24">
              <h5 className="text-base text-center sm:text-left">
                Address : {lab.place_name}
              </h5>
            </div>
            <div className="w-full sm:w-1/3 p-2 rounded-lg flex flex-col gap-2 justify-center items-center">
              <Link to={`/patient-dashboard/book-lab-test/lab-profile/${lab?.id}`}>
                <Button className="w-36" title="Book Test" secondary />
              </Link>
              <Link to={`/patient-dashboard/book-lab-test/lab-details/${lab?.id}`}>
                <Button className="w-36" title="View Profile" secondary />
              </Link>
            </div>
          </div>
        </div>
       </Link>
      ))}
    </DashboardSection>
  );
}

type SearchLabName = {
  id: number;
  place_name: string;
  lab_name: string;
};

type LabTest = {
  lab_id: number;
  title: string;
};
