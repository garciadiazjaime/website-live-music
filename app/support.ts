import { Event } from "@/support/types";

export const getEventWithDateAndTime = (event: Event) => {
  const startDate = new Date(event.start_date);

  return {
    ...event,
    date: startDate.toLocaleDateString(),
    time: startDate.toTimeString().split(":")[0],
  };
};
