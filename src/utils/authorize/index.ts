/**
 * 授权组件
 **/
import Taro from "@tarojs/taro";

import { apiList, getAuthorization } from "./setting";

interface modalObjType {
  showModal: boolean; //是否显示弹窗
  //显示弹窗内容 参数参考wx.showModal
  content: {
    title: string;
    content: string;
  };
  //自定义弹窗
  customModal: {
    show: boolean; // 是否自定义组件
    showFn: () => void; // 自定义组件显示回调
  };
}

interface AuthorizationType {
  openSetting: boolean;
  loading: boolean;
  method: string;
  authorizationObj: object;
  authorization: string;
  customModalConfirmResolve: () => void;
  customModalConfirmReject: () => void;
  runModal: (e: {
    // 弹窗参数
    modalObj: modalObjType;
    // 是否立刻执行方法 默认为true 为false会调用获取授权方法提前授权无授权数据返回
    immediately: boolean;
    // 拒绝授权后立即提示授权设置授权信息进入授权页
    cancelShowModal: boolean;
    reqData: object;
  }) => Promise<any>;
  hasModal: (modalObj: modalObjType) => {};
  customModal: (customModal: modalObjType["customModal"]) => Promise<{
    confirm: boolean;
  }>;
  downloadFile: (e: object) => object;
}

type methodType = (typeof apiList)[number];
export default class Authorization implements AuthorizationType {
  public openSetting = false;
  public loading = false;
  public method;
  public authorizationObj;
  public authorization;
  public customModalConfirmResolve;
  public customModalConfirmReject;
  constructor(props: { method: methodType }) {
    const { method } = props;
    if (method === "getUserInfo") {
      throw Error(
        "小程序已回收,请使用头像昵称填写或wx.getUserProfile，小游戏可继续调用",
      );
    }
    if (!method) {
      throw Error("openSetting组件,method传参不能为空");
    }
    if (!apiList.includes(method)) {
      throw Error(`openSetting组件,暂无${method}方法请修改`);
    }
    this.method = method; // 微信方法
    this.authorizationObj = getAuthorization(method);
    this.authorization = this.authorizationObj.key; // 微信授权值
  }

  // 执行方法
  async runModal({
    // 弹窗参数
    modalObj = {},
    // 是否立刻执行方法 默认为true 为false会调用获取授权方法,提前授权无授权数据返回
    immediately = true,
    // 拒绝授权后立即提示授权设置授权信息进入授权页
    cancelShowModal = false,
    // 调用时传入的数据
    reqData = {},
    //未调用过或拒绝授权是否继续执行
    notAuthorizeExecute = true,
  } = {}) {
    // 初始化弹窗数据
    const newModalObj: modalObjType = this.initModalObj(modalObj);
    const unList = ["camera", "RecorderManager", "createVKSession"];
    if (unList.includes(this.method) && immediately) {
      console.warn("openSetting组件：暂不支持立即执行将为您转为获取授权");
      immediately = false;
    }
    if (typeof reqData !== "object") {
      console.error("reqData参数必须时对象");
    }
    if (this.method === "startLocationUpdateBackground") {
      console.warn(
        "与其它类型授权不同的是，scope.userLocationBackground 不会弹窗提醒用户。需要用户在设置页中，主动将“位置信息”选项设置为“使用小程序期间和离开小程序后”。开发者可以通过调用wx.openSetting，打开设置页",
      );
      this.openSetting = true;
    }
    // 检查是否需要下载
    let newReqData = await this.downloadFile(reqData);
    // 判断是否获取授权
    const hasSetting = await this.getSetting();
    if (!hasSetting && !notAuthorizeExecute) {
      return Promise.reject({
        code: "2001",
        msg: "未授权中断了执行",
      });
    }
    if (hasSetting === false || this.openSetting) {
      // 需要弹窗
      if (newModalObj && newModalObj.showModal) {
        const modalInfo = await this.hasModal(newModalObj);
        if (!modalInfo.confirm) return Promise.reject(modalInfo);
      }
      // 吊起授权页
      const wxOpenSetting = await this.wxOpenSetting();

      // 用户无点击动作调用点击
      if (!wxOpenSetting.confirm && wxOpenSetting.errMsg.includes("user TAP")) {
        /* eslint-disable prefer-rest-params */
        console.log("用户未点击自动调用点击方法");
        const arg = [...arguments];
        arg[0].modalObj = {
          ...newModalObj,
          showModal: true,
        };
        return this.runModal({
          ...arg[0],
        });
      }
      if (!wxOpenSetting.confirm) return Promise.reject(wxOpenSetting);
    }

    const promise = immediately
      ? this.getWxMethod({
          reqData: newReqData as object,
        })
      : this.getAuthorize();
    return promise.catch((err) => {
      if (err?.errMsg?.includes("auth") && cancelShowModal) {
        arguments[0].modalObj = {
          ...newModalObj,
          showModal: true,
        };
        return this.runModal({
          ...arguments[0],
        });
      }
      return Promise.reject(err);
    });
  }

