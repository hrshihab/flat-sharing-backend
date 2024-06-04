import { MaritalStatus } from "@prisma/client";

export type IBooking = {
  flatId: string;
  userId: string;
  name: string;
  age: number;
  profession: string;
  maritalStatus: MaritalStatus;
  PresentAddress: string;
  phoneNo: string;
};
