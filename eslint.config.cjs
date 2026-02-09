const js = require('@eslint/js')
const importPlugin = require('eslint-plugin-import')
const unusedImports = require('eslint-plugin-unused-imports')
const globals = require('globals')
const tseslint = require('typescript-eslint')

module.exports = [
    {
        ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'eslint.config.cjs']
    },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ['**/*.{ts,tsx,js,cjs,mjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node
            }
        },
        plugins: {
            import: importPlugin,
            'unused-imports': unusedImports
        },
        settings: {
            'import/resolver': {
                typescript: true,
                node: true
            }
        },
        rules: {
            'unused-imports/no-unused-imports': 'error',

            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

            'import/order': [
                'error',
                {
                    groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index'], ['type']],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true }
                }
            ]
        }
    }
]
