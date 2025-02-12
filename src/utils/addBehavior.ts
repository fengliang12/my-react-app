import api from "../api";

/**
 * 本地埋点
 * @param data
 */
const AddBehavior = async (
  data: Partial<Api.Common.AddBehavior.RequestBody>,
) => {
  await api.common.addBehavior(data);
};

export default AddBehavior;
