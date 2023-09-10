/**
 * The Tracking Authorization Status. See [ATTrackingManager.AuthorizationStatus](https://developer.apple.com/documentation/apptrackingtransparency/attrackingmanager/authorizationstatus)
 */
export declare type TrackingStatus = 'unavailable' | 'denied' | 'authorized' | 'restricted' | 'not-determined';
/**
 * Requests permission to track the user. Requires an [`NSUserTrackingUsageDescription`](https://developer.apple.com/documentation/bundleresources/information_property_list/nsusertrackingusagedescription) key in your `Info.plist`. (See [iOS 14 Tracking API](https://developer.apple.com/documentation/apptrackingtransparency))
 *
 * @platform iOS 14
 */
export declare function requestTrackingPermission(): Promise<TrackingStatus>;
/**
 * Gets the current tracking status. On devices
 *
 * @platform iOS 14
 */
export declare function getTrackingStatus(): Promise<TrackingStatus>;
