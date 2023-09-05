import "./index.scss";

import { Input, Text, Textarea, View, ViewProps } from "@tarojs/components";
import { useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import OmsAddress from "@/src/components/Common/OmsAddress";
import to from "@/src/utils/to";

interface T_props extends ViewProps {
  inputFormFn: (form: T_Area_Form) => void;
}

const ExchangeExpress: React.FC<T_props> = (props) => {
  const dispatch = useDispatch();
  const { inputFormFn } = props;
  const [areaForm, setReceiver] = useState<T_Area_Form>({
    addressee: "",
    mobile: "",
    detail: "",
    province: "",
    city: "",
    district: "",
  });

  const getAddress = useMemoizedFn(async () => {
    // const res: any = await address.getAddress();
    // if (!res?.data) return;
    // let str = `${res?.data?.province}${res?.data?.city}${res?.data?.district}`;
    // setRegionPlaceholder(str);
    // setReceiver(res?.data);
    // inputFormFn?.(res?.data);
  });

  useEffect(() => {
    getAddress();
  }, [getAddress]);

  const InputReceiverInfo = (key: string, e: any) => {
    areaForm[key] = e.detail.value;
    setReceiver({ ...areaForm });
    inputFormFn?.(areaForm);
  };

  const [regionPlaceholder, setRegionPlaceholder] = useState<string>();
  const selectArea = (addressInfo: any) => {
    areaForm.province = addressInfo.province;
    areaForm.city = addressInfo.city;
    areaForm.district = addressInfo.district;
    setRegionPlaceholder(
      `${addressInfo.province}${addressInfo.city}${addressInfo.district}`,
    );
    setReceiver({ ...areaForm });
    inputFormFn?.(areaForm);
  };

  return (
    <View className="module">
      <View className="sh-form">
        <View>
          <View className="address_item">
            <View className="label">收件人姓名</View>
            <Input
              className="input_item"
              placeholder="请输入..."
              type="text"
              value={areaForm.addressee}
              onInput={InputReceiverInfo.bind(null, "addressee")}
            ></Input>
          </View>
          <View className="address_item">
            <View className="label">手机号</View>
            <Input
              className="input_item"
              placeholder="请输入..."
              type="number"
              value={areaForm.mobile}
              onInput={InputReceiverInfo.bind(null, "mobile")}
            ></Input>
          </View>
          <View className="address_item">
            <View className="label">省/市/区</View>
            <OmsAddress className="input_item" onChange={selectArea}>
              {regionPlaceholder ? (
                <View className="w-full h-full picker-content">
                  {regionPlaceholder}
                </View>
              ) : (
                <View className="w-full h-full" style="color:#7d7c7c">
                  请选择...
                </View>
              )}
            </OmsAddress>
          </View>
          <View className="address_item" style="align-items: flex-start;">
            <View className="label" style="margin-top:10px">
              详细地址
            </View>
            <Textarea
              className="textarea-item"
              placeholder="请输入..."
              value={areaForm.detail}
              onInput={InputReceiverInfo.bind(null, "detail")}
            ></Textarea>
          </View>
        </View>
      </View>
    </View>
  );
};
export default ExchangeExpress;
