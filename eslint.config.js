import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import * as eslintPluginImport from 'eslint-plugin-import'
import * as eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import * as eslintPluginReact from 'eslint-plugin-react'

export default tseslint.config(
  { 
    ignores: ['build/', 'node_modules/', 'dist/'] 
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        NodeJS: true,
        JSX: true
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: eslintPluginImport,
      'jsx-a11y': eslintPluginJsxA11y,
      react: eslintPluginReact
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      
      'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
      'jsx-a11y/label-has-associated-control': [
        2,
        {
          labelComponents: ['CustomInputLabel'],
          labelAttributes: ['label'],
          controlComponents: ['CustomInput'],
          depth: 3
        }
      ],
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton']
        }
      ],
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling'], ['index']],
          pathGroups: [
            {
              pattern: 'next/**',
              group: 'builtin',
              position: 'before'
            },
            {
              pattern: 'react',
              group: 'builtin',
              position: 'after'
            },
            {
              pattern: 'recoil',
              group: 'builtin',
              position: 'after'
            },
            {
              pattern: '@/**',
              group: 'internal'
            },
            {
              pattern: 'stores/**',
              group: 'internal'
            },
            {
              pattern: './*.scss',
              group: 'index'
            }
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ]
    }
  },
  {
    files: ['.husky/*', '.lintstagedrc.js', 'yarn.lock', 'scripts/**/*.js', 'env/script.js', 'next.config.js'],
    rules: {
      'prettier/prettier': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  }
)