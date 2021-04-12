module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: '3'
            }
        ]
    ],
    plugins: [
        [
            'import',
            {
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true
            },
            'vant'
        ],
        '@vue/babel-plugin-jsx',
        '@babel/plugin-proposal-class-properties'
    ]
}
