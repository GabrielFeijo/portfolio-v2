import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  js.configs.recommended,
  prettier,
  {
    ignores: ['dist', 'node_modules', 'coverage', '.vite'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/static-components': 'off',
      'react/no-unknown-property': ['error', { ignore: ['args', 'attach', 'position', 'rotation', 'scale', 'map', 'roughness', 'metalness', 'intensity', 'uniforms', 'transparent', 'depthWrite', 'depthTest', 'blending', 'vertexColors', 'sizeAttenuation', 'frustumCulled', 'geometry', 'material', 'side', 'uColor', 'uIntensity', 'uType', 'uLightDir', 'uTime', 'uColorPrimary', 'uColorSecondary', 'distance', 'decay', 'groundColor', 'angle', 'penumbra'] }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['tests/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
        ...globals.vitest,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-setter-return': 'off',
      'react/no-unknown-property': ['error', { ignore: ['args', 'attach', 'position', 'rotation', 'scale', 'map', 'roughness', 'metalness', 'intensity', 'uniforms', 'transparent', 'depthWrite', 'depthTest', 'blending', 'vertexColors', 'sizeAttenuation', 'frustumCulled', 'geometry', 'material', 'side', 'uColor', 'uIntensity', 'uType', 'uLightDir', 'uTime', 'uColorPrimary', 'uColorSecondary', 'distance', 'decay', 'groundColor', 'angle', 'penumbra'] }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
