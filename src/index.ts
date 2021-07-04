import type { GtmIdContainer, GtmQueryParams, GtmSupportOptions, LoadScriptOptions } from '@gtm-support/core';
import { GtmSupport as GtmPlugin, loadScript } from '@gtm-support/core';
import _Vue, { PluginObject } from 'vue';
import type Router from 'vue-router';
import type { Route } from 'vue-router';

/**
 * Options passed to the plugin.
 */
export interface VueGtmUseOptions extends GtmSupportOptions {
  /**
   * Pass the router instance to automatically sync with router.
   */
  vueRouter?: Router;
  /**
   * Don't trigger events for specified router names.
   */
  ignoredViews?: string[] | ((to: Route, from: Route) => boolean);
  /**
   * Whether or not call `trackView` in `Vue.nextTick`.
   */
  trackOnNextTick?: boolean;
}

let gtmPlugin: GtmPlugin | undefined;

/**
 * Installation procedure.
 *
 * @param Vue The Vue instance.
 * @param options Configuration options.
 */
function install(Vue: typeof _Vue, options: VueGtmUseOptions = { id: '' }): void {
  // Apply default configuration
  options = { trackOnNextTick: false, ...options };

  // Add to vue prototype and also from globals
  gtmPlugin = new GtmPlugin(options);
  Vue.prototype.$gtm = Vue.gtm = gtmPlugin;

  // Handle vue-router if defined
  if (options.vueRouter) {
    initVueRouterGuard(Vue, options.vueRouter, options.ignoredViews, options.trackOnNextTick);
  }

  // Load GTM script when enabled
  if (gtmPlugin.options.enabled && gtmPlugin.options.loadScript) {
    if (Array.isArray(options.id)) {
      options.id.forEach((id: string | GtmIdContainer) => {
        if (typeof id === 'string') {
          loadScript(id, options as LoadScriptOptions);
        } else {
          const newConf: VueGtmUseOptions = {
            ...options
          };

          if (id.queryParams != null) {
            newConf.queryParams = {
              ...newConf.queryParams,
              ...id.queryParams
            } as GtmQueryParams;
          }

          loadScript(id.id, newConf as LoadScriptOptions);
        }
      });
    } else {
      loadScript(options.id, options as LoadScriptOptions);
    }
  }
}

/**
 * Initialize the router guard.
 *
 * @param Vue The Vue instance.
 * @param vueRouter The Vue router instance to attach the guard.
 * @param ignoredViews An array of route name that will be ignored.
 * @param trackOnNextTick Whether or not to call `trackView` in `Vue.nextTick`.
 */
function initVueRouterGuard(
  Vue: typeof _Vue,
  vueRouter: Exclude<VueGtmUseOptions['vueRouter'], undefined>,
  ignoredViews: VueGtmUseOptions['ignoredViews'] = [],
  trackOnNextTick: VueGtmUseOptions['trackOnNextTick']
): void {
  if (!vueRouter) {
    console.warn("[VueGtm]: You tried to register 'vueRouter' for vue-gtm, but 'vue-router' was not found.");
    return;
  }

  vueRouter.afterEach((to, from) => {
    // Ignore some routes
    if (
      typeof to.name !== 'string' ||
      (Array.isArray(ignoredViews) && ignoredViews.includes(to.name)) ||
      (typeof ignoredViews === 'function' && ignoredViews(to, from))
    ) {
      return;
    }

    // Dispatch vue event using meta gtm value if defined otherwise fallback to route name
    const name: string = to.meta && typeof to.meta.gtm === 'string' && !!to.meta.gtm ? to.meta.gtm : to.name;
    const additionalEventData: Record<string, any> = to.meta?.gtmAdditionalEventData ?? {};
    const baseUrl: string = vueRouter.options.base ?? '';
    let fullUrl: string = baseUrl;
    if (!fullUrl.endsWith('/')) {
      fullUrl += '/';
    }
    fullUrl += to.fullPath.startsWith('/') ? to.fullPath.substr(1) : to.fullPath;

    if (trackOnNextTick) {
      Vue.nextTick(() => {
        gtmPlugin?.trackView(name, fullUrl, additionalEventData);
      });
    } else {
      gtmPlugin?.trackView(name, fullUrl, additionalEventData);
    }
  });
}

declare module 'vue/types/vue' {
  // eslint-disable-next-line jsdoc/require-jsdoc
  export interface Vue {
    /**
     * The Vue GTM Plugin instance.
     */
    $gtm: GtmPlugin;
  }
  // eslint-disable-next-line jsdoc/require-jsdoc
  export interface VueConstructor<V extends Vue = Vue> {
    /**
     * The Vue GTM Plugin instance.
     */
    gtm: GtmPlugin;
  }
}

/**
 * Vue GTM Plugin.
 */
export type VueGtmPlugin = PluginObject<VueGtmUseOptions>;

const _default: VueGtmPlugin = { install };

export {
  assertIsGtmId,
  DataLayerObject,
  GtmIdContainer,
  GtmQueryParams,
  GtmSupport,
  GtmSupportOptions,
  hasScript,
  loadScript,
  LoadScriptOptions,
  TrackEventOptions
} from '@gtm-support/core';
export { GtmPlugin };
export default _default;

/**
 * Returns GTM plugin instance to be used via Composition API inside setup method.
 *
 * @returns The Vue GTM instance if the it was installed, otherwise `undefined`.
 */
export function useGtm(): GtmPlugin | undefined {
  return gtmPlugin;
}
