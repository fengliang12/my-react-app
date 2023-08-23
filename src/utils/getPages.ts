import Taro from "@tarojs/taro";

interface params<T> {
  getKey?: string;
  getCurrentPage?: T;
}

type PropTypes = <T>(
  params: params<T>,
) => T extends false ? Taro.Page[] : string;

export const getPages: PropTypes = ({
  getKey = "route",
  getCurrentPage = true,
} = {}) => {
  const pages = Taro.getCurrentPages();
  if (getCurrentPage) {
    return pages[pages.length - 1][getKey];
  }
  return pages;
};