  // 初始化弹窗数据
  initModalObj(modalObj) {
    const modalObjInit = {
      showModal: !!(modalObj && modalObj.showModal),
      // 显示弹窗内容
      content: {
        title: "获取授权",
        content: `是否允许小程序使用您的${this.authorizationObj.title}`,
      },
      // 是否自定义弹窗
      customModal: {
        show: false, // 是否自定义组件
        showFn: () => {}, // 自定义组件显示回调
      },
      ...modalObj,
    };
    return modalObjInit;
  }

  // 自定义弹窗
  customModal(customModal: modalObjType["customModal"]) {
    customModal.showFn();
    return new Promise((resolve) => {
      this.customModalConfirmResolve = function () {
        resolve({
          confirm: true,
        });
      };
      this.customModalConfirmReject = function () {
        resolve({
          confirm: false,
        });
      };
    }) as Promise<{
      confirm: boolean;
    }>;
  }

  // 有弹窗时调用
  async hasModal(modalObj) {
    const modal = modalObj?.customModal?.show
      ? await this.customModal(modalObj.customModal)
      : await Taro.showModal(modalObj.content);
    if (modal?.confirm) {
      // 用户点击确认
      return {
        confirm: true,
        msg: "弹窗点击确认",
        errMsg: "userModalCancel",
      };
    } else {
      return {
        confirm: false,
        msg: "弹窗取消授权用户取消",
        errMsg: "userModalCancel",
      };
    }
  }

  // 获取是否授权
  async getSetting(authorization = this.authorization) {
    if (this.loading) return;
    this.loading = true;
    const res = await Taro.getSetting().catch((err) => err);
    this.loading = false;
    // console.log("res", res, authorization);
    return res && res.authSetting[authorization];
  }

  // 调用提示框
  wxShowModal(modalObj = {}) {
    return Taro.showModal(modalObj);
  }

  // 调起客户端小程序设置界面，返回用户设置的操作结果  当用户授权时返回成功
  // 参数 authorization 授权值
  async wxOpenSetting(authorization = this.authorization) {
    const openSetting = await Taro.openSetting().catch((err) => {
      if (err.errMsg.includes("user TAP")) {
        return {
          msg: "直接调用了wx.openSetting方法没有用户点击行为",
          errMsg: err.errMsg,
          confirm: false,
        };
      }
      return {
        ...err,
        confirm: false,
        msg: "Taro.openSetting方法失败了",
      };
    });
    // console.log('吊起用户界面', openSetting)
    return {
      ...openSetting,
      confirm: !!(
        openSetting.authSetting && openSetting.authSetting[authorization]
      ),
    };
  }

  // 只获取授权,之后调用数据
  // 参数 authorization 授权值
  getAuthorize(authorization = this.authorization) {
    return Taro.authorize({
      scope: authorization,
    });
  }

  // 获取授权成功后数据
  // 参数 method 微信方法 reqData请求二外参数
  getWxMethod({ reqData = {} }) {
    let method = this.method;
    if (!Taro[method]) {
      throw Error(`当前基础库中未找到wx.${method}方法，请调整基础库`);
    }
    return Taro[method](reqData);
  }

  // 检查是否下载
  checkDown() {
    const { method } = this;
    const downArr = ["saveImageToPhotosAlbum", "saveVideoToPhotosAlbum"];
    return downArr.includes(method);
  }

  // 下载图片到本地
  downloadFile(reqData) {
    if (
      !reqData.filePath ||
      !this.checkDown() ||
      (!reqData.filePath.includes("http://") &&
        !reqData.filePath.includes("https://"))
    ) {
      return Promise.resolve(reqData);
    }

    return new Promise((resolve, reject) => {
      Taro.downloadFile({
        url: reqData.filePath,
        success: (res) => {
          reqData.filePath = res.tempFilePath;
          resolve(reqData);
        },
        fail() {
          reject(new Error("图片下载失败"));
        },
      });
    });
  }
}
