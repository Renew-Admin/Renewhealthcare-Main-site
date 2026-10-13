// ESLint 9 flat config (LINT-R2). `npm run lint` had no config at all, so it
// exited with "ESLint couldn't find an eslint.config.(js|mjs|cjs) file".
//
// Only packages already in node_modules are used: @eslint/js and globals come
// with eslint itself (transitive dependencies), eslint-plugin-react and
// eslint-plugin-react-hooks are devDependencies.
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  {
    ignores: ['.next/**', '.open-next/**', 'node_modules/**', 'public/**', 'backend/**'],
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      react: { version: 'detect' },
    },
  },
]
