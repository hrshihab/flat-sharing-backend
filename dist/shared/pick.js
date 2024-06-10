"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = (obj, keys) => {
    const finalPicked = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalPicked[key] = obj[key];
            //console.log("finalPicked", finalPicked[key]);
            //console.log("obj", obj[key]);
        }
    }
    return finalPicked;
};
exports.default = pick;
