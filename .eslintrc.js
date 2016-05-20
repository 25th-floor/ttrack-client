module.exports = {
    'extends': '25th',
    'parser': 'babel-eslint',
    'env': {
        'jest': true
    },
    'rules': {
        'react/jsx-no-bind': [2, {
            'ignoreRefs': true,
        }],
        'react/prop-types': [2, { ignore: ['children'] }],
        'no-use-before-define': 0,
        'no-console': [1, { allow: ["error", "info"] }],
    }
};