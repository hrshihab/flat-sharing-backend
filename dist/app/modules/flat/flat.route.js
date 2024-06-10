"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FLatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const flat_controller_1 = require("./flat.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const flat_validation_1 = require("./flat.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const sendImageToCloudinary_1 = require("../../../shared/sendImageToCloudinary");
const User_constant_1 = require("../User/User.constant");
const router = express_1.default.Router();
router.post("/create-flat", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN, User_constant_1.USER_ROLE.USER), (req, res, next) => {
    //console.log(req.body, req.files); // Log the body
    (0, sendImageToCloudinary_1.upload)(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        //console.log("files:", req.files); // Log the files
        //console.log("req.body before parsing:", req.body); // Log the body before parsing
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
}, (0, validateRequest_1.default)(flat_validation_1.flatValidationSchema.flatValidation), flat_controller_1.flatController.addFlat);
router.get("/get-all-flats", 
//auth(USER_ROLE.ADMIN),
flat_controller_1.flatController.getFlats);
router.get("/get-my-flats", (0, auth_1.default)(User_constant_1.USER_ROLE.USER, User_constant_1.USER_ROLE.ADMIN), flat_controller_1.flatController.getFlatByUserId);
router.get("/getSingleFlat/:id", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN, User_constant_1.USER_ROLE.USER), flat_controller_1.flatController.getSingleFlat);
router.patch("/updateFLat/:flatId", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), flat_controller_1.flatController.updateFlat);
router.patch("/updateMyFLat/:id", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN, User_constant_1.USER_ROLE.USER), flat_controller_1.flatController.updateMyFlat);
router.delete("/deleteFlat/:flatId", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN, User_constant_1.USER_ROLE.USER), flat_controller_1.flatController.deleteFlat);
exports.FLatRoutes = router;
