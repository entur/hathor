import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // netex-ts-gen output: machine-generated, regenerated on schema bumps.
    // Loosen the two rules whose violations are intrinsic to the emission
    // (Extensions?: any in entity interfaces; intentionally-unused Reshape
    // params in mapping helpers). Upstream fix tracked separately.
    files: [
      'src/data/vehicles/xml/Vehicle.ts',
      'src/data/vehicles/xml/Vehicle-mapping.ts',
      'src/data/vehicles/xml/VehicleModel.ts',
      'src/data/vehicles/xml/VehicleModel-mapping.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }
);
