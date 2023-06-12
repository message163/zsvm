import fs from 'node:fs'
import { fileURLToPath } from 'url'
import path from 'node:path'
const __filename = fileURLToPath(import.meta.url)
export const dirName = path.dirname(__filename)
export const mkdirVersion = (version: string) => {
    if (!fs.existsSync(path.resolve(dirName, `${version}`))) {
        fs.mkdirSync(path.resolve(dirName, `${version}`))
    }
}