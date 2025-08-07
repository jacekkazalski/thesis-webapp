import react from 'eslint-plugin-react'
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from "globals";

export default [
    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                project: './tsconfig.json',
                tsconfigRootDir: process.cwd()
            },
            globals: {
                ...globals.browser,
                ...globals.es2021
            },
        },

        plugins: {
            '@typescript-eslint': ts,
            'react-hooks': reactHooks,
            react: react,
        },
        settings: {
            react: {
                version: 'detect'
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...ts.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': [
                'error',
                {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
            ],
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
        }
    }
]