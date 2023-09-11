const handleDataType = (data: any) => {
  const hasList = ["true", "false", "null"];
  //排除 非字符串类型
  if (typeof data !== "string") return data;
  //为''字符串直接返回
  if (!data.trim()) return data;
  if (
    hasList.includes(data) ||
    (/^(0?|-?[1-9]\d*)$/.test(data) && data.length < 15)
  ) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("handleDataType => ", data, e);
    }
  }
  return data;
};
export default handleDataType;
