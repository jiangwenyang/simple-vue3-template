import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, type UserConfig, loadEnv } from 'vite'

import dayjs from 'dayjs'
import * as dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
// 图标
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
// 注入动态环境变量
import VitePluginMetaEnv from 'vite-plugin-meta-env'

import pkg from './package.json'

import vueDevTools from 'vite-plugin-vue-devtools'

const { version: APP_VERSION } = pkg

/**
 * 构建env文件的dts
 */
function buildEnvDTS(envConfig: Record<string, string>) {
  // 创建 TypeScript 接口
  let interfaceContent =
    '// !!!此文件为自动生成，请不要手动修改\n' +
    'interface ImportMetaEnv extends Readonly<Record<string, string>> {\n'
  Object.keys(envConfig).forEach((key) => {
    interfaceContent += `  readonly ${key}: string;\n`
  })
  interfaceContent += `}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}\n`

  // 输出到指定的 TypeScript 文件
  const outputPath = resolve(__dirname, 'env.d.ts')
  writeFileSync(outputPath, interfaceContent)
}

export default defineConfig(({ command, mode }): UserConfig => {
  const { PORT } = dotenv.config({ path: `./.env` }).parsed ?? {}
  const { VITE_API_URL, BASE_SERVICE_URL } = dotenv.config({ path: `./.env.${mode}` }).parsed ?? {}

  // 增加动态环境变量
  const metaEnv = {
    APP_VERSION,
    APP_BUILD_TIME: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }

  // 解析加载OEM环境变量
  const oem = process.env.OEM
  // 如果存在OEM环境变量，加载相应的 .env.oemX 文件
  if (oem) {
    const oemEnvPath = resolve(process.cwd(), `./env.${oem}`)
    if (existsSync(oemEnvPath)) {
      const envConfig = dotenv.config({ path: oemEnvPath })
      dotenvExpand.expand(envConfig)
    }
  }

  const config: UserConfig = {
    base: './',
    envDir: './',
    plugins: [
      Vue(),
      VueJsx({
        // options are passed on to @vue/babel-preset-jsx
      }),
      vueDevTools(),
      Icons({
        compiler: 'vue3',
        autoInstall: true,
        customCollections: {
          'local-icons': FileSystemIconLoader('./src/assets/icons', (svg) =>
            svg.replace(/^<svg /, '<svg fill="currentColor" '),
          ),
        },
      }),
      Components({
        resolvers: [
          NaiveUiResolver(),
          IconsResolver({
            customCollections: ['local-icons'],
          }),
        ],
      }),
      // 按需导入
      AutoImport({
        // targets to transform
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        // global imports to register
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
          },
        ],

        // Filepath to generate corresponding .d.ts file.
        // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
        // Set `false` to disable.
        dts: './auto-imports.d.ts',

        // Inject the imports at the end of other imports
        injectAtEnd: true,

        // Generate corresponding .eslintrc-auto-import.json file.
        // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        },
      }),
      // 环境变量
      VitePluginMetaEnv(metaEnv, 'import.meta.env'),
      VitePluginMetaEnv(metaEnv, 'process.env'),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
    server: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      cors: true,
      open: true,
      port: Number(PORT),
      host: true,
      proxy: {
        [VITE_API_URL]: {
          target: BASE_SERVICE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/apis/, ''),
        },
      },
    },
    build: {
      sourcemap: false,
      target: 'esnext',
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          manualChunks(id, { getModuleInfo }) {
            // 打包依赖
            if (id.includes('node_modules')) {
              return 'vendor'
            }
            const reg = /(.*)\/src\/components\/(.*)/
            if (reg.test(id)) {
              const importersLen = getModuleInfo(id)?.importers.length
              // 被多处引用
              if (importersLen && importersLen > 1) {
                return 'components'
              }
            }
          },
          plugins: [
            mode === 'analyze'
              ? // rollup-plugin-visualizer
                // https://github.com/btd/rollup-plugin-visualizer
                visualizer({
                  open: true,
                  filename: 'dist/stats.html',
                  // gzipSize: true,
                  // brotliSize: true,
                })
              : undefined,
          ],
        },
      },
    },
    esbuild: {
      // Drop console when production build.
      drop: command === 'serve' ? [] : ['console'],
    },
  }

  const env = loadEnv(mode, resolve(process.cwd(), 'env'))
  // 生成环境变量文件
  buildEnvDTS(env)

  return config
})
