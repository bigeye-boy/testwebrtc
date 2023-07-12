import { defineConfig } from 'vite'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from "unocss/vite";
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts';
import Components from 'unplugin-vue-components/vite'
import svgLoader from 'vite-svg-loader'
import px2rem from 'postcss-plugin-px2rem'
import basicSsl from '@vitejs/plugin-basic-ssl'
// https://vitejs.dev/config/

const px2remOptions = {
  rootValue: 14.4,  //换算基数， 默认100 ,也就是1440px ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多少px了
  unitPrecision: 5, //允许REM单位增长到的十进制数字，其实就是精度控制
  // propWhiteList: [], // 默认值是一个空数组，这意味着禁用白名单并启用所有属性。
  // propBlackList: [], // 黑名单
  // exclude:false,  //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
  // selectorBlackList: [], //要忽略并保留为px的选择器
  // ignoreIdentifier: false, //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
  // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
  mediaQuery: false, //（布尔值）允许在媒体查询中转换px
  minPixelValue: 0,  //设置要替换的最小像素值(3px会被转rem)。 默认 0
  remUnit: 16
}

export default defineConfig({
  base: "/testwebrtc/",
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  build: {
    outDir:'docs'
  },
  plugins: [
    vue(),
    UnoCSS(),
    Pages(
      { extensions: ['vue', 'md'], }
    ),
    Layouts(),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
    svgLoader(),
    basicSsl()
  ],
  // ssr: {
  //   noExternal: ['echarts', 'vue-echarts', 'resize-detector', 'zrender','vue3-draggable-resizable']
  // },
  // ssgOptions: {
  //   script: 'async',
  //   format: 'cjs',
  //   dirStyle: 'nested',
  //   formatting: 'minify',
  //   crittersOptions: {
  //     reduceInlineStyles: false,
  //   },
  //   onFinished() {
  //     generateSitemap()
  //   },
  // },
  css: {
    postcss: {
      plugins: [px2rem(px2remOptions)]
    }
  },
  server: {
    host: true,
    open: true,
    proxy: {
      "/esports_server": {
        target: "http://116.63.152.28",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, ""),
      },
    },
  },
})
