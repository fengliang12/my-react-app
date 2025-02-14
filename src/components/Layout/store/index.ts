// @ts-nocheck
import {
  action,
  configure,
  observable,
  isObservableArray,
  isObservableObject
} from "mobx";
import { merge, set, get, isObject } from "lodash-es";
import { getSystemInfo } from "../helper";

// 不允许在动作外部修改状态
configure({ enforceActions: "observed" });

export const store = observable({
  // 数据字段
  updateStyle: observable.map(),
  updateCom: {
    current: observable.map(),
    src: observable.map(),
    offset: observable.map(),
    nodes: observable.map(),
    muted: observable.map(),
    value: observable.map(),
    catchMove: observable.map()
  },
  eventPointTo: observable.map(),
  popup: observable.map(),
  ref: {},
  // actions
  setCom: action(function (payload, pageId) {
    if (Array.isArray(payload)) {
      payload.forEach(item => {
        if (item?.type) {
          this.updateCom[item.type].set(`${pageId}_${item.key}`, item.value);
        }
      });
    } else {
      if (payload?.type) {
        this.updateCom[payload.type].set(
          `${pageId}_${payload.key}`,
          payload.value
        );
      }
    }
  }),
  setStyle: action(function (payload, pageId) {
    if (Array.isArray(payload)) {
      payload.forEach(item => {
        if (isObject(item.value)) {
          this.updateStyle.set(
            `${pageId}_${item.key}`,
            merge(
              {},
              this.updateStyle.get(`${pageId}_${item.key}`) ?? {},
              item.value
            )
          );
        } else {
          this.updateStyle.set(`${pageId}_${item.key}`, item.value);
        }
      });
    } else {
      if (isObject(payload.value)) {
        this.updateStyle.set(
          `${pageId}_${payload.key}`,
          merge(
            {},
            this.updateStyle.get(`${pageId}_${payload.key}`) ?? {},
            payload.value
          )
        );
      } else {
        this.updateStyle.set(`${pageId}_${payload.key}`, payload.value);
      }
    }
  }),
  setAllStyle: action(function (payload, pageId) {
    if (Array.isArray(payload)) {
      payload.forEach(item => {
        this.updateStyle.set(`${pageId}_${item.key}`, item.value);
      });
    } else {
      this.updateStyle.set(`${pageId}_${payload.key}`, payload.value);
    }
  }),
  setEventPointTo: action(function (payload, pageId) {
    this.eventPointTo.set(`${pageId}_${payload.key}`, payload.value);
  }),
  setToggleEventPointTo: action(function (key, pageId) {
    this.eventPointTo.set(
      `${pageId}_${key}`,
      this.eventPointTo.get(key) === "ev" ? "e" : "ev"
    );
  }),
  setPopup: action(function (payload) {
    this.popup.set(`${payload.key}`, payload.value);
  }),
  setComCurrent: action(function (payload, pageId) {
    const { updateCurrent, relation, swiperRelation } = payload;
    const changeDatas = [
      { key: updateCurrent?.id, value: updateCurrent?.newCurrent }
    ];
    if (relation?.length > 0) {
      const gap = updateCurrent?.newCurrent - updateCurrent?.oldCurrent;
      swiperRelation.forEach(cur => {
        if (relation.includes(cur.id)) {
          let current =
            (this.updateCom.current.get(`${pageId}_${cur.id}`) || 0) + gap;
          if (current >= cur.count) {
            current = cur.count - 1;
          }
          if (current < 0) {
            current = 0;
          }
          changeDatas.push({
            key: cur.id,
            value: current
          });
        }
      });
    }
    changeDatas?.forEach(item => {
      this.updateCom.current.set(`${pageId}_${item.key}`, item.value);
    });
  }),
  setRef(payload, pageId, key) {
    if (!this.ref[pageId]) {
      set(this.ref, pageId, {});
    }
    if (!this.ref[pageId][key]) {
      set(this.ref, `${pageId}.${key}`, {});
    }
    merge(this.ref[pageId][key], payload);
  }
});

export const pageStore = observable({
  initPage: action(function (payload, pageId) {
    pageStore[pageId] = merge(this[pageId], payload);
  }),
  setPage: action(function (payload, pageId) {
    let data = get(pageStore, `${pageId}.${payload.key}`);
    if (isObservableArray(data)) {
      if (payload?.type === "remove") {
        data.splice(payload.value, 1);
      } else {
        data.push(payload.value);
      }
    } else if (isObservableObject(data)) {
      merge(data, payload.value);
    } else {
      set(pageStore, `${pageId}.${payload.key}`, payload.value);
    }
  })
});

/** APP全局数据 */
export const appStore = observable({
  user: {
    // 是否是会员
    isMember: false,
    // 真实名称
    realName: null,
    // 昵称
    nickName: null,
    // 头像
    avatarUrl: null,
    // 头像额外样式
    avatarStyle: null,
    // 头像边框
    avatarBorderUrl: null,
    // 头像边框额外样式
    avatarBorderStyle: null,
    // 性别
    gender: null,
    // 手机号
    phone: null,
    // 生日
    birthday: null,
    // 会员等级索引
    memberIndex: -1,
    // 会员卡号
    memberNum: null,
    // 会员卡号二维码地址
    memberNumQrCode: null,
    // 当前会员等级
    memberLevel: null,
    // 上一级会员等级
    lastMemberLevel: null,
    // 下一级会员等级
    nextMemberLevel: null,
    // 下一级会员等级需要消费金额
    nextMemberLevelSum: null,
    // 下一级会员等级需要消费次数
    nextMemberLevelCount: null,
    // 下一等级描述文案
    nextMemberLevelText: null,
    // 保级需要消费金额
    keepMemberLevelSum: null,
    // 等级进度百分比
    memberLevelProgress: null,
    // 等级截止日期
    memberLevelDeadline: null,
    // 当前积分
    point: null,
    // 即将到期的积分
    pointA: null,
    // 即将到期积分截止时间
    pointATime: null,
    // 一个月内到期积分
    pointB: null,
    // 过期积分
    pointC: null,
    // 优惠券数量
    couponCount: null,
    // 是否是徽章达人
    isHaveBadge: false,
    // 是否显示等级截止日期、等级有效期
    isShowMemberLevelDeadline: true,
    // 是否显示即将到期积分截止时间
    isShowPointATime: true
  },
  systemInfo: {},
  setApp: action(function (payload) {
    const { key, value } = payload;
    appStore[key] = value;
  }),
  setUser: action(function (payload) {
    if (payload) {
      merge(appStore.user, payload);
    }
  }),
  initSystemInfo: action(function () {
    merge(appStore.systemInfo, getSystemInfo());
  })
});
