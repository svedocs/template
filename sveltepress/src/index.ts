import type { DefaultThemeOptions, ThemeDefault } from 'virtual:sveltepress/theme-default'

import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { SERVICE_WORKER_PATH } from './constants.js'
import admonitions from './markdown/admonitions.js'
import anchors from './markdown/anchors.js'
import codeImport from './markdown/code-import.js'
import highlighter, { initHighlighter } from './markdown/highlighter.js'
import installPkg from './markdown/install-pkg.js'
import links from './markdown/links.js'
import liveCode from './markdown/live-code.js'
import createPreCorePlugins from './vite-plugins/create-pre-core-plugins.js'

export { SERVICE_WORKER_PATH } from './constants.js'

const VIRTUAL_PWA = 'virtual:pwa-info'
const VIRTUAL_PWA_SVELTE_REGISTER = 'virtual:pwa-register/svelte'

export const themeOptionsRef: {
  value?: DefaultThemeOptions
} = {
  value: undefined,
}

const defaultTheme: ThemeDefault = (options) => {
  themeOptionsRef.value = options

  return {
    name: '@sveltepress/theme-default',
    globalLayout: '@sveltepress/theme-default/GlobalLayout.svelte',
    pageLayout: '@sveltepress/theme-default/PageLayout.svelte',
    vitePlugins: async (corePlugin) => {
      const plugins = [
        ...await createPreCorePlugins(options),
        corePlugin,
      ]
      if (options?.pwa) {
        plugins.push(SvelteKitPWA({
          strategies: 'injectManifest',
          srcDir: SERVICE_WORKER_PATH.replace(/sw\.js$/, ''),
          filename: 'sw.js',
          injectManifest: {
            globDirectory: '.svelte-kit/output',
            globPatterns: [
              'client/**/*.{js,css,ico,png,svg,webp,otf,woff,woff2}',
              'prerendered/**/*.html',
            ],
          },
          ...options.pwa,
        }))
      }
      else {
        // In case of pwa relative virtual modules are not found
        plugins.push({
          name: '@sveltepress/virtual-pwa',
          resolveId(id) {
            if (id === VIRTUAL_PWA)
              return VIRTUAL_PWA
            if (id === VIRTUAL_PWA_SVELTE_REGISTER)
              return VIRTUAL_PWA_SVELTE_REGISTER
          },
          load(id) {
            if (id === VIRTUAL_PWA)
              return 'export const pwaInfo = null'
            if (id === VIRTUAL_PWA_SVELTE_REGISTER)
              return 'export const useRegisterSW = () => ({ needRefresh: false, updateServiceWorker: false, offlineReady: false })'
          },
        })
      }
      return plugins
    },
    remarkPlugins: [
      liveCode,
      admonitions,
      links,
      anchors,
      codeImport,
      installPkg,
    ],
    highlighter,
    footnoteLabel: options?.i18n?.footnoteLabel,
  }
}

export {
  defaultTheme,
  highlighter,
  initHighlighter,
}
