#!/usr/bin/env node
import { program } from 'commander'
import fs from 'fs'
import { checkVersion, instllNodeVersion } from "./core/install";
const jsonData = fs.readFileSync('./package.json', 'utf-8');
const Package = JSON.parse(jsonData);
program.version(Package.version).version('-v, --version', 'output the current version')

//下载命令
program.command('install <version>').action(async (version) => {
    const res = await checkVersion(version)
    res && instllNodeVersion(res)
})





program.parse(process.argv)