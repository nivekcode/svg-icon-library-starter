module.exports = {
    entry: './showcase/main.js',
    output: {
        filename: './dist/showcase/main.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    }
};
