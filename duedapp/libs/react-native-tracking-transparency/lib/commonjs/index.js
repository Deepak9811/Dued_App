"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestTrackingPermission = requestTrackingPermission;
exports.getTrackingStatus = getTrackingStatus;

var _reactNative = require("react-native");

const TrackingTransparency = _reactNative.NativeModules.TrackingTransparency;
/**
 * The Tracking Authorization Status. See [ATTrackingManager.AuthorizationStatus](https://developer.apple.com/documentation/apptrackingtransparency/attrackingmanager/authorizationstatus)
 */

/**
 * Requests permission to track the user. Requires an [`NSUserTrackingUsageDescription`](https://developer.apple.com/documentation/bundleresources/information_property_list/nsusertrackingusagedescription) key in your `Info.plist`. (See [iOS 14 Tracking API](https://developer.apple.com/documentation/apptrackingtransparency))
 *
 * @platform iOS 14
 */
async function requestTrackingPermission() {
  if (_reactNative.Platform.OS !== 'ios') return 'unavailable';
  return await TrackingTransparency.requestTrackingPermission();
}
/**
 * Gets the current tracking status. On devices
 *
 * @platform iOS 14
 */


async function getTrackingStatus() {
  if (_reactNative.Platform.OS !== 'ios') return 'unavailable';
  return await TrackingTransparency.getTrackingStatus();
}
//# sourceMappingURL=index.js.map