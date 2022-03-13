// webpack.config.js
const path = require('path');
const webpack = require('./node_modules/webpack/types');


const PATHS = {
    /**
     * Каталог исходного кода.
     * @type {string}
     */
    src: path.join(__dirname, '../src'),
    /**
     * Целевой каталог.
     * @type {string}
     */
    dist: path.join(__dirname, '../public'),
    /**
     * Каталог ассетов.
     * @type {string}
     */
    assets: 'static/'
}

/** @type {webpack.WebpackOptionsNormalized} */
const webpack_config = {
    output: {
        path: PATHS.dist,
        filename: 'index.bundle.js',
    },
}

module.exports = webpack_config;
