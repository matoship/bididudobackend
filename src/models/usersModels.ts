export type UserEntry = {
  userName: string;
  icon: string;
};

export type UserSchema = {
  userName: string;
  icon: string;
  Exp: number;
  status: number;
};

export type joinedEventsSchema = {
  eventid: string;
  status: number;
  joinedTime: Date;
};
