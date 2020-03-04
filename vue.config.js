const path = require('path')
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    assetsDir: 'static',
    productionSourceMap: false,
    lintOnSave: true,
    chainWebpack: (config) => {
        config.resolve.alias.set('@', resolve('src'))
    },
    devServer: {
        prot: 8080
    }
}