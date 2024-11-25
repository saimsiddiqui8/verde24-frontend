import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import {
  createDoctorTimeSlot,
  deleteDoctorTimeSlots,
  getDoctorTimeSlots,
} from "../../../../../api/apiCalls/doctorsApi";
import {
  Button,
  DashboardSection,
  Modal,
  TimePicker,
} from "../../../../../components";
import { RootState } from "../../../../../redux/store";
import { notifyFailure, notifySuccess } from "../../../../../utils/Utils";
import {
  ADD_SLOTS_QUERY,
  DELETE_TIME_SLOTS,
  GET_DOCTOR_TIMESLOTS,
} from "../consultationForm/queries";
import {
  loadingEnd,
  loadingStart,
} from "../../../../../redux/slices/loadingSlice";
import { TimeSlot } from "../../../../../api/apiCalls/types";

const FormSchema = z.object({
  slot_time: z.string().min(1, { message: "Slot Time is required" }),
});

const days = [
  { title: "Monday", slots: [], selected: true },
  { title: "Tuesday", slots: [], selected: false },
  { title: "Wednesday", slots: [], selected: false },
  { title: "Thursday", slots: [], selected: false },
  { title: "Friday", slots: [], selected: false },
  { title: "Saturday", slots: [], selected: false },
  { title: "Sunday", slots: [], selected: false },
];

const getdays = [
  { title: "Monday", selected: true },
  { title: "Tuesday", selected: false },
  { title: "Wednesday", selected: false },
  { title: "Thursday", selected: false },
  { title: "Friday", selected: false },
  { title: "Saturday", selected: false },
  { title: "Sunday", selected: false },
];

const dayStyles =
  "border-primary border-2 py-1.5 px-3 rounded-lg cursor-pointer font-bold";
const selectedStyles = "bg-primary text-white";

