import { execSync } from "child_process"
import { ResultVersion } from "./type"
import https from 'https'
import { Url } from "../common/url"


/**
 * 
 * @returns 获取用户的node 版本号
 */
export const isNode = (): ResultVersion => {
    try {
        const result = execSync('node -v').toString()
        return {
            status: true,
            version: result.substring(1, result.length - 1)
        }
    }
    catch (e) {
        console.error(e)
        return {
            status: false,
            version: ""
        }
    }
}

/**
 * 
 * @returns node所有的版本以及npm 版本 v8信息 List<{}>
 */
export const getNodeVersion = <T>(): Promise<T> => {
    //http 发送请求
    return new Promise<T>((resolve) => {
        https.get(Url.NODE_VERSION, (res) => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                resolve(JSON.parse(data))
            })
        }).on('error', (e) => {
            console.error(e)
        })
    })
}

/**
 * 
 * @returns 是不是windows
 */
export const isWindows = () => {
    return process.platform === 'win32'
}
/**
 * 
 * @returns 是不是mac
 */
export const isMac = () => {
    return process.platform === 'darwin'
}