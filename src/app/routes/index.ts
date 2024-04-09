import express from "express";
import { userRoutes } from "../modules/User/User.routes";
import { authRoutes } from "../modules/auth/auth.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: userRoutes,
  },
  {
    path: "/",
    route: authRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
