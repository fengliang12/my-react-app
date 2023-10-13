import { useMemoizedFn } from "ahooks";

export default function usePrivacyAuth() {
  const checkPrivacyAuth = useMemoizedFn(async () => {
    return new Promise((resolve, reject) => {
      wx.getPrivacySetting({
        success(res) {
          resolve(res.needAuthorization);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  });
  const requirePrivacyAuth = useMemoizedFn(async () => {
    if (!wx?.requirePrivacyAuthorize) return Promise.resolve(true);

    return new Promise((resolve, reject) => {
      wx.requirePrivacyAuthorize({
        success() {
          resolve(true);
        },
        fail() {
          reject(false);
        },
      });
    });
  });
  return {
    checkPrivacyAuth,
    requirePrivacyAuth,
  };
}
