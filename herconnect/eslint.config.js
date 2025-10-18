import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: ['dist', 'node_modules']
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off', //  Allow apostrophes in JSX
      
      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      
      // Variable rules
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^(_|React$)', //  Allow unused React imports
          caughtErrors: 'none'
        }
      ],
      
      // Console rules - Allow all console methods for development
      'no-console': 'off', // Allow console.log, console.error, etc.
      
      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // Config files (vite.config.js, etc)
  {
    files: ['*.config.js', 'vite.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-undef': 'off'
    }
  }
]