import { USER_ROLE } from "./User.constant";

export type TUser = {
  username: string;
  email: string;
  password: string;
  profilePhoto?: string;
  status: UserStatus;
  role: TUserRole;
};

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export type TUserProfile = {
  name?: string;
};

export type TUserRole = keyof typeof USER_ROLE;
