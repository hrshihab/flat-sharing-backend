"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.sendImageToCloudinary = void 0;
/* eslint-disable no-console */
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
});
const sendImageToCloudinary = (imageName, filePath) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(filePath, { public_id: imageName }, function (error, result) {
            if (error) {
                console.log("Error in sending image to cloudinary", error.message, error.stack);
                reject(error);
            }
            resolve(result);
            // delete a file asynchronously
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log("Temporary file deleted");
                }
            });
        });
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
// Determine the upload directory
const uploadDir = process.env.NODE_ENV === "production"
    ? "/tmp"
    : path_1.default.join(process.cwd(), "uploads");
// Ensure the uploads directory exists locally
if (process.env.NODE_ENV !== "production" && !fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use appropriate directory based on environment
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
exports.upload = (0, multer_1.default)({ storage }).array("files", 10); // Allow up to 10 files
// /* eslint-disable no-console */
// import { v2 as cloudinary } from "cloudinary";
// import config from "../config";
// import fs from "fs";
// import multer from "multer";
// import path from "path";
// cloudinary.config({
//   cloud_name: config.cloudinary_cloud_name,
//   api_key: config.cloudinary_api_key,
//   api_secret: config.cloudinary_api_secret,
// });
// export const sendImageToCloudinary = (imageName: string, path: string) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       path,
//       { public_id: imageName },
//       function (error, result) {
//         if (error) {
//           console.log(
//             "Error in sending image to cloudinary",
//             error.message,
//             error.stack
//           );
//           reject(error);
//         }
//         resolve(result);
//         // delete a file asynchronously
//         fs.unlink(path, (err) => {
//           if (err) {
//             reject(err);
//           } else {
//             //console.log("file deleted");
//           }
//         });
//       }
//     );
//   });
// };
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(process.cwd(), "uploads");
//     // Ensure the uploads directory exists
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
//     );
//   },
// });
// export const upload = multer({ storage }).array("files", 10); // Allow up to 10 files
