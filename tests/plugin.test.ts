import { describe, expect, test } from 'vitest';
import { GtmPlugin as VueGtmPlugin } from '../src/index';

describe('Plugin', () => {
  test('should apply default options', () => {
    const instance: VueGtmPlugin = new VueGtmPlugin({ id: 'GTM-DEMO' });
    expect(instance.options).toEqual({
      compatibility: false,
      debug: false,
      defer: false,
      enabled: true,
      loadScript: true,
    });
  });

  test('should apply id when passed as string', () => {
    const instance: VueGtmPlugin = new VueGtmPlugin({ id: 'GTM-DEMO' });
    expect(instance.id).toEqual('GTM-DEMO');
  });

  test('should apply id when passed as array', () => {
    const instance: VueGtmPlugin = new VueGtmPlugin({
      id: ['GTM-DEMO1', 'GTM-DEMO2'],
    });
    expect(instance.id).toEqual(['GTM-DEMO1', 'GTM-DEMO2']);
  });

  test('should apply id when passed as container array', () => {
    const instance: VueGtmPlugin = new VueGtmPlugin({
      id: [{ id: 'GTM-DEMO1' }, { id: 'GTM-DEMO2' }],
    });
    expect(instance.id).toEqual([{ id: 'GTM-DEMO1' }, { id: 'GTM-DEMO2' }]);
  });

  test("should have `isInBrowserContext` defined and it's overridable", () => {
    const instance: VueGtmPlugin = new VueGtmPlugin({ id: 'GTM-DEMO' });
    expect(instance.isInBrowserContext).toBeDefined();
    expect(instance.isInBrowserContext).toBeInstanceOf(Function);
    expect(instance.isInBrowserContext()).toBeTruthy();

    instance.isInBrowserContext = () => false;
    expect(instance.isInBrowserContext()).toBeFalsy();
  });
});