export default function AddSlots() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(FormSchema) });
  const [weekdays, setWeekdays] = useState<Days[]>(days);
  const [getweekdays, setgetWeekdays] = useState<weekDays[]>(getdays);
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const selectedDay = weekdays?.find((day) => day?.selected);
  const allEmpty = weekdays.every((day) => day.slots.length === 0);
  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const [doctorTimeSlots, setDoctorTimeSlots] = useState<TimeSlot[]>([]);

  const setgetSelectedDay = (title: string) => {
    setgetWeekdays((prev) =>
      prev?.map((day) => {
        if (day?.title === title) {
          return { ...day, selected: true };
        } else {
          return { ...day, selected: false };
        }
      }),
    );
  };

  const setSelectedDay = (title: string) => {
    setWeekdays((prev) =>
      prev?.map((day) => {
        if (day?.title === title) {
          return { ...day, selected: true };
        } else {
          return { ...day, selected: false };
        }
      }),
    );
  };

  const deleteSlots = () => {
    setWeekdays((prev) =>
      prev?.map((day) => {
        if (day?.title === selectedDay?.title) {
          return { ...day, slots: [] };
        } else {
          return { ...day };
        }
      }),
    );
  };

  const formatTimeTo12Hour = (time: string) => {
    let [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${suffix}`;
  };

  const onSubmit = (data: any) => {
    if (!selectedDay) return;
    const formattedTime = formatTimeTo12Hour(data.slot_time);

    const hasConflict = selectedDay.slots.some((slot) => {
      const existingTime = new Date(`1970-01-01T${slot}:00`);
      const newTime = new Date(`1970-01-01T${formattedTime}:00`);

      const timeDifference = Math.abs(
        existingTime.getTime() - newTime.getTime(),
      );
      return slot === formattedTime || timeDifference < 60 * 60 * 1000;
    });

    if (hasConflict) {
      alert(
        "This time slot conflicts with an existing slot for the selected day.",
      );
      return;
    }

    setWeekdays((prev) =>
      prev?.map((day) => {
        if (day?.title === selectedDay?.title) {
          return { ...day, slots: [...day.slots, formattedTime] };
        } else {
          return { ...day };
        }
      }),
    );
    setShowSlotsModal(false);
  };

  async function fetchData() {
    const responses = [];

    for (const day of weekdays) {
      try {
        if (day?.slots?.length > 0) {
          const response = await createDoctorTimeSlot(ADD_SLOTS_QUERY, {
            data: {
              doctor_id: parseInt(id!),
              weekday: day?.title,
              timeSlots: day?.slots.map((time: string) => ({
                time,
                status: "Available",
              })),
            },
          });
          if (response?.id) {
            const responseData = response;
            responses.push(responseData);
          }
          getDoctorTimeslot();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    return responses;
  }

  const handleSlots = async () => {
    dispatch(loadingStart());
    try {
      const allResponses = await fetchData();
      if (allResponses?.length > 0) {
        notifySuccess("Time Slots added!");
      }
      dispatch(loadingEnd());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getDoctorTimeslot = async () => {
    dispatch(loadingStart());
    try {
      const timeSlots = await getDoctorTimeSlots(GET_DOCTOR_TIMESLOTS, {
        findDoctorTimeSlotsId: id,
      });
      setDoctorTimeSlots(timeSlots);
      dispatch(loadingEnd());
    } catch (err: any) {
      notifyFailure(err.toString());
    }
  };

  useEffect(() => {
    if (!id) {
      dispatch(loadingStart());
      return;
    }

    getDoctorTimeslot();
  }, [id]);

  const getTimeSlotsForSelectedDay = () => {
    const selectedDay = getweekdays?.find((day) => day?.selected);

    if (selectedDay) {
      const selectedDayObject = doctorTimeSlots?.find(
        (slot) => slot?.weekday === selectedDay?.title,
      );

      return selectedDayObject || null;
    }

    return null;
  };

  const selectedDayObject = getTimeSlotsForSelectedDay();

  const handleDeletePermanent = async (id: number) => {
    dispatch(loadingStart());
    try {
      await deleteDoctorTimeSlots(DELETE_TIME_SLOTS, {
        deleteDoctorTimeSlotsId: id,
      });

      getDoctorTimeslot();
      dispatch(loadingEnd());
    } catch (error) {
      console.error("Error deleting time slots:", error);
    }
  };

  return (
    <>
      {!allEmpty && (
        <h4 className="text-red-500 font-bold mb-4">
          Please remember to save your changes after uploading the slot
          schedule.
        </h4>
      )}
      <DashboardSection title="Schedule Slots">
        {!allEmpty && (
          <div className="absolute top-2 right-2">
            <Button title="Save Changes" onClick={handleSlots} />
          </div>
        )}
        <div className="flex flex-wrap justify-between gap-2 my-4">
          {weekdays?.map((weekday, index) => (
            <div
              key={index}
              className={twMerge(
                `flex-1 min-w-[120px] text-center py-2 px-4 cursor-pointer ${dayStyles} ${weekday?.selected && selectedStyles}`,
              )}
              onClick={() => setSelectedDay(weekday?.title)}
            >
              {weekday?.title}
            </div>
          ))}
        </div>
        <div className="my-10">
          <div className="flex justify-between items-center my-2">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">Time Slots</h3>
              {selectedDay?.slots?.length! > 0 && (
                <span
                  className="flex gap-1 items-center font-bold text-sm text-red-500 cursor-pointer"
                  onClick={deleteSlots}
                >
                  <FaTrash size={20} fill="red" />
                  Delete all slots
                </span>
              )}
            </div>
            <div
              className="flex gap-2 font-medium cursor-pointer"
              onClick={() => setShowSlotsModal(true)}
            >
              <IoMdAddCircle size={25} />
              Add Slot
            </div>
          </div>
          <div className="my-4">
            {selectedDay?.slots?.length! > 0 ? (
              <div className="flex gap-2 items-center flex-wrap">
                {selectedDay?.slots?.map((slot, index) => (
                  <div
                    key={index}
                    className="py-1 px-4 font-bold text-white bg-gradient-to-b from-green-600 to-green-900"
                  >
                    {slot}
                  </div>
                ))}
              </div>
            ) : (
              <h4 className="text-center">No Slots Added Yet</h4>
            )}
          </div>
        </div>
      </DashboardSection>

      <Modal
        title="Add Time Slots"
        showModal={showSlotsModal}
        setModal={setShowSlotsModal}
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <TimePicker
            label="Slot Start Time"
            properties={{ ...register("slot_time") }}
            error={errors["slot_time"]}
          />
          <button type="submit" className="form-btn mt-2">
            Add
          </button>
        </form>
      </Modal>
      <DashboardSection>
        <div className="flex flex-wrap justify-between gap-2 my-2">
          <div className="w-full">
            <h1 className="text-3xl font-semibold my-3">View Slots</h1>
          </div>
          {getweekdays?.map((weekday, index) => (
            <div
              key={index}
              className={twMerge(
                `flex-1 min-w-[120px] text-center py-2 px-4 cursor-pointer ${dayStyles} ${weekday?.selected && selectedStyles}`,
              )}
              onClick={() => setgetSelectedDay(weekday?.title)}
            >
              {weekday?.title}
            </div>
          ))}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {selectedDayObject && selectedDayObject.timeSlots.length > 0 ? (
              <div className="w-full">
                <div className="flex w-full space-x-3">
                  {selectedDayObject.timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`flex-grow min-w-[120px] text-center ${dayStyles}`}
                    >
                      <span>
                        {slot?.status === "Booked" ? "Booked" : slot.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-start mt-4 gap-x-3">
                  <Button
                    onClick={() => {
                      handleDeletePermanent(selectedDayObject.id);
                    }}
                    title="Delete Slot"
                    className="w-fit"
                    secondary={true}
                  />
                </div>
                <div className="text-lg font-semibold mt-4">
                  if you want to changes slot then first delete then Add
                </div>
              </div>
            ) : (
              <div className="text-3xl font-semibold mt-4">
                No slot available
              </div>
            )}
          </div>
        </div>
      </DashboardSection>
    </>
  );
}

interface Days {
  title: string;
  slots: string[];
  selected: boolean;
}

interface weekDays {
  title: string;
  selected: boolean;
}
