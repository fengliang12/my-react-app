import Taro from "@tarojs/taro";

type propsType = (tmplIds: string[]) => Promise<string[]>;

const subscribeMsg: propsType = async (tmplIds) => {
  const result: string[] = [];
  try {
    let subSuccess = await Taro.requestSubscribeMessage({ tmplIds });
    Object.entries(subSuccess).forEach((item: any) => {
      result.push(item);
    });
  } catch (err) {
    return [];
  }
  return result;
};

export default subscribeMsg;
