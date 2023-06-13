import fs from 'node:fs'
import { dirName } from '../file'
import chalk from 'chalk'
import { exec } from 'child_process'
import { getVersionList } from './list'
import { getCurrentVersion } from '../utils'
export const uninstallVersion = (version: string) => {
    if (getCurrentVersion() == version) {
        console.log(chalk.red('当前使用版本不能卸载'))
        return
    }
    const suffix = 'node-v'
    const versionList = getVersionList(false)
    if (versionList.includes(suffix + version)) {
        console.log(chalk.green('开始卸载', version))
        exec(`rm -rf ${dirName}/${suffix + version}`)
        console.log(chalk.green('卸载成功'))
    } else {
        console.log(chalk.red('没有找到该版本', version))
    }
}