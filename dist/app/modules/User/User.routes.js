"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const User_controller_1 = require("./User.controller");
const User_validation_1 = require("./User.validation");
const validateRequest_1 = __importDefault(
  require("../../middleware/validateRequest")
);
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
//console.log("Done");
router.post(
  "/register",
  (0, validateRequest_1.default)(
    User_validation_1.userValidation.userCreateValidationSchema
  ),
  User_controller_1.userController.createUser
);
router.get(
  "/profile",
  (0, auth_1.default)(),
  User_controller_1.userController.getUserProfile
);
router.put(
  "/profile",
  (0, auth_1.default)(),
  (0, validateRequest_1.default)(
    User_validation_1.userValidation.userUpdateValidationSchema
  ),
  User_controller_1.userController.updateUserProfile
);
exports.userRoutes = router;
