import { getNodeVersion, isMac, isWindows, isX64 } from '../utils/index'
import type { INodeVersion, ResultPromise } from './install.type'
import { Url } from '../common/url'
import { mkdirVersion } from '../file/index'
import https from 'https'
import { dirName } from '../file'
import fs from 'node:fs'
import chalk from 'chalk'
import progress from 'cli-progress'
import tar from 'tar'
import AdmZip from 'adm-zip'
import zlib from 'zlib'
import { exec, spawnSync,execSync } from 'child_process'
import os from 'os'
import { EnvVar } from '../utils'
import path from 'path'
const concatBuff = (buffList: Array<any>) => {
    let buffSize = 0;
    for (let index = 0; index < buffList.length; index++) {
        const buff = buffList[index];
        buffSize = buffSize + buff.byteLength;
    }
    let ResponseData = Buffer.concat([...buffList], buffSize);
    return ResponseData;
}

const bar = new progress.SingleBar({
    format: '下载进度 |' + chalk.green('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
}, progress.Presets.shades_classic);
/**
 * 
 * @param version 版本
 * @returns  找到用户输入的版本号
 */
export const checkVersion = async (version: string) => {
    const list = await getNodeVersion<INodeVersion[]>()
    const result = list.find(v => v.version.includes(version))
    if (result) {
        console.log(chalk.green('找到该版本', result.version))
        if (fs.existsSync(`${dirName}/node-${result.version}`)) {
            console.log(chalk.red(`您之前安装过该版本 ${result.version}`))
            changeUserPorcessEvn(result.version)
            return null
        }
        mkdirVersion(result.version)
        return result
    } else {
        console.log(chalk.red('没有找到该版本', version))
        return null
    }
}

export const unZipFile = (result: INodeVersion): Promise<ResultPromise> => {
    console.log(chalk.green('开始解压文件'))
    return new Promise((resolve) => {
        if (isMac()) {
            const readSteam = fs.createReadStream(`${dirName}/${result.version}/node-${result.version}.tar.gz`)
            const unzipStream = zlib.createGunzip()
            const untarStream = tar.extract({
                cwd: `${dirName}/${result.version}`
            })
            readSteam.pipe(unzipStream).pipe(untarStream)
            untarStream.on('finish', () => {
                console.log(chalk.green('解压完成'))
                resolve({
                    success: true
                })
            })
        }

        if (isWindows()) {
            const zip = new AdmZip(`${dirName}/${result.version}/node-${result.version}.zip`);
            zip.extractAllTo(`${dirName}/${result.version}/`, true);
            resolve({
                success: true
            })
        }
    })


}

/**
 * 
 * @param result 核心步骤 下载文件 解压文件 移动文件  删除文件 
 */
export const instllNodeVersion = async (result: INodeVersion) => {
    if (result) {
        let url = `${Url.NODE_DOWNLOAD}${result.version}/node-${result.version}`
        let suffix = ''
        let token = ''
        if (isWindows()) {
            token = '-win-x64'
            url = url + `-win-x64.zip`
            suffix = 'zip'
        }
        if (isMac()) {
            //如果是mac 判断是不是arm64
            token = `-darwin-${isX64() ? 'x64' : 'arm64'}`
            url = url + `${token}.tar.gz`
            suffix = 'tar.gz'
        }
        //下载文件
        https.get(url, (res) => {
            let total = Number(res.headers['content-length'])
            let loadend = 0;
            const buffList: any[] = [];
            bar.start(total, 0);
            res.on('data', (chunk) => {
                buffList.push(chunk)
                loadend += chunk.length
                bar.update(loadend)
            })
            res.on('end', () => {
                bar.stop()
                //1.写入文件
                console.log(chalk.green('下载完成'))
                console.log(chalk.green('开始写入文件'))
                const buff = concatBuff(buffList)
                fs.writeFileSync(`${dirName}/${result.version}/node-${result.version}.${suffix}`, buff)
                console.log(chalk.green('写入完成'))
                //2.解压文件
                unZipFile(result).then(() => {
                    //3.移动文件
                    console.log(chalk.green('开始移动文件'))
                    fs.renameSync(`${dirName}/${result.version}/node-${result.version}${token}`, `${dirName}/node-${result.version}`)
                    console.log(chalk.green('移动文件完成'))
                    //4.删除文件
                    console.log(chalk.green('开始删除文件夹'))
                    fs.rmSync(`${dirName}/${result.version}`, { recursive: true })
                    console.log(chalk.green('删除文件夹完成'))
                    changeUserPorcessEvn(result.version)
                })
            })
        })
        //return console.log('暂时不支持该系统 请联系小满QQ 1195566313')
    }
}



export const changeUserPorcessEvn = (version: string) => {
    console.log(chalk.green('开始修改环境变量'))
    if (isWindows()) {
        //修改系统环境变量
        console.log(chalk.green('修改系统环境变量'))
        const result = execSync(`powershell -Command "[Environment]::GetEnvironmentVariable('ZSVM_VERSION', [System.EnvironmentVariableTarget]::Machine)"`,{encoding:'utf-8'});
        if(result){
            spawnSync('powershell', [`[Environment]::SetEnvironmentVariable("ZSVM_VERSION", "${[dirName,'node-'+ version].join(path.sep)}", "Machine")`], { stdio: 'inherit' })
        }else{
            spawnSync('powershell', [`[Environment]::SetEnvironmentVariable("ZSVM_VERSION", "${[dirName,'node-'+ version].join(path.sep)}", "Machine")`], { stdio: 'inherit' })
            spawnSync('powershell', [`[Environment]::SetEnvironmentVariable("Path", "%ZSVM_VERSION%;$env:Path", "Machine")`], { stdio: 'inherit' } )
        }
        //用户环境变量
        console.log(chalk.green('修改User环境变量'))
        const resultUser = execSync(`powershell -Command "[Environment]::GetEnvironmentVariable('ZSVM_VERSION', [System.EnvironmentVariableTarget]::User)"`,{encoding:'utf-8'});
        if(resultUser){
            spawnSync('powershell', [`[Environment]::SetEnvironmentVariable("ZSVM_VERSION", "${[dirName,'node-'+ version].join(path.sep)}", "User")`], { stdio: 'inherit' })
        }else{
            spawnSync('powershell', [`[Environment]::SetEnvironmentVariable("ZSVM_VERSION", "${[dirName,'node-'+ version].join(path.sep)}", "User")`], { stdio: 'inherit' })
            spawnSync('powershell', [`[Environment]::SetEnvironmentVariable("Path", "%ZSVM_VERSION%;$env:Path", "User")`], { stdio: 'inherit' } )
        }

    }
    if (isMac()) {
        let processEnv = new EnvVar(version)
        const zshrc = fs.readFileSync(`${os.homedir()}/.zshrc`, 'utf-8')
        if (!zshrc.includes(`PATH=$${processEnv.ZSVM_VERSION}`)) {
            exec(`echo 'export PATH=$${processEnv.ZSVM_VERSION}:$PATH' >> ~/.zshrc`)
        }
        exec(`source ~/.zshrc`)
    }
    console.log(chalk.green('修改环境变量完成'))
}
