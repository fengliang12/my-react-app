import config from "@/config/index";

import http from "../axios";

const { storeCode } = config;

const commonUrl = `/ec-portal/store/${storeCode}/cart`;

/** 加入购物车*/
const append: Api.Cart.AppendCart.FuncT = (data) =>
  http.post(`${commonUrl}/append`, data);

// 查看购物车
const locate: Api.Cart.GetCart.FuncT = (data) =>
  http.post(`${commonUrl}/locate`, data);

// 清空购物车
const remove: Api.Cart.RemoveCart.FuncT = (data) =>
  http.post(`${commonUrl}/remove`, data);

// 更新购物车全部选中状态
const select: Api.Cart.SelectAllCart.FuncT = (data) =>
  http.post(`${commonUrl}/select`, data);

// 加购后更新购物车选中状态
const selectOne: Api.Cart.SelectOne.FuncT = (skuId) =>
  http.post(`${commonUrl}/selectOne/${skuId}`);

// 购物车提交订单
const submit: Api.Cart.SubmitCart.FuncT = (data) =>
  http.post(`${commonUrl}/submit`, data);

// 更新购物车
const update: Api.Cart.UpdateCart.FuncT = (data) =>
  http.post(`${commonUrl}/update`, data);

export default {
  append,
  locate,
  remove,
  select,
  selectOne,
  submit,
  update,
};
