interface PropsType {
  (e: any): Array<any>;
}
const handleGoodClass: PropsType = (goodList) => {
  if (!goodList?.length) {
    console.error("处理分类时商品不存在");
    return [];
  }
  let map = {};
  for (let i = 0; i < goodList?.length; i++) {
    let obj = goodList[i];
    if (!map[obj.point]) {
      map[obj.point] = [obj];
    } else {
      map[obj.point].push(obj);
    }
  }

  if (!map) return [];
  let _data: Array<any> = [];
  Object.keys(map).forEach((key) => {
    _data.push({
      point: key,
      data: map[key],
    });
  });
  return _data;
};
export default handleGoodClass;
