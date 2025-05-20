/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import { ClerkPlugin } from '@clerk/clerk-vue'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(ClerkPlugin, {
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    })
}
