import type { GtmIdContainer, GtmQueryParams, GtmSupportOptions, LoadScriptOptions } from '@gtm-support/core';
import { GtmSupport as GtmPlugin, loadScript } from '@gtm-support/core';
import { App, nextTick, Plugin } from 'vue';
import type { RouteLocationNormalized, Router } from 'vue-router';

/**
 * Options passed to the plugin.
 */
export interface VueGtmUseOptions extends GtmSupportOptions {
  /**
   * Pass the router instance to automatically sync with router.
   */
  vueRouter?: Router;
  /**
   * Don't trigger events for specified router names (case insensitive).
   */
  ignoredViews?: (string | RegExp | ((route: RouteLocationNormalized) => boolean))[];
  /**
   * Whether or not call `trackView` in `Vue.nextTick`.
   */
  trackOnNextTick?: boolean;
}

let gtmPlugin: GtmPlugin | undefined;

/**
 * Installation procedure.
 *
 * @param app The Vue app instance.
 * @param options Configuration options.
 */
function install(app: App, options: VueGtmUseOptions = { id: '' }): void {
  // Apply default configuration
  options = { trackOnNextTick: false, ...options };

  // Add to vue prototype and also from globals
  gtmPlugin = new GtmPlugin(options);
  app.config.globalProperties.$gtm = gtmPlugin;

  // Handle vue-router if defined
  if (options.vueRouter) {
    void initVueRouterGuard({
      app,
      vueRouter: options.vueRouter,
      ignoredViews: options.ignoredViews,
      trackOnNextTick: options.trackOnNextTick
    });
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

  app.provide('gtm', options);
}

/**
 * Initialize the router guard.
 *
 * @param app The Vue app instance.
 * @param vueRouter The Vue router instance to attach the guard.
 * @param ignoredViews An array of route name that will be ignored.
 * @param trackOnNextTick Whether or not to call `trackView` in `Vue.nextTick`.
 */
async function initVueRouterGuard({
  app,
  vueRouter,
  ignoredViews = [],
  trackOnNextTick = false
}: {
  app: App;
  vueRouter: NonNullable<VueGtmUseOptions['vueRouter']>;
  ignoredViews?: NonNullable<VueGtmUseOptions['ignoredViews']>;
  trackOnNextTick?: NonNullable<VueGtmUseOptions['trackOnNextTick']>;
}): Promise<void> {
  let vueRouterModule: typeof import('vue-router');
  try {
    vueRouterModule = await import('vue-router');
  } catch {
    console.warn("[VueGtm]: You tried to register 'vueRouter' for vue-gtm, but 'vue-router' was not found.");
    return;
  }

  // Normalize routes name
  const normalizedIgnoredViews = ignoredViews.map((view) => (typeof view === 'string' ? view.toLowerCase() : view));
  const shouldIgnoredView = (route: RouteLocationNormalized): boolean => {
    return normalizedIgnoredViews.some((ignoredView) => {
      const routeName = (route.name as string).toLowerCase();

      return typeof ignoredView === 'string'
        ? routeName === ignoredView
        : typeof ignoredView === 'function'
        ? ignoredView(route)
        : ignoredView.test(routeName);
    });
  };

  vueRouter.afterEach((to, from, failure) => {
    // Ignore some routes
    if (typeof to.name !== 'string' || shouldIgnoredView(to)) {
      return;
    }

    // Dispatch vue event using meta gtm value if defined otherwise fallback to route name
    const name: string = to.meta && typeof to.meta.gtm === 'string' && !!to.meta.gtm ? to.meta.gtm : to.name;

    if (vueRouterModule.isNavigationFailure(failure, vueRouterModule.NavigationFailureType.aborted)) {
      if (gtmPlugin?.debugEnabled()) {
        console.log(`[VueGtm]: '${name}' not tracked due to navigation aborted`);
      }
    } else if (vueRouterModule.isNavigationFailure(failure, vueRouterModule.NavigationFailureType.cancelled)) {
      if (gtmPlugin?.debugEnabled()) {
        console.log(`[VueGtm]: '${name}' not tracked due to navigation cancelled`);
      }
    }

    const additionalEventData: Record<string, any> = (to.meta?.gtmAdditionalEventData as Record<string, any>) ?? {};
    const baseUrl: string = vueRouter.options?.history?.base ?? '';
    let fullUrl: string = baseUrl;
    if (!fullUrl.endsWith('/')) {
      fullUrl += '/';
    }
    fullUrl += to.fullPath.startsWith('/') ? to.fullPath.substr(1) : to.fullPath;

    if (trackOnNextTick) {
      void nextTick(() => {
        gtmPlugin?.trackView(name, fullUrl, additionalEventData);
      });
    } else {
      gtmPlugin?.trackView(name, fullUrl, additionalEventData);
    }
  });
}

/**
 * Create the Vue GTM instance.
 *
 * @param options Options.
 * @returns The Vue GTM plugin instance.
 */
export function createGtm(options: VueGtmUseOptions): VueGtmPlugin {
  return { install: (app: App) => install(app, options) };
}

declare module '@vue/runtime-core' {
  // eslint-disable-next-line jsdoc/require-jsdoc
  export interface ComponentCustomProperties {
    /**
     * The Vue GTM Plugin instance.
     */
    $gtm: GtmPlugin;
  }
}

/**
 * Vue GTM Plugin.
 */
export type VueGtmPlugin = Plugin;

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
