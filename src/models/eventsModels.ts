export type EventEntry = {
  ownerId: string;
  title: string;
  requireApplication: boolean;
  isVirtual: boolean;
  allowJoinMidGame: boolean;
  checkInType: number;
  description: string;
  pictures: string;
  headCount: number;
  allowMinimumStart: boolean;
  minStartHeadCount: number;
  currentParticipant: number;
  startTime: Date;
  endTime: Date;
  status: number;
};

export type EventQuery = {
  requireApplication: boolean;
  isVirtual: boolean;
  allowJoinMidGame: boolean;
  checkInType: number;
  headCount: number;
  allowMinimumStart: boolean;
  minStartHeadCount: number;
  currentParticipant: number;
  startTime: Date;
  endTime: Date;
  status: number;
};

export type EventMember = {
  userId: string;
  status: number;
};

export const eventStatus = [0, 1, 2, 3, 4];

// -1:cancelled; 0:joined; 1:arrived
export const eventMemberStatus = [-1, 0, 1];
