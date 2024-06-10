"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const User_controller_1 = require("./User.controller");
const User_validation_1 = require("./User.validation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const User_constant_1 = require("./User.constant");
const sendImageToCloudinary_1 = require("../../../shared/sendImageToCloudinary");
const router = express_1.default.Router();
//console.log("Done");
router.post("/register", (0, validateRequest_1.default)(User_validation_1.userValidation.userCreateValidationSchema), User_controller_1.userController.createUser);
router.get("/me", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN, User_constant_1.USER_ROLE.USER), User_controller_1.userController.getUserProfile);
router.patch("/editprofile", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN, User_constant_1.USER_ROLE.USER), (req, res, next) => {
    (0, sendImageToCloudinary_1.upload)(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        //console.log("files:", req.files); // Log the files
        console.log("req.body before parsing:", req.body); // Log the body before parsing
        try {
            if (req.body.data) {
                // Check if req.body.data is a string and parse it
                //console.log("req.body.data before parsing:", req.body.data);
                req.body = JSON.parse(req.body.data);
                //console.log("req.body after parsing:", req.body);
            }
            next();
        }
        catch (error) {
            console.error("JSON parsing error:", error.message);
            return res.status(400).json({
                message: "Invalid JSON in request body",
                error: error.message,
            });
        }
    });
}, (0, validateRequest_1.default)(User_validation_1.userValidation.userUpdateValidationSchema), User_controller_1.userController.updateUserProfile);
router.patch("/editstatus", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), (req, res, next) => {
    (0, sendImageToCloudinary_1.upload)(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        //console.log("files:", req.files); // Log the files
        console.log("req.body before parsing:", req.body); // Log the body before parsing
        try {
            if (req.body.data) {
                // Check if req.body.data is a string and parse it
                //console.log("req.body.data before parsing:", req.body.data);
                req.body = JSON.parse(req.body.data);
                //console.log("req.body after parsing:", req.body);
            }
            next();
        }
        catch (error) {
            console.error("JSON parsing error:", error.message);
            return res.status(400).json({
                message: "Invalid JSON in request body",
                error: error.message,
            });
        }
    });
}, (0, validateRequest_1.default)(User_validation_1.userValidation.userUpdateValidationSchema), User_controller_1.userController.updateUserStatus);
router.get("/all-user", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), User_controller_1.userController.getAllUser);
exports.userRoutes = router;
