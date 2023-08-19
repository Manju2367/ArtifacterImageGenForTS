import { Func } from "./interfaces"

import axios from "axios"
import { writeFile } from "fs/promises"



export const downloadFile: Func.DownloadAssets = async (url, filepath) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            responseType: "arraybuffer"
        }).then(res => {
            writeFile(filepath, Buffer.from(res.data), "binary")
        }).then(() => {
            resolve()
        }).catch(err => {
            reject(err)
        })
    })
}