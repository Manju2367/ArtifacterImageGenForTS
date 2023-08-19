export namespace Func {

    export interface DownloadAssets {
        /**
         * ファイルをダウンロードする。
         * @param {string} url ダウンロードするファイルのURL
         * @param {string} filepath ファイルの保存パス
         * @returns {Promise<void>} 
         */
        (url: string, filepath: string): Promise<void>
    }

}