import { eventMemberStatus } from "../models/eventsModels";

export const validateEventMemberStatus = (status: number): string[] => {
  const errors: string[] = [];
  if (status === undefined || status === null) {
    errors.push("Status field is required.");
  } else if (typeof status !== "number") {
    errors.push("Status must be a number.");
  } else if (!eventMemberStatus.includes(status)) {
    errors.push("wrong status");
  }

  // Additional validation logic can be added here

  return errors;
};
