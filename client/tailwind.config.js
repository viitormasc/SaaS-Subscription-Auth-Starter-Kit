/ / / tailwind.config.js;
// const { heroui } = require('@heroui/theme');
//
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./node_modules/@heroui/theme/dist/components/(input-otp|form).js'],
//   theme: {
//     extend: {},
//   },
//   darkMode: 'class',
//   plugins: [heroui()],
// };
//
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/components/(input-otp|form).js',
  ],
  theme: {
    extend: {
      // Force legacy color format
      colors: {
        // Your custom colors if any
      },
    },
  },
  darkMode: 'class',
  plugins: [heroui()],
  // Force RGB color format instead of oklch
  experimental: {
    optimizeUniversalDefaults: true,
  },
  // This is the key - disable oklch colors
  future: {
    disableColorOpacityUtilitiesByDefault: true,
  },
  // Use the legacy engine
  corePlugins: {
    // This might help but could break some HeroUI components
    // 'color-scheme': false,
  },
};
