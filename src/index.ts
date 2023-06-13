#!/usr/bin/env node
import { program } from 'commander'
import { checkVersion, instllNodeVersion } from "./core/install";
import { getVersionList } from './core/list'
import { useVersion } from './core//use'
import {uninstallVersion} from './core/uninstall'
const Package = require('../package.json')
program.version(Package.version).version('-v, --version', 'output the current version')

//下载命令
program.command('install <version>').action(async (version) => {
    const res = await checkVersion(version)
    res && instllNodeVersion(res)
})

program.command('list').description('node version lists').action(() => {
    getVersionList()
})

program.command('use <version>').description('use node version').action(async (version) => {
    useVersion(version)
})

program.command('uninstall <version>').description('uninstall node version').action(async (version) => {
    uninstallVersion(version)
})



program.parse(process.argv)