import express from "express";
import { userRoutes } from "../modules/User/User.routes";
import { authRoutes } from "../modules/auth/auth.route";
import { FLatRoutes } from "../modules/flat/flat.route";
import { bookingRoutes } from "../modules/booking/booking.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/flat",
    route: FLatRoutes,
  },
  {
    path: "/flat-share-request",
    route: bookingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
