/**
 * @jest-environment node
 */

import { createGtm, useGtm } from '../src/index';
import { createAppWithComponent } from './vue-helper';

describe('SSG Mode', () => {
  test('should expose useGtm function but not trigger loadScript() due to Node env', () => {
    const { app } = createAppWithComponent();
    app.use(createGtm({ id: 'GTM-DEMO' }));

    expect(useGtm()).toBeDefined();
    expect(useGtm()).toStrictEqual(app.config.globalProperties.$gtm);
  });
});
