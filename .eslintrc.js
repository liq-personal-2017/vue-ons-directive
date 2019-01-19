module.exports = {
    env: {
        browser: true,
        commonjs: true,
        node: true,
        es6: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true
        },
        sourceType: 'module'
    },
    // overrides: [
    //     {
    //         files: ['./*.js'],
    //         excludedFiles: './lib/*',
    //         // rules: {
    //         //     quotes: [2, 'single']
    //         // }
    //     }
    // ],
    parser: 'babel-eslint',
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['warn', 'single'],
        semi: ['warn', 'never'],
        'no-console': 1,
        'no-unused-vars': 0
    }
}
