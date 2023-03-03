module.exports = () => {
    return {
        plugins: [
            require('postcss-pxtorem')({
                rootValue: 37.5,
                propList: ['*'],
                selectorBlackList: ['van-circle__layer']
            })
        ]
    }
}
