import { useState, useRef, useCallback, useEffect } from "react";
import { Button, DashboardSection } from "../../../components";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";
import locationicon from "../../../assets/location-icon.png";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import {
  getPharmacyById,
  updatePharmacyCordinatesById,
} from "../../../api/apiCalls/pharmacyApi";
import {
  FIND_PHARMACY_QUERY,
  UPDATED_PHARMACY_CORDINATES,
} from "./accountManagement/queries";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { updatePharmacyCoordinatesFData } from "../../../api/apiCalls/types";
import { Toaster } from "react-hot-toast";
import { notifyFailure, notifySuccess } from "../../../utils/Utils";

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];
const PharmacyLocation = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [edit, setEdit] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const queryClient = useQueryClient();
  const getPharmacy = async () => {
    if (!id) return;
    return getPharmacyById(FIND_PHARMACY_QUERY, {
      findPharmacyByIdId: id,
    });
  };

  const { data } = useQuery({
    queryKey: ["pharmacy", id],
    queryFn: getPharmacy,
    enabled: !!id,
  });

  const center = { lat: data?.latitude, lng: data?.longitude };

  const onLoadMap = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onLoadAutocomplete = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      setSearchBox(autocomplete);
    },
    [],
  );

  const onPlaceChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.geometry && place.geometry.location && map) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || "No address found",
        };
        setSelectedLocation(location);
        map.panTo(place.geometry.location);
        map.setZoom(15);
      }
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!edit) return;
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();

    if (lat === undefined || lng === undefined) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const location = {
          lat,
          lng,
          address: results[0].formatted_address,
        };
        setSelectedLocation(location);
      }
    });
  };

  useEffect(() => {
    if (data?.latitude && data?.longitude && data?.place_name) {
      setSelectedLocation({
        lat: data?.latitude,
        lng: data?.longitude,
        address: data?.place_name,
      });
    }
  }, [data]);

  const updatePharmacyCordinate = async (
    data: updatePharmacyCoordinatesFData,
  ) => {
    if (!id) return;
    return updatePharmacyCordinatesById(UPDATED_PHARMACY_CORDINATES, {
      updatePharmacyCoordinatesId: id,
      latitude: data?.latitude,
      longitude: data?.longitude,
      placeName: data?.placeName,
    });
  };

  const { data: updated, mutate } = useMutation(updatePharmacyCordinate);

  const handlePharmacyCordinate = () => {
    setEdit(false);
    if (!selectedLocation) {
      return;
    }
    if (
      selectedLocation?.lat === data?.latitude &&
      selectedLocation?.lng === data?.longitude &&
      selectedLocation?.address === data?.place_name
    ) {
      notifyFailure('You can"t save old location');
      return;
    }
    const updatedata = {
      latitude: parseFloat(selectedLocation?.lat?.toString() || "0"),
      longitude: parseFloat(selectedLocation?.lng?.toString() || "0"),
      placeName: selectedLocation?.address,
    };
    console.log("ddddddd", updatedata);

    mutate(updatedata);
  };

  useEffect(() => {
    if (updated?.latitude && updated?.longitude) {
      notifySuccess("Location Updated!");
      queryClient.invalidateQueries({
        queryKey: ["pharmacy"],
      });
    }
  }, [updated, queryClient]);

  return (
    <DashboardSection>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold">Select Location</h2>
        <div className="flex gap-2">
          <Button
            title="Edit"
            className="w-fit"
            onClick={() => setEdit(true)}
          />
          {edit && (
            <Button
              title="Save"
              className="w-fit"
              onClick={handlePharmacyCordinate}
            />
          )}
        </div>
      </div>

      <LoadScript
        googleMapsApiKey="AIzaSyD_UG0Q5SzKVBFPbxwfs1q9dRjnxsmhQBo"
        libraries={libraries}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="p-4 rounded-md shadow-md flex flex-col gap-4 bg-white">
            <Autocomplete
              onLoad={onLoadAutocomplete}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Location"
                className="w-full px-4 py-2 text-sm text-primary border border-primary rounded-md focus:outline-none"
                disabled={!edit}
              />
            </Autocomplete>

            <div>
              <h3 className="text-xl font-semibold mb-2">Selected Location</h3>
              {selectedLocation ? (
                <div className="text-sm my-2">
                  <div className="text-xs text-primary font-bold">
                    <p className="m-2">Latitude: {selectedLocation.lat}</p>
                    <p className="m-2">Longitude: {selectedLocation.lng}</p>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="rounded-full bg-pink-50 p-2 flex items-center justify-center">
                      <img
                        className="w-12 h-6"
                        src={locationicon}
                        alt="Location-icon"
                      />
                    </div>

                    <div>
                      <p className="font-medium text-sm">Current Location</p>
                      <p className="text-primary text-sm">
                        {selectedLocation.address}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No location selected</p>
              )}
            </div>
          </div>

          <div
            className={`relative h-[400px] rounded-lg shadow-md w-full ${!edit ? "pointer-events-none opacity-70" : ""}`}
          >
            <GoogleMap
              mapContainerClassName="w-full h-full rounded-lg"
              center={
                selectedLocation
                  ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
                  : center
              }
              zoom={selectedLocation ? 15 : 5}
              onLoad={onLoadMap}
              onClick={handleMapClick}
            >
              {selectedLocation && (
                <Marker
                  position={{
                    lat: selectedLocation.lat,
                    lng: selectedLocation.lng,
                  }}
                />
              )}
            </GoogleMap>
          </div>
        </div>
      </LoadScript>
      <Toaster />
    </DashboardSection>
  );
};

export default PharmacyLocation;
