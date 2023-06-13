
import { EnvVar, isMac, isWindows } from '../utils'
import { exec } from 'child_process'
import chalk from 'chalk'
import { getVersionList } from './list'
import { spawnSync } from 'child_process'
import path from 'path'
import { dirName } from '../file'
export const useVersion = (version: string) => {
    let versionList = getVersionList(false)
    const suffix = 'node-v'
    if (versionList.includes(suffix + version)) {
        console.log(chalk.green('切换版本', version))
        if(isWindows()){
            spawnSync('powershell', [`[Environment]::SetEnvironmentVariable("ZSVM_VERSION", "${[dirName,'node-'+ version].join(path.sep)}", "User")`], { stdio: 'inherit' })
        }
        if(isMac()){
            new EnvVar(version)
            exec(`source ~/.zshrc`)
        }
        console.log(chalk.green('切换成功'))
    } else {
        console.log(chalk.red('没有找到该版本', version))
    }
}