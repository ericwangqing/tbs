import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import styleImport from 'vite-plugin-style-import'
// import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import extractorPug from '@unocss/extractor-pug'
import { extractorSplit } from '@unocss/core'

import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const _dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  base: '', // important, do not generate static absolute path, not working for ipfs
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
    force: true,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // ...
        },
      },
    }),
    vueJsx(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/css`
          },
        },
      ],
    }),
    Unocss({
      extractors: [extractorPug(), extractorSplit],
      rules: [
        //[/^text-(\w+)-(\d+)$/, ([, color, opi]) => ({ color: `${d}%` })],
        // [/^h-(\d+)p$/, ([, d]) => ({ height: `${d}%` })],
      ],
      theme: {},
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(_dirname, 'src'),
    },
  },
  server: {
    fs: {
      strict: false,
    },
    host: '0.0.0.0',
  },
})
