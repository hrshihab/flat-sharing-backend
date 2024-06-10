/* eslint-disable no-console */
import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import fs from "fs";
import multer from "multer";
import path from "path";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = (imageName: string, filePath: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { public_id: imageName },
      function (error, result) {
        if (error) {
          console.log(
            "Error in sending image to cloudinary",
            error.message,
            error.stack
          );
          reject(error);
        }
        resolve(result);
        // delete a file asynchronously
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err);
          } else {
            // console.log("file deleted");
          }
        });
      }
    );
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join("/tmp");
    //console.log("uploadDir", fs.mkdirSync(uploadDir));
    // Ensure the /tmp directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

export const upload = multer({ storage }).array("files", 10); // Allow up to 10 files

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
