// import js from '@eslint/js';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';
// import { defineConfig } from 'eslint/config';
//
// export default defineConfig([
//   {
//     files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
//     plugins: { js },
//     extends: [
//       'js/recommended',
//       'eslint:recommended',
//       'plugin:@typescript-eslint/eslint-recommended',
//       'plugin:@typescript-eslint/recommended',
//       'plugin:prettier/recommended',
//     ],
//     languageOptions: { globals: globals.browser },
//   },
//   tseslint.configs.recommended,
// ]);
//
// import js from '@eslint/js';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';
// import prettier from 'eslint-plugin-prettier';
// import { defineConfig } from 'eslint/config';
//
// export default defineConfig([
//   // Base JavaScript configuration
//   {
//     files: ['**/*.{js,mjs,cjs}'],
//     extends: [js.configs.recommended],
//     languageOptions: {
//       globals: {
//         ...globals.browser,
//       },
//     },
//     rules: {
//       // Add any custom JS rules here
//     },
//   },
//
//   // TypeScript configuration
//   {
//     files: ['**/*.{ts,mts,cts}'],
//     extends: [js.configs.recommended, ...tseslint.configs.recommended],
//     languageOptions: {
//       globals: {
//         ...globals.browser,
//       },
//     },
//     rules: {
//       // Add any custom TS rules here
//     },
//   },
//
//   // Prettier configuration (should be last)
//   {
//     files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
//     plugins: {
//       prettier,
//     },
//     rules: {
//       'prettier/prettier': 'error',
//     },
//   },
// ]);
