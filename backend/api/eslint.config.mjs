import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.js'],
    ...eslint.configs.recommended[0],
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    ...tseslint.configs.recommended[0],
  },
];
