import "@tarojs/taro";

declare module "@tarojs/taro" {
  type QyOptions<T = any> = {
    success?: (res: T) => void;
    fail?: (res: any) => void;
    complete?: (res: any) => void;
  };
  interface qy {
    openEnterpriseChat<T>(
      option: {
        externalUserIds: string | string[];
        groupName?: string;
      } & QyOptions,
    ): Promise<any>;
  }
  interface TaroStatic {
    qy: qy;
  }
}
