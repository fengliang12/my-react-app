declare namespace App {
  type GlobalData = {
    /** 接口初始化方法 */
    init: (
      refresh?: boolean,
      shuYunMember?: boolean,
    ) => Promise<Store.User & Store.QyUser> | null;
    /** 路由跳转 */
    to: toType;
    /** 所有scope授权封装 */
    auth: toAuth;
    /**全局数据 */
    globalData: {
      userInfo: Store.User;
      systemInfo: any;
      memberInfo: any;
    };
  };
}

declare type toAuth = (scope: any) => Promise<boolean>;

declare type toType = (
  data:
    | string
    | number
    | {
        appId: string;
        path?: string;
        extraData?: any;
        envVersion?: "develop" | "trial" | "release";
        shortLink?: string;
      },
  type?:
    | "navigateTo"
    | "navigateBack"
    | "redirectTo"
    | "reLaunch"
    | "switchTab"
    | "navigateToMiniProgram"
    | "navigateBackMiniProgram"
    | "exitMiniProgram",
) => Promise<any>;

declare interface Promise<T> {
  error<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): Promise<T>;
}

declare interface T_Area_Form {
  addressee: string;
  mobile: string;
  detail: string;
  province: string;
  city: string;
  district: string;
  [props: string]: any;
}

declare interface ActivityForm {
  verifyCode: string;
  counterId: string;
  realName: string;
  mobile: string;
}

declare var __wxConfig: any;
declare let App: any;
declare let Page: any;

/**
 * 自定义扩展信息
 */
interface ExtendInfo {
  code?: string;
  name?: string;
  value?: string;
  [property: string]: any;
}
