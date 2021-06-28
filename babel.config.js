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
    plugins: ['@vue/babel-plugin-jsx', '@babel/plugin-proposal-class-properties']
}
