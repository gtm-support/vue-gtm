/**
 * @jest-environment node
 */

import Vue from 'vue';
import { CombinedVueInstance } from 'vue/types/vue';
import VueGtm, { useGtm } from '../src/index';
import { createAppWithComponent } from './vue-helper';

describe.skip('SSG Mode', () => {
  test('should expose useGtm function but not trigger loadScript() due to Node env', () => {
    const { app } = createAppWithComponent();

    Vue.use(VueGtm, { id: 'GTM-DEMO' });

    // eslint-disable-next-line @typescript-eslint/ban-types
    const vue: CombinedVueInstance<Vue, object, object, object, Record<never, any>> = new Vue({
      render: (h) => h(app)
    });

    expect(useGtm()).toBeDefined();
    expect(useGtm()).toStrictEqual(vue.$gtm);
  });
});
