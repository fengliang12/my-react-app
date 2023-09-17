/** 初始化入参 */
type InitArgument = {
  /** 版本 */
  version?: string;
  /** 模式 */
  mode?: "default" | "page" | "custom";
  /** 隐私标题文案 */
  title?: string;
  /** 详情文案1 */
  desc1?: string;
  /** 跳转隐私文案 */
  urlTitle?: string;
  /** 详情文案2 */
  desc2?: string;
  /** 同意文案 */
  agreeTxt?: string;
  /** 拒绝文案 */
  disagreeTxt?: string;
};

type LayoutType = {
  config: Partial<InitArgument>;
  init: (data: InitArgument) => void;
};

export const privacyAuth: LayoutType = {
  config: {
    version: "1.0.1",
    title: "用户隐私保护提示",
    desc1: "感谢您使用本小程序，您使用本小程序前应当阅井同意",
    urlTitle: "《用户隐私保护指引》",
    desc2:
      "当您点击同意并开始时用产品服务时，即表示你已理解并同息该条款内容，该条款将对您产生法律约束力。",
    agreeTxt: "同意并继续",
    disagreeTxt: "不同意",
  },
  init(data: InitArgument) {
    this.config = { ...this.config, ...data };
  },
};
