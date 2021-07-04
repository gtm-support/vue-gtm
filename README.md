<h1 align="center">Vue Google Tag Manager</h1>

<h4 align="center">*** Contributors welcome ***</h4>

<p align="center">
  <a href="https://tagmanager.google.com/">
    <img alt="Google Tag Manager" src="https://www.gstatic.cn/analytics-suite/header/suite/v2/ic_tag_manager.svg" height="192">
  </a>
  <a href="https://vuejs.org/">
    <img alt="Vue.js" src="https://vuejs.org/images/logo.png" height="192">
  </a>
</p>

<h4 align="center">Simple implementation of Google Tag Manager in Vue.js</h4>

---

<p align="center">
  <a href="https://github.com/gtm-support/vue-gtm/blob/vue2-gtm/LICENSE">
    <img alt="license: Apache-2.0" src="https://img.shields.io/github/license/gtm-support/vue-gtm.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/@gtm-support/vue2-gtm">
    <img alt="NPM package" src="https://img.shields.io/npm/v/@gtm-support/vue2-gtm.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/@gtm-support/vue2-gtm">
    <img alt="downloads" src="https://img.shields.io/npm/dt/@gtm-support/vue2-gtm.svg?style=flat-square">
  </a>
  <a href="#badge">
    <img alt="code style: Prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  </a>
  <a href="https://github.com/gtm-support/vue-gtm/actions/workflows/ci.yml">
    <img alt="Build Status" src="https://github.com/gtm-support/vue-gtm/actions/workflows/ci.yml/badge.svg?branch=vue2-gtm">
  </a>
</p>

This plugin will help you in your common GTM tasks.

**Note: If you are looking to track all Vuex mutations, you can use [Vuex GTM plugin](https://gist.github.com/matt-e-king/ebdb39088c50b96bbbbe77c5bc8abb2b)**

> If you want Vue 3 compatibility, please use the package [@gtm-support/vue-gtm](https://www.npmjs.com/package/@gtm-support/vue-gtm).

# Requirements

- **Vue.** >= 2.0.0 < 3.0.0
- **Google Tag Manager account.** To send data to

**Optional dependencies**

- **Vue Router** >= 3.x < 4.x - In order to use auto-tracking of screens

# Configuration

`npm install @gtm-support/vue2-gtm` or `yarn add @gtm-support/vue2-gtm` if you use [Yarn package manager](https://yarnpkg.com)

Here is an example configuration:

```js
import VueGtm from '@gtm-support/vue2-gtm';
import VueRouter from 'vue-router';
const router = new VueRouter({ routes, mode, linkActiveClass });

Vue.use(VueGtm, {
  id: 'GTM-xxxxxx', // Your GTM single container ID, array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy'] or array of objects [{id: 'GTM-xxxxxx', queryParams: { gtm_auth: 'abc123', gtm_preview: 'env-4', gtm_cookies_win: 'x'}}, {id: 'GTM-yyyyyy', queryParams: {gtm_auth: 'abc234', gtm_preview: 'env-5', gtm_cookies_win: 'x'}}], // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy']
  queryParams: {
    // Add URL query string when loading gtm.js with GTM ID (required when using custom environments)
    gtm_auth: 'AB7cDEf3GHIjkl-MnOP8qr',
    gtm_preview: 'env-4',
    gtm_cookies_win: 'x'
  },
  defer: false, // Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible). Defaults to false, so the script is loaded `async` by default
  compatibility: false, // Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`
  nonce: '2726c7f26c', // Will add `nonce` to the script tag
  enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
  debug: true, // Whether or not display console logs debugs (optional)
  loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: ['homepage'], // Don't trigger events for specified router names (optional)
  trackOnNextTick: false // Whether or not call trackView in Vue.nextTick
});
```

This injects the tag manager script in the page, except when `enabled` is set to `false`.
In that case it will be injected when calling `this.$gtm.enable(true)` for the first time.

Remember to enable the History Change Trigger for router changes to be sent through GTM.

# Documentation

Once the configuration is completed, you can access vue gtm instance in your components like that:

```js
export default {
  name: 'MyComponent',
  data() {
    return {
      someData: false
    };
  },
  methods: {
    onClick() {
      this.$gtm.trackEvent({
        event: null, // Event type [default = 'interaction'] (Optional)
        category: 'Calculator',
        action: 'click',
        label: 'Home page SIP calculator',
        value: 5000,
        noninteraction: false // Optional
      });
    }
  },
  mounted() {
    this.$gtm.trackView('MyScreenName', 'currentPath');
  }
};
```

The passed variables are mapped with GTM data layer as follows

```js
dataLayer.push({
  event: event || 'interaction',
  target: category,
  action: action,
  'target-properties': label,
  value: value,
  'interaction-type': noninteraction,
  ...rest
});
```

You can also access the instance anywhere whenever you imported `Vue` by using `Vue.gtm`. It is especially useful when you are in a store module or somewhere else than a component's scope.

It's also possible to send completely custom data to GTM with just pushing something manually to `dataLayer`:

```js
if (this.$gtm.enabled()) {
  window.dataLayer?.push({
    event: 'myEvent'
    // further parameters
  });
}
```

## Sync gtm with your router

Thanks to vue-router guards, you can automatically dispatch new screen views on router change!
To use this feature, you just need to inject the router instance on plugin initialization.

This feature will generate the view name according to a priority rule:

- If you defined a meta field for your route named `gtm` this will take the value of this field for the view name.
- Otherwise, if the plugin don't have a value for the `meta.gtm` it will fallback to the internal route name.

Most of teh time the second case is enough, but sometimes you want to have more control on what is sent, this is where the first rule shine.

Example:

```js
const myRoute = {
  path: 'myRoute',
  name: 'MyRouteName',
  component: SomeComponent,
  meta: { gtm: 'MyCustomValue' }
};
```

> This will use `MyCustomValue` as the view name.

## Using with composition API

In order to use this plugin with composition API (inside your `setup` method), you can just call the custom composable `useGtm`.

Example:

```vue
<template>
  <button @click="triggerEvent">Trigger event!</button>
</template>

<script>
import { useGtm } from '@gtm-support/vue2-gtm';

export default {
  name: 'MyCustomComponent',

  setup() {
    const gtm = useGtm();

    function triggerEvent() {
      gtm.trackEvent({
        event: 'event name',
        category: 'category',
        action: 'click',
        label: 'My custom component trigger',
        value: 5000,
        noninteraction: false
      });
    }

    return {
      triggerEvent
    };
  }
};
</script>
```

## Methods

### Enable plugin

Check if plugin is enabled

```js
this.$gtm.enabled();
```

Enable plugin

```js
this.$gtm.enable(true);
```

Disable plugin

```js
this.$gtm.enable(false);
```

### Debug plugin

Check if plugin is in debug mode

```js
this.$gtm.debugEnabled();
```

Enable debug mode

```js
this.$gtm.debug(true);
```

Disable debug mode

```js
this.$gtm.debug(false);
```

## IE 11 support

If you really need to support browsers like IE 11, you need to configure `transpileDependencies: ['@gtm-support/core']` in your `vue.config.js`.  
See [gtm-support/core#20 (comment)](https://github.com/gtm-support/core/issues/20#issuecomment-855903062)

## Credits

- [mib200 vue-gtm](https://github.com/mib200/vue-gtm)
- [ScreamZ vue-analytics](https://github.com/ScreamZ/vue-analytics)
