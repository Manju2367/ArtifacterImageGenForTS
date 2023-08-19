"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = void 0;
const axios_1 = __importDefault(require("axios"));
const promises_1 = require("fs/promises");
const downloadFile = async (url, filepath) => {
    return new Promise((resolve, reject) => {
        axios_1.default.get(url, {
            responseType: "arraybuffer"
        }).then(res => {
            (0, promises_1.writeFile)(filepath, Buffer.from(res.data), "binary");
        }).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
};
exports.downloadFile = downloadFile;
