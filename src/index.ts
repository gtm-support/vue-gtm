import type {
  GtmIdContainer,
  GtmQueryParams,
  GtmSupportOptions,
  LoadScriptOptions,
} from '@gtm-support/core';
import { GtmSupport as GtmPlugin, loadScript } from '@gtm-support/core';
import type { App, Plugin } from 'vue';
import { nextTick } from 'vue';
import type {
  ErrorTypes,
  NavigationFailure,
  RouteLocationNormalized,
  Router,
} from 'vue-router';

// eslint-disable-next-line jsdoc/require-jsdoc
type IgnoredViews =
  | string[]
  | ((to: RouteLocationNormalized, from: RouteLocationNormalized) => boolean);

/**
 * Options passed to the plugin.
 */
export interface VueGtmUseOptions extends GtmSupportOptions {
  /**
   * Pass the router instance to automatically sync with router.
   */
  vueRouter?: Router;
  /**
   * Derive additional event data after navigation.
   */
  vueRouterAdditionalEventData?: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
  ) => Record<string, any> | Promise<Record<string, any>>;
  /**
   * Don't trigger events for specified router names.
   */
  ignoredViews?: IgnoredViews;
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

  // Check if plugin is running in a real browser or e.g. in SSG mode
  if (gtmPlugin.isInBrowserContext()) {
    // Handle vue-router if defined
    if (options.vueRouter) {
      initVueRouterGuard(
        app,
        options.vueRouter,
        options.ignoredViews,
        options.trackOnNextTick,
        options.vueRouterAdditionalEventData,
      );
    }

    // Load GTM script when enabled
    if (gtmPlugin.options.enabled && gtmPlugin.options.loadScript) {
      if (Array.isArray(options.id)) {
        options.id.forEach((id: string | GtmIdContainer) => {
          if (typeof id === 'string') {
            loadScript(id, options as LoadScriptOptions);
          } else {
            const newConf: VueGtmUseOptions = {
              ...options,
            };

            if (id.queryParams != null) {
              newConf.queryParams = {
                ...newConf.queryParams,
                ...id.queryParams,
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

  app.provide('gtm', options);
}

// eslint-disable-next-line jsdoc/require-jsdoc
type NavigationFailureType =
  | ErrorTypes.NAVIGATION_ABORTED
  | ErrorTypes.NAVIGATION_CANCELLED
  | ErrorTypes.NAVIGATION_DUPLICATED;

/**
 * Initialize the router guard.
 *
 * @param app The Vue app instance.
 * @param vueRouter The Vue router instance to attach the guard.
 * @param ignoredViews An array of route name that will be ignored.
 * @param trackOnNextTick Whether or not to call `trackView` in `Vue.nextTick`.
 * @param deriveAdditionalEventData Callback to derive additional event data.
 */
function initVueRouterGuard(
  app: App,
  vueRouter: Exclude<VueGtmUseOptions['vueRouter'], undefined>,
  ignoredViews: VueGtmUseOptions['ignoredViews'] = [],
  trackOnNextTick: VueGtmUseOptions['trackOnNextTick'],
  deriveAdditionalEventData: VueGtmUseOptions['vueRouterAdditionalEventData'] = () => ({}),
): void {
  // eslint-disable-next-line jsdoc/require-jsdoc
  function isNavigationFailure(
    failure: void | NavigationFailure | undefined,
    navigationFailureType: NavigationFailureType,
  ): boolean {
    if (!(failure instanceof Error)) {
      return false;
    }
    return !!(failure.type & navigationFailureType);
  }

  vueRouter.afterEach(async (to, from, failure) => {
    // Ignore some routes
    if (
      typeof to.name !== 'string' ||
      (Array.isArray(ignoredViews) && ignoredViews.includes(to.name)) ||
      (typeof ignoredViews === 'function' && ignoredViews(to, from))
    ) {
      return;
    }

    // Dispatch vue event using meta gtm value if defined otherwise fallback to route name
    const name: string =
      to.meta && typeof to.meta.gtm === 'string' && !!to.meta.gtm
        ? to.meta.gtm
        : to.name;

    if (isNavigationFailure(failure, 4 /* NAVIGATION_ABORTED */)) {
      if (gtmPlugin?.debugEnabled()) {
        console.log(
          `[VueGtm]: '${name}' not tracked due to navigation aborted`,
        );
      }
    } else if (isNavigationFailure(failure, 8 /* NAVIGATION_CANCELLED */)) {
      if (gtmPlugin?.debugEnabled()) {
        console.log(
          `[VueGtm]: '${name}' not tracked due to navigation cancelled`,
        );
      }
    }

    const additionalEventData: Record<string, any> = {
      ...(await deriveAdditionalEventData(to, from)),
      ...(to.meta?.gtmAdditionalEventData as Record<string, any>),
    };
    const baseUrl: string = vueRouter.options?.history?.base ?? '';
    let fullUrl: string = baseUrl;
    if (!fullUrl.endsWith('/')) {
      fullUrl += '/';
    }
    fullUrl += to.fullPath.startsWith('/')
      ? to.fullPath.substring(1)
      : to.fullPath;

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

// @ts-expect-error: assume that `vue` already brings this dependency
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
  GtmSupport,
  assertIsGtmId,
  hasScript,
  loadScript,
} from '@gtm-support/core';
export type {
  DataLayerObject,
  GtmIdContainer,
  GtmQueryParams,
  GtmSupportOptions,
  LoadScriptOptions,
  TrackEventOptions,
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
