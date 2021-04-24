import { DataLayerObject, GtmSupport, TrackEventOptions } from '@gtm-support/core';
import { DEFAULT_CONFIG, VueGtmContainer, VueGtmUseOptions } from './config';

/**
 * Object definition for a track event.
 *
 * @deprecated Use `TrackEvent`.
 */
export type VueGtmTrackEventParams = TrackEventOptions;

/**
 * The Vue GTM Plugin main class.
 */
export default class VueGtmPlugin implements GtmSupport {
  private readonly gtmSupportInstance: GtmSupport;

  /**
   * Constructs a new `VueGTMPlugin`.
   *
   * @param id A GTM Container ID.
   * @param options Options.
   */
  public constructor(
    public readonly id: string | string[] | VueGtmContainer[],
    public readonly options: Pick<VueGtmUseOptions, keyof typeof DEFAULT_CONFIG | 'queryParams'> = DEFAULT_CONFIG
  ) {
    this.gtmSupportInstance = new GtmSupport({ ...options, id });
  }

  /** @inheritdoc */
  public isInBrowserContext(): boolean {
    return this.gtmSupportInstance.isInBrowserContext();
  }

  /** @inheritdoc */
  public enabled(): boolean {
    return this.gtmSupportInstance.enabled();
  }

  /** @inheritdoc */
  public enable(enabled?: boolean): void {
    return this.gtmSupportInstance.enable(enabled);
  }

  /** @inheritdoc */
  public debugEnabled(): boolean {
    return this.gtmSupportInstance.debugEnabled();
  }

  /** @inheritdoc */
  public debug(enable: boolean): void {
    return this.gtmSupportInstance.debug(enable);
  }

  /** @inheritdoc */
  public dataLayer(): false | DataLayerObject[] {
    return this.gtmSupportInstance.dataLayer();
  }

  /** @inheritdoc */
  public trackView(screenName: string, path: string, additionalEventData?: Record<string, any>): void {
    return this.gtmSupportInstance.trackView(screenName, path, additionalEventData);
  }

  /** @inheritdoc */
  public trackEvent({
    event,
    category = null,
    action = null,
    label = null,
    value = null,
    noninteraction = false,
    ...rest
  }: VueGtmTrackEventParams = {}): void {
    return this.gtmSupportInstance.trackEvent({ event, category, action, label, value, noninteraction, ...rest });
  }
}

export { DataLayerObject } from '@gtm-support/core';
export { VueGtmPlugin };
