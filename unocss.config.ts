/* eslint-disable no-useless-escape */
import { defineConfig, presetAttributify, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
    shortcuts: [
        ['flex--c', 'flex items-center'],
        ['flex-cc', 'flex justify-center items-center'],
        ['flex-bc', 'flex justify-between items-center'],
        ['text-h3', 'text-34px text-orange-600 leading-45px'],
        ['text-h4', 'text-32px text-dark-200 leading-45px'],
        ['text-h5', 'text-28px text-dark-200 leading-45px'],
        ['text-h6', 'text-24px text-dark-200 leading-33px'],
        ['text-h6-b', 'text-24px text-dark-200 leading-33px font-500'],
        ['text-p', 'text-24px text-hex-999 leading-33px']
    ],
    presets: [presetUno(), presetAttributify()],
    transformers: [transformerDirectives(), transformerVariantGroup()],
    safelist: 'svg-text1 svg-text2'.split(' '),
    rules: []
})
