import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetUno,
    presetWebFonts,
    transformerDirectives,
    transformerVariantGroup,
} from 'unocss'
  export default defineConfig({
    shortcuts: [
      // ['btn', 'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer !outline-none hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
      // ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
    ],
    presets: [
      presetUno(),
      presetAttributify(),
      presetIcons({
        scale: 1.2,
        warn: true,
      }),
      presetTypography(),
      // presetWebFonts({
      //   fonts: {
      //     sans: 'DM Sans',
      //     serif: 'DM Serif Display',
      //     mono: 'DM Mono',
      //   },
      // }),
    ],
    transformers: [
      transformerDirectives(),
      transformerVariantGroup(),
    ],
    safelist: 'prose m-auto text-left'.split(' '),
    theme: {
      breakpoints: {
        'sm': '640px',
          // => @media (min-width: 640px) { ... }

          'md': '768px',
          // => @media (min-width: 768px) { ... }

          'lg': '1024px',
          // => @media (min-width: 1024px) { ... }

          'xl': '1280px',
          // => @media (min-width: 1280px) { ... }

          '2xl': '1444px',
          // => @media (min-width: 1444px) { ... }
      },
    }
  })