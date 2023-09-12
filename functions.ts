import { Func } from "./interfaces"
import { writeFile } from "fs/promises"



export const downloadFile: Func.DownloadAssets = async (url, filepath) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "GET"
        }).then(async res => {
            if(!res.ok) {
                throw `Response error on download ${ url }`
            }

            writeFile(filepath, Buffer.from(await res.arrayBuffer()), "binary")
        }).then(() => {
            resolve()
        }).catch(err => {
            reject(err)
        })
    })
}