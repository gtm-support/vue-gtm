// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  ignorePatterns: ['.eslintrc.js', 'dist/'],
  env: {
    es6: true,
    jest: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.lint.json'],
    warnOnUnsupportedTypeScriptVersion: false
  },
  plugins: ['@typescript-eslint', 'prettier', 'jsdoc', 'spellcheck'],
  rules: {
    curly: ['error'],
    'linebreak-style': ['error', 'unix'],
    'no-case-declarations': 'warn',
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],

    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/indent': ['error', 2, { SwitchCase: 1, ignoredNodes: ['MemberExpression'] }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-ordering': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/prefer-readonly': ['warn'],
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/typedef': ['warn', { memberVariableDeclaration: true, variableDeclaration: true }],

    'jsdoc/match-description': [
      'warn',
      {
        mainDescription: '/^[A-Z`].+?(\\.|:)(\\n\\n.*((\\n{1,2}- .+)|(_.+_)|`.+`|\\n\\n---))?$/us',
        matchDescription: '^[A-Z`].+(\\.|`.+`)$',
        contexts: ['any'],
        tags: {
          param: true,
          returns: true
        }
      }
    ],
    'jsdoc/no-types': 'error',
    'jsdoc/require-jsdoc': [
      'warn',
      {
        contexts: [
          'ClassDeclaration',
          "ClassProperty:not([accessibility='private'])",
          'ExportNamedDeclaration:has(VariableDeclaration)',
          'FunctionExpression',
          "MethodDefinition:not([accessibility='private']) > FunctionExpression",
          'TSEnumDeclaration',
          'TSInterfaceDeclaration',
          'TSMethodSignature',
          // 'TSPropertySignature',
          'TSTypeAliasDeclaration'
        ]
      }
    ],
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns-type': 'off',

    'spellcheck/spell-checker': [
      'warn',
      {
        minLength: 4,
        skipWords: [
          'cancelled',
          'globals',
          'googletagmanager',
          'inheritdoc',
          'jsdoc',
          'noninteraction',
          'nullish',
          'overridable',
          'readonly',
          'vue'
        ]
      }
    ]
  },
  settings: {
    jsdoc: {
      mode: 'typescript'
    }
  },
  overrides: [
    {
      files: ['tests/*'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'jsdoc/require-jsdoc': 'off'
      }
    }
  ]
});
