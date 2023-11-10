import api from "../api";

/**
 * 本地埋点
 * @param data
 */
const AddBehavior = async (data: Api.Common.AddBehavior.RequestBody) => {
  let res = await api.common.addBehavior(data);
  console.log(`${data.type}===埋点数据`, data, res);
};

export default AddBehavior;
