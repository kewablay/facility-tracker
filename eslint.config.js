// @ts-check
const eslint = require('@eslint/js');
const { defineConfig, globalIgnores } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

// Blocks concrete repository implementations from leaking out of the data-access layer.
const RESTRICTED_REPOSITORY_IMPLEMENTATIONS = {
  patterns: [
    {
      group: [
        '*-facility.repository',
        './*-facility.repository',
        '../**/*-facility.repository',
        '**/*-facility.repository',
        '@features/**/*-facility.repository',
      ],
      message: 'Depend on the FacilityRepository abstraction, not an implementation.',
    },
  ],
};

module.exports = defineConfig([
  globalIgnores(['dist/**', '.angular/**', 'coverage/**']),
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', { allow: ['error'] }],
      'no-debugger': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Use named exports only. No default exports.',
        },
      ],
      'no-restricted-imports': ['error', RESTRICTED_REPOSITORY_IMPLEMENTATIONS],
    },
  },
  {
    files: ['src/app/features/*/data-access/**/*.ts', 'src/app/app.config.ts', '**/*.spec.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/label-has-associated-control': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/interactive-supports-focus': 'error',
    },
  },
]);
