module: {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'babel-loader',
            exclude: /node_modules/,
        },
    ],
};