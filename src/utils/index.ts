import { execSync } from "child_process"
import { ResultVersion } from "./type"
import https from 'https'
import { Url } from "../common/url"
import fs from 'fs'
import os from 'os'
import { dirName } from "../file"
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

export class EnvVar {
    version: string
    homedir: string
    zshrc: string
    ZSVM_VERSION:'ZSVM_VERSION'
    path: string
    public constructor(version: string) {
        this.version = version
        this.homedir = os.homedir()
        this.ZSVM_VERSION = 'ZSVM_VERSION'
        this.path = `${dirName}/node-${version}/bin`
        this.zshrc = fs.readFileSync(`${this.homedir}/.zshrc`, 'utf-8')
        this.init()
    }
    private init() {
        if (this.check()) {
            this.update()
        } else {
            this.add()
        }
    }

    check() {
        if (this.zshrc.includes(this.ZSVM_VERSION)) {
            return true
        }
        return false
    }
    add() {
       const createLine = `\nexport ${this.ZSVM_VERSION}="${this.path}" \n`
       fs.writeFileSync(`${this.homedir}/.zshrc`,this.zshrc + createLine)
       
    }
    update() {
        const regex = new RegExp(`^export ${this.ZSVM_VERSION}=.*$`, 'gm');
        const newLine = `export ${this.ZSVM_VERSION}="${this.path}"`
        const newZshrc = this.zshrc.replace(regex, newLine);
        fs.writeFileSync(`${this.homedir}/.zshrc`, newZshrc);
    }
}

export const getCurrentVersion = () => {
    const version = execSync('node -v').toString()
    return version && version.substring(1, version.length - 1)
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
/**
 * 
 * @returns 芯片处理逻辑 inter x64
 */
export const isX64 = () => {
    return process.arch === "x64"
}