"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = void 0;
const promises_1 = require("fs/promises");
const downloadFile = async (url, filepath) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "GET"
        }).then(async (res) => {
            if (!res.ok) {
                throw `Response error on download ${url}`;
            }
            (0, promises_1.writeFile)(filepath, Buffer.from(await res.arrayBuffer()), "binary");
        }).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
};
exports.downloadFile = downloadFile;
