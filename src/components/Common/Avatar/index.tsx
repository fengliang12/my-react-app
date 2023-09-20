import "./index.less";

import { Button, CommonEventFunction } from "@tarojs/components";

import common from "@/api/common";
import config from "@/src/config";

interface propsType {
  callback: (e: any) => void;
}

const Avatar: React.FC<propsType> = (props) => {
  const { callback } = props;
  /**
   * 头像
   * @param e
   */
  const handleChooseAvatar: CommonEventFunction = async (e) => {
    console.log("e", e);

    let { avatarUrl = "" } = e.detail;
    const { data } = await common.upLoadFile({
      filePath: avatarUrl,
      name: "file",
    });

    if (data) {
      callback(`${config.imgBaseUrl}/${data}`);
    }
  };
  return (
    <Button
      className="choose-avatar"
      openType="chooseAvatar"
      onChooseAvatar={handleChooseAvatar}
    ></Button>
  );
};
export default Avatar;
