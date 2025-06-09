import "@tarojs/taro";

declare module "@tarojs/taro" {
  type QyOptions<T = any> = {
    success?: (res: T) => void;
    fail?: (err: ErrorResult) => void;
    complete?: () => void;

    [prop: string]: any;
  };
  type SuccessResult = {
    errMsg?: string;
    [prop: string]: any;
  };
  type ErrorResult = {
    errMsg?: string;
    code?: number;
  };
  interface qy {
    canIUse(api: string): Promise<boolean>;
    login(
      options?: QyOptions & { timeout?: number; suiteId?: string },
    ): Promise<{ code: string } & SuccessResult>;
    checkSession(
      options?: QyOptions,
    ): Promise<{ expireIn: number } & SuccessResult>;
    getEnterpriseUserInfo(options: QyOptions): Promise<SuccessResult>;
    getAvatar(options: QyOptions): Promise<SuccessResult>;
    getQrCode(options: QyOptions): Promise<SuccessResult>;
    selectEnterpriseContact(options: QyOptions): Promise<SuccessResult>;
    selectExternalContact(options: QyOptions): Promise<SuccessResult>;
    openUserProfile(options: QyOptions): Promise<SuccessResult>;
    openEnterpriseChat(options: QyOptions): Promise<SuccessResult>;
    getCurExternalContact(options: QyOptions): Promise<SuccessResult>;
    shareToExternalContact(options: QyOptions): Promise<SuccessResult>;
    getCurExternalChat(options: QyOptions): Promise<SuccessResult>;
    sendChatMessage(options: QyOptions): Promise<SuccessResult>;
    shareToExternalChat(options: QyOptions): Promise<SuccessResult>;
    getContext(options: QyOptions): Promise<SuccessResult>;
    getNFCReaderState(options: QyOptions): Promise<SuccessResult>;
    startNFCReader(options: QyOptions): Promise<SuccessResult>;
    stopNFCReader(options: QyOptions): Promise<SuccessResult>;
    shareToExternalMoments(
      options: {
        /**文本消息 */
        text?: { content: string };
        /**附件，最多支持9个图片类型，或者1个视频，或者1个链接。类型只能三选一，若传了不同类型，报错'invalid attachments msgtype' */
        attachments?:
          | {
              //图片消息附件。普通图片：建议不超过 1440 x 1080，长图片：长边建议不超过 10800px。图片建议不要超过10M。最多支持传入9个；超过9个报错'invalid attachments size'
              msgtype: "image";
              image: {
                imgUrl?: string;
                mediaid?: string;
              };
            }[]
          | {
              //视频消息附件，建议不超过 1280 x 720，帧率 30 FPS，视频码率 1.67 Mbps，最长不超过30S，最大建议不超过10MB。只支持1个；若超过1个报错'invalid attachments size'
              msgtype: "video";
              video: {
                mediaid: string;
              };
            }[]
          | {
              //图文消息附件。只支持1个；若超过1个报错'invalid attachments size'
              msgtype: "link";
              link: {
                title?: string;
                url: string;
                imgUrl?: string;
              };
            }[];
      } & QyOptions,
    ): Promise<SuccessResult>;
  }
  interface TaroStatic {
    qy: qy;
  }
}
