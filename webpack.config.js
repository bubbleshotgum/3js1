const path = require('path')

module.exports = {
    entry: "./js/app.js",
    module: {
        rules: [
            {test: /\.(png|jpeg)$/, use: "image-loader"}
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js'
    },
    mode: "development"
}