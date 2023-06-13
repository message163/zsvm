import fs from 'node:fs'
import { dirName } from '../file/index'
import chalk from 'chalk'
import { getCurrentVersion } from '../utils'
export const getVersionList = (isLog = true) => {
    const list = fs.readdirSync(`${dirName}`, { withFileTypes: true }).filter(dirent => {
        return dirent.isDirectory()
    })
    const currentVersion = getCurrentVersion()
    let suffix = 'node-v'
    if (isLog) {
        console.log(chalk.green('当前已安装的版本'), chalk.green(list.length))
        list.forEach((dirent) => {
            if(suffix + currentVersion == dirent.name){
                console.log(chalk.green(dirent.name),chalk.rgb(255, 192, 203)('(当前使用版本)'))
            }else{
                console.log(chalk.green(dirent.name))
            }
           
        })
        return []
    }else{
        return list.map(dirent => dirent.name)
    }
}