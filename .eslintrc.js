module.exports = {
    env: {
        es6: true,
    },
    extends: [
        'plugin:@stylistic/recommended-extends',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        '@stylistic/comma-dangle': ['error', 'always-multiline'],
        '@stylistic/indent': ['error', 4],
        '@stylistic/semi': ['error', 'always'],
    },
};
