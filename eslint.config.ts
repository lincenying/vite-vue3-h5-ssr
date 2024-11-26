import { readFile } from 'node:fs/promises'
import lincy from '@lincy/eslint-config'

const autoImport = JSON.parse(
    (await readFile(new URL('./.eslintrc-auto-import.json', import.meta.url))).toString(),
)

const config = await lincy(
    {
        unocss: true,
    },
    {
        languageOptions: {
            globals: {
                ...autoImport.globals,
            },
        },
    },
)

export default config
