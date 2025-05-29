// 安装依赖
// npm install pinyin @types/pinyin

import pinyin from "pinyin";

interface ChineseInitialOptions {
  heteronym?: boolean; // 是否启用多音字
  filterNonChinese?: boolean; // 是否过滤非汉字字符
}

const getChineseInitials = (
  text: string,
  options: ChineseInitialOptions = {},
): string => {
  const { heteronym = false, filterNonChinese = true } = options;

  // 处理非汉字字符
  const filteredText = filterNonChinese
    ? text.replace(/[^\u4e00-\u9fa5]/g, "")
    : text;

  // 获取拼音首字母
  const initials = pinyin(filteredText, {
    style: pinyin.STYLE_FIRST_LETTER,
    heteronym: heteronym,
  });

  // 合并并大写
  return initials
    .flat()
    .map((arr) => arr[0])
    .join("")
    .toUpperCase();
};

export default getChineseInitials;
