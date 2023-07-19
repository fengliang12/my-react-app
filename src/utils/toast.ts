import Taro from "@tarojs/taro";

interface toastType {
  (e: string | Taro.showToast.Option): void;
}
const toast: toastType = (props) => {
  if (typeof props === "string") {
    Taro.showToast({
      title: props,
      icon: "none",
    });
    return;
  }
  const { title, icon = "none", ...rest } = props;
  if (!title) {
    console.error("title字段不能为空");
    return;
  }
  Taro.showToast({
    title,
    icon,
    ...rest,
  });
};
export default toast;
