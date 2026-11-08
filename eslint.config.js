import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      // ESLint 9 no sabe que un componente usado en JSX cuenta como usado:
      // eslint-plugin-react se lo dice (ESLint 10 ya lo hace solo)
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    settings: { react: { version: 'detect' } },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Las props no se declaran con PropTypes (React 19 ya no las comprueba)
      'react/prop-types': 'off',
    },
  },
  {
    // La configuracion de Vite y la de ESLint se ejecutan en Node, no en el navegador
    files: ['*.config.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
])
