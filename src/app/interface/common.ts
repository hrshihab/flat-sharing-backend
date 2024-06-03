import { Role } from "@prisma/client";

export type IAuthUser = {
  userId: string;
  email: string;
  role: Role;
} | null;
